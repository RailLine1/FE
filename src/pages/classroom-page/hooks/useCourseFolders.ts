import { useSyncExternalStore } from 'react';

import { CourseFolder } from '../courseTypes';
import { dummyMaterialStore, getDummyFolders } from '../dummy/materials';

// import { useFolders } from '@/api/6-학습자료/6-학습자료';

// GET /courses/{courseId}/folders. 원본 열람이 꺼진 멤버는 403이라 요청하지 않는다(P-MAT-05).
export function useCourseFolders(courseId: number, enabled: boolean) {
  // API 연동 시 아래 return으로 교체
  // return useFolders<CourseFolder[]>(courseId, { query: { enabled } });

  const state = useSyncExternalStore(
    dummyMaterialStore.subscribe,
    dummyMaterialStore.getState,
    dummyMaterialStore.getState,
  );
  const data: CourseFolder[] | undefined = enabled ? getDummyFolders(state, courseId) : undefined;
  return { data, isLoading: false, isError: false };
}
