import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useCompleteOnboarding } from '@/api/2-내-정보/2-내-정보';
import { Button } from '@/components/Button';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { AuthScreen } from '../components/AuthScreen';
import {
  AiIllustration,
  MaterialsIllustration,
  StreakIllustration,
} from '../components/Illustrations';

const SLIDES = [
  {
    title: '강의자료를 한곳에',
    body: '과목별로 자료를 모아 두고,\n같이 듣는 사람과 나눠요.',
    Illustration: MaterialsIllustration,
  },
  {
    title: '내 AI와 함께',
    body: '평소 쓰는 AI가 강의자료를\n그대로 참고해서 답해줘요.',
    Illustration: AiIllustration,
  },
  {
    title: '하루 한 조각씩',
    body: '부담 없는 한 문제로,\n배운 내용을 가볍게 되짚어요.',
    Illustration: StreakIllustration,
  },
];

// P-ACC-05. 서비스 소개
export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const { mutate: completeOnboarding } = useCompleteOnboarding();
  const { title, body, Illustration } = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  const finish = () => {
    // 실패해도 막지 않는다. 다음 로그인 때 소개를 한 번 더 볼 뿐이다.
    completeOnboarding();
    router.replace('/notify');
  };

  return (
    <AuthScreen>
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
        <Illustration />
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
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
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
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 28,
    marginBottom: 28,
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
