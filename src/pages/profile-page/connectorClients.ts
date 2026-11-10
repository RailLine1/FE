// P-AI-01, P-AI-06. 지원하는 AI(Claude, ChatGPT)와 등록 단계. 메뉴 이름은 각 앱의 실제 화면 기준이다.
// copy: 'url'이면 내 주소, 그 밖의 문자열은 {url}을 내 주소로 바꾼 명령을 단계 안에 복사 상자로 보여 준다.
export type GuideStep = { text: string; copy?: string };

export const ADDRESS_PLACEHOLDER = '<내 개인 주소>';

export const CONNECTOR_CLIENTS = {
  claude: {
    name: 'Claude',
    description: '웹 · 데스크톱 · 모바일 앱',
    shortcut: 'https://claude.ai/customize/connectors',
    steps: [
      {
        text: "[바로가기]로 Claude 커넥터 화면을 열어요. 왼쪽 사이드바의 '사용자 지정' › '커넥터'와 같은 화면이에요.",
      },
      { text: "오른쪽 위 '추가' › '커스텀 커넥터 추가'를 눌러요." },
      {
        text: "이름은 Daybit, 서버 URL은 아래 주소를 붙여넣어요. 인증은 '로그인 없음'을 고르고, 나머지는 그대로 두고 '추가'를 눌러요.",
        copy: 'url',
      },
      { text: "Daybit 화면에서 '연결'을 눌러요." },
      {
        text: "Daybit 커넥터의 도구 권한에서 읽기 전용 도구를 '항상 허용'으로 바꿔요. 자료를 읽을 때마다 묻지 않아요.",
      },
      { text: '새 대화에서 과목 자료를 물어보면 연결이 확인돼요.' },
    ],
  },
  chatgpt: {
    name: 'ChatGPT',
    description: '웹 · 데스크톱 · 모바일 앱',
    shortcut: 'https://chatgpt.com/plugins',
    steps: [
      { text: "[바로가기]로 ChatGPT '플러그인'을 열고 '+'를 눌러요." },
      {
        text: "이름은 Daybit, 연결은 '서버 URL'에 아래 주소를 붙여넣어요. 인증은 'OAuth 또는 인증 없음' 그대로 둬요.",
        copy: 'url',
      },
      {
        text: "위험 안내의 '이해했으며 계속 진행하겠습니다'를 체크하고 '플러그인으로 생성'을 눌러요.",
      },
      {
        text: '새 대화에서 과목 자료를 물어보면 ChatGPT가 Daybit를 알아서 써요. 그때 연결이 확인돼요.',
      },
    ],
  },
} as const satisfies Record<
  string,
  { name: string; description: string; shortcut?: string; steps: readonly GuideStep[] }
>;

// 복사 상자에 보여 줄 값. 주소가 없으면(발급 전 · 화면을 나갔다 온 뒤) 자리표시를 넣는다.
export function copyText(copy: string, url?: string) {
  const address = url ?? ADDRESS_PLACEHOLDER;
  return copy === 'url' ? address : copy.replace('{url}', address);
}

export type ConnectorClient = keyof typeof CONNECTOR_CLIENTS;
export const CONNECTOR_CLIENT_KEYS = Object.keys(CONNECTOR_CLIENTS) as ConnectorClient[];

type ClientStatus = { client?: string; lastCalledAt?: string | null };

export const isConnectorClient = (client?: string): client is ConnectorClient =>
  Boolean(client && client in CONNECTOR_CLIENTS);

// P-AI-04. 호출 기록이 있으면 등록된 것으로 본다.
export function connectedSummary(clients: ClientStatus[] = []) {
  const connected = clients.filter(
    ({ client, lastCalledAt }) => isConnectorClient(client) && lastCalledAt,
  );
  const [first] = connected;
  if (!first || !isConnectorClient(first.client)) return '미등록';
  const name = CONNECTOR_CLIENTS[first.client].name;
  return connected.length > 1 ? `${name} 외 ${connected.length - 1}개` : `${name} 연결됨`;
}

export function lastUsedText(iso: string, now = new Date(), label = '마지막 사용') {
  const date = new Date(iso);
  const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  const startOfDay = (value: Date) =>
    new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (days === 0) return `${label} 오늘 ${time}`;
  if (days === 1) return `${label} 어제 ${time}`;
  return `${label} ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 1단계를 반투명으로 두면 빈 칸(회색)보다 연해 보여서 불투명한 연보라로 둔다
// 어두운 테마 시안: 빈 칸은 surfaceMuted, 진할수록 밝은 보라. 노드 테스트가 읽는 파일이라 Palette를 가져오지 않는다.
const STREAK_LEVELS = ['#232132', '#4a3a8a', '#6a52c8', '#8b6cf6', '#b9a5ff'];

// P-BIT-13. 그날 푼 Bit 수에 따라 0·1·2·3·4개 이상, 5단계로 진해진다.
export function streakColor(count = 0) {
  return STREAK_LEVELS[Math.min(count, STREAK_LEVELS.length - 1)];
}
