import { useRouter } from 'expo-router';

// 주소로 바로 들어오면 돌아갈 화면이 없어 강의실로 보낸다.
export function useGoBackToClassroom() {
  const router = useRouter();

  return () => {
    if (router.canGoBack()) router.back();
    else router.replace('/classroom');
  };
}
