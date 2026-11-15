// 모바일 크롬은 새 탭으로 여는 링크를 설치된 앱에 넘기지 않는다.
// 안드로이드 intent 주소로 열면 앱이 있을 때 앱으로, 없으면 원래 웹 주소로 간다.
const AI_APPS: Record<string, string> = {
  'claude.ai': 'com.anthropic.claude',
  'chatgpt.com': 'com.openai.chatgpt',
};

/** AI 앱으로 넘길 수 있는 주소면 intent 주소를, 아니면 null을 준다. */
export function androidIntentUrl(url: string): string | null {
  const match = /^https:\/\/([^/?#]+)(.*)$/.exec(url);
  if (!match) return null;
  const [, host, rest] = match;
  const appPackage = AI_APPS[host];
  if (!appPackage) return null;
  const fallback = encodeURIComponent(url);
  return `intent://${host}${rest}#Intent;scheme=https;package=${appPackage};S.browser_fallback_url=${fallback};end`;
}
