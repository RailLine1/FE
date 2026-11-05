import { useSyncExternalStore } from 'react';

import { dummyStore, getDummyCourses } from '../dummy/courses';
import { ExploreSort } from '../types';

// import { useGetExploreCourses } from '@/api/explore';

type Params = {
  sort: ExploreSort;
  page?: number;
  size: number;
};

// GET /explore/courses?sort&page&size
export function useExploreCourses({ sort, page = 1, size }: Params) {
  // API 연동 시 아래 return으로 교체
  // return useGetExploreCourses({ sort, page, size });

  const courses = useSyncExternalStore(dummyStore.subscribe, dummyStore.getCourses, dummyStore.getCourses);
  return { data: getDummyCourses(courses, sort, page, size), isLoading: false, isError: false };
}
