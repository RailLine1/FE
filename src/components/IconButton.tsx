import { Pressable, StyleSheet } from 'react-native';

import { Icon, IconName } from '@/components/Icon';

const icons: Record<string, IconName> = {
  back: 'chevron-left-22',
  close: 'close-22',
  closeInverse: 'close-white-22',
  add: 'plus-22',
  more: 'more-22',
};

type IconButtonProps = {
  icon: 'back' | 'close' | 'closeInverse' | 'add' | 'more';
  accessibilityLabel: string;
  onPress?: () => void;
};

export function IconButton({ icon, accessibilityLabel, onPress }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={styles.button}>
      <Icon name={icons[icon]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderRadius: 12,
  },
});
