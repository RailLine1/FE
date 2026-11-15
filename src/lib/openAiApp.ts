import { Linking } from 'react-native';

// 앱에서는 안드로이드가 설치된 AI 앱으로 바로 넘긴다.
export function openAiApp(url: string) {
  Linking.openURL(url);
}
