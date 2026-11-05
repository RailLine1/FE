import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CourseIcon } from '@/components/CourseIcon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type TileProps = {
  name: string;
  intro?: string | null;
  icon: string;
  // 지난 강의처럼 끝난 과목은 아이콘을 회색으로 보여준다.
  muted?: boolean;
  onPress?: () => void;
};

export function Tile({ name, intro, icon, muted, onPress }: TileProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      <CourseIcon icon={icon} size={48} tone={muted ? 'muted' : 'soft'} />
      <View>
        <Text numberOfLines={2} style={styles.name}>
          {name}
        </Text>
        {intro && (
          <Text numberOfLines={1} style={styles.intro}>
            {intro}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    aspectRatio: 1,
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
    boxShadow: `0 4px 0 ${Palette.lineStrong}`,
  },
  pressed: {
    boxShadow: 'none',
    transform: [{ translateY: 4 }],
  },
  name: {
    ...Fonts.extraBold,
    fontSize: 17,
    letterSpacing: -0.3,
    color: Palette.text,
  },
  intro: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.textSub,
  },
});
