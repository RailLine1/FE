import { StyleSheet, View } from 'react-native';

import { TabItem, TabName } from '@/components/TabItem';
import { Palette } from '@/styles/palette';

const tabNames: TabName[] = ['classroom', 'bit', 'explore', 'profile'];

type TabBarProps = {
  selected: TabName;
  onSelect?: (tab: TabName) => void;
};

export function TabBar({ selected, onSelect }: TabBarProps) {
  return (
    <View accessibilityRole="tablist" style={styles.bar}>
      {tabNames.map((tab) => (
        <TabItem key={tab} tab={tab} selected={tab === selected} onPress={() => onSelect?.(tab)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: 6,
    paddingBottom: 12,
    paddingHorizontal: 8,
    borderTopWidth: 2,
    borderTopColor: Palette.line,
    backgroundColor: Palette.white,
  },
});
