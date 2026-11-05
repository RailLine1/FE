import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge, BadgeVariant } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type ListRowProps = {
  title: ReactNode;
  subtitle?: string;
  rank?: number;
  value?: string;
  badge?: string;
  badgeVariant?: BadgeVariant;
  leading?: ReactNode;
  trailing?: ReactNode;
  chevron?: boolean;
  highlighted?: boolean;
  titleTone?: 'default' | 'accent' | 'danger';
  onPress?: () => void;
};

export function ListRow({
  title,
  subtitle,
  rank,
  value,
  badge,
  badgeVariant = 'subscribed',
  leading,
  trailing,
  chevron,
  highlighted,
  titleTone = 'default',
  onPress,
}: ListRowProps) {
  const rowStyle = [
    styles.row,
    subtitle ? styles.tall : styles.short,
    highlighted && styles.highlighted,
  ];
  const content = (
    <>
      {rank !== undefined && <Text style={styles.rank}>{rank}</Text>}
      {leading}
      <View style={styles.main}>
        <Text
          style={[
            styles.title,
            subtitle ? Fonts.bold : Fonts.semiBold,
            titleTone === 'accent' && styles.accent,
            titleTone === 'danger' && styles.danger,
          ]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {value && <Text style={styles.value}>{value}</Text>}
      {badge && (
        <View>
          <Badge label={badge} variant={badgeVariant} />
        </View>
      )}
      {chevron && <Icon name="chevron-right-20" />}
    </>
  );

  // 줄을 누르는 동작과 오른쪽 버튼이 함께 있으면 버튼이 겹치지 않게 나란히 둔다.
  if (onPress && trailing) {
    return (
      <View style={rowStyle}>
        <Pressable accessibilityRole="button" onPress={onPress} style={styles.pressable}>
          {content}
        </Pressable>
        {trailing}
      </View>
    );
  }

  if (onPress) {
    return (
      <Pressable accessibilityRole="button" onPress={onPress} style={rowStyle}>
        {content}
      </Pressable>
    );
  }
  return (
    <View style={rowStyle}>
      {content}
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  pressable: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  short: {
    paddingVertical: 12,
  },
  tall: {
    paddingVertical: 10,
  },
  // ListGroup의 좌우 여백까지 배경을 채운다.
  highlighted: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
    backgroundColor: Palette.purpleTint,
  },
  rank: {
    ...Fonts.extraBold,
    width: 28,
    fontSize: 15,
    lineHeight: 22.5,
    textAlign: 'center',
    color: Palette.textMuted,
  },
  main: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.text,
  },
  accent: {
    color: Palette.purpleStrong,
  },
  danger: {
    color: Palette.red,
  },
  subtitle: {
    ...Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  value: {
    ...Fonts.bold,
    fontSize: 15,
    lineHeight: 22.5,
    letterSpacing: 1,
    color: Palette.text,
  },
});
