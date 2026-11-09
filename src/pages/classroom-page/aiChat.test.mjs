import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildCoursePrompt, getChatAction } from './aiChat.ts';

test('채팅 AI는 질문을 채운 주소를 연다', () => {
  const action = getChatAction('claude', '운영체제');
  assert.equal(
    action.url,
    `https://claude.ai/new?q=${encodeURIComponent(buildCoursePrompt('운영체제'))}`,
  );
  assert.ok(getChatAction('chatgpt', '운영체제').url.startsWith('https://chatgpt.com/?q='));
});
