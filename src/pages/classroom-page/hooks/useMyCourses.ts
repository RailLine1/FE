import { CourseTile, MineState } from '../courseTypes';
import { dummyCourses } from '../dummy/courses';

// import { useMine } from '@/api/3-과목/3-과목';

// GET /courses/mine?state=active|ended
export function useMyCourses(state: MineState) {
  // API 연동 시 아래 return으로 교체. Orval 타입은 응답 필드가 전부 optional이라 화면 타입으로 맞춘다.
  // return useMine<CourseTile[]>({ state });

  const data: CourseTile[] = dummyCourses[state];
  return { data, isLoading: false, isError: false };
}
