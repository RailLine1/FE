import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Platform, ScrollView, Share, StyleSheet, Text, View } from 'react-native';

import { useRecords, useTicket } from '@/api/7-bit/7-bit';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { circledNumber, compareToAverage, evidenceText, formatSeconds } from '../bitFormat';

const useNativeDriver = Platform.OS !== 'web';

const CONFETTI_COLORS = [
  Palette.purple,
  Palette.purpleShadow,
  Palette.golden,
  Palette.blue,
  Palette.green,
  Palette.orange,
  Palette.red,
];

// 렌더링마다 바뀌지 않게 번호로 위치와 크기를 정한다.
const CONFETTI = Array.from({ length: 70 }, (_, index) => ({
  color: CONFETTI_COLORS[index % CONFETTI_COLORS.length],
  left: `${(index * 37) % 100}%` as const,
  width: 6 + (index * 5) % 9,
  height: 6 + (index * 3) % 9,
  round: index % 9 === 0,
  delay: ((index * 13) % 40) / 100,
  drift: ((index * 29) % 80) - 40,
  turns: 1 + (index % 4),
}));

const CORRECT_TILES = ['solved', 'solved', 'today', 'solved', 'solved', 'solved'] as const;
const WRONG_TILES = ['solved', 'solved', 'empty', 'solved', 'empty', 'next'] as const;

