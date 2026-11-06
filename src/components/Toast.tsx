import { StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

export function Toast({ message, icon = true }: { message: string; icon?: boolean }) {
  return (
    <View accessibilityLiveRegion="polite" pointerEvents="none" style={styles.position}>
      <View style={styles.toast}>
        {icon && <Icon name="check-white-16" color={Palette.golden} />}
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  position: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 132,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Palette.navy,
    boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.12)',
  },
  message: {
    ...Fonts.bold,
    fontSize: 13,
    color: Palette.white,
  },
});
