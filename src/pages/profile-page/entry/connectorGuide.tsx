import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getGet2QueryKey, useGet2, useReissue } from '@/api/10-커넥터/10-커넥터';
import { AppBar } from '@/components/AppBar';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { Icon } from '@/components/Icon';
import { Screen } from '@/components/Screen';
import { SectionLabel } from '@/components/SectionLabel';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CONNECTOR_CLIENTS, ConnectorClient, lastUsedText } from '../connectorClients';
import { ISSUED_URL_KEY } from './connectorIssued';

// P-AI-02, P-AI-06
export default function ConnectorGuidePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ client: string }>();
  const client = (params.client in CONNECTOR_CLIENTS ? params.client : 'claude') as ConnectorClient;
  const info: {
    name: string;
    shortcut?: string;
    steps: readonly { text: string; command?: string }[];
  } = CONNECTOR_CLIENTS[client];

  const { data } = useGet2();
  const reissue = useReissue();
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);
  const [confirmIssue, setConfirmIssue] = useState(false);

  const current = info.steps[step];
  const lastCalledAt = data?.clients?.find((item) => item.client === client)?.lastCalledAt;

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile/connector');
  };

  const issue = () => {
    setConfirmIssue(false);
    reissue.mutate(undefined, {
      onSuccess: ({ url }) => {
        // 주소에 비밀값이 있어 경로 값으로 넘기지 않는다.
        queryClient.setQueryData(ISSUED_URL_KEY, url);
        queryClient.invalidateQueries({ queryKey: getGet2QueryKey() });
        router.push('/profile/connector/issued');
      },
    });
  };

  const copyCommand = async () => {
    if (!current.command) return;
    await Clipboard.setStringAsync(current.command);
    setCopied(true);
  };

  const move = (next: number) => {
    setStep(next);
    setCopied(false);
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
            <Text style={styles.markLetter}>{info.name.slice(0, 1)}</Text>
          </View>
          <Text accessibilityRole="header" numberOfLines={1} style={styles.name}>
            {info.name}
          </Text>
          {info.shortcut && (
            <Button
              label="바로가기"
              variant="secondary"
              size="small"
              onPress={() => Linking.openURL(info.shortcut as string)}
              style={styles.shortcut}
            />
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.step}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberLabel}>{step + 1}</Text>
            </View>
            <Text style={styles.stepText}>{current.text}</Text>
          </View>

          {/* ponytail: 실제 캡처가 없어 시안의 자리표시를 그대로 둔다. 이미지가 나오면 교체한다. */}
          <View style={styles.capture}>
            {current.command ? (
              <Text selectable style={styles.command}>
                {current.command}
              </Text>
            ) : (
              <Text style={styles.captureLabel}>
                {`[${info.name} 화면 캡처 ${step + 1} / ${info.steps.length}]`}
              </Text>
            )}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="이전 단계"
              disabled={step === 0}
              onPress={() => move(step - 1)}
              style={[styles.arrow, styles.previous, step === 0 && styles.arrowDisabled]}>
              <Icon name="chevron-left-22" />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="다음 단계"
              disabled={step === info.steps.length - 1}
              onPress={() => move(step + 1)}
              style={[
                styles.arrow,
                styles.next,
                step === info.steps.length - 1 && styles.arrowDisabled,
              ]}>
              <Icon name="chevron-right-20" color={Palette.text} />
            </Pressable>
          </View>

          {current.command && (
            <Button
              label={copied ? '복사했어요' : '명령 복사'}
              variant="secondary"
              size="small"
              onPress={copyCommand}
              style={styles.wideButton}
            />
          )}

          <View style={styles.dots}>
            {info.steps.map((item, index) => (
              <View key={item.text} style={[styles.dot, index === step && styles.activeDot]} />
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <SectionLabel>내 개인 주소</SectionLabel>
          <Button
            label="새로 발급"
            variant="secondary"
            size="small"
            disabled={reissue.isPending}
            onPress={() => setConfirmIssue(true)}
            style={styles.wideButton}
          />
          {reissue.isError && (
            <Text style={styles.error}>발급하지 못했어요. 잠시 후 다시 시도해 주세요.</Text>
          )}
          <Text style={styles.addressNotice}>
            전체 주소는 발급 직후 한 번만 보여요. 잃어버렸다면 새로 발급하세요. 이전 주소는 바로
            동작하지 않아요.
          </Text>
        </View>

        {lastCalledAt && (
          <View style={styles.connected}>
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedLabel}>연결 확인됨</Text>
            </View>
            <Text style={styles.connectedText}>{lastUsedText(lastCalledAt)}</Text>
          </View>
        )}
      </ScrollView>

      {/* 시안에는 없지만 이전 주소가 바로 무효가 되어 한 번 확인한다. */}
      <BottomSheet
        visible={confirmIssue}
        onClose={() => setConfirmIssue(false)}
        title="새 주소를 발급할까요?"
        description="지금 쓰는 주소는 바로 동작하지 않아요. AI 설정에 새 주소를 다시 넣어야 해요.">
        <View style={styles.sheetActions}>
          <Button label="새로 발급" variant="danger" onPress={issue} />
          <Button label="취소" variant="text" onPress={() => setConfirmIssue(false)} />
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
  command: {
    ...Fonts.semiBold,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.text,
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
  error: {
    ...Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.red,
  },
  addressNotice: {
    ...Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  sheetActions: {
    gap: 12,
    marginTop: 8,
  },
  connected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: Palette.greenTint,
  },
  connectedBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: Palette.white,
  },
  connectedLabel: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.green,
  },
  connectedText: {
    ...Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
});