// P-BIT-11. 제출 직후와 완료 티켓에서 모두 이 화면을 본다.
export default function ResultPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ bitId: string; courseId: string; courseName: string }>();
  const bitId = Number(params.bitId);
  const courseId = Number(params.courseId);

  const { data: ticket, isLoading, isError } = useTicket(bitId);
  const correct = ticket?.correct;
  // ResultTicket에는 보기 글자가 없어 오답일 때만 해설에서 가져온다.
  const { data: records } = useRecords(
    courseId,
    { day: 'today' },
    { query: { enabled: correct === false && Boolean(courseId) } },
  );
  const [confetti] = useState(() => new Animated.Value(0));
  const [shake] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (correct === undefined) return;
    if (correct) {
      Animated.timing(confetti, { toValue: 1, duration: 2600, useNativeDriver }).start();
      return;
    }
    // 시안에 오답 모션 프레임이 없어 카드를 짧게 흔든다.
    Animated.sequence(
      [-10, 10, -6, 6, 0].map((toValue) =>
        Animated.timing(shake, { toValue, duration: 70, useNativeDriver }),
      ),
    ).start();
  }, [confetti, correct, shake]);

  const close = () => router.dismissTo('/bit');
  const openRecords = () => router.push({ pathname: '/bit/[bitId]/records', params });
  const share = async () => {
    try {
      await Share.share({
        message: `Daybit ${ticket?.courseName} #${ticket?.no} ${formatSeconds(ticket?.elapsedSec)}`,
      });
    } catch {
      // 공유를 지원하지 않는 브라우저이거나 사용자가 닫은 경우다.
    }
  };

  if (!ticket) {
    return (
      <Screen background={Palette.navy}>
        <View style={styles.header}>
          <IconButton icon="closeInverse" accessibilityLabel="닫기" onPress={close} />
        </View>
        <QueryStatus isLoading={isLoading} isError={isError} />
      </Screen>
    );
  }

  const answerLabel =
    records?.explanation?.answer === ticket.answer
      ? records?.explanation?.choices?.[ticket.answer ?? 0]
      : undefined;
  const evidence = evidenceText(ticket.evidence);
  const answerText = [
    `정답은 ${circledNumber(ticket.answer)}${answerLabel ? ` ${answerLabel}` : ''}`,
    evidence,
  ]
    .filter(Boolean)
    .join(' · ');
  const tiles = correct ? CORRECT_TILES : WRONG_TILES;

  return (
    <Screen background={Palette.navy}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <IconButton icon="closeInverse" accessibilityLabel="닫기" onPress={close} />
        </View>
        <View style={styles.eyebrow}>
          <Text style={styles.eyebrowLabel}>
            {correct ? '한 번에 정답, 힌트 없이' : '아쉽게 오답'}
          </Text>
        </View>
        <Text accessibilityRole="header" style={styles.time}>
          {formatSeconds(ticket.elapsedSec)}
        </Text>
        <Text style={styles.summary}>
          {`${ticket.courseName} #${ticket.no} · 오늘 평균 ${formatSeconds(ticket.averageSec)}`}
        </Text>

        <Animated.View
          style={[
            styles.card,
            correct ? styles.correctCard : styles.wrongCard,
            { transform: [{ translateX: shake }] },
          ]}>
          <View style={styles.tiles}>
            {tiles.map((tile, index) => (
              <View key={index} style={[styles.tile, styles[tile]]} />
            ))}
          </View>
          {correct ? (
            <>
              <Text style={styles.rank}>{`상위 ${ticket.topPercent}%`}</Text>
              <Text style={styles.score}>
                {`점수 ${ticket.score} · ${compareToAverage(ticket.elapsedSec, ticket.averageSec)}`}
              </Text>
              <View style={styles.week}>
                {ticket.week?.map((solved, index) => (
                  <View
                    key={index}
                    style={[styles.weekBit, solved ? styles.solvedBit : styles.emptyBit]}
                  />
                ))}
              </View>
              <Text style={styles.streak}>{`연속 ${ticket.streak}일째`}</Text>
            </>
          ) : (
            <>
              <Text style={styles.retry}>내일 다시 도전</Text>
              <Text style={styles.answer}>{answerText}</Text>
              <Text style={styles.keepStreak}>
                {`푼 것만으로 연속 ${ticket.streak}일째가 이어져요`}
              </Text>
            </>
          )}
          <Text style={styles.logo}>Daybit</Text>
        </Animated.View>

        <View style={styles.spacer} />
        <View style={styles.actions}>
          {/* ponytail: 카드를 이미지로 저장하려면 새 라이브러리가 필요해 비활성으로 둔다. */}
          <Button label="이미지 저장" variant="surface" disabled style={styles.action} />
          <Button label="공유" variant="surface" onPress={share} style={styles.action} />
        </View>
        <Button
          label="기록 보기"
          variant="textInverse"
          onPress={openRecords}
          style={styles.recordsButton}
        />
      </ScrollView>

      {correct && (
        <View pointerEvents="none" style={styles.confetti}>
          {CONFETTI.map((piece, index) => {
            const start = piece.delay;
            return (
              <Animated.View
                key={index}
                style={{
                  position: 'absolute',
                  top: -20,
                  left: piece.left,
                  width: piece.width,
                  height: piece.height,
                  borderRadius: piece.round ? piece.width / 2 : 2,
                  backgroundColor: piece.color,
                  opacity: confetti.interpolate({
                    inputRange: [0, start, start + 0.01, 0.85, 1],
                    outputRange: [0, 0, 1, 1, 0],
                  }),
                  transform: [
                    {
                      translateY: confetti.interpolate({
                        inputRange: [0, start, 1],
                        outputRange: [0, 0, 880],
                      }),
                    },
                    {
                      translateX: confetti.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, piece.drift],
                      }),
                    },
                    {
                      rotate: confetti.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', `${piece.turns * 360}deg`],
                      }),
                    },
                  ],
                }}
              />
            );
          })}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 28,
  },
  // 화면 밖으로 나간 조각이 가로 스크롤을 만들지 않게 자른다.
  confetti: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    overflow: 'hidden',
  },
  header: {
    justifyContent: 'center',
    height: 56,
    paddingLeft: 4,
  },
  eyebrow: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#ffffff1f',
  },
  eyebrowLabel: {
    ...Fonts.bold,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.white,
  },
  time: {
    ...Fonts.black,
    marginTop: 12,
    fontSize: 88,
    lineHeight: 92.4,
    letterSpacing: -2,
    textAlign: 'center',
    color: Palette.white,
  },
  summary: {
    ...Fonts.bold,
    fontSize: 15,
    lineHeight: 22.5,
    textAlign: 'center',
    color: '#ffffffb3',
  },
  card: {
    alignItems: 'center',
    alignSelf: 'center',
    width: 300,
    maxWidth: '100%',
    marginTop: 32,
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 21,
    borderRadius: 32,
    backgroundColor: Palette.white,
  },
  correctCard: {
    boxShadow: `0 6px 0 ${Palette.purpleShadow}`,
  },
  wrongCard: {
    boxShadow: `0 6px 0 ${Palette.lineStrong}`,
  },
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: 112,
  },
  tile: {
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  solved: {
    backgroundColor: Palette.purple,
    boxShadow: `0 3px 0 ${Palette.purpleShadow}`,
  },
  today: {
    backgroundColor: Palette.golden,
    boxShadow: `0 3px 0 ${Palette.goldenShadow}`,
  },
  empty: {
    backgroundColor: Palette.line,
  },
  next: {
    borderWidth: 2,
    borderColor: Palette.purple,
  },
  rank: {
    ...Fonts.bold,
    marginTop: 20,
    fontSize: 30,
    lineHeight: 45,
    letterSpacing: -0.8,
    color: Palette.text,
  },
  score: {
    ...Fonts.bold,
    marginTop: 6,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: Palette.textSub,
  },
  week: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
  },
  weekBit: {
    width: 20,
    height: 20,
    borderRadius: 6,
  },
  solvedBit: {
    backgroundColor: Palette.purple,
    boxShadow: `0 2px 0 ${Palette.purpleShadow}`,
  },
  emptyBit: {
    backgroundColor: Palette.line,
  },
  streak: {
    ...Fonts.bold,
    marginTop: 6,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  retry: {
    ...Fonts.bold,
    marginTop: 20,
    fontSize: 26,
    lineHeight: 39,
    letterSpacing: -0.6,
    color: Palette.text,
  },
  answer: {
    ...Fonts.bold,
    marginTop: 6,
    fontSize: 15,
    lineHeight: 22.5,
    textAlign: 'center',
    color: Palette.textSub,
  },
  keepStreak: {
    ...Fonts.bold,
    marginTop: 17,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: Palette.textSub,
  },
  logo: {
    ...Fonts.black,
    marginTop: 20,
    fontSize: 17,
    lineHeight: 25.5,
    letterSpacing: -0.5,
    color: Palette.text,
  },
  spacer: {
    flex: 1,
    minHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  action: {
    flex: 1,
  },
  recordsButton: {
    alignSelf: 'center',
    height: 42,
    marginTop: 8,
  },
});
