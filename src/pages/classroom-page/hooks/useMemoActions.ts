import { useQueryClient } from '@tanstack/react-query';

import { useAddMemo, useDeleteMemo, useEditMemo } from '@/api/8-기록-메모/8-기록-메모';
import { showErrorMeta } from '@/lib/errorToast';

// POST /archive/{bitId}/memos, PATCH·DELETE /memos/{memoId}
export function useMemoActions(bitId: number) {
  // 메모 수가 바뀌므로 기록 목록도 함께 갱신한다.
  const queryClient = useQueryClient();
  const options = {
    mutation: { meta: showErrorMeta, onSuccess: () => queryClient.invalidateQueries() },
  };
  const { mutate: add } = useAddMemo(options);
  const { mutate: edit } = useEditMemo(options);
  const { mutate: remove } = useDeleteMemo(options);

  return {
    addMemo: (body: string) => add({ bitId, data: { body } }),
    editMemo: (memoId: number, body: string) => edit({ memoId, data: { body } }),
    deleteMemo: (memoId: number) => remove({ memoId }),
  };
}
