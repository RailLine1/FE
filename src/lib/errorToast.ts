import { useSyncExternalStore } from 'react';

import { ApiError } from '@/lib/createApiFetch';

const TOAST_DURATION = 2400;
const FALLBACK_MESSAGE = '처리하지 못했어요. 잠시 후 다시 시도해 주세요.';

// 화면에 따로 안내가 없는 요청에 붙이면 실패 시 서버 문구를 토스트로 보여준다.
export const showErrorMeta = { showError: true };

let message: string | null = null;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

const setMessage = (next: string | null) => {
  message = next;
  listeners.forEach((listener) => listener());
};

export function getErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return FALLBACK_MESSAGE;
  // VALIDATION_FAILED의 message는 '필드: 내용' 형식이다.
  if (error.code === 'VALIDATION_FAILED') return error.message.replace(/^[^:]*:\s*/, '');
  return error.message || FALLBACK_MESSAGE;
}

export function showErrorToast(error: unknown) {
  clearTimeout(timer);
  setMessage(getErrorMessage(error));
  timer = setTimeout(() => setMessage(null), TOAST_DURATION);
}

export function useErrorToastMessage() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    () => message,
    () => null,
  );
}
