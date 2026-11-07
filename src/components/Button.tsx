import { Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { Icon, IconName } from '@/components/Icon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

const variants = {
  primary: { background: Palette.purple, shadow: Palette.purpleShadow, text: Palette.white },
  danger: { background: Palette.red, shadow: Palette.redShadow, text: Palette.white },
  success: { background: Palette.green, shadow: Palette.greenShadow, text: Palette.white },
  surface: { background: Palette.white, shadow: Palette.navyShadow, text: Palette.navy },
  secondary: { border: Palette.lineStrong, shadow: Palette.lineStrong, text: Palette.blue },
  dangerOutline: { border: Palette.lineStrong, shadow: Palette.lineStrong, text: Palette.red },
  neutral: { border: Palette.lineStrong, shadow: Palette.lineStrong, text: Palette.text },
  text: { text: Palette.purpleStrong },
  textInverse: { text: Palette.white },
};

type ButtonProps = {
  label: string;
  variant?: keyof typeof variants;
  size?: 'large' | 'small';
  icon?: IconName;
  disabled?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Button({
  label,
  variant = 'primary',
  size = 'large',
  icon,
  disabled,
  onPress,
  style,
}: ButtonProps) {
  const colors: { background?: string; border?: string; shadow?: string; text: string } =
    variants[variant];
  const large = size === 'large';
  const depth = large ? 4 : 3;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      // 누르면 그림자 높이만큼 내려가 눌린 것처럼 보인다(Claude Design db-btn:active).
      style={({ pressed }) => [
        styles.base,
        large ? styles.large : styles.small,
        colors.background && { backgroundColor: colors.background },
        colors.border && { borderWidth: 2, borderColor: colors.border },
        colors.shadow && { boxShadow: `0 ${depth}px 0 ${colors.shadow}` },
        pressed && colors.shadow && { boxShadow: 'none', transform: [{ translateY: depth }] },
        disabled && styles.disabled,
        style,
      ]}>
      {icon && <Icon name={icon} />}
      <Text style={[large ? styles.largeLabel : styles.smallLabel, { color: colors.text }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  large: {
    height: 48,
    borderRadius: 12,
  },
  small: {
    alignSelf: 'flex-start',
    height: 36,
    borderRadius: 10,
  },
  disabled: {
    opacity: 0.45,
  },
  largeLabel: {
    ...Fonts.bold,
    fontSize: 15,
    lineHeight: 22.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  smallLabel: {
    ...Fonts.bold,
    fontSize: 13,
    lineHeight: 19.5,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
