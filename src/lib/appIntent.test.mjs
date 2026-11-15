import assert from 'node:assert/strict';
import { test } from 'node:test';

import { androidIntentUrl } from './appIntent.ts';

test('AI 앱 주소는 앱과 웹 대체 주소를 담은 intent 주소가 된다', () => {
  assert.equal(
    androidIntentUrl('https://claude.ai/new?q=%EA%B0%80'),
    'intent://claude.ai/new?q=%EA%B0%80#Intent;scheme=https;package=com.anthropic.claude;S.browser_fallback_url=https%3A%2F%2Fclaude.ai%2Fnew%3Fq%3D%25EA%25B0%2580;end',
  );
  assert.equal(
    androidIntentUrl('https://chatgpt.com'),
    'intent://chatgpt.com#Intent;scheme=https;package=com.openai.chatgpt;S.browser_fallback_url=https%3A%2F%2Fchatgpt.com;end',
  );
});

test('다른 주소는 바꾸지 않는다', () => {
  assert.equal(androidIntentUrl('https://example.com/a'), null);
  assert.equal(androidIntentUrl('daybit://github'), null);
});
