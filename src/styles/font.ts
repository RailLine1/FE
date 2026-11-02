import { Platform } from 'react-native';

// Nunito에는 한글이 없다. 웹은 기기마다 대체 폰트가 달라서 Figma와 같은 Noto Sans KR을 지정한다.
const family = (name: string) =>
  Platform.OS === 'web' ? `${name}, "Noto Sans KR", sans-serif` : name;

// fontWeight도 함께 둬야 한글이 같은 굵기로 대체된다.
export const Fonts = {
  regular: { fontFamily: family('Nunito_400Regular'), fontWeight: '400' },
  medium: { fontFamily: family('Nunito_500Medium'), fontWeight: '500' },
  semiBold: { fontFamily: family('Nunito_600SemiBold'), fontWeight: '600' },
  bold: { fontFamily: family('Nunito_700Bold'), fontWeight: '700' },
  extraBold: { fontFamily: family('Nunito_800ExtraBold'), fontWeight: '800' },
} as const;
