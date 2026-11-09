import '@/styles/reset.css';
import '@/styles/global.css';

import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_500Medium } from '@expo-google-fonts/nunito/500Medium';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Nunito_900Black } from '@expo-google-fonts/nunito/900Black';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Platform } from 'react-native';
import { DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import Head from 'expo-router/head';

import { ErrorToast } from '@/components/ErrorToast';
import { queryClient } from '@/lib/queryClient';
import { usePushNotifications } from '@/lib/pushNotifications';
import { useAuthGate } from '@/lib/useAuthGate';

export default function App() {
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });
  // 웹은 폰트(약 790KB)를 기다리지 않고 먼저 그린다. 받아지면 브라우저가 바꿔 끼운다. 앱은 폰트가 기기에 있어 바로 끝난다.
  const ready = fontsLoaded || Platform.OS === 'web';
  useAuthGate(ready);
  usePushNotifications(ready);
  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      {/* ponytail: 디자인이 라이트뿐이라 고정한다. 다크 모드를 만들 때 서버 렌더링과 맞춰 추가한다. */}
      <ThemeProvider value={DefaultTheme}>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400..900&display=swap"
          />
        </Head>
        <Stack screenOptions={{ headerShown: false }} />
        <ErrorToast />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
