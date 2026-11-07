import { Redirect } from 'expo-router';

// 첫 화면은 강의실이다. 로그인 전이면 useAuthGate가 로그인 화면으로 보낸다.
export default function Index() {
  return <Redirect href="/classroom" />;
}
