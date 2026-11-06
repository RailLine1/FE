import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useUpload } from '@/api/6-학습자료/6-학습자료';
import { ApiError } from '@/lib/createApiFetch';

export const MAX_FILE_SIZE = 50 * 1024 * 1024;
export const FILE_TOO_LARGE_MESSAGE = '50MB가 넘어서 올릴 수 없어요.';

export type PickedFile = {
  name: string;
  size?: number;
  uri: string;
  mimeType?: string;
  // 웹에서만 있다.
  file?: File;
};

export type UploadInput = {
  id: string;
  // 비우면 서버가 파일 이름으로 저장한다.
  title: string;
  picked: PickedFile;
};

export type UploadFailure = {
  id: string;
  message: string;
};

function getUploadErrorMessage(error: unknown) {
  if (error instanceof ApiError) {
    if (error.code === 'FILE_TOO_LARGE') return FILE_TOO_LARGE_MESSAGE;
    if (error.code === 'VALIDATION_FAILED') return 'PDF 파일만 올릴 수 있어요.';
  }
  return '올리지 못했어요. 다시 시도해 주세요.';
}

// POST /folders/{folderId}/files (multipart file, title, consent=true). 파일마다 한 번씩 호출한다.
export function useUploadFiles(folderId: number) {
  const [isPending, setIsPending] = useState(false);

  const queryClient = useQueryClient();
  const { mutateAsync } = useUpload();

  const uploadOne = ({ title, picked }: UploadInput) => {
    // 앱에서는 uri, name, type을 담은 객체를 FormData에 넣는다.
    const file =
      picked.file ??
      ({
        uri: picked.uri,
        name: picked.name,
        type: picked.mimeType ?? 'application/pdf',
      } as unknown as Blob);
    return mutateAsync({
      folderId,
      params: { title: title || undefined, consent: true },
      data: { file },
    });
  };

  // 실패한 파일만 돌려준다.
  const uploadFiles = async (inputs: UploadInput[]) => {
    const failures: UploadFailure[] = [];
    setIsPending(true);
    for (const input of inputs) {
      try {
        await uploadOne(input);
      } catch (error) {
        failures.push({ id: input.id, message: getUploadErrorMessage(error) });
      }
    }
    await queryClient.invalidateQueries();
    setIsPending(false);
    return failures;
  };

  return { uploadFiles, isPending };
}
