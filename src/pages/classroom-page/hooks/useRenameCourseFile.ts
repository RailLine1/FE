import { useQueryClient } from '@tanstack/react-query';

import { useRenameFile } from '@/api/6-학습자료/6-학습자료';
import { showErrorMeta } from '@/lib/errorToast';

// PATCH /files/{fileId}. 관리자 · 공동 관리자만
export function useRenameCourseFile() {
  const queryClient = useQueryClient();
  const { mutate } = useRenameFile({
    mutation: { meta: showErrorMeta, onSuccess: () => queryClient.invalidateQueries() },
  });

  return (fileId: number, title: string) => mutate({ fileId, data: { title } });
}
