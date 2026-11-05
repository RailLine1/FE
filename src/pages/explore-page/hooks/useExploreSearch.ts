import { useSyncExternalStore } from 'react';

import { dummyStore, searchDummyCourses } from '../dummy/courses';

// import { useGetExploreSearch } from '@/api/explore';

// GET /explore/search?q=
export function useExploreSearch(query: string) {
  // API 연동 시 아래 return으로 교체. 입력 중 요청이 많으면 query에 디바운스를 건다.
  // return useGetExploreSearch({ q: query }, { query: { enabled: query.length > 0 } });

  const courses = useSyncExternalStore(dummyStore.subscribe, dummyStore.getCourses, dummyStore.getCourses);
  return { data: searchDummyCourses(courses, query), isLoading: false, isError: false };
}
