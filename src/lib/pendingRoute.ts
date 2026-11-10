import type { Href } from 'expo-router';

// 로그인 전에 공유 링크(/s/{코드})로 들어온 사람이 로그인 뒤 그 링크로 돌아가게 경로를 잠깐 기억한다.
let pending: Href | null = null;

export const pendingRoute = {
  set(path: string) {
    pending = path as Href;
  },
  // 한 번 꺼내면 지운다.
  take() {
    const path = pending;
    pending = null;
    return path;
  },
};
