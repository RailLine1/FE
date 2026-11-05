import { addDummyMemo, deleteDummyMemo, editDummyMemo } from '../dummy/archive';

// import { useQueryClient } from '@tanstack/react-query';
// import { useAddMemo, useDeleteMemo, useEditMemo } from '@/api/8-기록-메모/8-기록-메모';

// POST /archive/{bitId}/memos, PATCH·DELETE /memos/{memoId}
export function useMemoActions(bitId: number) {
  // API 연동 시 아래 return으로 교체. 메모 수가 바뀌므로 기록 목록도 함께 갱신한다.
  // const queryClient = useQueryClient();
  // const options = { mutation: { onSuccess: () => queryClient.invalidateQueries() } };
  // const { mutate: add } = useAddMemo(options);
  // const { mutate: edit } = useEditMemo(options);
  // const { mutate: remove } = useDeleteMemo(options);
  // return {
  //   addMemo: (body: string) => add({ bitId, data: { body } }),
  //   editMemo: (memoId: number, body: string) => edit({ memoId, data: { body } }),
  //   deleteMemo: (memoId: number) => remove({ memoId }),
  // };

  return {
    addMemo: (body: string) => addDummyMemo(bitId, body),
    editMemo: (memoId: number, body: string) => editDummyMemo(bitId, memoId, body),
    deleteMemo: (memoId: number) => deleteDummyMemo(bitId, memoId),
  };
}
