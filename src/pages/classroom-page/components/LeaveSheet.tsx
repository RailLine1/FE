import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseRole } from '../courseTypes';

type LeaveContent = {
  title: string;
  description: ReactNode;
  action: string;
};

// 권한별 안내(P-ROLE-03, 04)
function getContent(name: string, role: CourseRole, nextAdmin?: string): LeaveContent {
  if (role !== 'admin') {
    return {
      title: `${name}에서 탈퇴할까요?`,
      description: '강의실 목록에서 사라지고 이 과목 알림도 꺼져요. 다시 들어오려면 탐색에서 구독해야 해요.',
      action: '탈퇴하기',
    };
  }
  if (nextAdmin) {
    return {
      title: `${name}에서 탈퇴할까요?`,
      description: (
        <>
          탈퇴하면 가장 먼저 공동 관리자가 된 <Text style={styles.strong}>{nextAdmin}</Text> 님이
          관리자가 돼요.
        </>
      ),
      action: '탈퇴하기',
    };
  }
  return {
    title: '과목이 삭제돼요',
    description: (
      <>
        공동 관리자가 없어 탈퇴하면 <Text style={styles.strong}>과목과 모든 자료가 삭제</Text>돼요.
        구독자도 더 이상 볼 수 없고, 되돌릴 수 없어요.
      </>
    ),
    action: '탈퇴하고 과목 삭제',
  };
}

type LeaveSheetProps = {
  visible: boolean;
  name: string;
  role: CourseRole;
  nextAdmin?: string;
  disabled?: boolean;
  onClose: () => void;
  onLeave: () => void;
};

export function LeaveSheet({
  visible,
  name,
  role,
  nextAdmin,
  disabled,
  onClose,
  onLeave,
}: LeaveSheetProps) {
  const { title, description, action } = getContent(name, role, nextAdmin);

  return (
    <BottomSheet visible={visible} title={title} onClose={onClose}>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.actions}>
        <Button label={action} variant="danger" disabled={disabled} onPress={onLeave} />
        <Button label="취소" variant="text" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  description: {
    ...Fonts.regular,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 21.7,
    color: Palette.textSub,
  },
  strong: {
    ...Fonts.bold,
    color: Palette.text,
  },
  actions: {
    gap: 12,
  },
});
