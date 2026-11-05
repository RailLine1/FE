import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { ListGroup } from '@/components/ListGroup';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Toast } from '@/components/Toast';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { JoinRequestRow } from '../components/JoinRequestRow';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useCourseJoinRequests } from '../hooks/useCourseJoinRequests';
import { useJoinRequestActions } from '../hooks/useJoinRequestActions';
import { useTimedToast } from '../hooks/useTimedToast';

export default function RequestsPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const { data: course } = useCourseDetail(courseId);
  const { data: requests, isLoading, isError } = useCourseJoinRequests(courseId);
  const { approve, reject, approveAll, isPending } = useJoinRequestActions(courseId);
  const { message, showToast } = useTimedToast();

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else {
      router.replace({
        pathname: '/classroom/[courseId]/settings',
        params: { courseId: params.courseId },
      });
    }
  };

  const denied = course?.role === 'member';

  return (
    <Screen>
      <AppBar
        title="가입 요청 관리"
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }}
      />
      <QueryStatus
        isLoading={isLoading}
        isError={isError || !course || denied}
        errorMessage={denied ? '관리자만 볼 수 있어요.' : undefined}
      />
      {course && !denied && requests && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={styles.description}>비공개 과목이라 승인한 사람만 참여할 수 있어요.</Text>
          {requests.length > 0 ? (
            <>
              <View style={styles.header}>
                <Text style={styles.count}>대기 {requests.length}건</Text>
                <Button
                  label="모두 승인"
                  variant="text"
                  size="small"
                  disabled={isPending}
                  onPress={() => approveAll((count) => showToast(`${count}명을 모두 승인했어요`))}
                />
              </View>
              <ListGroup>
                {requests.map((request) => (
                  <JoinRequestRow
                    key={request.requestId}
                    request={request}
                    disabled={isPending}
                    onReject={() =>
                      reject(request.requestId, () =>
                        showToast(`${request.nickname} 님의 요청을 거절했어요`),
                      )
                    }
                    onApprove={() =>
                      approve(request.requestId, () =>
                        showToast(`${request.nickname} 님을 승인했어요`),
                      )
                    }
                  />
                ))}
              </ListGroup>
            </>
          ) : (
            <Text style={styles.empty}>대기 중인 가입 요청이 없어요</Text>
          )}
          <Text style={styles.note}>요청자의 아이디는 보이지 않고 닉네임만 표시돼요.</Text>
        </ScrollView>
      )}
      {message && <Toast message={message} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: 12,
    padding: 16,
  },
  description: {
    ...Fonts.regular,
    fontSize: 14,
    color: Palette.textSub,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  count: {
    ...Fonts.extraBold,
    fontSize: 11,
    letterSpacing: 2,
    color: Palette.textMuted,
  },
  empty: {
    ...Fonts.semiBold,
    paddingVertical: 32,
    fontSize: 14,
    textAlign: 'center',
    color: Palette.textMuted,
  },
  note: {
    ...Fonts.regular,
    fontSize: 12,
    color: Palette.textSub,
  },
});
