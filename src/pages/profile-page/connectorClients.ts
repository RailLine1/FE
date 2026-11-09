// P-AI-01. 지원하는 AI 4개와 등록 가이드.
// 시안에는 Claude 2단계 문구만 있어 나머지 단계와 명령은 실제 화면을 확인한 뒤 다듬는다.
const ISSUE_STEP = { text: '아래 [새로 발급]으로 내 개인 주소를 받아 복사해요.' };

export const CONNECTOR_CLIENTS = {
  claude: {
    name: 'Claude',
    description: '웹 · 데스크톱 · 모바일 앱',
    shortcut: 'https://claude.ai',
    steps: [
      ISSUE_STEP,
      { text: "Claude 웹에서 설정 › 커넥터 › '커스텀 커넥터 추가'를 눌러요." },
      { text: '복사한 주소를 붙여 넣고 추가를 눌러요.' },
      { text: '새 대화에서 Daybit 커넥터를 켜고 과목 자료를 물어봐요.' },
    ],
  },
  chatgpt: {
    name: 'ChatGPT',
    description: '웹 · 데스크톱 · 모바일 앱',
    shortcut: 'https://chatgpt.com',
    steps: [
      ISSUE_STEP,
      { text: 'ChatGPT 웹에서 설정 › 커넥터로 들어가요.' },
      { text: '복사한 주소를 붙여 넣고 추가를 눌러요.' },
      { text: '새 대화에서 Daybit 커넥터를 켜고 과목 자료를 물어봐요.' },
    ],
  },
  claudecode: {
    name: 'Claude Code',
    description: '터미널',
    steps: [
      ISSUE_STEP,
      {
        text: '터미널에서 아래 명령을 실행해요.',
        command: 'claude mcp add --transport http daybit <내 개인 주소>',
      },
      { text: 'Claude Code에서 /mcp를 입력해 daybit 연결을 확인해요.' },
    ],
  },
  codex: {
    name: 'Codex',
    description: '터미널',
    steps: [
      ISSUE_STEP,
      {
        text: '터미널에서 아래 명령을 실행해요.',
        command: 'codex mcp add daybit --url <내 개인 주소>',
      },
      { text: 'Codex에서 /mcp를 입력해 daybit 연결을 확인해요.' },
    ],
  },
} as const satisfies Record<
  string,
  {
    name: string;
    description: string;
    shortcut?: string;
    steps: readonly { text: string; command?: string }[];
  }
>;

export type ConnectorClient = keyof typeof CONNECTOR_CLIENTS;
export const CONNECTOR_CLIENT_KEYS = Object.keys(CONNECTOR_CLIENTS) as ConnectorClient[];

type ClientStatus = { client?: ConnectorClient; lastCalledAt?: string | null };

// P-AI-04. 호출 기록이 있으면 등록된 것으로 본다.
export function connectedSummary(clients: ClientStatus[] = []) {
  const connected = clients.filter(({ client, lastCalledAt }) => client && lastCalledAt);
  const [first] = connected;
  if (!first?.client) return '미등록';
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
const STREAK_LEVELS = ['#e5e5e5', '#d4c0ff', '#b18cff', '#9e70ff', '#8952ff'];

// P-BIT-13. 그날 푼 Bit 수에 따라 0·1·2·3·4개 이상, 5단계로 진해진다.
export function streakColor(count = 0) {
  return STREAK_LEVELS[Math.min(count, STREAK_LEVELS.length - 1)];
}
