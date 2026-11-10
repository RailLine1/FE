import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { ListRow } from '@/components/ListRow';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseMember } from '../courseTypes';
import { roleBadges } from './CourseSummary';
import { MemberAvatar } from './MemberAvatar';

const formatCoSince = (value: string) => {
  const date = new Date(value);
  const pad = (number: number) => String(number).padStart(2, '0');
  return `${pad(date.getMonth() + 1)}.${pad(date.getDate())}부터`;
};

type MemberRowProps = {
  member: CourseMember;
  isMe: boolean;
  // 없으면 바꿀 수 없는 사람이라 직급만 보여준다.
  onPressRole?: () => void;
};

export function MemberRow({ member, isMe, onPressRole }: MemberRowProps) {
  const badge = roleBadges[member.role];

  return (
    <ListRow
      title={isMe ? '나' : member.nickname}
      subtitle={member.role === 'co' && member.coSince ? formatCoSince(member.coSince) : undefined}
      leading={<MemberAvatar id={member.userId} nickname={member.nickname} isMe={isMe} />}
      trailingAction
      trailing={
        onPressRole ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${member.nickname} 직급 변경`}
            onPress={onPressRole}
            style={styles.roleButton}>
            <Text style={styles.roleLabel}>{badge.label}</Text>
            <Icon name="chevron-down-14" />
          </Pressable>
        ) : (
          <View>
            <Badge label={badge.label} variant={badge.variant} />
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 999,
    borderColor: Palette.line,
    backgroundColor: Palette.surface,
  },
  roleLabel: {
    ...Fonts.bold,
    fontSize: 13,
    color: Palette.text,
  },
});
