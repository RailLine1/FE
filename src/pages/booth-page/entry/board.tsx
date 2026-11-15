import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Mascot } from '@/components/Mascot';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette, themed } from '@/styles/palette';

import { BoothRanking, fetchRanking } from '../boothApi';
import { RankingList } from '../RankingList';

const REFRESH_MS = 5000;

// 부스 모니터에 띄워 두는 랭킹. 5초마다 새로 받는다.
export default function BoothBoardPage() {
  const [ranking, setRanking] = useState<BoothRanking>();

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetchRanking(50)
        .then((next) => alive && setRanking(next))
        .catch(() => undefined);
    load();
    const timer = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.head}>
          <Mascot pose="byte" size={64} />
          <View>
            <Text style={styles.title}>Daybit 부스 퀴즈</Text>
            <Text style={styles.sub}>{ranking ? `${ranking.players}명 참여` : ' '}</Text>
          </View>
        </View>
        {ranking && <RankingList rows={ranking.rows} total={ranking.total} large />}
      </ScrollView>
    </Screen>
  );
}

const styles = themed(() => StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 32,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  title: {
    ...Fonts.black,
    fontSize: 28,
    lineHeight: 40,
    letterSpacing: -1,
    color: Palette.text,
  },
  sub: {
    ...Fonts.bold,
    fontSize: 15,
    lineHeight: 22,
    color: Palette.textSub,
  },
}));
