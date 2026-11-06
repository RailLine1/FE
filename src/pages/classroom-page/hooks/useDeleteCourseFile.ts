import { useQueryClient } from '@tanstack/react-query';

import { useDeleteFile } from '@/api/6-학습자료/6-학습자료';
import { showErrorMeta } from '@/lib/errorToast';

// DELETE /files/{fileId}
export function useDeleteCourseFile() {
  const queryClient = useQueryClient();
  const { mutate } = useDeleteFile({
    mutation: { meta: showErrorMeta, onSuccess: () => queryClient.invalidateQueries() },
  });

  return (fileId: number) => mutate({ fileId });
}
