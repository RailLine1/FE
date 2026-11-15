import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { IconButton } from '@/components/IconButton';
import { Mascot } from '@/components/Mascot';
import { QuizChoice } from '@/components/QuizChoice';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette, themed } from '@/styles/palette';

import {
  BoothError,
  BoothRanking,
  BoothResult,
  BoothStart,
  fetchRanking,
  formatMs,
  startBooth,
  submitBooth,
} from '../boothApi';
import { RankingList } from '../RankingList';

const NICKNAME_MAX = 10;

// 행사 부스 퀴즈. 로그인 없이 닉네임 하나당 한 번 풀고, 모두의 기록이 랭킹에 올라간다.
export default function BoothPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [play, setPlay] = useState<BoothStart>();
  const [startedAt, setStartedAt] = useState(0);
  const [now, setNow] = useState(0);
  const [index, setIndex] = useState(0);
  const [choices, setChoices] = useState<number[]>([]);
  const [result, setResult] = useState<BoothResult>();
  const [ranking, setRanking] = useState<BoothRanking>();

  // 푸는 동안 위쪽 시간을 0.1초마다 갱신한다. 기록은 서버가 잰 시간으로 남는다.
  useEffect(() => {
    if (!play || result) return;
    const timer = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(timer);
  }, [play, result]);

  const begin = async () => {
    const name = nickname.trim();
    if (name.length === 0) return setError('닉네임을 써 주세요.');
    if (name.length > NICKNAME_MAX) return setError(`닉네임은 ${NICKNAME_MAX}자까지 쓸 수 있어요.`);
    setBusy(true);
    setError(undefined);
    try {
      const started = await startBooth(name);
      setPlay(started);
      setStartedAt(Date.now());
      setNow(Date.now());
    } catch (e) {
      setError(
        e instanceof BoothError && e.code === 'NICKNAME_TAKEN'
          ? '이미 쓴 닉네임이에요. 다른 닉네임을 써 주세요.'
          : (e as Error).message,
      );
    } finally {
      setBusy(false);
    }
  };

  const choose = (choice: number) =>
    setChoices((prev) => {
      const nextChoices = [...prev];
      nextChoices[index] = choice;
      return nextChoices;
    });

  const next = async () => {
    if (!play || choices[index] === undefined) return;
    if (index < play.questions.length - 1) return setIndex(index + 1);
    setBusy(true);
    setError(undefined);
    try {
      const done = await submitBooth(play.playId, choices);
      setResult(done);
      setRanking(await fetchRanking());
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setNickname('');
    setPlay(undefined);
    setIndex(0);
    setChoices([]);
    setResult(undefined);
    setRanking(undefined);
    setError(undefined);
  };

  const leave = () => (router.canGoBack() ? router.back() : router.replace('/login'));

  if (result && play) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.center}>
            <Mascot pose="byte" size={64} />
            <Text style={styles.resultName}>{result.nickname}</Text>
            <Text style={styles.resultScore}>{`${result.correct} / ${result.total}`}</Text>
            <Text style={styles.resultMeta}>
              {`${formatMs(result.elapsedMs)} · ${result.players}명 중 ${result.rank}위`}
            </Text>
          </View>

          <View style={styles.answers}>
            {play.questions.map((question, i) => {
              const answer = result.answers[i];
              return (
                <View key={i} style={styles.answer}>
                  <Text style={styles.answerStem}>{`${i + 1}. ${question.stem}`}</Text>
                  <Text style={[styles.answerLine, answer.correct ? styles.good : styles.bad]}>
                    {answer.correct
                      ? `정답 · ${question.choices[answer.answer]}`
                      : `오답 · 정답은 ${question.choices[answer.answer]}`}
                  </Text>
                  <Text style={styles.answerText}>{answer.explanation}</Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.section}>랭킹</Text>
          {ranking && <RankingList rows={ranking.rows} total={ranking.total} me={result.nickname} />}

          <Button label="다른 닉네임으로 풀기" variant="neutral" onPress={reset} style={styles.gap} />
        </ScrollView>
      </Screen>
    );
  }

  if (play) {
    const question = play.questions[index];
    const last = index === play.questions.length - 1;
    return (
      <Screen>
        <View style={styles.header}>
          <IconButton icon="close" accessibilityLabel="그만두기" onPress={reset} />
          <View style={styles.progress}>
            <View
              style={[styles.progressFill, { width: `${((index + 1) / play.questions.length) * 100}%` }]}
            />
          </View>
          <Text style={styles.time}>{formatMs(Math.max(0, now - startedAt))}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.quiz}>
          <Text style={styles.count}>{`${index + 1} / ${play.questions.length}`}</Text>
          <Text accessibilityRole="header" style={styles.stem}>
            {question.stem}
          </Text>
          <View style={styles.choices}>
            {question.choices.map((choice, i) => (
              <QuizChoice
                key={`${index}-${i}`}
                number={i + 1}
                label={choice}
                state={choices[index] === i ? 'selected' : 'default'}
                onPress={() => choose(i)}
              />
            ))}
          </View>
          <Button
            label={last ? '제출' : '다음'}
            disabled={busy || choices[index] === undefined}
            onPress={next}
            style={styles.gap}
          />
          {error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.intro}>
        <View style={styles.center}>
          <Mascot pose="byte" size={128} />
          <Text accessibilityRole="header" style={styles.title}>
            Daybit 부스 퀴즈
          </Text>
          <Text style={styles.sub}>3문제 · 맞힌 수가 같으면 빨리 푼 순</Text>
        </View>
        <View style={styles.form}>
          <FormField
            label="닉네임"
            placeholder={`랭킹에 보일 이름 (${NICKNAME_MAX}자까지)`}
            maxLength={NICKNAME_MAX}
            value={nickname}
            error={error}
            onChangeText={setNickname}
            onSubmitEditing={begin}
          />
          <Button label="시작" disabled={busy} onPress={begin} style={styles.gap} />
        </View>
        <Button label="로그인 화면으로" variant="text" onPress={leave} style={styles.back} />
      </ScrollView>
    </Screen>
  );
}

