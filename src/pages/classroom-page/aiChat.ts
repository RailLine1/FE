import type { ConnectorClient } from './courseTypes';

// 과목 자료를 커넥터로 찾아 답하게 하는 첫 질문
export const buildCoursePrompt = (courseName: string) =>
  `Daybit 커넥터로 '${courseName}' 과목 자료를 찾아보고, 내가 묻는 내용을 자료 근거(파일 이름과 페이지)와 함께 설명해 줘.`;

type ChatAction = { url: string; copied: string };

// P-AI-05. 질문을 채워 AI 앱을 연다.
export function getChatAction(client: ConnectorClient['client'], courseName: string): ChatAction {
  const prompt = buildCoursePrompt(courseName);
  const query = encodeURIComponent(prompt);

  switch (client) {
    case 'claude':
      return { url: `https://claude.ai/new?q=${query}`, copied: prompt };
    case 'chatgpt':
      return { url: `https://chatgpt.com/?q=${query}`, copied: prompt };
  }
}
