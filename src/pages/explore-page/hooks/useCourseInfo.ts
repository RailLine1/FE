import { useSyncExternalStore } from 'react';

import { dummyStore } from '../dummy/courses';

// import { useGetExploreCourse } from '@/api/explore';

// GET /explore/courses/{code}
export function useCourseInfo(code: string) {
  // API 연동 시 아래 return으로 교체. 없는 과목과 권한 없는 비공개 과목은 404로 온다.
  // return useGetExploreCourse(code);

  const courses = useSyncExternalStore(dummyStore.subscribe, dummyStore.getCourses, dummyStore.getCourses);
  const data = courses.find((course) => course.code === code);
  return { data, isLoading: false, isError: !data };
}
