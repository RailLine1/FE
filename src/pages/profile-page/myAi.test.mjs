import assert from 'node:assert/strict';
import { test } from 'node:test';

import { lastUsedText } from './connectorClients.ts';
import { MY_AI_GUIDES, MY_AI_KEYS, isMyAi, isRunLate } from './myAi.ts';

test('경로 값은 claude와 chatgpt만 받는다', () => {
  assert.equal(isMyAi('claude'), true);
  assert.equal(isMyAi('codex'), false);
  assert.equal(isMyAi(undefined), false);
  assert.equal(isMyAi('toString'), false);
});

test('예약 작업 가이드는 Claude만, 예약 문장 복사 단계가 하나 있다', () => {
  assert.deepEqual(MY_AI_KEYS, ['claude']);
  assert.equal(MY_AI_GUIDES.claude.steps.filter((step) => step.copy).length, 1);
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
