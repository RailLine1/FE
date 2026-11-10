import { Href, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TabItem, TabName } from '@/components/TabItem';
import { Palette } from '@/styles/palette';

const tabNames: TabName[] = ['classroom', 'bit', 'explore', 'profile'];

const tabRoutes: Partial<Record<TabName, Href>> = {
  classroom: '/classroom',
  bit: '/bit',
  explore: '/explore',
  profile: '/profile',
};

type TabBarProps = {
  selected: TabName;
  onSelect?: (tab: TabName) => void;
};

export function TabBar({ selected, onSelect }: TabBarProps) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  const select = (tab: TabName) => {
    if (onSelect) {
      onSelect(tab);
      return;
    }
    const route = tabRoutes[tab];
    if (route && tab !== selected) router.replace(route);
  };

  return (
    <View accessibilityRole="tablist" style={[styles.bar, { paddingBottom: 12 + bottom }]}>
      {tabNames.map((tab) => (
        <TabItem key={tab} tab={tab} selected={tab === selected} onPress={() => select(tab)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: 6,
    paddingHorizontal: 8,
    borderTopWidth: 2,
    borderTopColor: Palette.line,
    backgroundColor: Palette.bar,
  },
});
