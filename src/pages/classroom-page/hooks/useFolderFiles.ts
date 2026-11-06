import { useFiles } from '@/api/6-학습자료/6-학습자료';

import { CourseFile } from '../courseTypes';

const PROCESSING_REFETCH_INTERVAL = 5000;

// GET /folders/{folderId}/files. 멤버 응답에는 ready만 온다(P-MAT-04).
export function useFolderFiles(folderId: number, enabled: boolean) {
  return useFiles<CourseFile[]>(folderId, {
    query: {
      enabled,
      // 처리 중인 자료가 있을 때만 상태가 바뀌었는지 다시 확인한다.
      refetchInterval: ({ state }) =>
        state.data?.some(({ status }) => status === 'processing')
          ? PROCESSING_REFETCH_INTERVAL
          : false,
    },
  });
}
