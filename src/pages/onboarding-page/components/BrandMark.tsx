import { StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

export function BrandMark() {
  return (
    <View style={styles.mark}>
      <Text style={styles.letter}>D</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Palette.purple,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  letter: {
    ...Fonts.black,
    fontSize: 30,
    lineHeight: 45,
    color: Palette.white,
  },
});
