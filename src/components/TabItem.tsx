import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon, IconName } from '@/components/Icon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

const tabs: Record<string, { label: string; icon: IconName; selectedIcon: IconName }> = {
  classroom: { label: '강의실', icon: 'home-22', selectedIcon: 'home-purple-22' },
  bit: { label: 'Bit', icon: 'bit-22', selectedIcon: 'bit-purple-22' },
  explore: { label: '탐색', icon: 'search-gray-22', selectedIcon: 'search-purple-22' },
  profile: { label: '내 정보', icon: 'profile-22', selectedIcon: 'profile-purple-22' },
};

export type TabName = 'classroom' | 'bit' | 'explore' | 'profile';

type TabItemProps = {
  tab: TabName;
  selected?: boolean;
  onPress?: () => void;
};

export function TabItem({ tab, selected, onPress }: TabItemProps) {
  const { label, icon, selectedIcon } = tabs[tab];
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={styles.item}>
      <View style={[styles.icon, selected && styles.iconSelected]}>
        <Icon name={selected ? selectedIcon : icon} />
      </View>
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 32,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: 'transparent',
  },
  iconSelected: {
    borderColor: Palette.purple,
    backgroundColor: Palette.purpleTint,
  },
  label: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textMuted,
  },
  labelSelected: {
    color: Palette.purpleStrong,
  },
});
