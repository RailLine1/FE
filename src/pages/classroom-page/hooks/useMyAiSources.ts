import { useGet1 } from '@/api/11-내-ai-출제/11-내-ai-출제';

import { MyAiStatus } from '../courseTypes';

// GET /me/myai. 퀴즈 출처로 고를 수 있는 내 AI만 돌려준다(P-AI-10).
export function useMyAiSources() {
  const { data } = useGet1<{ ais: MyAiStatus[] }>();
  return data?.ais.filter(({ registered }) => registered).map(({ ai }) => ai) ?? [];
}
