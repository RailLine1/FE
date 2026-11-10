import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useToday } from '@/api/7-bit/7-bit';
import { Screen } from '@/components/Screen';
import { useCourseInfo } from '@/pages/explore-page/hooks/useCourseInfo';
import { Palette } from '@/styles/palette';

// 공유 링크(/s/{과목 코드}). 그 과목을 듣고 있으면 오늘의 Bit로, 아니면 과목 정보(구독 · 가입 요청)로 보낸다.
// 로그인 전이면 useAuthGate가 로그인으로 보내고, 로그인 뒤 이 화면으로 돌아온다.
export default function ShareEntryPage() {
  const router = useRouter();
  const { code = '' } = useLocalSearchParams<{ code: string }>();
  const info = useCourseInfo(code);
  const member = info.data?.myStatus === 'subscribed' || info.data?.myStatus === 'managing';
  const today = useToday({ query: { enabled: member } });

  useEffect(() => {
    if (info.isError) {
      router.replace('/explore');
      return;
    }
    if (!info.data) return;
    if (!member) {
      router.replace({ pathname: '/explore/[code]', params: { code } });
      return;
    }
    if (!today.data && !today.isError) return;
    const ticket = today.data?.find((item) => item.courseId === info.data?.courseId);
    if (!ticket?.bitId) {
      router.replace('/bit');
      return;
    }
    const params = {
      bitId: String(ticket.bitId),
      courseId: String(ticket.courseId),
      courseName: ticket.courseName ?? '',
    };
    router.replace(
      ticket.status === 'done'
        ? { pathname: '/bit/[bitId]/result', params }
        : { pathname: '/bit/[bitId]/quiz', params },
    );
  }, [code, info.data, info.isError, member, router, today.data, today.isError]);

  return (
    <Screen>
      <View style={styles.center}>
        <ActivityIndicator color={Palette.purple} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
