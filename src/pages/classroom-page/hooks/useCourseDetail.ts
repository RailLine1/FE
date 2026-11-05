import { useSyncExternalStore } from 'react';

import { CourseDetail } from '../courseTypes';
import { dummyDetailStore } from '../dummy/courseDetails';

// import { useDetail } from '@/api/3-과목/3-과목';

// GET /courses/{courseId}
export function useCourseDetail(courseId: number) {
  // API 연동 시 아래 return으로 교체
  // return useDetail<CourseDetail>(courseId);

  const details = useSyncExternalStore(
    dummyDetailStore.subscribe,
    dummyDetailStore.getDetails,
    dummyDetailStore.getDetails,
  );
  const data: CourseDetail | undefined = details.find((course) => course.courseId === courseId);
  return { data, isLoading: false, isError: !data };
}
