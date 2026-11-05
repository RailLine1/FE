import { router } from 'expo-router';

import { ApiError, createApiFetch } from '@/lib/createApiFetch';
import { tokenStorage } from '@/lib/tokenStorage';

export { ApiError };

// Orval이 생성한 API 함수는 모두 이 함수로 요청한다.
export const apiFetch = createApiFetch({
  baseUrl: process.env.EXPO_PUBLIC_API_URL ?? '',
  storage: tokenStorage,
  // ponytail: 로그인 화면이 아직 없어 첫 화면으로 보낸다. `login` 화면이 생기면 경로만 바꾼다.
  onSessionExpired: () => router.replace('/'),
});

// Orval이 ErrorType<응답 타입> 형태로 쓴다. 실제 오류는 항상 ApiError다.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type ErrorType<_Error> = ApiError;
export type BodyType<Body> = Body;
