import { Icon } from '@/components/Icon';
import { IconBox } from '@/components/IconBox';
import { ListRow } from '@/components/ListRow';
import { Palette } from '@/styles/palette';

import { ConnectorClient } from '../courseTypes';
import { useMyConnector } from '../hooks/useMyConnector';
import { GroupSection } from './GroupSection';

const clientLabels: Record<ConnectorClient['client'], { title: string; subtitle: string }> = {
  claude: { title: 'Claude', subtitle: '앱 열고 질문하기' },
  chatgpt: { title: 'ChatGPT', subtitle: '앱 열고 질문하기' },
  claudecode: { title: 'Claude Code', subtitle: '명령 복사하기' },
  codex: { title: 'Codex', subtitle: '명령 복사하기' },
};

export function AiSection() {
  const { data } = useMyConnector();
  // 첫 호출이 들어온 AI만 등록된 것으로 본다(P-AI-04, 05).
  const registered = data?.clients?.filter(({ lastCalledAt }) => lastCalledAt) ?? [];

  return (
    <GroupSection title="AI로 대화">
      {registered.map(({ client }) => (
        <ListRow
          key={client}
          title={clientLabels[client].title}
          subtitle={clientLabels[client].subtitle}
          leading={
            <IconBox tone="soft">
              <Icon name="sparkle-20" color={Palette.purpleStrong} />
            </IconBox>
          }
          chevron
        />
      ))}
      <ListRow title="＋ 커넥터 등록" titleTone="accent" />
    </GroupSection>
  );
}
