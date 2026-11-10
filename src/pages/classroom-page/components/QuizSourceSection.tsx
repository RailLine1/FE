import { useRouter } from 'expo-router';
import { Image, StyleSheet } from 'react-native';

import { useGet2 } from '@/api/10-커넥터/10-커넥터';
import { useGet1 } from '@/api/11-내-ai-출제/11-내-ai-출제';
import { Icon } from '@/components/Icon';
import { ListRow } from '@/components/ListRow';
import { CONNECTOR_LOGO_TINT, CONNECTOR_LOGOS } from '@/pages/profile-page/connectorLogos';
import { lastUsedText } from '@/pages/profile-page/connectorClients';
import { MY_AI_KEYS, MY_AI_NAMES, isRunLate } from '@/pages/profile-page/myAi';

import { MyAiName, QuizSource } from '../courseTypes';
import { GroupSection } from './GroupSection';

export const isSameQuizSource = (a: QuizSource, b: QuizSource) =>
  a.type === b.type && (a.type === 'default' || a.ai === b.ai);

type QuizSourceSectionProps = {
  courseId: number;
  value: QuizSource;
  onChange: (source: QuizSource) => void;
};

// P-AI-09, 10. Gemini Flash와 내 AI 출제 중에서 고른다.
// 내 AI는 커넥터 연결 → 예약 작업 등록 순서라, 아직 안 된 단계로 바로 보낸다.
export function QuizSourceSection({ courseId, value, onChange }: QuizSourceSectionProps) {
  const router = useRouter();
  const myAi = useGet1();
  const connector = useGet2();
  // 다른 관리자가 고른 AI도 지금 출처라면 보여준다.
  const ais: MyAiName[] =
    value.type === 'myai' && !MY_AI_KEYS.includes(value.ai)
      ? [...MY_AI_KEYS, value.ai]
      : MY_AI_KEYS;

  const rowFor = (ai: MyAiName) => {
    const option: QuizSource = { type: 'myai', ai };
    const selected = isSameQuizSource(option, value);
    const status = myAi.data?.ais?.find((item) => item.ai === ai);
    const registered = status?.registered;
    const connected = connector.data?.clients?.find((c) => c.client === ai)?.lastCalledAt;
    const openGuide = () =>
      router.push({
        pathname: '/classroom/[courseId]/myai/[ai]',
        params: { courseId: String(courseId), ai },
      });

    // 연결 → 등록이 끝난 AI만 바로 고르고, 아니면 남은 단계 화면으로 보낸다.
    const setup = !connected
      ? {
          subtitle: '커넥터를 먼저 연결해 주세요',
          open: () =>
            router.push({
              pathname: '/profile/connector/[client]',
              params: { client: ai },
            }),
        }
      : !registered
        ? { subtitle: '예약 작업 등록이 필요해요', open: openGuide }
        : null;
    const late = registered && isRunLate(status?.lastRunAt);
    const runText = status?.lastRunAt
      ? lastUsedText(status.lastRunAt, new Date(), '마지막 실행')
      : '예약 작업이 매일 문제를 만들어요';

    return (
      <ListRow
        key={ai}
        title={MY_AI_NAMES[ai]}
        subtitle={
          setup?.subtitle ?? (late ? '어제부터 실행이 없어요 · 예약 작업을 확인해 주세요' : runText)
        }
        subtitleTone={late ? 'danger' : undefined}
        leading={<Image source={CONNECTOR_LOGOS[ai]} style={[styles.logo, { tintColor: CONNECTOR_LOGO_TINT[ai] }]} />}
        trailing={selected ? <Icon name="check-purple-20" /> : undefined}
        chevron={selected || Boolean(setup)}
        onPress={setup?.open ?? (selected ? openGuide : () => onChange(option))}
      />
    );
  };

  const geminiSelected = value.type === 'default';
  return (
    <GroupSection title="퀴즈 출처">
      <ListRow
        title="Gemini Flash"
        subtitle="기본 · 무료"
        trailing={geminiSelected ? <Icon name="check-purple-20" /> : undefined}
        onPress={geminiSelected ? undefined : () => onChange({ type: 'default' })}
      />
      {ais.map(rowFor)}
      {/* AI로 대화처럼 커넥터가 없는 관리자도 여기서 바로 등록하러 간다. */}
      <ListRow
        title="＋ 커넥터 등록"
        titleTone="accent"
        onPress={() => router.push('/profile/connector')}
      />
    </GroupSection>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 22,
    height: 22,
  },
});
