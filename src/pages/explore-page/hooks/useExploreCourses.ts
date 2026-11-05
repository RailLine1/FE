import { useSyncExternalStore } from 'react';

import { dummyStore, getDummyCourses } from '../dummy/courses';
import { ExploreCoursePage, ExploreSort } from '../courseTypes';

// import { useList } from '@/api/4-탐색-구독/4-탐색-구독';

type Params = {
  sort: ExploreSort;
  page?: number;
  size: number;
};

// GET /explore/courses?sort&page&size
export function useExploreCourses({ sort, page = 1, size }: Params) {
  // API 연동 시 아래 return으로 교체. Orval 타입은 응답 필드가 전부 optional이라 화면 타입으로 맞춘다.
  // return useList<ExploreCoursePage>({ sort, page, size });

  const courses = useSyncExternalStore(dummyStore.subscribe, dummyStore.getCourses, dummyStore.getCourses);
  const data: ExploreCoursePage = getDummyCourses(courses, sort, page, size);
  return { data, isLoading: false, isError: false };
}
