import { useRouter } from 'expo-router';

// 주소로 바로 들어오면 돌아갈 화면이 없어 탐색 첫 화면으로 보낸다.
export function useGoBackToExplore() {
  const router = useRouter();

  return () => {
    if (router.canGoBack()) router.back();
    else router.replace('/explore');
  };
}
