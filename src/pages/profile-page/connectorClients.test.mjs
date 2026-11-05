import assert from 'node:assert/strict';
import { test } from 'node:test';

import { connectedSummary, lastUsedText, streakColor } from './connectorClients.ts';

test('호출 기록이 있는 AI만 연결된 것으로 요약한다', () => {
  assert.equal(connectedSummary(), '미등록');
  assert.equal(connectedSummary([{ client: 'claude', lastCalledAt: null }]), '미등록');
  assert.equal(
    connectedSummary([{ client: 'claude', lastCalledAt: '2026-11-06T09:12:00+09:00' }]),
    'Claude 연결됨',
  );
  assert.equal(
    connectedSummary([
      { client: 'claude', lastCalledAt: '2026-11-06T09:12:00+09:00' },
      { client: 'codex', lastCalledAt: '2026-11-06T09:12:00+09:00' },
    ]),
    'Claude 외 1개',
  );
});

test('마지막 사용 시각을 오늘, 어제, 날짜로 나눈다', () => {
  const now = new Date(2026, 10, 6, 15, 0);
  assert.equal(lastUsedText(new Date(2026, 10, 6, 9, 12).toISOString(), now), '마지막 사용 오늘 09:12');
  assert.equal(lastUsedText(new Date(2026, 10, 5, 23, 5).toISOString(), now), '마지막 사용 어제 23:05');
  assert.equal(lastUsedText(new Date(2026, 9, 30, 8, 0).toISOString(), now), '마지막 사용 10월 30일');
});

test('푼 수에 따라 격자 색이 5단계로 나뉜다', () => {
  const colors = [0, 1, 2, 3, 4].map(streakColor);
  assert.equal(new Set(colors).size, 5);
  assert.equal(streakColor(9), streakColor(4));
});
