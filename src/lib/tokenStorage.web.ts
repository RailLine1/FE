import type { TokenStorage } from '@/lib/createApiFetch';

const ACCESS_KEY = 'daybit.accessToken';
const REFRESH_KEY = 'daybit.refreshToken';

// ponytail: expo-secure-store가 웹을 지원하지 않아 localStorage를 쓴다. XSS에 노출되므로
// 보안 요구가 커지면 BE의 httpOnly 쿠키 방식으로 옮긴다.
export const tokenStorage: TokenStorage = {
  async get() {
    // 서버 렌더링 중에는 localStorage가 없다.
    if (typeof window === 'undefined') return null;
    const accessToken = window.localStorage.getItem(ACCESS_KEY);
    const refreshToken = window.localStorage.getItem(REFRESH_KEY);
    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  },
  async set({ accessToken, refreshToken }) {
    window.localStorage.setItem(ACCESS_KEY, accessToken);
    window.localStorage.setItem(REFRESH_KEY, refreshToken);
  },
  async clear() {
    window.localStorage.removeItem(ACCESS_KEY);
    window.localStorage.removeItem(REFRESH_KEY);
  },
};
