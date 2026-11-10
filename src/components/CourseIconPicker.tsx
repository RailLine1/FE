import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { getCourseIconSource } from '@/components/CourseIcon';
import { COURSE_ICON_GROUPS, toCourseIcon } from '@/components/courseIcons';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type CourseIconPickerProps = {
  value: string;
  onChange: (icon: string) => void;
};

// 분야별 묶음, 한 줄에 6개. 모양은 원래 선택 창 그대로(고르면 보라 칸).
export function CourseIconPicker({ value, onChange }: CourseIconPickerProps) {
  const current = toCourseIcon(value);

  return (
    <View style={styles.groups}>
      {COURSE_ICON_GROUPS.map(({ label, keys }) => (
        <View key={label} style={styles.group}>
          <Text style={styles.label}>{label}</Text>
          <View style={styles.row}>
            {keys.map((icon) => {
              const selected = icon === current;
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
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  groups: {
    gap: 12,
    marginTop: 6,
  },
  group: {
    gap: 6,
  },
  label: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
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
