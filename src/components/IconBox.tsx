import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Palette } from '@/styles/palette';

const tones = {
  main: { background: Palette.purple },
  soft: { background: Palette.purpleTint },
  golden: { background: Palette.goldenTint },
  muted: { background: Palette.surfaceMuted },
  outline: { background: Palette.surface, border: Palette.line },
};

type IconBoxProps = {
  children: ReactNode;
  size?: number;
  tone?: keyof typeof tones;
  raised?: boolean;
};

export function IconBox({ children, size = 36, tone = 'main', raised }: IconBoxProps) {
  const { background, border }: { background: string; border?: string } = tones[tone];

  return (
    <View
      style={[
        styles.box,
        {
          width: size,
          height: size,
          // Claude Design의 36/10, 56/16, 64/18, 72/20 비율이다.
          borderRadius: Math.round(size * 0.28),
          backgroundColor: background,
        },
        border && { borderWidth: 2, borderColor: border },
        raised && styles.raised,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  raised: {
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
});
