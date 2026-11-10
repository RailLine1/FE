import { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

export function SectionLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    ...Fonts.extraBold,
    fontSize: 11,
    letterSpacing: 2,
    color: Palette.textSub,
  },
});
