import { CourseDetail, CourseMember, MyConnector } from '../courseTypes';

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
export const dummyDetails: CourseDetail[] = [
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
  pastCourse(11, '선형대수', 'calculator', '2026년 1학기'),
  pastCourse(12, '확률과 통계', 'sigma', '2026년 1학기'),
  pastCourse(13, '모바일 프로그래밍', 'code', '2025년 2학기'),
  pastCourse(14, '컴퓨터 구조', 'layers', '2025년 2학기'),
];

export const dummyMembers: Record<number, CourseMember[]> = {
  3: [
    { userId: 1, nickname: '나', role: 'admin', coSince: null },
    { userId: 2, nickname: '밤샘금지', role: 'co', coSince: '2026-09-01T10:00:00+09:00' },
    { userId: 3, nickname: '시험전날', role: 'member', coSince: null },
  ],
  4: [{ userId: 1, nickname: '나', role: 'admin', coSince: null }],
};

export const dummyConnector: MyConnector = {
  clients: [
    { client: 'claude', lastCalledAt: '2026-11-04T21:00:00+09:00' },
    { client: 'chatgpt', lastCalledAt: null },
  ],
};
