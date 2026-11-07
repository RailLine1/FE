// P-AI-07~11. 내 AI 출제를 쓸 수 있는 AI. BE가 주는 순서(Claude, ChatGPT)와 같다.
export const MY_AI_NAMES = { claude: 'Claude', chatgpt: 'ChatGPT' } as const;
export type MyAi = keyof typeof MY_AI_NAMES;
export const MY_AI_KEYS = Object.keys(MY_AI_NAMES) as MyAi[];

type MyAiStatus = { ai?: MyAi; registered?: boolean };

export function isMyAi(value: unknown): value is MyAi {
  return typeof value === 'string' && Object.hasOwn(MY_AI_NAMES, value);
}

export function myAiSteps(ai: MyAi) {
  const name = MY_AI_NAMES[ai];
  return [
    `먼저 ${name}에 Daybit 커넥터를 등록해요.`,
    `${name} 앱에서 예약 작업을 만들고 아래 예약 문장을 붙여 넣은 뒤, 한 번 직접 실행해요.`,
  ];
}

// 내 정보 메뉴에 보이는 요약. 예약 실행이 한 번이라도 들어온 AI만 등록된 것으로 본다.
export function myAiSummary(ais: MyAiStatus[] = []) {
  const registered = ais.filter(({ ai, registered }) => ai && registered);
  const [first] = registered;
  if (!first?.ai) return '미등록';
  const name = MY_AI_NAMES[first.ai];
  return registered.length > 1 ? `${name} 외 ${registered.length - 1}개` : `${name} 등록됨`;
}
