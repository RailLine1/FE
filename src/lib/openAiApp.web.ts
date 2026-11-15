import { Linking } from 'react-native';

import { androidIntentUrl } from './appIntent';

// 안드로이드 브라우저에서는 설치된 AI 앱으로 열고, 앱이 없으면 같은 탭에서 웹으로 간다.
// 다른 기기는 지금처럼 새 탭으로 연다.
export function openAiApp(url: string) {
  const intent = /Android/i.test(navigator.userAgent) ? androidIntentUrl(url) : null;
  if (intent) window.location.href = intent;
  else Linking.openURL(url);
}
