import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type QueryStatusProps = {
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
};

// 로딩과 오류는 시안이 없어 최소 표시만 둔다.
export function QueryStatus({
  isLoading,
  isError,
  errorMessage = '불러오지 못했어요. 잠시 후 다시 시도해 주세요.',
}: QueryStatusProps) {
  if (isLoading) {
    return (
      <View style={styles.box}>
        <ActivityIndicator color={Palette.purple} />
      </View>
    );
  }
  if (isError) {
    return (
      <View style={styles.box}>
        <Text style={styles.message}>{errorMessage}</Text>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  message: {
    ...Fonts.semiBold,
    fontSize: 13,
    color: Palette.textSub,
    textAlign: 'center',
  },
});
