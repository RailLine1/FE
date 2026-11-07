import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGet1 } from '@/api/11-내-ai-출제/11-내-ai-출제';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { SectionLabel } from '@/components/SectionLabel';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CONNECTOR_CLIENTS, lastUsedText } from '../connectorClients';
import { isMyAi, myAiSteps } from '../myAi';

// P-AI-08, P-AI-11
export default function MyAiGuidePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ ai: string }>();
  const ai = isMyAi(params.ai) ? params.ai : 'claude';
  const { name, shortcut } = CONNECTOR_CLIENTS[ai];
  const steps = myAiSteps(ai);

  const { data, isLoading, isError } = useGet1();
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const item = data?.ais?.find((status) => status.ai === ai);

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile/myai');
  };

  const copyPrompt = async () => {
    if (!item?.schedulePrompt) return;
    await Clipboard.setStringAsync(item.schedulePrompt);
    setCopied(true);
  };

  return (
    <Screen>
      <AppBar
        borderless
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: back }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.mark}>
            <Text style={styles.markLetter}>{name.slice(0, 1)}</Text>
          </View>
          <Text accessibilityRole="header" numberOfLines={1} style={styles.name}>
            {name}
          </Text>
          <Button
            label="바로가기"
            variant="secondary"
            size="small"
            onPress={() => Linking.openURL(shortcut)}
            style={styles.shortcut}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberLabel}>{step + 1}</Text>
            </View>
            <Text style={styles.stepText}>{steps[step]}</Text>
          </View>

          {/* ponytail: 실제 캡처가 없어 시안의 자리표시를 그대로 둔다. 이미지가 나오면 교체한다. */}
          <View style={styles.capture}>
            <Text style={styles.captureLabel}>
              {`[${name} 화면 캡처 ${step + 1} / ${steps.length}]`}
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="이전 단계"
              disabled={step === 0}
              onPress={() => setStep(step - 1)}
              style={[styles.arrow, styles.previous, step === 0 && styles.arrowDisabled]}>
              <Icon name="chevron-left-22" />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="다음 단계"
              disabled={step === steps.length - 1}
              onPress={() => setStep(step + 1)}
              style={[
                styles.arrow,
                styles.next,
                step === steps.length - 1 && styles.arrowDisabled,
              ]}>
              <Icon name="chevron-right-20" color={Palette.text} />
            </Pressable>
          </View>

          {step === 0 && (
            <Button
              label="커넥터 등록"
              variant="secondary"
              size="small"
              onPress={() =>
                router.push({ pathname: '/profile/connector/[client]', params: { client: ai } })
              }
              style={styles.wideButton}
            />
          )}

          <View style={styles.dots}>
            {steps.map((text, index) => (
              <View key={text} style={[styles.dot, index === step && styles.activeDot]} />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <SectionLabel>예약 문장</SectionLabel>
          <QueryStatus isLoading={isLoading} isError={isError} />
          {item?.schedulePrompt && (
            <View style={styles.prompt}>
              <Text numberOfLines={3} style={styles.promptText}>
                {item.schedulePrompt.replace(/\n{2,}/g, '\n')}
              </Text>
            </View>
          )}
          <Button
            label={copied ? '복사했어요' : '예약 문장 복사'}
            variant="secondary"
            size="small"
            disabled={!item?.schedulePrompt}
            onPress={copyPrompt}
            style={styles.wideButton}
          />
          <Text style={styles.notice}>
            커넥터를 먼저 등록해야 해요. 첫 예약 실행이 들어오면 등록됨으로 바뀌고, 그때부터 퀴즈
            출처로 고를 수 있어요.
          </Text>
        </View>

        {item?.registered && (
          <View style={styles.registered}>
            <View style={styles.registeredBadge}>
              <Text style={styles.registeredLabel}>등록됨</Text>
            </View>
            {item.lastRunAt && (
              <Text style={styles.registeredText}>
                {lastUsedText(item.lastRunAt, new Date(), '마지막 실행')}
              </Text>
            )}
          </View>
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
    gap: 12,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 48,
    marginBottom: 4,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderWidth: 2,
    borderRadius: 14,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  markLetter: {
    ...Fonts.black,
    fontSize: 20,
    lineHeight: 30,
    color: Palette.text,
  },
  name: {
    ...Fonts.black,
    flex: 1,
    fontSize: 22,
    lineHeight: 33,
    color: Palette.text,
  },
  shortcut: {
    alignSelf: 'center',
  },
  card: {
    gap: 12,
    padding: 16,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: Palette.line,
  },
  step: {
    flexDirection: 'row',
    gap: 10,
    minHeight: 45,
  },
  stepNumber: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Palette.purple,
  },
  stepNumberLabel: {
    ...Fonts.black,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.white,
  },
  stepText: {
    ...Fonts.regular,
    flex: 1,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.text,
  },
  capture: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    paddingHorizontal: 56,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 14,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  captureLabel: {
    ...Fonts.semiBold,
    fontSize: 13,
    lineHeight: 19.5,
    textAlign: 'center',
    color: Palette.textSub,
  },
  arrow: {
    position: 'absolute',
    top: 68,
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Palette.white,
  },
  previous: {
    left: 6,
  },
  next: {
    right: 6,
  },
  arrowDisabled: {
    opacity: 0.4,
  },
  wideButton: {
    alignSelf: 'stretch',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
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
  prompt: {
    padding: 12,
    borderWidth: 2,
    borderRadius: 14,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  promptText: {
    ...Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  notice: {
    ...Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  registered: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: Palette.greenTint,
  },
  registeredBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: Palette.white,
  },
  registeredLabel: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.green,
  },
  registeredText: {
    ...Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
});
