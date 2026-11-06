import { useMemos } from '@/api/8-기록-메모/8-기록-메모';

import { Memo } from '../courseTypes';

// GET /archive/{bitId}/memos
export function useBitMemos(bitId: number) {
  return useMemos<Memo[]>(bitId);
}
