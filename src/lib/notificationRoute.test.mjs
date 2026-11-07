import assert from 'node:assert/strict';
import { test } from 'node:test';

import { notificationRoute } from './notificationRoute.ts';

test('오늘의 한 조각 알림은 Bit 탭으로 간다', () => {
  assert.equal(notificationRoute({ type: 'bit_open', courseId: '3', bitId: '9' }), '/bit');
});

test('다른 알림은 과목으로 가고, 과목이 없으면 이동하지 않는다', () => {
  assert.equal(notificationRoute({ type: 'join_approved', courseId: '3' }), '/classroom/3');
  assert.equal(notificationRoute({ type: 'promoted_admin' }), null);
  assert.equal(notificationRoute(undefined), null);
});
