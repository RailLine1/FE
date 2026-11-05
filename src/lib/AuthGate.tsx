import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';

import { tokenStorage } from '@/lib/tokenStorage';

const PUBLIC_ROUTES = ['/login', '/signup', '/github', '/component-catalog'];

// 토큰이 없으면 로그인 화면으로 보낸다. Stack이 마운트된 뒤 이동하도록 Stack 옆에 렌더링한다.
export function AuthGate() {
  const pathname = usePathname();

  useEffect(() => {
    if (PUBLIC_ROUTES.includes(pathname)) return;
    tokenStorage.get().then((tokens) => {
      if (!tokens) router.replace('/login');
    });
  }, [pathname]);

  return null;
}
