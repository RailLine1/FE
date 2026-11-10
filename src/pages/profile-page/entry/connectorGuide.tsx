import { useQueryClient } from '@tanstack/react-query';
import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getGet2QueryKey, useGet2, useReissue } from '@/api/10-커넥터/10-커넥터';
import { AppBar } from '@/components/AppBar';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { CopyBox, GuideStep as Step } from '@/components/GuideStep';
import { Mascot } from '@/components/Mascot';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import {
  CONNECTOR_CLIENTS,
  ConnectorClient,
  GuideStep,
  copyText,
  lastUsedText,
} from '../connectorClients';
import { CONNECTOR_LOGO_TINT, CONNECTOR_LOGOS } from '../connectorLogos';

// P-AI-02, P-AI-04, P-AI-06. 단계를 한 화면에 모두 보여 주고, 복사할 주소 · 명령은 그 단계 안에 둔다.
export default function ConnectorGuidePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ client: string }>();
  const client = (params.client in CONNECTOR_CLIENTS ? params.client : 'claude') as ConnectorClient;
  const info: {
    name: string;
    description: string;
    shortcut?: string;
    steps: readonly GuideStep[];
  } = CONNECTOR_CLIENTS[client];

  const { data } = useGet2();
  const reissue = useReissue();
  // 전체 주소는 비밀값이라 저장하지 않고 이 화면에 있는 동안만 들고 있는다(P-AI-02).
  const [issuedUrl, setIssuedUrl] = useState<string>();
  // 처음 열면 서버가 주소를 만들어 전체 주소를 한 번 내려준다(fullUrlShown).
  const url = issuedUrl ?? (data?.fullUrlShown ? data.url : undefined);
  const [copied, setCopied] = useState<number>();
  const [confirmIssue, setConfirmIssue] = useState(false);

  const lastCalledAt = data?.clients?.find((item) => item.client === client)?.lastCalledAt;

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile/connector');
  };

  const issue = () => {
    setConfirmIssue(false);
    reissue.mutate(undefined, {
      onSuccess: ({ url: issued }) => {
        setIssuedUrl(issued);
        setCopied(undefined);
        queryClient.invalidateQueries({ queryKey: getGet2QueryKey() });
      },
    });
  };

  const copy = async (index: number, text: string) => {
    await Clipboard.setStringAsync(text);
    setCopied(index);
  };

  return (
    <Screen>
      <AppBar borderless leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: back }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.mark}>
            <Image source={CONNECTOR_LOGOS[client]} style={[styles.logo, { tintColor: CONNECTOR_LOGO_TINT[client] }]} />
          </View>
          <View style={styles.headerText}>
            <Text accessibilityRole="header" numberOfLines={1} style={styles.name}>
              {info.name}
            </Text>
            <Text style={styles.description}>{info.description}</Text>
          </View>
          {info.shortcut && (
            <Button
              label="바로가기"
              variant="secondary"
              size="small"
              onPress={() => Linking.openURL(info.shortcut as string)}
            />
          )}
        </View>

        <View style={styles.byte}>
          <Mascot pose="byte" says="아래 순서대로 주소를 복사해 AI에 붙여 넣으면 끝이에요. 막히면 바로가기를 눌러 봐요!" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>연결 방법</Text>

          <Step
            number={1}
            text={
              url
                ? '내 개인 주소가 준비됐어요. 전체 주소는 지금 한 번만 보여요.'
                : '내 개인 주소는 처음 한 번만 보여요. 잃어버렸다면 새로 발급하세요. 이전 주소는 바로 동작하지 않아요.'
            }>
            {url ? (
              <Text style={styles.issued}>아래 단계에서 복사해 쓰세요.</Text>
            ) : (
              <Button
                label="새로 발급"
                variant="secondary"
                size="small"
                disabled={reissue.isPending}
                onPress={() => setConfirmIssue(true)}
                style={styles.issueButton}
              />
            )}
            {reissue.isError && (
              <Text style={styles.error}>발급하지 못했어요. 잠시 후 다시 시도해 주세요.</Text>
            )}
          </Step>

          {info.steps.map((step, index) => (
            <Step key={step.text} number={index + 2} text={step.text}>
              {step.copy && (
                <CopyBox
                  value={copyText(step.copy, url)}
                  placeholder={!url}
                  copied={copied === index}
                  onCopy={() => copy(index, copyText(step.copy as string, url))}
                />
              )}
            </Step>
          ))}
        </View>

        {lastCalledAt ? (
          <View style={styles.connected}>
            <View style={styles.connectedBadge}>
              <Text style={styles.connectedLabel}>연결 확인됨</Text>
            </View>
            <Text style={styles.connectedText}>{lastUsedText(lastCalledAt)}</Text>
          </View>
        ) : (
          <View style={styles.byteBottom}>
            <Mascot pose="kilo" size={32} says="AI가 Daybit 자료를 처음 읽으면 여기서 알려 줄게요." />
          </View>
        )}
      </ScrollView>

      {/* 이전 주소가 바로 무효가 되어 한 번 확인한다. */}
      <BottomSheet
        visible={confirmIssue}
        onClose={() => setConfirmIssue(false)}
        title="새 주소를 발급할까요?"
        description="지금 쓰는 주소는 바로 동작하지 않아요. 등록한 AI에 새 주소를 다시 넣어야 해요.">
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
    backgroundColor: Palette.surface,
  },
  logo: {
    width: 26,
    height: 26,
  },
  headerText: {
    flex: 1,
  },
  name: {
    ...Fonts.black,
    fontSize: 22,
    lineHeight: 33,
    color: Palette.text,
  },
  description: {
    ...Fonts.regular,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  card: {
    gap: 16,
    padding: 16,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: Palette.line,
  },
  cardTitle: {
    ...Fonts.bold,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  issueButton: {
    alignSelf: 'flex-start',
  },
  issued: {
    ...Fonts.semiBold,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.green,
  },
  error: {
    ...Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.red,
  },
  byte: {
    marginBottom: 16,
  },
  byteBottom: {
    marginTop: 16,
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
    backgroundColor: Palette.surface,
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
