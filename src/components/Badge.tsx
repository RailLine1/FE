import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

const variants = {
  success: { background: Palette.greenTint, text: Palette.green },
  pending: { background: Palette.blueTint, text: Palette.blue },
  subscribed: { background: Palette.purpleTint, text: Palette.purpleStrong },
};

type BadgeProps = {
  label: string;
  variant: keyof typeof variants;
};

export function Badge({ label, variant }: BadgeProps) {
  const { background, text } = variants[variant];
  return (
    <View style={[styles.badge, { backgroundColor: background }]}>
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
