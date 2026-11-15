import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette, themed } from '@/styles/palette';

const colors = themed(() => ({
  purple: Palette.purple,
  blue: Palette.blue,
  orange: Palette.orange,
  green: Palette.green,
  purpleDeep: Palette.purpleShadow,
}));

type AvatarProps = {
  label: string;
  color?: keyof typeof colors;
};

export function Avatar({ label, color = 'purple' }: AvatarProps) {
  return (
    <View style={[styles.circle, { backgroundColor: colors[color] }]}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderWidth: 2,
    borderRadius: 18,
    borderColor: Palette.surface,
  },
  label: {
    ...Fonts.extraBold,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.white,
  },
}));
