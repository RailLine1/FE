import { useSyncExternalStore } from 'react';

import { Memo } from '../courseTypes';
import { dummyArchiveStore } from '../dummy/archive';

// import { useMemos } from '@/api/8-기록-메모/8-기록-메모';

// GET /archive/{bitId}/memos
export function useBitMemos(bitId: number) {
  // API 연동 시 아래 return으로 교체
  // return useMemos<Memo[]>(bitId);

  const memos = useSyncExternalStore(
    dummyArchiveStore.subscribe,
    dummyArchiveStore.getMemos,
    dummyArchiveStore.getMemos,
  );
  const data: Memo[] = memos[bitId] ?? [];
  return { data, isLoading: false, isError: false };
}
