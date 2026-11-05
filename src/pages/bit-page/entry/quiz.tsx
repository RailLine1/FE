import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getTicketQueryKey, useStart, useSubmit } from '@/api/7-bit/7-bit';
import type { ResultTicket } from '@/api/model';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { QuizChoice } from '@/components/QuizChoice';
import { Screen } from '@/components/Screen';
import { ApiError } from '@/lib/createApiFetch';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { evidenceText, formatSeconds } from '../bitFormat';

const LOADING_MS = 1500;
const useNativeDriver = Platform.OS !== 'web';

const errorMessage = (error: unknown) =>
  error instanceof ApiError ? error.message : '서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.';

// P-BIT-08, P-BIT-09
export default function QuizPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ bitId: string; courseId: string; courseName: string }>();
  const bitId = Number(params.bitId);

  const start = useStart();
  const submit = useSubmit();
  const { mutate: startBit } = start;
  const [selected, setSelected] = useState<number>();
  const [result, setResult] = useState<ResultTicket>();
  const [now, setNow] = useState(0);
  const [bob] = useState(() => new Animated.Value(0));
  const [progress] = useState(() => new Animated.Value(0));

  const question = start.data?.question;
  const startedAt = start.data?.startedAt;
  const loading = !question && !start.isError;

  const goToResult = () =>
    router.replace({ pathname: '/bit/[bitId]/result', params });
  const close = () => router.dismissTo('/bit');

  // 걸린 시간은 문제를 받은 순간부터 재므로, 로딩이 끝난 뒤에 시작을 요청한다.
  useEffect(() => {
    const timer = setTimeout(() => startBit({ bitId }), LOADING_MS);
    return () => clearTimeout(timer);
  }, [bitId, startBit]);

  useEffect(() => {
    if (!loading) return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 500, useNativeDriver }),
        Animated.timing(bob, { toValue: 0, duration: 500, useNativeDriver }),
      ]),
    );
    animation.start();
    // 너비는 네이티브 드라이버를 쓸 수 없다.
    Animated.timing(progress, {
      toValue: 1,
      duration: LOADING_MS,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    return () => animation.stop();
  }, [bob, loading, progress]);

  useEffect(() => {
    if (!startedAt || result) return;
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [result, startedAt]);

  // 이미 푼 Bit는 다시 응시하지 않고 결과로 보낸다.
  const startError = start.error;
  useEffect(() => {
    if (startError instanceof ApiError && startError.code === 'ALREADY_ATTEMPTED') {
      router.replace({ pathname: '/bit/[bitId]/result', params });
    }
  }, [params, router, startError]);

  const submitAnswer = () => {
    if (selected === undefined) return;
    submit.mutate(
      { bitId, data: { choice: selected } },
      {
        onSuccess: (ticket) => {
          queryClient.setQueryData(getTicketQueryKey(bitId), ticket);
          // 티켓 목록, 기록, 환영 화면의 숫자가 모두 바뀐다.
          queryClient.invalidateQueries({
            predicate: ({ queryKey }) => !String(queryKey[0]).includes('/ticket'),
          });
          setResult(ticket);
        },
        onError: (error) => {
          if (error instanceof ApiError && error.code === 'ALREADY_ATTEMPTED') goToResult();
        },
      },
    );
  };

  if (loading) {
    return (
      <Screen>
        <AppBar
          borderless
          leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: close }}
        />
        <View style={styles.loader}>
          <View style={styles.mark}>
            <Text style={styles.markLetter}>D</Text>
          </View>
          <Text style={styles.logo}>Daybit</Text>
          <View style={styles.stage}>
            <Animated.View
              style={[
                styles.loaderBit,
                styles.purpleBit,
                {
                  transform: [
                    {
                      translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [0, -10] }),
                    },
                    { rotate: '-10deg' },
                  ],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.loaderBit,
                styles.goldenBit,
                {
                  transform: [
                    {
                      translateY: bob.interpolate({ inputRange: [0, 1], outputRange: [-10, 0] }),
                    },
                    { rotate: '16deg' },
                  ],
                },
              ]}
            />
            <View style={styles.loaderShadow} />
          </View>
          <View accessibilityLabel="문제 준비 중" style={styles.loaderBar}>
            <Animated.View
              style={[
                styles.loaderFill,
                {
                  width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
          <Text style={styles.loaderText}>오늘의 한 조각 준비 중</Text>
          <Text style={styles.loaderCourse}>{params.courseName}</Text>
        </View>
      </Screen>
    );
  }

  if (!question) {
    return (
      <Screen>
        <AppBar
          borderless
          leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: close }}
        />
        <Text style={styles.startError}>{errorMessage(startError)}</Text>
      </Screen>
    );
  }

  const answered = result !== undefined;
  const correct = result?.correct;
  const elapsed = answered
    ? (result.elapsedSec ?? 0)
    : Math.max(0, Math.floor((now - Date.parse(startedAt ?? '')) / 1000)) || 0;
  const evidence = evidenceText(result?.evidence);
  const fillColor = !answered ? Palette.purple : correct ? Palette.green : Palette.red;
  const fillWidth = answered ? '100%' : selected === undefined ? '12%' : '50%';

  return (
    <Screen>
      <View style={styles.header}>
        <IconButton icon="close" accessibilityLabel="닫기" onPress={close} />
        <View style={styles.progress}>
          <View style={[styles.progressFill, { width: fillWidth, backgroundColor: fillColor }]} />
        </View>
        <Text style={styles.time}>{formatSeconds(elapsed)}</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagLabel}>{`${params.courseName} #${start.data?.no ?? ''}`}</Text>
          </View>
          {result?.evidence?.file && <Text style={styles.source}>{result.evidence.file}</Text>}
        </View>
        <Text accessibilityRole="header" style={styles.stem}>
          {question.stem}
        </Text>

        <View style={styles.choices}>
          {question.choices?.map((choice, index) => {
            let state: 'default' | 'selected' | 'correct' | 'wrong' = 'default';
            if (answered) {
              if (index === result.answer) state = 'correct';
              else if (index === result.myChoice) state = 'wrong';
            } else if (index === selected) {
              state = 'selected';
            }
            return (
              <QuizChoice
                key={index}
                number={index + 1}
                label={choice}
                state={state}
                onPress={answered ? undefined : () => setSelected(index)}
              />
            );
          })}
        </View>

        {answered ? (
          evidence !== '' && (
            <View style={styles.evidence}>
              <Icon name="file-14" color={Palette.purpleStrong} />
              <Text style={styles.evidenceLabel}>{`${params.courseName} · ${evidence}`}</Text>
            </View>
          )
        ) : (
          <Text style={styles.notice}>근거 페이지와 해설은 제출 후에 공개돼요.</Text>
        )}
      </ScrollView>

      {answered ? (
        <View style={[styles.panel, correct ? styles.correctPanel : styles.wrongPanel]}>
          <Text style={[styles.panelTitle, { color: correct ? Palette.green : Palette.red }]}>
            {correct ? '정답이에요!' : `아쉬워요, 정답은 ${(result.answer ?? 0) + 1}번이에요`}
          </Text>
          {result.explanation && <Text style={styles.panelBody}>{result.explanation}</Text>}
          <Button
            label="계속"
            variant={correct ? 'success' : 'danger'}
            onPress={goToResult}
            style={styles.panelButton}
          />
        </View>
      ) : (
        <View style={styles.footer}>
          {submit.isError && <Text style={styles.submitError}>{errorMessage(submit.error)}</Text>}
          <Button
            label="제출하기"
            disabled={selected === undefined || submit.isPending}
            onPress={submitAnswer}
          />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: {
    alignItems: 'center',
    paddingTop: 24,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Palette.purple,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  markLetter: {
    ...Fonts.black,
    fontSize: 26,
    lineHeight: 39,
    color: Palette.white,
  },
  logo: {
    ...Fonts.black,
    marginTop: 12,
    fontSize: 22,
    lineHeight: 33,
    letterSpacing: -0.5,
    color: Palette.text,
  },
  stage: {
    width: 156,
    height: 156,
    marginTop: 142,
  },
  loaderBit: {
    position: 'absolute',
    width: 52,
    height: 52,
    borderRadius: 12,
  },
  purpleBit: {
    left: 23,
    top: 59,
    backgroundColor: Palette.purple,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  goldenBit: {
    left: 80,
    top: 29,
    backgroundColor: Palette.golden,
    boxShadow: `0 4px 0 ${Palette.goldenShadow}`,
  },
  loaderShadow: {
    position: 'absolute',
    left: 40,
    bottom: 0,
    width: 76,
    height: 10,
    borderRadius: 5,
    backgroundColor: Palette.navy,
    opacity: 0.12,
  },
  loaderBar: {
    overflow: 'hidden',
    width: 280,
    maxWidth: '100%',
    height: 14,
    marginTop: 22,
    padding: 2,
    borderRadius: 7,
    backgroundColor: Palette.line,
  },
  loaderFill: {
    height: 10,
    borderRadius: 5,
    backgroundColor: Palette.purple,
  },
  loaderText: {
    ...Fonts.bold,
    marginTop: 16,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.textSub,
  },
  loaderCourse: {
    ...Fonts.bold,
    marginTop: 16,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  startError: {
    ...Fonts.semiBold,
    padding: 24,
    fontSize: 13,
    textAlign: 'center',
    color: Palette.textSub,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 56,
    paddingLeft: 4,
    paddingRight: 8,
  },
  progress: {
    flex: 1,
    overflow: 'hidden',
    height: 14,
    borderRadius: 7,
    backgroundColor: Palette.line,
  },
  progressFill: {
    height: 14,
    borderRadius: 7,
  },
  time: {
    ...Fonts.extraBold,
    width: 48,
    fontSize: 15,
    lineHeight: 22.5,
    textAlign: 'right',
    color: Palette.textSub,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: Palette.purpleTint,
  },
  tagLabel: {
    ...Fonts.bold,
    fontSize: 11,
    lineHeight: 16.5,
    color: Palette.purpleStrong,
  },
  source: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  stem: {
    ...Fonts.bold,
    marginTop: 16,
    fontSize: 20,
    lineHeight: 29,
    letterSpacing: -0.3,
    color: Palette.text,
  },
  choices: {
    gap: 12,
    marginTop: 16,
  },
  notice: {
    ...Fonts.bold,
    marginTop: 16,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: Palette.textSub,
  },
  evidence: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 46,
    marginTop: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  evidenceLabel: {
    ...Fonts.bold,
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.purpleStrong,
  },
  footer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 28,
    borderTopWidth: 2,
    borderTopColor: Palette.line,
  },
  submitError: {
    ...Fonts.semiBold,
    marginBottom: 12,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: Palette.red,
  },
  panel: {
    paddingTop: 14,
    paddingHorizontal: 16,
    paddingBottom: 28,
    borderTopWidth: 2,
  },
  correctPanel: {
    borderTopColor: Palette.green,
    backgroundColor: Palette.greenTint,
  },
  wrongPanel: {
    borderTopColor: Palette.red,
    backgroundColor: Palette.redTint,
  },
  panelTitle: {
    ...Fonts.black,
    fontSize: 18,
    lineHeight: 27,
  },
  panelBody: {
    ...Fonts.regular,
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  panelButton: {
    marginTop: 13,
  },
});
