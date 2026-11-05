import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { ExploreCourseDetail } from '../courseTypes';

type Action = {
  label: string;
  note?: string;
  action?: 'classroom' | 'subscribe';
};

function getAction({ myStatus, ended, visibility }: ExploreCourseDetail): Action {
  // 상태별 버튼(P-COURSE-06)
  if (myStatus === 'subscribed') return { label: '강의실로 이동', action: 'classroom' };
  if (myStatus === 'pending') {
    return { label: '대기 중', note: '관리자가 승인하면 강의실에 나타나요.' };
  }
  if (ended) return { label: '구독 불가', note: '수강 기간이 끝난 과목이에요.' };
  if (visibility === 'private') {
    return {
      label: '가입 요청 보내기',
      note: '비공개 과목이라 관리자가 승인해야 참여할 수 있어요.',
      action: 'subscribe',
    };
  }
  return { label: '구독', note: '구독하면 바로 강의실에 추가돼요.', action: 'subscribe' };
}

type CourseActionProps = {
  course: ExploreCourseDetail;
  disabled?: boolean;
  onSubscribe: () => void;
  onOpenClassroom: () => void;
};

export function CourseAction({ course, disabled, onSubscribe, onOpenClassroom }: CourseActionProps) {
  const { label, note, action } = getAction(course);

  return (
    <View style={styles.action}>
      <Button
        label={label}
        variant={action ? 'primary' : 'secondary'}
        disabled={disabled || !action}
        onPress={action === 'classroom' ? onOpenClassroom : onSubscribe}
      />
      {note && <Text style={styles.note}>{note}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  action: {
    gap: 16,
  },
  note: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.textSub,
    textAlign: 'center',
  },
});
