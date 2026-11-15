// 부스 퀴즈 API. 로그인 없이 쓰므로 앱 공용 클라이언트(토큰을 붙임) 대신 fetch로 부른다.
const BASE = `${process.env.EXPO_PUBLIC_API_URL ?? ''}/booth`;

export type BoothQuestion = { stem: string; choices: string[] };
export type BoothStart = { playId: string; questions: BoothQuestion[] };
export type BoothAnswer = { answer: number; myChoice: number; correct: boolean; explanation: string };
export type BoothResult = {
  nickname: string;
  correct: number;
  total: number;
  elapsedMs: number;
  rank: number;
  players: number;
  answers: BoothAnswer[];
};
export type BoothRankRow = { rank: number; nickname: string; correct: number; elapsedMs: number };
export type BoothRanking = { total: number; players: number; rows: BoothRankRow[] };

export class BoothError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

async function call<T>(path: string, body?: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new BoothError('NETWORK', '서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.');
  }
  const data = await res.json().catch(() => undefined);
  if (!res.ok) {
    throw new BoothError(data?.error?.code ?? 'UNKNOWN', data?.error?.message ?? '잠시 후 다시 시도해 주세요.');
  }
  return data as T;
}

export const startBooth = (nickname: string) => call<BoothStart>('/plays', { nickname });
export const submitBooth = (playId: string, choices: number[]) =>
  call<BoothResult>(`/plays/${playId}/submit`, { choices });
export const fetchRanking = (limit = 100) => call<BoothRanking>(`/ranking?limit=${limit}`);

export const formatMs = (ms: number) => `${(ms / 1000).toFixed(1)}초`;
