import { createDummyFolder, deleteDummyFolder, renameDummyFolder } from '../dummy/materials';

// import { useQueryClient } from '@tanstack/react-query';
// import { useCreateFolder, useDeleteFolder, useRenameFolder } from '@/api/6-학습자료/6-학습자료';

// POST /courses/{courseId}/folders, PATCH·DELETE /folders/{folderId}
export function useFolderActions(courseId: number) {
  // API 연동 시 아래 return으로 교체. mid·final은 400이라 화면에서 메뉴를 보여주지 않는다(P-MAT-01).
  // const queryClient = useQueryClient();
  // const options = { mutation: { onSuccess: () => queryClient.invalidateQueries() } };
  // const { mutate: create } = useCreateFolder(options);
  // const { mutate: rename } = useRenameFolder(options);
  // const { mutate: remove } = useDeleteFolder(options);
  // return {
  //   createFolder: (name: string) => create({ courseId, data: { name } }),
  //   renameFolder: (folderId: number, name: string) => rename({ folderId, data: { name } }),
  //   deleteFolder: (folderId: number) => remove({ folderId }),
  // };

  return {
    createFolder: (name: string) => createDummyFolder(courseId, name),
    renameFolder: (folderId: number, name: string) => renameDummyFolder(courseId, folderId, name),
    deleteFolder: (folderId: number) => deleteDummyFolder(courseId, folderId),
  };
}
