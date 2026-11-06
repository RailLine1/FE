import { Linking } from 'react-native';

import { view } from '@/api/6-학습자료/6-학습자료';
import { showErrorToast } from '@/lib/errorToast';

// GET /files/{fileId}의 임시 URL로 PDF를 연다.
export function useOpenFile() {
  return async (fileId: number) => {
    try {
      const { url } = await view(fileId);
      if (url) await Linking.openURL(url);
    } catch (error) {
      showErrorToast(error);
    }
  };
}
