import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { IconButton, IconButtonIcon } from '@/components/IconButton';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type AppBarProps = {
  title?: string;
  leading?: {
    icon: IconButtonIcon;
    accessibilityLabel: string;
    onPress?: () => void;
  };
  trailing?: ReactNode;
  large?: boolean;
  borderless?: boolean;
};

export function AppBar({ title, leading, trailing, large, borderless }: AppBarProps) {
  return (
    <View style={[styles.bar, { paddingLeft: leading ? 8 : 16 }, !borderless && styles.border]}>
      {leading && <IconButton {...leading} />}
      <Text accessibilityRole="header" numberOfLines={1} style={[styles.title, large && styles.large]}>
        {title}
      </Text>
      {trailing}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 56,
    paddingRight: 8,
    backgroundColor: 'transparent',
  },
  border: {
    borderBottomWidth: 2,
    borderBottomColor: Palette.line,
  },
  title: {
    ...Fonts.extraBold,
    flex: 1,
    fontSize: 17,
    color: Palette.text,
  },
  large: {
    fontSize: 24,
  },
});
