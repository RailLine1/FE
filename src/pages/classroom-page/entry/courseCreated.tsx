import * as Clipboard from 'expo-clipboard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { CourseIcon } from '@/components/CourseIcon';
import { Screen } from '@/components/Screen';
import { Toast } from '@/components/Toast';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

const TOAST_DURATION = 2500;

export default function CourseCreatedPage() {
  const router = useRouter();
  const { name, icon, code } = useLocalSearchParams<{ name: string; icon: string; code: string }>();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyCode = async () => {
    await Clipboard.setStringAsync(code ?? '');
    setCopied(true);
  };

  return (
    <Screen>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <CourseIcon icon={icon ?? ''} size={72} raised />
          <Text accessibilityRole="header" style={styles.title}>
            {`${name} 과목을 만들었어요`}
          </Text>
          <Text style={styles.description}>함께 들을 사람에게 과목 코드를 알려 주세요.</Text>
        </View>
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>과목 코드</Text>
          <Text style={styles.code}>{code}</Text>
          <Button
            label="코드 복사"
            variant="secondary"
            size="small"
            onPress={copyCode}
            style={styles.copy}
          />
        </View>
        <Text style={styles.tip}>강의자료를 올리면 구독자가 보고, 연결한 AI로 대화할 수 있어요.</Text>
        <View style={styles.spacer} />
        <Button label="강의실로 가기" onPress={() => router.replace('/classroom')} />
      </ScrollView>
      {copied && <Toast message="코드를 복사했어요" />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  hero: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 24,
  },
  title: {
    ...Fonts.black,
    marginTop: 16,
    fontSize: 24,
    letterSpacing: -0.5,
    color: Palette.text,
    textAlign: 'center',
  },
  description: {
    ...Fonts.regular,
    fontSize: 15,
    color: Palette.textSub,
    textAlign: 'center',
  },
  codeCard: {
    gap: 6,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: Palette.purple,
    backgroundColor: Palette.white,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  codeLabel: {
    ...Fonts.extraBold,
    fontSize: 11,
    letterSpacing: 2,
    color: Palette.purpleStrong,
  },
  code: {
    ...Fonts.black,
    fontSize: 36,
    letterSpacing: 6,
    color: Palette.text,
  },
  copy: {
    alignSelf: 'stretch',
    marginTop: 10,
  },
  tip: {
    ...Fonts.semiBold,
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Palette.goldenTint,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.text,
  },
  spacer: {
    flexGrow: 1,
    minHeight: 24,
  },
});
