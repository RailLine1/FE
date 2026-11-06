import { useFolders } from '@/api/6-학습자료/6-학습자료';

import { CourseFolder } from '../courseTypes';

// GET /courses/{courseId}/folders. 원본 열람이 꺼진 멤버는 403이라 요청하지 않는다(P-MAT-05).
export function useCourseFolders(courseId: number, enabled: boolean) {
  return useFolders<CourseFolder[]>(courseId, { query: { enabled } });
}
