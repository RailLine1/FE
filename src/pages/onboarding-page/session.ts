import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

import { getGithubStartUrl } from '@/api/1-인증/1-인증';
import type { TokenPair } from '@/api/model';
import type { Tokens } from '@/lib/createApiFetch';
import { queryClient } from '@/lib/queryClient';
import { tokenStorage } from '@/lib/tokenStorage';

// 로그인을 마친 뒤 도착하는 화면. 첫 탭인 강의실로 간다.
export const HOME_ROUTE = '/classroom';

export async function startSession(tokens: TokenPair | undefined) {
  await tokenStorage.set(tokens as Tokens);
  // 이전 계정의 응답이 남지 않게 한다.
  queryClient.clear();
}

// 끝나면 BE가 `/github?code=` 또는 `?error=`로 돌려보낸다. 앱은 딥링크로 같은 화면에 도착한다.
export function openGithubLogin() {
  const path = getGithubStartUrl({ redirect: Linking.createURL('github') });
  const url = `${process.env.EXPO_PUBLIC_API_URL}${path.replace(/^\/api\/v1/, '')}`;
  if (Platform.OS === 'web') {
    window.location.assign(url);
  } else {
    Linking.openURL(url);
  }
}
