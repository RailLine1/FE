import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type CheckboxProps = {
  label: string;
  checked: boolean;
  onValueChange?: (checked: boolean) => void;
};

export function Checkbox({ label, checked, onValueChange }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      onPress={() => onValueChange?.(!checked)}
      style={[styles.box, checked && styles.boxChecked]}>
      <View style={[styles.mark, checked && styles.markChecked]} />
      <Text style={[styles.label, checked && styles.labelChecked]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
  },
  boxChecked: {
    borderColor: Palette.purple,
  },
  mark: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 2.5,
    borderColor: Palette.checkboxLine,
    backgroundColor: Palette.white,
  },
  markChecked: {
    borderColor: Palette.purple,
    backgroundColor: Palette.purple,
  },
  label: {
    ...Fonts.regular,
    flex: 1,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  labelChecked: {
    color: Palette.text,
  },
});
