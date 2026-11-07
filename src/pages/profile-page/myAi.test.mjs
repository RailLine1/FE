import assert from 'node:assert/strict';
import { test } from 'node:test';

import { lastUsedText } from './connectorClients.ts';
import { isMyAi, myAiSteps, myAiSummary } from './myAi.ts';

test('예약 실행이 들어온 AI만 등록된 것으로 요약한다', () => {
  assert.equal(myAiSummary(), '미등록');
  assert.equal(myAiSummary([{ ai: 'claude', registered: false }]), '미등록');
  assert.equal(myAiSummary([{ ai: 'chatgpt', registered: true }]), 'ChatGPT 등록됨');
  assert.equal(
    myAiSummary([
      { ai: 'claude', registered: true },
      { ai: 'chatgpt', registered: true },
    ]),
    'Claude 외 1개',
  );
});

test('경로 값은 claude와 chatgpt만 받는다', () => {
  assert.equal(isMyAi('claude'), true);
  assert.equal(isMyAi('codex'), false);
  assert.equal(isMyAi(undefined), false);
  assert.equal(isMyAi('toString'), false);
});

test('단계 문구에 AI 이름이 들어간다', () => {
  assert.match(myAiSteps('chatgpt')[1], /^ChatGPT 앱에서/);
});

test('마지막 실행 시각은 사용 시각과 같은 형식이다', () => {
  const now = new Date(2026, 10, 7, 18, 0);
  assert.equal(
    lastUsedText(new Date(2026, 10, 7, 17, 5).toISOString(), now, '마지막 실행'),
    '마지막 실행 오늘 17:05',
  );
});
