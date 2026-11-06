import assert from 'node:assert/strict';
import { test } from 'node:test';

import { buildCoursePrompt, getChatAction } from './aiChat.ts';

test('채팅 AI는 질문을 채운 주소를 연다', () => {
  const action = getChatAction('claude', '운영체제');
  assert.equal(action.kind, 'open');
  assert.equal(
    action.url,
    `https://claude.ai/new?q=${encodeURIComponent(buildCoursePrompt('운영체제'))}`,
  );
  assert.ok(getChatAction('chatgpt', '운영체제').url.startsWith('https://chatgpt.com/?q='));
});

test('터미널 도구는 과목 질문을 담은 명령을 복사한다', () => {
  const action = getChatAction('claudecode', '운영체제');
  assert.equal(action.kind, 'copy');
  assert.equal(action.text, `claude "${buildCoursePrompt('운영체제')}"`);
  assert.ok(getChatAction('codex', '운영체제').text.startsWith('codex "'));
});

test('과목명의 큰따옴표가 명령을 깨지 않는다', () => {
  const { text } = getChatAction('codex', '자료 "구조"');
  assert.equal(text.match(/"/g).length, 2);
});
