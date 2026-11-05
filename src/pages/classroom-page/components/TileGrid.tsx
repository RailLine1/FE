import { StyleSheet, View } from 'react-native';

import { Tile } from '@/components/Tile';

import { CourseTile } from '../courseTypes';

type TileGridProps = {
  courses: CourseTile[];
  muted?: boolean;
};

export function TileGrid({ courses, muted }: TileGridProps) {
  const rows = Array.from({ length: Math.ceil(courses.length / 2) }, (_, index) =>
    courses.slice(index * 2, index * 2 + 2),
  );

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0].courseId} style={styles.row}>
          {row.map(({ courseId, name, intro, icon }) => (
            <View key={courseId} style={styles.cell}>
              <Tile name={name} intro={intro} icon={icon} muted={muted} />
            </View>
          ))}
          {row.length === 1 && <View style={styles.cell} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  cell: {
    flex: 1,
    minWidth: 0,
  },
});
