import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';

import { Icon } from '@/components/Icon';
import { IconBox } from '@/components/IconBox';
import { ListRow } from '@/components/ListRow';
import { Palette } from '@/styles/palette';

import { getChatAction } from '../aiChat';
import { ConnectorClient } from '../courseTypes';
import { useMyConnector } from '../hooks/useMyConnector';
import { GroupSection } from './GroupSection';

const clientLabels: Record<ConnectorClient['client'], { title: string; subtitle: string }> = {
  claude: { title: 'Claude', subtitle: '앱 열고 질문하기' },
  chatgpt: { title: 'ChatGPT', subtitle: '앱 열고 질문하기' },
  claudecode: { title: 'Claude Code', subtitle: '명령 복사하기' },
  codex: { title: 'Codex', subtitle: '명령 복사하기' },
};

type AiSectionProps = {
  courseName: string;
  onNotice: (message: string) => void;
};

export function AiSection({ courseName, onNotice }: AiSectionProps) {
  const router = useRouter();
  const { data } = useMyConnector();
  // 첫 호출이 들어온 AI만 등록된 것으로 본다(P-AI-04, 05).
  const registered = data?.clients?.filter(({ lastCalledAt }) => lastCalledAt) ?? [];

  const startChat = (client: ConnectorClient['client']) => {
    const action = getChatAction(client, courseName);
    const { title } = clientLabels[client];

    if (action.kind === 'copy') {
      Clipboard.setStringAsync(action.text);
      onNotice(`터미널에 붙여 넣을 ${title} 명령을 복사했어요`);
      return;
    }
    // 앱에서 질문이 채워지지 않을 때를 대비해 질문도 복사해 둔다(검증 필요).
    Clipboard.setStringAsync(action.copied);
    Linking.openURL(action.url);
    onNotice(`${title}를 열어요. 질문도 복사해 뒀어요`);
  };

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
          onPress={() => startChat(client)}
        />
      ))}
      <ListRow
        title="＋ 커넥터 등록"
        titleTone="accent"
        onPress={() => router.push('/profile/connector')}
      />
    </GroupSection>
  );
}
