import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';

import { pendingRoute } from '@/lib/pendingRoute';
import { tokenStorage } from '@/lib/tokenStorage';

const PUBLIC_ROUTES = ['/login', '/signup', '/github', '/component-catalog'];

// 토큰이 없으면 로그인 화면으로 보낸다. 내비게이터가 마운트된 뒤에만 이동할 수 있어 ready로 기다린다.
export function useAuthGate(ready: boolean) {
  const pathname = usePathname();

  useEffect(() => {
    if (!ready || PUBLIC_ROUTES.includes(pathname)) return;
    tokenStorage.get().then((tokens) => {
      if (tokens) return;
      // 공유 링크로 들어왔다면 로그인 뒤 돌아갈 수 있게 기억한다.
      if (pathname.startsWith('/s/')) pendingRoute.set(pathname);
      router.replace('/login');
    });
  }, [ready, pathname]);
}
