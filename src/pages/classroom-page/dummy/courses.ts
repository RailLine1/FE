import { CourseTile, MineState } from '../courseTypes';

// API 연동 후 이 폴더는 삭제한다.
const initialCourses: Record<MineState, CourseTile[]> = {
  active: [
    { courseId: 1, name: '운영체제', icon: 'cpu', intro: '3-2 전공필수 · 수요일 1교시' },
    { courseId: 2, name: '컴퓨터 네트워크', icon: 'globe', intro: '3-2 수강 중 · 팀플 있음' },
    { courseId: 3, name: '데이터베이스', icon: 'database', intro: '내가 만든 과목 · 스터디 공유용' },
  ],
  ended: [
    { courseId: 11, name: '선형대수', icon: 'calculator', intro: '2026년 1학기' },
    { courseId: 12, name: '확률과 통계', icon: 'sigma', intro: '2026년 1학기' },
    { courseId: 13, name: '모바일 프로그래밍', icon: 'code', intro: '2025년 2학기' },
    { courseId: 14, name: '컴퓨터 구조', icon: 'layers', intro: '2025년 2학기' },
  ],
};

// 실제 API의 캐시 갱신을 대신해 탈퇴 결과를 강의실 목록에 반영한다.
let courses = initialCourses;
const listeners = new Set<() => void>();

export const dummyCourseStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getCourses: () => courses,
};

export function removeDummyCourse(courseId: number) {
  courses = {
    active: courses.active.filter((course) => course.courseId !== courseId),
    ended: courses.ended.filter((course) => course.courseId !== courseId),
  };
  listeners.forEach((listener) => listener());
}
