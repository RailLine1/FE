// P-AI-07~11. 내 AI 출제를 쓸 수 있는 AI. 예약 작업 가이드는 과목 환경설정 › 퀴즈 출처에서 연다.
// ChatGPT는 요금제에 따라 커스텀 커넥터 · 쓰기 도구가 막혀 있어 직접 검증하지 못했다. 화면에 그 안내(notice)를 같이 보여 준다.
export const MY_AI_NAMES = { claude: 'Claude', chatgpt: 'ChatGPT' } as const;
export type MyAi = keyof typeof MY_AI_NAMES;

export function isMyAi(value: unknown): value is MyAi {
  return typeof value === 'string' && Object.hasOwn(MY_AI_NAMES, value);
}

// 예약 작업 만들기 단계. copy: true인 단계에 예약 문장 복사 상자를 둔다. 메뉴 이름은 실제 앱 화면 기준이다.
// copyPrefix: 채팅으로 예약 작업을 만드는 AI는 예약 문장 앞에 만들어 달라는 문장을 붙인다.
type MyAiGuide = {
  shortcut: string;
  steps: readonly { text: string; copy?: boolean }[];
  copyPrefix?: string;
  notice?: string;
};

export const MY_AI_GUIDES: Partial<Record<MyAi, MyAiGuide>> = {
  claude: {
    shortcut: 'https://claude.ai/scheduled-task',
    steps: [
      {
        text: "[바로가기]로 Claude '예약된 작업'을 열고 '직접 설정'을 눌러요. 이미 작업이 있으면 오른쪽 위 '새 작업' › '직접 설정'이에요.",
      },
      { text: '이름은 Daybit 출제로 쓰고, 지침 칸에 아래 작업 내용을 붙여넣어요.', copy: true },
      {
        text: "'자동 승인'은 그대로 두고, 트리거는 '스케줄' · '매일', 시각은 원하는 때로 정한 뒤 '만들기'를 눌러요. 새 자료는 다음 실행 때 문제가 돼요.",
      },
      {
        text: "목록에서 만든 작업을 누르고 '지금 실행'을 눌러요. 실행이 들어오면 아래에 등록됨이 떠요. 내용은 작업 화면의 연필 버튼으로 고칠 수 있어요.",
      },
    ],
  },
  chatgpt: {
    shortcut: 'https://chatgpt.com',
    copyPrefix:
      '매일 오전 7시에 아래 작업을 실행하는 예약 작업을 만들어 줘. 실행할 때는 Daybit 앱만 써.\n\n',
    notice:
      'ChatGPT는 요금제에 따라 예약 작업에서 커넥터를 쓰지 못할 수 있어요. 안 되면 Gemini가 대신 만들어요.',
    steps: [
      { text: '[바로가기]로 ChatGPT 새 대화를 열어요. 연결한 Daybit는 따로 켜지 않아도 돼요.' },
      {
        text: '아래 작업 내용을 붙여넣고 보내요. ChatGPT가 매일 실행되는 예약 작업을 만들어요.',
        copy: true,
      },
      {
        text: "만들어진 작업은 ChatGPT의 '예약된 작업'에서 확인하고 고칠 수 있어요. 첫 실행이 들어오면 아래에 등록됨이 떠요.",
      },
    ],
  },
};

export const MY_AI_KEYS = Object.keys(MY_AI_GUIDES) as MyAi[];

export function scheduleCopy(ai: MyAi, prompt?: string) {
  if (!prompt) return '';
  return (MY_AI_GUIDES[ai]?.copyPrefix ?? '') + prompt;
}

// 매일 실행이라 하루 + 여유 2시간 동안 실행이 없으면 작업이 지워졌거나 멈춘 것으로 보고 알린다.
// 48시간이 지나면 서버가 출처를 Gemini로 되돌린다(P-BIT-15).
const LATE_AFTER_MS = 26 * 60 * 60 * 1000;

export function isRunLate(lastRunAt?: string | null, now = new Date()) {
  return (
    Boolean(lastRunAt) && now.getTime() - new Date(lastRunAt as string).getTime() > LATE_AFTER_MS
  );
}
