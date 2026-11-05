import { useEffect, useState } from 'react';

const TOAST_DURATION = 1600;

// 처리 결과 안내를 잠깐 보여준다.
export function useTimedToast() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [message]);

  return { message, showToast: setMessage };
}
