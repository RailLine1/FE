import { useMine } from '@/api/3-과목/3-과목';

import { CourseTile, MineState } from '../courseTypes';

// GET /courses/mine?state=active|ended. Orval 타입은 응답 필드가 전부 optional이라 화면 타입으로 맞춘다.
export function useMyCourses(state: MineState) {
  return useMine<CourseTile[]>({ state });
}
