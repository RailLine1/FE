import type { ConnectorClient } from './courseTypes';

// 과목 자료를 커넥터로 찾아 답하게 하는 첫 질문
export const buildCoursePrompt = (courseName: string) =>
  `Daybit 커넥터로 '${courseName}' 과목 자료를 찾아보고, 내가 묻는 내용을 자료 근거(파일 이름과 페이지)와 함께 설명해 줘.`;

// 터미널 명령은 따옴표 안에 들어가므로 작은따옴표를 바꾼다.
const quote = (text: string) => `"${text.replaceAll('"', "'")}"`;

type ChatAction =
  | { kind: 'open'; url: string; copied: string }
  | { kind: 'copy'; text: string; copied: string };

// P-AI-05. 채팅 AI는 질문을 채워 열고, 터미널 도구는 명령을 복사한다.
export function getChatAction(client: ConnectorClient['client'], courseName: string): ChatAction {
  const prompt = buildCoursePrompt(courseName);
  const query = encodeURIComponent(prompt);

  switch (client) {
    case 'claude':
      return { kind: 'open', url: `https://claude.ai/new?q=${query}`, copied: prompt };
    case 'chatgpt':
      return { kind: 'open', url: `https://chatgpt.com/?q=${query}`, copied: prompt };
    case 'claudecode':
      return { kind: 'copy', text: `claude ${quote(prompt)}`, copied: prompt };
    case 'codex':
      return { kind: 'copy', text: `codex ${quote(prompt)}`, copied: prompt };
  }
}
