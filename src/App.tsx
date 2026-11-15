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
import { StatusBar } from 'expo-status-bar';
import { useSyncExternalStore } from 'react';
import { Platform } from 'react-native';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import Head from 'expo-router/head';

import { ErrorToast } from '@/components/ErrorToast';
import { queryClient } from '@/lib/queryClient';
import { usePushNotifications } from '@/lib/pushNotifications';
import { useAuthGate } from '@/lib/useAuthGate';
import { isLight, Palette, subscribeTheme, themeVersion } from '@/styles/palette';

// 화면 뒤 바탕을 테마 색으로. 그리기 전 · 넘어갈 때 다른 색이 잠깐 보이지 않게 한다.
function navigationTheme() {
  const base = isLight() ? DefaultTheme : DarkTheme;
  return { ...base, colors: { ...base.colors, background: Palette.bg, card: Palette.bg } };
}

export default function App() {
  // 테마를 바꾸면 화면을 새로 그려 바뀐 색을 읽게 한다. 이동 상태는 바깥 내비게이션 컨테이너가 들고 있다.
  const version = useSyncExternalStore(subscribeTheme, themeVersion);
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
      <ThemeProvider key={version} value={navigationTheme()}>
        <StatusBar style={isLight() ? 'dark' : 'light'} />
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400..900&display=swap"
          />
        </Head>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Palette.bg } }} />
        <ErrorToast />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
