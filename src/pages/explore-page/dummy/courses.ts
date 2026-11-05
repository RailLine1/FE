import { ExploreCourse, ExploreCourseDetail, ExploreCoursePage, ExploreSort } from '../courseTypes';

// API 연동 후 이 폴더는 삭제한다.
const term = '2026년 2학기';

const course = (
  code: string,
  name: string,
  icon: string,
  admin: string,
  intro: string,
  rest: Partial<ExploreCourseDetail> = {},
): ExploreCourseDetail => ({
  code,
  name,
  icon,
  admin,
  term,
  intro,
  visibility: 'public',
  ended: false,
  myStatus: 'none',
  ...rest,
});

const fillerIcons = ['book', 'pen', 'chart', 'compass', 'lightbulb', 'music', 'atom', 'flask'];

// 인기순으로 둔다. 구독자 수는 정렬에만 쓰고 응답에 없다(P-EXP-05).
const initialCourses: ExploreCourseDetail[] = [
  course('DS7K2M', '자료구조', 'layers', '알고조교', '자료구조 강의 자료와 과제 풀이를 공유해요.', {
    myStatus: 'subscribed',
  }),
  course('OS4X9P', '운영체제', 'cpu', '커널패닉', '3-2 전공필수 · 수요일 1교시', {
    myStatus: 'subscribed',
  }),
  course('NW3T8R', '컴퓨터 네트워크', 'globe', '패킷러', '네트워크 계층별 정리 자료를 올려요.', {
    myStatus: 'subscribed',
  }),
  course('OSL2B8', '운영체제 실습', 'terminal', '실습조교', '실습 과제 안내와 xv6 자료를 공유해요.'),
  course('PS8V1C', '확률과 통계', 'sigma', '관리자8', '확률과 통계 기출을 함께 풀어요.'),
  course('WP5H3D', '웹 프로그래밍', 'code', '관리자3', '웹 프로그래밍 실습 자료를 공유해요.'),
  course('AI6N4F', '인공지능', 'lightbulb', '관리자5', '인공지능 개념을 함께 정리해요.'),
  course('ML1Q7G', '머신러닝 기초', 'atom', '텐서', '머신러닝 기초 스터디 과목이에요.'),
  course('DM9E2J', '이산수학', 'compass', '논리왕', '이산수학 증명 문제를 함께 풀어요.'),
  course('DB4L6K', '데이터베이스 설계', 'database', '스키마', '정규화와 SQL 과제를 다뤄요.'),
  course('OM3Z5W', '운영관리론', 'chart', '경영러', '운영관리론 시험 범위를 정리해요.'),
  ...Array.from({ length: 20 }, (_, index) =>
    course(
      `GE${String(index + 1).padStart(2, '0')}AB`,
      `교양 과목 ${index + 1}`,
      fillerIcons[index % fillerIcons.length],
      `관리자${index + 10}`,
      '교양 과목 자료를 공유해요.',
    ),
  ),
  course('AL55PC', '알고리즘', 'network', '분할정복', '알고리즘 스터디 비공개 과목이에요.', {
    visibility: 'private',
  }),
  course('LA90QW', '선형대수', 'calculator', '행렬장인', '선형대수 필기 정리를 공유해요.', {
    ended: true,
  }),
];

const newestFirst = ['DM9E2J', 'DB4L6K', 'ML1Q7G'];

const toListItem = ({ code, name, icon, admin, ended, myStatus }: ExploreCourse): ExploreCourse => ({
  code,
  name,
  icon,
  admin,
  ended,
  myStatus,
});

const isExplorable = ({ visibility, ended }: ExploreCourseDetail) =>
  visibility === 'public' && !ended;

export function getDummyCourses(
  courses: ExploreCourseDetail[],
  sort: ExploreSort,
  page: number,
  size: number,
): ExploreCoursePage {
  const explorable = courses.filter(isExplorable);
  const sorted =
    sort === 'subscribers'
      ? explorable
      : [
          ...newestFirst.map((code) => explorable.find((item) => item.code === code)!),
          ...explorable.filter((item) => !newestFirst.includes(item.code)).reverse(),
        ];
  const start = (page - 1) * size;

  return {
    items: sorted.slice(start, start + size).map(toListItem),
    total: sorted.length,
    page,
    size,
  };
}

// 과목명은 공개·진행 중 부분 일치, 코드는 모든 과목 전체 일치(P-EXP-03).
export function searchDummyCourses(courses: ExploreCourseDetail[], query: string): ExploreCourse[] {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return [];

  return courses
    .filter(
      (item) =>
        item.code.toLowerCase() === keyword ||
        (isExplorable(item) && item.name.toLowerCase().includes(keyword)),
    )
    .map(toListItem);
}

// 실제 API의 캐시 갱신을 대신해 구독 상태를 모든 화면에 반영한다.
let courses = initialCourses;
const listeners = new Set<() => void>();

export const dummyStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getCourses: () => courses,
};

// 구독 응답(P-COURSE-03). 공개는 subscribed, 비공개는 pending.
export function subscribeDummyCourse(code: string) {
  const target = courses.find((item) => item.code === code);
  if (!target || target.ended) throw new Error('COURSE_ENDED');

  const myStatus = target.visibility === 'public' ? 'subscribed' : 'pending';
  courses = courses.map((item) => (item.code === code ? { ...item, myStatus } : item));
  listeners.forEach((listener) => listener());
  return myStatus;
}
