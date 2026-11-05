import { CourseDetail, MyConnector } from '../courseTypes';

// API 연동 후 이 폴더는 삭제한다.
const term = '2026년 2학기';

const pastCourse = (courseId: number, name: string, icon: string, intro: string): CourseDetail => ({
  courseId,
  name,
  icon,
  intro,
  term: intro,
  subscribers: 30,
  role: 'member',
  rawAllowed: true,
  archiveCount: 20,
  state: 'ended',
});

// 1 멤버, 2 멤버(원본 열람 꺼짐), 3 관리자, 4 공동 관리자가 없는 관리자
let details: CourseDetail[] = [
  {
    courseId: 1,
    name: '운영체제',
    icon: 'cpu',
    intro: '3-2 전공필수 · 수요일 1교시',
    term,
    subscribers: 42,
    role: 'member',
    rawAllowed: true,
    archiveCount: 41,
    state: 'active',
  },
  {
    courseId: 2,
    name: '컴퓨터 네트워크',
    icon: 'globe',
    intro: '3-2 수강 중 · 팀플 있음',
    term,
    subscribers: 24,
    role: 'member',
    rawAllowed: false,
    archiveCount: 18,
    state: 'active',
  },
  {
    courseId: 3,
    name: '데이터베이스',
    icon: 'database',
    intro: '내가 만든 과목 · 스터디 공유용',
    term,
    subscribers: 11,
    role: 'admin',
    rawAllowed: true,
    archiveCount: 12,
    state: 'active',
  },
  {
    courseId: 4,
    name: '알고리즘 스터디',
    icon: 'network',
    intro: '혼자 운영하는 과목',
    term,
    subscribers: 3,
    role: 'admin',
    rawAllowed: true,
    archiveCount: 2,
    state: 'active',
  },
  {
    courseId: 5,
    name: '자료구조',
    icon: 'tree',
    intro: '혼자 운영하는 과목',
    term,
    subscribers: 3,
    role: 'co',
    rawAllowed: true,
    archiveCount: 2,
    state: 'active',
  },
  pastCourse(11, '선형대수', 'calculator', '2026년 1학기'),
  pastCourse(12, '확률과 통계', 'sigma', '2026년 1학기'),
  pastCourse(13, '모바일 프로그래밍', 'code', '2025년 2학기'),
  pastCourse(14, '컴퓨터 구조', 'layers', '2025년 2학기'),
];

export const dummyConnector: MyConnector = {
  clients: [
    { client: 'claude', lastCalledAt: '2026-11-04T21:00:00+09:00' },
    { client: 'chatgpt', lastCalledAt: null },
  ],
};

// 새로 만든 과목도 상세 화면을 열 수 있게 한다.
export function addDummyDetail(detail: CourseDetail) {
  details = [...details, detail];
  listeners.forEach((listener) => listener());
}

const listeners = new Set<() => void>();

// 실제 API의 캐시 갱신을 대신해 환경설정 저장을 과목 상세에 반영한다.
export const dummyDetailStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getDetails: () => details,
};

export function updateDummyDetail(courseId: number, patch: Partial<CourseDetail>) {
  details = details.map((detail) =>
    detail.courseId === courseId ? { ...detail, ...patch } : detail,
  );
  listeners.forEach((listener) => listener());
}
