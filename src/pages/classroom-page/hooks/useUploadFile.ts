import { uploadDummyFile } from '../dummy/materials';

// import { useQueryClient } from '@tanstack/react-query';
// import { useUpload } from '@/api/6-학습자료/6-학습자료';

export type PickedFile = {
  name: string;
  size?: number;
  uri: string;
  mimeType?: string;
  // 웹에서만 있다.
  file?: File;
};

type UploadInput = {
  title: string;
  picked: PickedFile;
};

// POST /folders/{folderId}/files (multipart file, title, consent=true)
export function useUploadFile(folderId: number) {
  // API 연동 시 아래 return으로 교체. 앱에서는 uri, name, type을 담은 객체를 FormData에 넣는다.
  // const queryClient = useQueryClient();
  // const { mutate, isPending } = useUpload();
  // return {
  //   upload: ({ title, picked }: UploadInput, onSuccess: () => void) => {
  //     const file =
  //       picked.file ??
  //       ({
  //         uri: picked.uri,
  //         name: picked.name,
  //         type: picked.mimeType ?? 'application/pdf',
  //       } as unknown as Blob);
  //     mutate(
  //       { folderId, params: { title: title || undefined, consent: true }, data: { file } },
  //       {
  //         onSuccess: () => {
  //           queryClient.invalidateQueries();
  //           onSuccess();
  //         },
  //       },
  //     );
  //   },
  //   isPending,
  // };

  return {
    upload: ({ title, picked }: UploadInput, onSuccess: () => void) => {
      uploadDummyFile(folderId, title || picked.name.replace(/\.pdf$/i, ''));
      onSuccess();
    },
    isPending: false,
  };
}
