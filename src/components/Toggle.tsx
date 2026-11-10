import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

// Claude Design db-toggle: 0.2초 동안 동그라미가 밀리고 색이 바뀐다.
// 기기의 동작 줄이기 설정을 켜면 Reanimated가 애니메이션 없이 바로 바꾼다.
const DURATION = 200;
const THUMB_TRAVEL = 20;

type ToggleProps = {
  title: string;
  description?: string;
  value: boolean;
  onValueChange?: (value: boolean) => void;
  divider?: boolean;
};

export function Toggle({ title, description, value, onValueChange, divider }: ToggleProps) {
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: DURATION });
  }, [progress, value]);

  // ponytail: Figma에 꺼진 상태가 없어 line 색으로 임시 처리. 디자인이 나오면 교체
  const trackStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(progress.value, [0, 1], [Palette.line, Palette.purple]),
  }));
  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * THUMB_TRAVEL }],
  }));

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
      <Animated.View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </Animated.View>
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
  },
  thumb: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Palette.surface,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
  },
});
