import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

const variants = {
  success: { background: Palette.greenTint, text: Palette.green },
  pending: { background: Palette.blueTint, text: Palette.blue },
  subscribed: { background: Palette.purpleTint, text: Palette.purpleStrong },
  danger: { background: Palette.redTint, text: Palette.red },
  admin: { background: Palette.goldenTint, text: Palette.goldenInk },
  member: { background: Palette.surfaceMuted, text: Palette.textSub, border: Palette.line },
};

export type BadgeVariant = keyof typeof variants;

type BadgeProps = {
  label: string;
  variant: BadgeVariant;
};

export function Badge({ label, variant }: BadgeProps) {
  const { background, text, border }: { background: string; text: string; border?: string } =
    variants[variant];
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: background },
        border && { boxShadow: `inset 0 0 0 1px ${border}` },
      ]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  label: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
  },
});
