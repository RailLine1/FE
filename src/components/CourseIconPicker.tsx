import { Image, Pressable, StyleSheet, View } from 'react-native';

import { courseIconNames, getCourseIconSource } from '@/components/CourseIcon';
import { Palette } from '@/styles/palette';

const COLUMNS = 6;

type CourseIconPickerProps = {
  value: string;
  onChange: (icon: string) => void;
};

export function CourseIconPicker({ value, onChange }: CourseIconPickerProps) {
  const rows = Array.from({ length: Math.ceil(courseIconNames.length / COLUMNS) }, (_, index) =>
    courseIconNames.slice(index * COLUMNS, (index + 1) * COLUMNS),
  );

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0]} style={styles.row}>
          {row.map((icon) => {
            const selected = icon === value;
            return (
              <Pressable
                key={icon}
                accessibilityRole="radio"
                accessibilityLabel={icon}
                accessibilityState={{ selected }}
                onPress={() => onChange(icon)}
                style={[styles.item, selected && styles.selected]}>
                <Image
                  source={getCourseIconSource(icon)}
                  style={[styles.icon, { tintColor: selected ? Palette.white : Palette.textSub }]}
                />
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 8,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  item: {
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: Palette.surfaceMuted,
  },
  selected: {
    backgroundColor: Palette.purple,
    boxShadow: `0 3px 0 ${Palette.purpleShadow}`,
  },
  icon: {
    width: 22,
    height: 22,
  },
});
