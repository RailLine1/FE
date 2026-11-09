import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Image, Linking, StyleSheet } from 'react-native';

import { IconBox } from '@/components/IconBox';
import { ListRow } from '@/components/ListRow';
import { CONNECTOR_LOGOS } from '@/pages/profile-page/connectorLogos';

import { getChatAction } from '../aiChat';
import { ConnectorClient } from '../courseTypes';
import { useMyConnector } from '../hooks/useMyConnector';
import { GroupSection } from './GroupSection';

const clientLabels: Record<ConnectorClient['client'], string> = {
  claude: 'Claude',
  chatgpt: 'ChatGPT',
};

type AiSectionProps = {
  courseName: string;
  onNotice: (message: string) => void;
};

export function AiSection({ courseName, onNotice }: AiSectionProps) {
  const router = useRouter();
  const { data } = useMyConnector();
  // 첫 호출이 들어온 AI만 등록된 것으로 본다(P-AI-04, 05).
  // 지원하는 AI는 Claude · ChatGPT 둘이다(P-AI-01). 예전에 등록한 터미널 도구는 보여 주지 않는다.
  const registered =
    data?.clients?.filter(({ client, lastCalledAt }) => lastCalledAt && client in clientLabels) ?? [];

  const startChat = (client: ConnectorClient['client']) => {
    const action = getChatAction(client, courseName);
    const title = clientLabels[client];
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
          title={clientLabels[client]}
          subtitle="앱 열고 질문하기"
          leading={
            <IconBox tone="soft">
              <Image source={CONNECTOR_LOGOS[client]} style={styles.logo} />
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

const styles = StyleSheet.create({
  logo: {
    width: 20,
    height: 20,
  },
});
