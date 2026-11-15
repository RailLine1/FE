import * as SecureStore from 'expo-secure-store';

export type ThemeName = 'dark' | 'light';

const KEY = 'daybit.theme';

// 첫 화면부터 고른 테마로 그리려고 모듈을 읽는 순간 동기로 꺼낸다. 기본은 흰 테마.
export function readThemeName(): ThemeName {
  try {
    return SecureStore.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function saveThemeName(name: ThemeName) {
  SecureStore.setItemAsync(KEY, name).catch(() => undefined);
}
