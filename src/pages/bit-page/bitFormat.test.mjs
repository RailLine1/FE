import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  circledNumber,
  compareToAverage,
  evidenceText,
  formatSeconds,
  gridOpacity,
} from './bitFormat.ts';

test('초를 분:초로 바꾼다', () => {
  assert.equal(formatSeconds(0), '0:00');
  assert.equal(formatSeconds(38), '0:38');
  assert.equal(formatSeconds(80), '1:20');
  assert.equal(formatSeconds(), '0:00');
});

test('보기 번호를 원문자로 바꾼다', () => {
  assert.equal(circledNumber(1), '②');
  assert.equal(circledNumber(3), '④');
});

test('평균과 비교한다', () => {
  assert.equal(compareToAverage(38, 80), '평균보다 42초 빨라요');
  assert.equal(compareToAverage(90, 80), '평균보다 10초 느려요');
  assert.equal(compareToAverage(80, 80), '평균과 같아요');
});

test('근거 자료 문구를 만든다', () => {
  assert.equal(evidenceText({ file: 'lec07', page: 12 }), 'lec07 p.12');
  assert.equal(evidenceText({ file: 'lec07' }), 'lec07');
  assert.equal(evidenceText(), '');
});

test('푼 수에 따라 격자 진하기가 5단계로 나뉜다', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 9].map(gridOpacity), [0, 0.4, 0.6, 0.8, 1, 1]);
});