const styles = themed(() => StyleSheet.create({
  intro: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 72,
    paddingBottom: 32,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 32,
  },
  center: {
    alignItems: 'center',
  },
  title: {
    ...Fonts.black,
    marginTop: 16,
    fontSize: 28,
    lineHeight: 40,
    letterSpacing: -1,
    color: Palette.text,
  },
  sub: {
    ...Fonts.regular,
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.textSub,
  },
  form: {
    marginTop: 36,
  },
  gap: {
    marginTop: 24,
  },
  back: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 56,
    paddingLeft: 4,
    paddingRight: 12,
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
    backgroundColor: Palette.purple,
  },
  time: {
    ...Fonts.extraBold,
    width: 56,
    fontSize: 15,
    lineHeight: 22.5,
    textAlign: 'right',
    color: Palette.textSub,
  },
  quiz: {
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  count: {
    ...Fonts.bold,
    fontSize: 13,
    lineHeight: 20,
    color: Palette.purpleStrong,
  },
  stem: {
    ...Fonts.bold,
    marginTop: 8,
    fontSize: 20,
    lineHeight: 29,
    letterSpacing: -0.3,
    color: Palette.text,
  },
  choices: {
    gap: 12,
    marginTop: 16,
  },
  error: {
    ...Fonts.semiBold,
    marginTop: 12,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    color: Palette.red,
  },
  resultName: {
    ...Fonts.bold,
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: Palette.textSub,
  },
  resultScore: {
    ...Fonts.black,
    marginTop: 4,
    fontSize: 40,
    lineHeight: 52,
    color: Palette.text,
  },
  resultMeta: {
    ...Fonts.bold,
    marginTop: 4,
    fontSize: 15,
    lineHeight: 22,
    color: Palette.purpleStrong,
  },
  answers: {
    gap: 12,
    marginTop: 28,
  },
  answer: {
    gap: 4,
    padding: 16,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.line,
    backgroundColor: Palette.surface,
  },
  answerStem: {
    ...Fonts.bold,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.text,
  },
  answerLine: {
    ...Fonts.bold,
    fontSize: 13,
    lineHeight: 20,
  },
  good: {
    color: Palette.green,
  },
  bad: {
    color: Palette.red,
  },
  answerText: {
    ...Fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: Palette.textSub,
  },
  section: {
    ...Fonts.extraBold,
    marginTop: 32,
    marginBottom: 12,
    fontSize: 17,
    lineHeight: 25,
    color: Palette.text,
  },
}));
