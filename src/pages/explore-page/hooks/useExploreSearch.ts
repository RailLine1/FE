import { useSyncExternalStore } from 'react';

import { dummyStore, searchDummyCourses } from '../dummy/courses';
import { ExploreCourse } from '../types';

// import { useSearch } from '@/api/4-탐색-구독/4-탐색-구독';

// GET /explore/search?q=
export function useExploreSearch(query: string) {
  // API 연동 시 아래 return으로 교체. 입력 중 요청이 많으면 query에 디바운스를 건다.
  // return useSearch<ExploreCourse[]>({ q: query }, { query: { enabled: query.length > 0 } });

  const courses = useSyncExternalStore(dummyStore.subscribe, dummyStore.getCourses, dummyStore.getCourses);
  const data: ExploreCourse[] = searchDummyCourses(courses, query);
  return { data, isLoading: false, isError: false };
}
