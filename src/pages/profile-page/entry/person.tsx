import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useProfile } from '@/api/7-bit/7-bit';
import { AppBar } from '@/components/AppBar';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { streakColor } from '../connectorClients';

// P-BIT-13, P-SOC-02. 닉네임과 과목 구분 없는 학습 기록만 공개한다.
export default function PersonPage() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { data, isLoading, isError } = useProfile(Number(userId));

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/bit');
  };

  const nickname = data?.nickname ?? '';
  const streak = data?.streak;
  const stats = [
    { label: '연속', value: streak?.current ?? 0 },
    { label: '이번 달', value: streak?.thisMonth ?? 0 },
    { label: '최장', value: streak?.best ?? 0 },
  ];

  return (
    <Screen>
      <AppBar
        borderless
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: back }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <QueryStatus isLoading={isLoading} isError={isError} />
        {data && (
          <>
            <View style={styles.avatar}>
              <Text style={styles.avatarLabel}>{nickname.slice(0, 1)}</Text>
            </View>
            <Text accessibilityRole="header" style={styles.nickname}>
              {nickname}
            </Text>

            <View style={styles.card}>
              <View style={styles.stats}>
                {stats.map(({ label, value }) => (
                  <View key={label} style={styles.stat}>
                    <Text style={styles.statValue}>{`${value}일`}</Text>
                    <Text style={styles.statLabel}>{label}</Text>
                  </View>
                ))}
              </View>
              {/* 한 열이 한 주이고 위에서 아래로 날짜가 이어진다. */}
              <View style={styles.grid}>
                {streak?.days?.map(({ date, count }) => (
                  <View key={date} style={[styles.cell, { backgroundColor: streakColor(count) }]} />
                ))}
              </View>
              <View style={styles.gridFooter}>
                <Text style={styles.gridLabel}>15주 전</Text>
                <Text style={styles.gridLabel}>오늘</Text>
              </View>
            </View>
            <Text style={styles.notice}>그날 푼 Bit가 많을수록 진해요.</Text>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Palette.blue,
    boxShadow: '0 4px 0 #1592cc',
  },
  avatarLabel: {
    ...Fonts.bold,
    fontSize: 32,
    lineHeight: 48,
    color: Palette.white,
  },
  nickname: {
    ...Fonts.bold,
    marginTop: 10,
    fontSize: 26,
    lineHeight: 39,
    letterSpacing: -0.6,
    textAlign: 'center',
    color: Palette.text,
  },
  card: {
    gap: 14,
    marginTop: 24,
    padding: 16,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: Palette.line,
  },
  stats: {
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Fonts.bold,
    fontSize: 24,
    lineHeight: 36,
    color: Palette.text,
  },
  statLabel: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignContent: 'space-between',
    gap: 4,
    height: 122,
  },
  cell: {
    width: 14,
    height: 14,
    borderRadius: 4,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridLabel: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  notice: {
    ...Fonts.bold,
    marginTop: 16,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: Palette.textSub,
  },
});
