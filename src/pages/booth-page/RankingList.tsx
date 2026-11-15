import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette, themed } from '@/styles/palette';

import { BoothRankRow, formatMs } from './boothApi';

type Props = {
  rows: BoothRankRow[];
  total: number;
  me?: string;
  large?: boolean;
};

export function RankingList({ rows, total, me, large }: Props) {
  if (rows.length === 0) return <Text style={styles.empty}>아직 기록이 없어요</Text>;
  return (
    <View style={styles.list}>
      {rows.map((row) => {
        const mine = row.nickname === me;
        return (
          <View key={row.nickname} style={[styles.row, large && styles.rowLarge, mine && styles.rowMine]}>
            <Text style={[styles.rank, large && styles.rankLarge, row.rank <= 3 && styles.rankTop]}>{row.rank}</Text>
            <Text numberOfLines={1} style={[styles.name, large && styles.nameLarge]}>
              {row.nickname}
            </Text>
            <Text style={[styles.meta, large && styles.metaLarge]}>
              {`${row.correct}/${total} · ${formatMs(row.elapsedMs)}`}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = themed(() => StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.line,
    backgroundColor: Palette.surface,
  },
  rowLarge: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  rowMine: {
    borderColor: Palette.purple,
    backgroundColor: Palette.purpleTint,
  },
  rank: {
    ...Fonts.black,
    width: 28,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: Palette.textSub,
  },
  rankLarge: {
    width: 44,
    fontSize: 24,
    lineHeight: 34,
  },
  rankTop: {
    color: Palette.purpleStrong,
  },
  name: {
    ...Fonts.bold,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: Palette.text,
  },
  nameLarge: {
    fontSize: 22,
    lineHeight: 32,
  },
  meta: {
    ...Fonts.semiBold,
    fontSize: 13,
    lineHeight: 20,
    color: Palette.textSub,
  },
  metaLarge: {
    fontSize: 18,
    lineHeight: 28,
  },
  empty: {
    ...Fonts.semiBold,
    paddingVertical: 24,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: Palette.textSub,
  },
}));
