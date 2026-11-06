import { useList } from '@/api/4-탐색-구독/4-탐색-구독';

import { ExploreCoursePage, ExploreSort } from '../courseTypes';

type Params = {
  sort: ExploreSort;
  page?: number;
  size: number;
};

// GET /explore/courses?sort&page&size. Orval 타입은 응답 필드가 전부 optional이라 화면 타입으로 맞춘다.
export function useExploreCourses({ sort, page = 1, size }: Params) {
  return useList<ExploreCoursePage>({ sort, page, size });
}
