import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type ListRowProps = {
  title: string;
  subtitle?: string;
  rank?: number;
  value?: string;
  badge?: string;
};

export function ListRow({ title, subtitle, rank, value, badge }: ListRowProps) {
  return (
    <View style={[styles.row, subtitle ? styles.tall : styles.short]}>
      {rank !== undefined && <Text style={styles.rank}>{rank}</Text>}
      <View style={styles.main}>
        <Text style={[styles.title, subtitle ? Fonts.bold : Fonts.semiBold]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {value && <Text style={styles.value}>{value}</Text>}
      {badge && <Badge label={badge} variant="subscribed" />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  short: {
    paddingVertical: 12,
  },
  tall: {
    paddingVertical: 10,
  },
  rank: {
    ...Fonts.extraBold,
    width: 28,
    fontSize: 15,
    lineHeight: 22.5,
    textAlign: 'center',
    color: Palette.textMuted,
  },
  main: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.text,
  },
  subtitle: {
    ...Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  value: {
    ...Fonts.bold,
    fontSize: 15,
    lineHeight: 22.5,
    letterSpacing: 1,
    color: Palette.text,
  },
});
