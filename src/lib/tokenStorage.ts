import * as SecureStore from 'expo-secure-store';

import type { TokenStorage } from '@/lib/createApiFetch';

const ACCESS_KEY = 'daybit.accessToken';
const REFRESH_KEY = 'daybit.refreshToken';

export const tokenStorage: TokenStorage = {
  async get() {
    const accessToken = await SecureStore.getItemAsync(ACCESS_KEY);
    const refreshToken = await SecureStore.getItemAsync(REFRESH_KEY);
    return accessToken && refreshToken ? { accessToken, refreshToken } : null;
  },
  async set({ accessToken, refreshToken }) {
    await SecureStore.setItemAsync(ACCESS_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_KEY, refreshToken);
  },
  async clear() {
    await SecureStore.deleteItemAsync(ACCESS_KEY);
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  },
};
