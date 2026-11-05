import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCompleteOnboarding } from '@/api/2-내-정보/2-내-정보';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

const SLIDES = [
  { title: '강의자료를 한곳에', body: '과목별로 자료를 모아 두고,\n같이 듣는 사람과 나눠요.' },
  { title: '내 AI와 함께', body: '평소 쓰는 AI가 강의자료를\n그대로 참고해서 답해줘요.' },
  { title: '하루 한 조각씩', body: '부담 없는 한 문제로,\n배운 내용을 가볍게 되짚어요.' },
];

const TILES = ['solved', 'solved', 'solved', 'today', 'solved', 'solved', 'next', 'empty'] as const;

// P-ACC-05. 서비스 소개
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const { mutate: completeOnboarding } = useCompleteOnboarding();
  const { title, body } = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  const finish = () => {
    // 실패해도 막지 않는다. 다음 로그인 때 소개를 한 번 더 볼 뿐이다.
    completeOnboarding();
    router.replace('/notify');
  };

  return (
    <Screen>
      <ScrollView style={styles.flex} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Button
            label="건너뛰기"
            variant="text"
            size="small"
            onPress={finish}
            style={styles.skip}
          />
        </View>
        <View style={styles.main}>
          {/* 위치는 Figma 일러스트(358x300) 기준이다. 화면 폭이 달라도 같은 크기로 가운데에 둔다. */}
          <View style={styles.illustration}>
            <View style={styles.canvas}>
              {step === 0 && (
                <>
                  <View style={[styles.paper, styles.paperBack]}>
                    <View style={[styles.bar, { width: 78 }]} />
                    <View style={[styles.bar, { width: 78 }]} />
                    <View style={[styles.bar, { width: 46.8 }]} />
                  </View>
                  <View style={[styles.paper, styles.paperFront]}>
                    <View style={[styles.bar, styles.accentBar, { width: 78 }]} />
                    <View style={[styles.bar, { width: 78 }]} />
                    <View style={[styles.bar, { width: 54.6 }]} />
                  </View>
                  <View style={styles.folder}>
                    <View style={styles.folderSlot} />
                  </View>
                </>
              )}
              {step === 1 && (
                <>
                  <View style={[styles.paper, styles.document]}>
                    <View style={[styles.bar, { width: 72 }]} />
                    <View style={[styles.bar, styles.accentBar, { width: 72 }]} />
                    <View style={[styles.bar, { width: 72 }]} />
                    <View style={[styles.bar, { width: 43.2 }]} />
                  </View>
                  <View style={styles.answer}>
                    <View style={[styles.answerBar, { width: 148 }]} />
                    <View style={[styles.answerBar, { width: 96 }]} />
                  </View>
                  <View style={styles.question}>
                    <View style={[styles.bar, { width: 108 }]} />
                  </View>
                  <View style={[styles.badge, styles.sourceBadge]}>
                    <Text style={[styles.badgeLabel, styles.sourceLabel]}>LEC07 P.12 참고</Text>
                  </View>
                </>
              )}
              {step === 2 && (
                <>
                  <View style={styles.grid}>
                    {TILES.map((tile, index) => (
                      <View key={index} style={[styles.tile, styles[tile]]} />
                    ))}
                  </View>
                  <View style={[styles.badge, styles.streakBadge]}>
                    <Text style={[styles.badgeLabel, styles.streakLabel]}>연속 6일</Text>
                  </View>
                </>
              )}
            </View>
          </View>
          <View style={styles.dots}>
            {SLIDES.map((slide, index) => (
              <View key={slide.title} style={[styles.dot, index === step && styles.activeDot]} />
            ))}
          </View>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          <Text style={styles.body}>{body}</Text>
        </View>
        <Button
          label={isLast ? '시작하기' : '다음'}
          onPress={isLast ? finish : () => setStep(step + 1)}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    justifyContent: 'center',
    height: 56,
  },
  skip: {
    alignSelf: 'flex-end',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
  },
  illustration: {
    alignItems: 'center',
    overflow: 'hidden',
    height: 300,
    borderRadius: 28,
    backgroundColor: Palette.purpleTint,
  },
  canvas: {
    width: 358,
    height: 300,
  },
  bar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.line,
  },
  accentBar: {
    backgroundColor: Palette.purple,
  },
  paper: {
    position: 'absolute',
    gap: 10,
    width: 110,
    height: 140,
    paddingTop: 18,
    paddingLeft: 14,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
  },
  paperBack: {
    left: 92,
    top: 56,
    transform: [{ rotate: '-8deg' }],
  },
  paperFront: {
    left: 160,
    top: 44,
    transform: [{ rotate: '7deg' }],
  },
  folder: {
    position: 'absolute',
    left: 60,
    top: 146,
    alignItems: 'center',
    width: 238,
    height: 110,
    paddingTop: 51,
    borderRadius: 18,
    backgroundColor: Palette.purple,
    boxShadow: `0 6px 0 ${Palette.purpleShadow}`,
  },
  folderSlot: {
    width: 56,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff99',
  },
  document: {
    left: 32,
    top: 70,
    width: 104,
  },
  answer: {
    position: 'absolute',
    left: 160,
    top: 56,
    gap: 10,
    width: 180,
    height: 76,
    paddingTop: 18,
    paddingLeft: 16,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    backgroundColor: Palette.purple,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  answerBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffffbf',
  },
  question: {
    position: 'absolute',
    left: 196,
    top: 156,
    width: 144,
    height: 56,
    paddingTop: 20,
    paddingLeft: 16,
    borderWidth: 2,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
  },
  grid: {
    position: 'absolute',
    left: 69,
    top: 98,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: 220,
  },
  tile: {
    width: 46,
    height: 46,
    borderRadius: 14,
  },
  solved: {
    backgroundColor: Palette.purple,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  today: {
    backgroundColor: Palette.golden,
    boxShadow: `0 4px 0 ${Palette.goldenShadow}`,
  },
  next: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Palette.purple,
    backgroundColor: Palette.white,
  },
  empty: {
    borderWidth: 2,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
  },
  badge: {
    position: 'absolute',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: Palette.white,
  },
  sourceBadge: {
    left: 160,
    top: 238,
  },
  streakBadge: {
    left: 147,
    top: 202,
  },
  badgeLabel: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
  },
  sourceLabel: {
    color: Palette.purpleStrong,
  },
  streakLabel: {
    color: Palette.orange,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginVertical: 28,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.line,
  },
  activeDot: {
    width: 24,
    backgroundColor: Palette.purple,
  },
  title: {
    ...Fonts.black,
    fontSize: 32,
    lineHeight: 38.4,
    letterSpacing: -0.8,
    textAlign: 'center',
    color: Palette.text,
  },
  body: {
    ...Fonts.regular,
    minHeight: 51,
    marginTop: 10,
    fontSize: 17,
    lineHeight: 25.5,
    textAlign: 'center',
    color: Palette.textSub,
  },
});
