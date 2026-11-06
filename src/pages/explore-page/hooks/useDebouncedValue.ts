import { useEffect, useState } from 'react';

const DEBOUNCE_DELAY = 300;

// 입력이 멈춘 뒤의 값만 돌려준다.
export function useDebouncedValue<T>(value: T) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), DEBOUNCE_DELAY);
    return () => clearTimeout(timer);
  }, [value]);

  return debounced;
}
