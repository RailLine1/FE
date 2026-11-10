import * as Clipboard from 'expo-clipboard';
import * as Linking from 'expo-linking';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGet2 } from '@/api/10-커넥터/10-커넥터';
import { useGet1 } from '@/api/11-내-ai-출제/11-내-ai-출제';
import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { CopyBox, GuideStep } from '@/components/GuideStep';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { lastUsedText } from '@/pages/profile-page/connectorClients';
import { CONNECTOR_LOGO_TINT, CONNECTOR_LOGOS } from '@/pages/profile-page/connectorLogos';
import {
  MY_AI_GUIDES,
  MY_AI_NAMES,
  isMyAi,
  isRunLate,
  scheduleCopy,
} from '@/pages/profile-page/myAi';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

// P-AI-08, P-AI-11. 과목 환경설정 › 퀴즈 출처에서 여는 예약 작업 가이드. 커넥터 연결이 먼저다.
export default function MyAiGuidePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId: string; ai: string }>();
  const ai = isMyAi(params.ai) && MY_AI_GUIDES[params.ai] ? params.ai : 'claude';
  const name = MY_AI_NAMES[ai];
  const guide = MY_AI_GUIDES[ai];
  const steps = guide?.steps ?? [];

  const myAi = useGet1();
  const connector = useGet2();
  const [copied, setCopied] = useState(false);

  const item = myAi.data?.ais?.find((status) => status.ai === ai);
  const late = isRunLate(item?.lastRunAt);
  const copyValue = scheduleCopy(ai, item?.schedulePrompt);
  const connected = Boolean(connector.data?.clients?.find((c) => c.client === ai)?.lastCalledAt);

  const back = () => {
    if (router.canGoBack()) router.back();
    else
      router.replace({
        pathname: '/classroom/[courseId]/settings',
        params: { courseId: params.courseId },
      });
  };

  const copyPrompt = async () => {
    if (!copyValue) return;
    await Clipboard.setStringAsync(copyValue);
    setCopied(true);
  };

  return (
    <Screen>
      <AppBar borderless leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: back }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.mark}>
            <Image source={CONNECTOR_LOGOS[ai]} style={[styles.logo, { tintColor: CONNECTOR_LOGO_TINT[ai] }]} />
          </View>
          <View style={styles.headerText}>
            <Text accessibilityRole="header" style={styles.name}>
              {`${name}로 문제 만들기`}
            </Text>
            <Text style={styles.description}>
              {`${name} 예약 작업이 매일 새 자료로 문제를 만들어 보내요.`}
            </Text>
          </View>
          {guide && (
            <Button
              label="바로가기"
              variant="secondary"
              size="small"
              onPress={() => Linking.openURL(guide.shortcut)}
            />
          )}
        </View>

        <QueryStatus
          isLoading={myAi.isLoading || connector.isLoading}
          isError={myAi.isError || connector.isError}
        />

        {connector.data && !connected && (
          <View style={styles.card}>
            <Text style={styles.stepText}>{`먼저 ${name}에 Daybit 커넥터를 연결해 주세요.`}</Text>
            <Button
              label="커넥터 연결"
              variant="secondary"
              size="small"
              onPress={() =>
                router.push({
                  pathname: '/profile/connector/[client]',
                  params: { client: ai },
                })
              }
              style={styles.inlineButton}
            />
          </View>
        )}

        {connected && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>예약 작업 만들기</Text>
            {guide?.notice && <Text style={styles.notice}>{guide.notice}</Text>}
            {steps.map((step, index) => (
              <GuideStep key={step.text} number={index + 1} text={step.text}>
                {step.copy && (
                  <CopyBox
                    value={copyValue}
                    placeholder={!copyValue}
                    copied={copied}
                    onCopy={copyPrompt}
                  />
                )}
              </GuideStep>
            ))}
          </View>
        )}

        {connected &&
          (item?.registered ? (
            <View style={[styles.registered, late && styles.late]}>
              <View style={styles.registeredRow}>
                <View style={styles.registeredBadge}>
                  <Text style={[styles.registeredLabel, late && styles.lateLabel]}>
                    {late ? '실행이 끊겼어요' : '등록됨'}
                  </Text>
                </View>
                {item.lastRunAt && (
                  <Text style={styles.registeredText}>
                    {lastUsedText(item.lastRunAt, new Date(), '마지막 실행')}
                  </Text>
                )}
              </View>
              <Text style={styles.registeredText}>
                {late
                  ? `${name} '예약된 작업'에 작업이 있는지 확인해 주세요. 지웠다면 위 단계대로 다시 만들면 돼요. 48시간 동안 실행이 없으면 Gemini로 돌아가요.`
                  : `퀴즈 출처에서 ${name}를 고르면 이 과목에 적용돼요.`}
              </Text>
              <Button label="퀴즈 출처로 돌아가기" onPress={back} />
            </View>
          ) : (
            <Text style={styles.notice}>
              첫 예약 실행이 들어오면 등록됨으로 바뀌어요. 48시간 동안 실행이 없으면 Gemini로
              돌아가요.
            </Text>
          ))}
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
    fontSize: 20,
    lineHeight: 30,
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
  stepText: {
    ...Fonts.regular,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.text,
  },
  inlineButton: {
    alignSelf: 'flex-start',
  },
  notice: {
    ...Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
    paddingHorizontal: 4,
  },
  registered: {
    gap: 10,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Palette.greenTint,
  },
  registeredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  registeredBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: Palette.surface,
  },
  registeredLabel: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.green,
  },
  late: {
    backgroundColor: Palette.redTint,
  },
  lateLabel: {
    color: Palette.red,
  },
  registeredText: {
    ...Fonts.semiBold,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
});
