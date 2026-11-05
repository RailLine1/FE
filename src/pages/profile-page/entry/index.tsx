import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useLogout } from '@/api/1-인증/1-인증';
import { useGet2 } from '@/api/10-커넥터/10-커넥터';
import { useGet } from '@/api/2-내-정보/2-내-정보';
import { useMyStreak } from '@/api/7-bit/7-bit';
import { AppBar } from '@/components/AppBar';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { ListGroup } from '@/components/ListGroup';
import { ListRow } from '@/components/ListRow';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { queryClient } from '@/lib/queryClient';
import { tokenStorage } from '@/lib/tokenStorage';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { connectedSummary, streakColor } from '../connectorClients';

export default function ProfilePage() {
  const router = useRouter();
  const me = useGet();
  const streak = useMyStreak({ weeks: 15 });
  const connector = useGet2();
  const logout = useLogout();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const nickname = me.data?.nickname ?? '';
  const stats = [
    { label: '연속', value: streak.data?.current ?? 0 },
    { label: '이번 달', value: streak.data?.thisMonth ?? 0 },
    { label: '최장', value: streak.data?.best ?? 0 },
  ];

  const signOut = async () => {
    const tokens = await tokenStorage.get();
    // 서버 요청이 실패해도 이 기기에서는 로그아웃한다.
    if (tokens) {
      await logout
        .mutateAsync({ data: { refreshToken: tokens.refreshToken } })
        .catch(() => undefined);
    }
    await tokenStorage.clear();
    queryClient.clear();
    setConfirmLogout(false);
    router.replace('/login');
  };

  return (
    <Screen hasTabBar>
      <AppBar large title="내 정보" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <QueryStatus isLoading={me.isLoading} isError={me.isError} />
        {me.data && (
          <View style={styles.profile}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLabel}>{nickname.slice(0, 1)}</Text>
            </View>
            <View style={styles.profileText}>
              <Text numberOfLines={1} style={styles.nickname}>
                {nickname}
              </Text>
              <Text style={styles.counts}>
                {`구독 ${me.data.subscribedCount ?? 0} · 관리 ${me.data.managedCount ?? 0}`}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.stats}>
            {stats.map(({ label, value }) => (
              <View key={label} style={styles.stat}>
                <Text style={styles.statValue}>{`${value}일`}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
          {/* P-BIT-13. 한 열이 한 주이고 위에서 아래로 날짜가 이어진다. */}
          <View style={styles.grid}>
            {streak.data?.days?.map(({ date, count }) => (
              <View key={date} style={[styles.cell, { backgroundColor: streakColor(count) }]} />
            ))}
          </View>
          <View style={styles.gridFooter}>
            <Text style={styles.gridLabel}>15주 전</Text>
            <Text style={styles.gridLabel}>많이 풀수록 진해요 · 프로필에 공개</Text>
            <Text style={styles.gridLabel}>오늘</Text>
          </View>
        </View>

        <ListGroup>
          <ListRow
            title={<Text style={styles.menuTitle}>커넥터 등록</Text>}
            trailing={
              <View style={styles.menuTrailing}>
                <Text style={styles.menuValue}>{connectedSummary(connector.data?.clients)}</Text>
                <Icon name="chevron-right-20" />
              </View>
            }
            onPress={() => router.push('/profile/connector')}
          />
          {/* P-NOTI-02. 시안에 이동할 화면이 없고, 알림은 과목별 화면에서 바꾼다. */}
          <ListRow
            title={<Text style={styles.menuTitle}>알림 설정</Text>}
            trailing={
              <View style={styles.menuTrailing}>
                <Text style={styles.menuValue}>과목별</Text>
                <Icon name="chevron-right-20" />
              </View>
            }
          />
          <ListRow
            title={<Text style={styles.menuTitle}>로그아웃</Text>}
            titleTone="danger"
            onPress={() => setConfirmLogout(true)}
          />
        </ListGroup>
      </ScrollView>
      <TabBar selected="profile" />

      <BottomSheet
        visible={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        title="로그아웃할까요?">
        <View style={styles.sheetActions}>
          <Button
            label="로그아웃"
            variant="danger"
            disabled={logout.isPending}
            onPress={signOut}
          />
          <Button label="취소" variant="text" onPress={() => setConfirmLogout(false)} />
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: 14,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.purple,
  },
  avatarLabel: {
    ...Fonts.bold,
    fontSize: 20,
    lineHeight: 30,
    color: Palette.white,
  },
  profileText: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  nickname: {
    ...Fonts.bold,
    fontSize: 20,
    lineHeight: 30,
    color: Palette.text,
  },
  counts: {
    ...Fonts.regular,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  card: {
    gap: 12,
    padding: 14,
    borderWidth: 2,
    borderRadius: 16,
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
    fontSize: 20,
    lineHeight: 30,
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
    gap: 3,
    height: 102,
  },
  cell: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridLabel: {
    ...Fonts.bold,
    fontSize: 11,
    lineHeight: 16.5,
    color: Palette.textSub,
  },
  menuTitle: {
    ...Fonts.bold,
  },
  menuTrailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuValue: {
    ...Fonts.bold,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  sheetActions: {
    gap: 12,
    marginTop: 8,
  },
});
