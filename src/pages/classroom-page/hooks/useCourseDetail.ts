import { useDetail } from '@/api/3-과목/3-과목';

import { CourseDetail } from '../courseTypes';

// GET /courses/{courseId}
export function useCourseDetail(courseId: number) {
  return useDetail<CourseDetail>(courseId);
}
