import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

const pad = (value: number) => String(value).padStart(2, '0');
const toDateString = (year: number, month: number, day: number) =>
  `${year}-${pad(month + 1)}-${pad(day)}`;

function getWeeks(year: number, month: number) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstWeekday).fill(null),
    ...Array.from({ length: days }, (_, index) => index + 1),
  ];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, index) =>
    cells.slice(index * 7, (index + 1) * 7),
  );
}

type CalendarProps = {
  value: string | null;
  onSelect: (date: string) => void;
};

function Calendar({ value, onSelect }: CalendarProps) {
  const initial = value ? new Date(`${value}T00:00:00`) : new Date();
  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth());

  const move = (amount: number) => {
    const next = new Date(year, month + amount, 1);
    setYear(next.getFullYear());
    setMonth(next.getMonth());
  };

  return (
    <View style={styles.calendar}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="이전 달"
          onPress={() => move(-1)}
          style={styles.move}>
          <Icon name="chevron-left-22" />
        </Pressable>
        <Text style={styles.month}>{`${year}년 ${month + 1}월`}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="다음 달"
          onPress={() => move(1)}
          style={styles.move}>
          <Icon name="chevron-right-20" />
        </Pressable>
      </View>
      <View style={styles.week}>
        {WEEKDAYS.map((weekday) => (
          <Text key={weekday} style={styles.weekday}>
            {weekday}
          </Text>
        ))}
      </View>
      {getWeeks(year, month).map((week, weekIndex) => (
        <View key={weekIndex} style={styles.week}>
          {week.map((day, dayIndex) => {
            if (!day) return <View key={dayIndex} style={styles.day} />;
            const date = toDateString(year, month, day);
            const selected = date === value;
            return (
              <Pressable
                key={dayIndex}
                accessibilityRole="button"
                accessibilityLabel={date}
                accessibilityState={{ selected }}
                onPress={() => onSelect(date)}
                style={[styles.day, selected && styles.daySelected]}>
                <Text style={[styles.dayLabel, selected && styles.dayLabelSelected]}>{day}</Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

type DateFieldProps = {
  label: string;
  // YYYY-MM-DD
  value: string | null;
  onChange: (date: string | null) => void;
};

export function DateField({ label, value, onChange }: DateFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label} 날짜 선택`}
        onPress={() => setVisible(true)}
        style={styles.input}>
        <Text style={value ? styles.value : styles.placeholder}>{value?.replaceAll('-', '.') ?? '날짜 선택'}</Text>
      </Pressable>
      <BottomSheet visible={visible} title={`${label} 날짜`} onClose={() => setVisible(false)}>
        {visible && (
          <Calendar
            value={value}
            onSelect={(date) => {
              onChange(date);
              setVisible(false);
            }}
          />
        )}
        {value && (
          <Button
            label="날짜 지우기"
            variant="text"
            onPress={() => {
              onChange(null);
              setVisible(false);
            }}
          />
        )}
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  label: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.textSub,
  },
  input: {
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
  },
  value: {
    ...Fonts.semiBold,
    fontSize: 15,
    color: Palette.text,
  },
  placeholder: {
    ...Fonts.medium,
    fontSize: 15,
    color: Palette.textMuted,
  },
  calendar: {
    gap: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  move: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  month: {
    ...Fonts.extraBold,
    fontSize: 15,
    color: Palette.text,
  },
  week: {
    flexDirection: 'row',
  },
  weekday: {
    ...Fonts.semiBold,
    flex: 1,
    paddingVertical: 6,
    fontSize: 12,
    color: Palette.textSub,
    textAlign: 'center',
  },
  day: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 12,
  },
  daySelected: {
    backgroundColor: Palette.purple,
  },
  dayLabel: {
    ...Fonts.semiBold,
    fontSize: 14,
    color: Palette.text,
  },
  dayLabelSelected: {
    ...Fonts.extraBold,
    color: Palette.white,
  },
});
