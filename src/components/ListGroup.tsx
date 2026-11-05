import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Palette } from '@/styles/palette';

export function ListGroup({ children }: { children: ReactNode }) {
  return (
    <View style={styles.group}>
      <View style={styles.rows}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    overflow: 'hidden',
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  // 마지막 행의 구분선을 박스 밖으로 밀어 가린다.
  rows: {
    marginBottom: -1,
  },
});
