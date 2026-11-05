import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ListGroup } from '@/components/ListGroup';
import { ListRow } from '@/components/ListRow';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseMember, CourseRole, CourseVisibility } from '../courseTypes';
import { MemberAvatar } from './MemberAvatar';

export type MemberAction = 'co' | 'member' | 'kick';

type RoleSheetProps = {
  member: CourseMember;
  myRole: CourseRole;
  onChoose: (action: MemberAction) => void;
  onClose: () => void;
};

// 공동 관리자 시점에서는 멤버에게 추방만 보인다(P-ROLE-02).
export function MemberRoleSheet({ member, myRole, onChoose, onClose }: RoleSheetProps) {
  const isAdmin = myRole === 'admin';
  const check = (role: CourseRole) =>
    member.role === role ? <Icon name="check-purple-20" /> : undefined;

  return (
    <BottomSheet visible onClose={onClose}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MemberAvatar id={member.userId} nickname={member.nickname} />
          <Text style={styles.name}>{member.nickname}</Text>
        </View>
        <ListGroup>
          {isAdmin && (
            <ListRow
              title="공동 관리자"
              subtitle="가입 승인과 추방을 함께 해요"
              trailing={check('co')}
              onPress={member.role === 'co' ? undefined : () => onChoose('co')}
            />
          )}
          {isAdmin && (
            <ListRow
              title="멤버"
              trailing={check('member')}
              onPress={member.role === 'member' ? undefined : () => onChoose('member')}
            />
          )}
          <ListRow title="추방" titleTone="danger" onPress={() => onChoose('kick')} />
        </ListGroup>
        {!isAdmin && <Text style={styles.note}>권한 변경은 관리자만 할 수 있어요.</Text>}
        <Button label="취소" variant="text" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}

const getConfirm = (nickname: string, action: MemberAction, visibility?: CourseVisibility | null) => {
  if (action === 'kick') {
    return {
      title: `${nickname} 님을 추방할까요?`,
      description:
        visibility === 'public'
          ? '강의실에서 사라지고, 다시 들어오려면 새로 구독해야 해요.'
          : '강의실에서 사라지고, 비공개 과목이라 다시 들어오려면 승인이 필요해요.',
      label: '추방',
    };
  }
  if (action === 'co') {
    return {
      title: `${nickname} 님을 공동 관리자로 바꿀까요?`,
      description: '공동 관리자는 가입 승인과 추방, 자료 관리를 할 수 있어요.',
      label: '바꾸기',
    };
  }
  return {
    title: `${nickname} 님을 멤버로 바꿀까요?`,
    description: '공동 관리자 권한이 사라지고 일반 멤버가 돼요.',
    label: '바꾸기',
  };
};

type ConfirmSheetProps = {
  member: CourseMember;
  action: MemberAction;
  visibility?: CourseVisibility | null;
  disabled?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

export function MemberConfirmSheet({
  member,
  action,
  visibility,
  disabled,
  onConfirm,
  onClose,
}: ConfirmSheetProps) {
  const { title, description, label } = getConfirm(member.nickname, action, visibility);

  return (
    <BottomSheet visible title={title} description={description} onClose={onClose}>
      <View style={styles.actions}>
        <Button
          label={label}
          variant={action === 'kick' ? 'danger' : 'primary'}
          disabled={disabled}
          onPress={onConfirm}
        />
        <Button label="취소" variant="text" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  name: {
    ...Fonts.extraBold,
    fontSize: 20,
    color: Palette.text,
  },
  note: {
    ...Fonts.regular,
    fontSize: 12,
    color: Palette.textSub,
  },
  actions: {
    gap: 12,
  },
});
