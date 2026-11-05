import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

const MAX_VISIBLE_PAGES = 5;

function getVisiblePages(page: number, totalPages: number) {
  const count = Math.min(MAX_VISIBLE_PAGES, totalPages);
  const start = Math.min(
    Math.max(1, page - Math.floor(count / 2)),
    totalPages - count + 1,
  );
  return Array.from({ length: count }, (_, index) => start + index);
}

type PaginationProps = {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
};

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <View style={styles.pagination}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="이전 페이지"
        disabled={page === 1}
        onPress={() => onChange(page - 1)}
        style={[styles.button, page === 1 && styles.disabled]}>
        <Icon name="chevron-left-22" />
      </Pressable>
      {getVisiblePages(page, totalPages).map((number) => {
        const selected = number === page;
        return (
          <Pressable
            key={number}
            accessibilityRole="button"
            accessibilityLabel={`${number}페이지`}
            accessibilityState={{ selected }}
            onPress={() => onChange(number)}
            style={[styles.button, selected && styles.selected]}>
            <Text style={[styles.number, selected && styles.selectedNumber]}>{number}</Text>
          </Pressable>
        );
      })}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="다음 페이지"
        disabled={page === totalPages}
        onPress={() => onChange(page + 1)}
        style={[styles.button, page === totalPages && styles.disabled]}>
        <Icon name="chevron-right-20" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  disabled: {
    opacity: 0.35,
  },
  selected: {
    backgroundColor: Palette.purple,
  },
  number: {
    ...Fonts.bold,
    fontSize: 14,
    color: Palette.textSub,
  },
  selectedNumber: {
    ...Fonts.extraBold,
    color: Palette.white,
  },
});
