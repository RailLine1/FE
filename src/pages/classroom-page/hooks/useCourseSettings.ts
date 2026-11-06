import { useSettings } from '@/api/3-과목/3-과목';

import { CourseSettings } from '../courseTypes';

// GET /courses/{courseId}/settings
export function useCourseSettings(courseId: number) {
  return useSettings<CourseSettings>(courseId);
}
