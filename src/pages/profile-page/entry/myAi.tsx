import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useGet1 } from '@/api/11-내-ai-출제/11-내-ai-출제';
import { AppBar } from '@/components/AppBar';
import { Badge } from '@/components/Badge';
import { Icon } from '@/components/Icon';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CONNECTOR_CLIENTS, lastUsedText } from '../connectorClients';
import { MY_AI_KEYS } from '../myAi';

// P-AI-08, P-AI-10
export default function MyAiPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useGet1();

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  };

  return (
    <Screen>
      <AppBar
        title="출제 AI 등록"
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: back }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.description}>
          AI 앱에 예약 문장을 넣어 두면, 새 자료가 올라올 때 AI가 직접 문제를 만들어 보내요.
        </Text>
        <QueryStatus isLoading={isLoading} isError={isError} />

        {MY_AI_KEYS.map((ai) => {
          const item = data?.ais?.find((status) => status.ai === ai);
          return (
            <Pressable
              key={ai}
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/profile/myai/[ai]', params: { ai } })}
              style={styles.row}>
              <View style={styles.mark}>
                <Text style={styles.markLetter}>{CONNECTOR_CLIENTS[ai].name.slice(0, 1)}</Text>
              </View>
              <View style={styles.rowText}>
                <Text style={styles.name}>{CONNECTOR_CLIENTS[ai].name}</Text>
                <Text style={styles.status}>
                  {item?.registered && item.lastRunAt
                    ? lastUsedText(item.lastRunAt, new Date(), '마지막 실행')
                    : '아직 등록하지 않았어요'}
                </Text>
              </View>
              {item?.registered ? (
                <View>
                  <Badge label="등록됨" variant="success" />
                </View>
              ) : (
                <Icon name="chevron-right-20" />
              )}
            </Pressable>
          );
        })}

        <Text style={styles.description}>
          {'등록된 AI는 과목 환경설정의 퀴즈 출처에서 고를 수 있어요.\n48시간 동안 실행이 없으면 Gemini로 돌아가요.'}
        </Text>
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
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  description: {
    ...Fonts.regular,
    marginBottom: 4,
    fontSize: 14,
    lineHeight: 21.7,
    color: Palette.textSub,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 76,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.line,
    boxShadow: `0 3px 0 ${Palette.line}`,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
    boxShadow: `0 3px 0 ${Palette.line}`,
  },
  markLetter: {
    ...Fonts.black,
    fontSize: 18,
    lineHeight: 27,
    color: Palette.text,
  },
  rowText: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...Fonts.bold,
    fontSize: 16,
    lineHeight: 24,
    color: Palette.text,
  },
  status: {
    ...Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
});
