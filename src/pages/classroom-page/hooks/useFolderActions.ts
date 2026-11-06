import { useQueryClient } from '@tanstack/react-query';

import { useCreateFolder, useDeleteFolder, useRenameFolder } from '@/api/6-학습자료/6-학습자료';
import { showErrorMeta } from '@/lib/errorToast';

// POST /courses/{courseId}/folders, PATCH·DELETE /folders/{folderId}
// mid·final은 400이라 화면에서 메뉴를 보여주지 않는다(P-MAT-01).
export function useFolderActions(courseId: number) {
  const queryClient = useQueryClient();
  const options = {
    mutation: { meta: showErrorMeta, onSuccess: () => queryClient.invalidateQueries() },
  };
  const { mutate: create } = useCreateFolder(options);
  const { mutate: rename } = useRenameFolder(options);
  const { mutate: remove } = useDeleteFolder(options);

  return {
    createFolder: (name: string) => create({ courseId, data: { name } }),
    renameFolder: (folderId: number, name: string) => rename({ folderId, data: { name } }),
    deleteFolder: (folderId: number) => remove({ folderId }),
  };
}
