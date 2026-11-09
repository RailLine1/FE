import assert from 'node:assert/strict';
import { test } from 'node:test';

import { lastUsedText } from './connectorClients.ts';
import { MY_AI_GUIDES, MY_AI_KEYS, isMyAi, isRunLate, scheduleCopy } from './myAi.ts';

test('경로 값은 claude와 chatgpt만 받는다', () => {
  assert.equal(isMyAi('claude'), true);
  assert.equal(isMyAi('codex'), false);
  assert.equal(isMyAi(undefined), false);
  assert.equal(isMyAi('toString'), false);
});

test('가이드마다 예약 문장 복사 단계가 하나 있다', () => {
  assert.deepEqual(MY_AI_KEYS, ['claude', 'chatgpt']);
  for (const ai of MY_AI_KEYS) {
    assert.equal(MY_AI_GUIDES[ai].steps.filter((step) => step.copy).length, 1);
  }
});

test('Claude는 지침 본문 그대로, ChatGPT는 만들어 달라는 문장을 붙여 복사한다', () => {
  assert.equal(scheduleCopy('claude', '본문'), '본문');
  assert.ok(scheduleCopy('chatgpt', '본문').startsWith('매일 오전 7시에'));
  assert.ok(scheduleCopy('chatgpt', '본문').endsWith('본문'));
  assert.equal(scheduleCopy('chatgpt'), '');
});

test('마지막 실행 시각은 사용 시각과 같은 형식이다', () => {
  const now = new Date(2026, 10, 7, 18, 0);
  assert.equal(
    lastUsedText(new Date(2026, 10, 7, 17, 5).toISOString(), now, '마지막 실행'),
    '마지막 실행 오늘 17:05',
  );
});

test('26시간 넘게 예약 실행이 없으면 늦었다고 본다', () => {
  const now = new Date(2026, 10, 9, 12, 0);
  assert.equal(isRunLate(new Date(2026, 10, 8, 12, 0).toISOString(), now), false);
  assert.equal(isRunLate(new Date(2026, 10, 8, 9, 0).toISOString(), now), true);
  assert.equal(isRunLate(null, now), false);
});
