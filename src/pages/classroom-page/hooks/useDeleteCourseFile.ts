import { deleteDummyFile } from '../dummy/materials';

// import { useQueryClient } from '@tanstack/react-query';
// import { useDeleteFile } from '@/api/6-학습자료/6-학습자료';

// DELETE /files/{fileId}
export function useDeleteCourseFile(folderId: number) {
  // API 연동 시 아래 return으로 교체
  // const queryClient = useQueryClient();
  // const { mutate } = useDeleteFile({
  //   mutation: { onSuccess: () => queryClient.invalidateQueries() },
  // });
  // return (fileId: number) => mutate({ fileId });

  return (fileId: number) => deleteDummyFile(folderId, fileId);
}
