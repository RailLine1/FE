import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useGithubExchange } from '@/api/1-인증/1-인증';
import { ApiError } from '@/lib/createApiFetch';
import { Screen } from '@/components/Screen';
import { Palette } from '@/styles/palette';
import { pendingRoute } from '@/lib/pendingRoute';

import { startSession } from '../session';

// GitHub 로그인에서 돌아오는 화면. `?code=`를 토큰으로 바꾸거나 `?error=`를 로그인 화면에 넘긴다.
export default function GithubCallbackPage() {
  const router = useRouter();
  const { code, error } = useLocalSearchParams<{ code?: string; error?: string }>();
  const { mutate: exchange } = useGithubExchange();
  // code는 1회용이라 화면이 다시 마운트돼도 한 번만 보낸다.
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    if (!code) {
      router.replace({ pathname: '/login', params: { error: error ?? 'GITHUB_FAILED' } });
      return;
    }
    exchange(
      { data: { code } },
      {
        onSuccess: async ({ tokens, needsNickname, isFirstLogin }) => {
          await startSession(tokens);
          if (needsNickname) router.replace('/nickname');
          else router.replace(isFirstLogin ? '/onboarding' : (pendingRoute.take() ?? '/welcome'));
        },
        onError: (failure) =>
          router.replace({
            pathname: '/login',
            params: { error: failure instanceof ApiError ? failure.code : 'GITHUB_FAILED' },
          }),
      },
    );
  }, [code, error, exchange, router]);

  return (
    <Screen>
      <View style={styles.loading}>
        <ActivityIndicator color={Palette.purple} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
