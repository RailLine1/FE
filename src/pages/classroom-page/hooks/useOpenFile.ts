// import { Linking } from 'react-native';
// import { view } from '@/api/6-학습자료/6-학습자료';

// GET /files/{fileId}의 임시 URL로 PDF를 연다.
export function useOpenFile() {
  // API 연동 시 아래 return으로 교체
  // return async (fileId: number) => {
  //   const { url } = await view(fileId);
  //   if (url) await Linking.openURL(url);
  // };

  return async (_fileId: number) => {};
}
