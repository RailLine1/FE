import { useRouter } from 'expo-router';

import { Icon } from '@/components/Icon';
import { ListRow } from '@/components/ListRow';

import { MyAiName, QuizSource } from '../courseTypes';
import { useMyAiSources } from '../hooks/useMyAiSources';
import { GroupSection } from './GroupSection';

const aiNames: Record<MyAiName, string> = {
  claude: 'Claude',
  chatgpt: 'ChatGPT',
};

export const isSameQuizSource = (a: QuizSource, b: QuizSource) =>
  a.type === b.type && (a.type === 'default' || a.ai === b.ai);

type QuizSourceSectionProps = {
  value: QuizSource;
  onChange: (source: QuizSource) => void;
};

// P-AI-09, 10. Gemini Flash와 내가 등록한 출제 AI 중에서 고른다.
export function QuizSourceSection({ value, onChange }: QuizSourceSectionProps) {
  const router = useRouter();
  const myAis = useMyAiSources();
  // 다른 관리자가 고른 AI도 지금 출처라면 보여준다.
  const current = value.type === 'myai' && !myAis.includes(value.ai) ? [value.ai] : [];
  const options: QuizSource[] = [
    { type: 'default' },
    ...[...myAis, ...current].map((ai) => ({ type: 'myai' as const, ai })),
  ];

  return (
    <GroupSection title="퀴즈 출처">
      {options.map((option) => {
        const selected = isSameQuizSource(option, value);
        return (
          <ListRow
            key={option.type === 'myai' ? option.ai : 'default'}
            title={option.type === 'myai' ? aiNames[option.ai] : 'Gemini Flash'}
            subtitle={option.type === 'myai' ? '내 AI 출제 · 예약 실행' : '기본 · 무료'}
            trailing={selected ? <Icon name="check-purple-20" /> : undefined}
            onPress={selected ? undefined : () => onChange(option)}
          />
        );
      })}
      <ListRow
        title="＋ 출제 AI 등록"
        titleTone="accent"
        onPress={() => router.push('/profile/myai')}
      />
    </GroupSection>
  );
}
