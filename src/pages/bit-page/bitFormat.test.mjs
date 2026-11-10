import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  circledNumber,
  compareToAverage,
  evidenceText,
  formatSeconds,
  gridOpacity,
  shareMessage,
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
  assert.equal(compareToAverage(90, 80), '오늘도 해냈어요');
  assert.equal(compareToAverage(80, 80), '오늘도 해냈어요');
});

test('근거 자료 문구를 만든다', () => {
  assert.equal(evidenceText({ file: 'lec07', page: 12 }), 'lec07 p.12');
  assert.equal(evidenceText({ file: 'lec07' }), 'lec07');
  assert.equal(evidenceText(), '');
});

test('푼 수에 따라 격자 진하기가 5단계로 나뉜다', () => {
  assert.deepEqual([0, 1, 2, 3, 4, 9].map(gridOpacity), [0, 0.4, 0.6, 0.8, 1, 1]);
});

test('공유 문구에 개념 · 결과 · 이번 주 · 링크가 들어간다', () => {
  const text = shareMessage(
    {
      courseName: '알고리즘',
      no: 1,
      concept: '탐욕 알고리즘',
      correct: true,
      elapsedSec: 11,
      streak: 2,
      week: [1, 1, 0, 0, 0, 0, 0],
    },
    'https://daybit-app.vercel.app/s/ABC123',
  );
  assert.match(text, /^오늘의 한 조각 · 알고리즘 #1/);
  assert.match(text, /「탐욕 알고리즘」 0:11 만에 정답/);
  assert.match(text, /이번 주 ●●○○○○○ {2}연속 2일째/);
  assert.ok(text.endsWith('https://daybit-app.vercel.app/s/ABC123'));
  assert.doesNotMatch(shareMessage({ correct: false, elapsedSec: 30 }, 'x'), /「/);
});
