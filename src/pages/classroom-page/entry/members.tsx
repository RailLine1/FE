import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { ListGroup } from '@/components/ListGroup';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Toast } from '@/components/Toast';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { MemberRow } from '../components/MemberRow';
import { MemberAction, MemberConfirmSheet, MemberRoleSheet } from '../components/MemberSheets';
import { CourseMember, CourseRole } from '../courseTypes';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useCourseMembers } from '../hooks/useCourseMembers';
import { useCourseSettings } from '../hooks/useCourseSettings';
import { useMemberActions } from '../hooks/useMemberActions';
import { useMyUserId } from '../hooks/useMyUserId';
import { useTimedToast } from '../hooks/useTimedToast';

// 관리자는 본인과 관리자를 뺀 모두를, 공동 관리자는 멤버만 처리할 수 있다(P-ROLE-02).
const canChangeMember = (myRole: CourseRole, member: CourseMember, isMe: boolean) => {
  if (isMe || member.role === 'admin') return false;
  return myRole === 'admin' || member.role === 'member';
};

export default function MembersPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const { data: course, isLoading: isCourseLoading, isError: isCourseError } = useCourseDetail(courseId);
  const { data: settings } = useCourseSettings(courseId);
  // 멤버는 권한이 없어 요청하지 않는다.
  const canManage = course?.role === 'admin' || course?.role === 'co';
  const { data: members, isLoading, isError } = useCourseMembers(courseId, canManage);
  const { changeRole, kick, isPending } = useMemberActions(courseId);
  const myUserId = useMyUserId();
  const { message, showToast } = useTimedToast();
  const [target, setTarget] = useState<CourseMember | null>(null);
  const [action, setAction] = useState<MemberAction | null>(null);

  const closeSheet = () => {
    setTarget(null);
    setAction(null);
  };

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else {
      router.replace({
        pathname: '/classroom/[courseId]/settings',
        params: { courseId: params.courseId },
      });
    }
  };

  const confirm = () => {
    if (!target || !action) return;
    const { userId, nickname } = target;
    const done = (text: string) => {
      closeSheet();
      showToast(text);
    };

    if (action === 'kick') kick(userId, () => done(`${nickname} 님을 추방했어요`));
    else {
      const roleName = action === 'co' ? '공동 관리자' : '멤버';
      changeRole(userId, action, () => done(`${nickname} 님을 ${roleName}로 바꿨어요`));
    }
  };

  const denied = course?.role === 'member';

  return (
    <Screen>
      <AppBar
        title="멤버 관리"
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }}
      />
      <QueryStatus
        isLoading={isCourseLoading || (!denied && isLoading)}
        isError={isCourseError || denied || isError}
        errorMessage={denied ? '관리자만 볼 수 있어요.' : undefined}
      />
      {course && !denied && members && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={styles.summary}>
            {course.name} · {members.length}명
          </Text>
          <ListGroup>
            {members.map((member) => {
              const isMe = member.userId === myUserId;
              return (
                <MemberRow
                  key={member.userId}
                  member={member}
                  isMe={isMe}
                  onPressRole={
                    canChangeMember(course.role, member, isMe) ? () => setTarget(member) : undefined
                  }
                />
              );
            })}
          </ListGroup>
          <Text style={styles.note}>
            관리자는 과목을 만든 사람이에요. 관리자가 나가면 가장 먼저 공동 관리자가 된 사람이
            관리자가 돼요.{'\n'}공동 관리자는 가입 승인과 추방만 할 수 있고, 다른 사람의 권한은 바꿀
            수 없어요.
          </Text>
        </ScrollView>
      )}
      {course && target && !action && (
        <MemberRoleSheet
          member={target}
          myRole={course.role}
          onChoose={setAction}
          onClose={closeSheet}
        />
      )}
      {target && action && (
        <MemberConfirmSheet
          member={target}
          action={action}
          visibility={settings?.visibility}
          disabled={isPending}
          onConfirm={confirm}
          onClose={closeSheet}
        />
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
  summary: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.textSub,
  },
  note: {
    ...Fonts.regular,
    marginTop: 4,
    fontSize: 12,
    lineHeight: 19.2,
    color: Palette.textSub,
  },
});
