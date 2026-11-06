import { useInfo } from '@/api/4-탐색-구독/4-탐색-구독';

import { ExploreCourseDetail } from '../courseTypes';

// GET /explore/courses/{code}. 없는 과목과 권한 없는 비공개 과목은 404로 온다.
export function useCourseInfo(code: string) {
  return useInfo<ExploreCourseDetail>(code);
}
