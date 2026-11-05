import { CourseMember, CourseRole, JoinRequest } from '../courseTypes';
import { dummyDetailStore, updateDummyDetail } from './courseDetails';

// API 연동 후 이 폴더는 삭제한다.
export const DUMMY_MY_USER_ID = 1;

const me = (role: CourseRole, coSince: string | null = null): CourseMember => ({
  userId: DUMMY_MY_USER_ID,
  nickname: '나',
  role,
  coSince,
});

let members: Record<number, CourseMember[]> = {
  3: [
    me('admin'),
    { userId: 2, nickname: '밤샘금지', role: 'co', coSince: '2026-10-20T10:00:00+09:00' },
    { userId: 3, nickname: 'OS마스터', role: 'member', coSince: null },
    { userId: 4, nickname: '출석왕', role: 'member', coSince: null },
    { userId: 5, nickname: '새내기컴공', role: 'member', coSince: null },
  ],
  // 공동 관리자 시점을 확인하는 과목
  5: [
    { userId: 6, nickname: '알고조교', role: 'admin', coSince: null },
    me('co', '2026-10-15T10:00:00+09:00'),
    { userId: 7, nickname: '캡스톤도망', role: 'co', coSince: '2026-10-20T10:00:00+09:00' },
    { userId: 8, nickname: '과제폭탄', role: 'member', coSince: null },
  ],
};

let requests: Record<number, JoinRequest[]> = {
  3: [
    { requestId: 21, nickname: '공대생J', requestedAt: '2026-11-06T14:20:00+09:00' },
    { requestId: 22, nickname: '복학생K', requestedAt: '2026-11-05T22:05:00+09:00' },
  ],
};

const listeners = new Set<() => void>();
const notifyAll = () => listeners.forEach((listener) => listener());

export const dummyMemberStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getMembers: () => members,
  getRequests: () => requests,
};

// 새로 만든 과목에는 만든 사람만 있다.
export const getDummyMembers = (current: typeof members, courseId: number) =>
  current[courseId] ?? [me('admin')];

export const getDummyRequests = (current: typeof requests, courseId: number) =>
  current[courseId] ?? [];

const rank: Record<CourseRole, number> = { admin: 0, co: 1, member: 2 };

// 응답 순서와 같게 관리자, 공동 관리자(된 날짜순), 멤버 순으로 둔다(P-ROLE-02).
const sortMembers = (list: CourseMember[]) =>
  [...list].sort(
    (a, b) => rank[a.role] - rank[b.role] || (a.coSince ?? '').localeCompare(b.coSince ?? ''),
  );

const addSubscribers = (courseId: number, count: number) => {
  const detail = dummyDetailStore.getDetails().find((course) => course.courseId === courseId);
  if (detail) updateDummyDetail(courseId, { subscribers: detail.subscribers + count });
};

export function changeDummyRole(courseId: number, userId: number, role: 'co' | 'member') {
  const coSince = role === 'co' ? new Date().toISOString() : null;
  const changed = getDummyMembers(members, courseId).map((member) =>
    member.userId === userId ? { ...member, role, coSince } : member,
  );
  members = { ...members, [courseId]: sortMembers(changed) };
  notifyAll();
}

export function kickDummyMember(courseId: number, userId: number) {
  members = {
    ...members,
    [courseId]: getDummyMembers(members, courseId).filter((member) => member.userId !== userId),
  };
  addSubscribers(courseId, -1);
  notifyAll();
}

const toMember = ({ requestId, nickname }: JoinRequest): CourseMember => ({
  userId: requestId,
  nickname,
  role: 'member',
  coSince: null,
});

export function approveDummyRequest(courseId: number, requestId: number) {
  const list = getDummyRequests(requests, courseId);
  const approved = list.filter((request) => request.requestId === requestId);
  requests = { ...requests, [courseId]: list.filter((request) => request.requestId !== requestId) };
  members = {
    ...members,
    [courseId]: sortMembers([...getDummyMembers(members, courseId), ...approved.map(toMember)]),
  };
  addSubscribers(courseId, approved.length);
  notifyAll();
}

export function rejectDummyRequest(courseId: number, requestId: number) {
  requests = {
    ...requests,
    [courseId]: getDummyRequests(requests, courseId).filter(
      (request) => request.requestId !== requestId,
    ),
  };
  notifyAll();
}

export function approveAllDummyRequests(courseId: number) {
  const list = getDummyRequests(requests, courseId);
  requests = { ...requests, [courseId]: [] };
  members = {
    ...members,
    [courseId]: sortMembers([...getDummyMembers(members, courseId), ...list.map(toMember)]),
  };
  addSubscribers(courseId, list.length);
  notifyAll();
  return list.length;
}
