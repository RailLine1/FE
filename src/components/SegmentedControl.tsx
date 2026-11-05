import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type SegmentedControlProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange?: (value: T) => void;
};

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <View accessibilityRole="tablist" style={styles.control}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange?.(option.value)}
            style={[styles.option, selected && styles.selected]}>
            <Text style={[styles.label, selected && styles.selectedLabel]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 36,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: Palette.white,
    boxShadow: `0 0 0 2px ${Palette.purple}`,
  },
  label: {
    ...Fonts.bold,
    fontSize: 13,
    letterSpacing: 0.5,
    color: Palette.textMuted,
  },
  selectedLabel: {
    color: Palette.purpleStrong,
  },
});
