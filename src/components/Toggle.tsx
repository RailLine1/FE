import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type ToggleProps = {
  title: string;
  description?: string;
  value: boolean;
  onValueChange?: (value: boolean) => void;
  divider?: boolean;
};

export function Toggle({ title, description, value, onValueChange, divider }: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange?.(!value)}
      style={[styles.row, divider && styles.divider]}>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {/* ponytail: Figma에 꺼진 상태가 없어 line 색으로 임시 처리. 디자인이 나오면 교체 */}
      <View style={[styles.track, !value && styles.trackOff]}>
        <View style={[styles.thumb, value ? styles.thumbOn : styles.thumbOff]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...Fonts.semiBold,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.text,
  },
  description: {
    ...Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: Palette.purple,
  },
  trackOff: {
    backgroundColor: Palette.line,
  },
  thumb: {
    position: 'absolute',
    top: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.white,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },
  thumbOn: {
    left: 23,
  },
  thumbOff: {
    left: 3,
  },
});
