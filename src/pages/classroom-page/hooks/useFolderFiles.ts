import { useSyncExternalStore } from 'react';

import { CourseFile } from '../courseTypes';
import { dummyMaterialStore, getDummyFiles } from '../dummy/materials';

// import { useFiles } from '@/api/6-학습자료/6-학습자료';

// GET /folders/{folderId}/files. 멤버 응답에는 ready만 온다(P-MAT-04).
export function useFolderFiles(folderId: number, enabled: boolean) {
  // API 연동 시 아래 return으로 교체
  // return useFiles<CourseFile[]>(folderId, { query: { enabled } });

  const state = useSyncExternalStore(
    dummyMaterialStore.subscribe,
    dummyMaterialStore.getState,
    dummyMaterialStore.getState,
  );
  const data: CourseFile[] | undefined = enabled ? getDummyFiles(state, folderId) : undefined;
  return { data, isLoading: false, isError: false };
}
