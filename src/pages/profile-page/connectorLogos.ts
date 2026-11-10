import type { ImageSourcePropType } from 'react-native';

import type { ConnectorClient } from './connectorClients';

// 각 AI 앱의 실제 아이콘. connectorClients.ts는 노드 테스트가 읽어서 이미지 require를 여기 따로 둔다.
export const CONNECTOR_LOGOS: Record<ConnectorClient, ImageSourcePropType> = {
  claude: require('@/assets/icons/claude-24.png'),
  chatgpt: require('@/assets/icons/chatgpt-24.png'),
};

// 어두운 테마에서 검은 로고(ChatGPT)는 글자색으로 칠해 보이게 한다.
export const CONNECTOR_LOGO_TINT: Partial<Record<ConnectorClient, string>> = { chatgpt: '#f7f7f8' };
