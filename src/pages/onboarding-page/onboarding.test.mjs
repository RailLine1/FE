import assert from 'node:assert/strict';
import { test } from 'node:test';

import { githubErrorMessage, toFormErrors, validateLogin, validateSignup } from './authForm.ts';
import { greetingFor, newMaterialsText } from './welcomeContent.ts';

const valid = {
  loginId: 'daybit01',
  password: 'password1',
  passwordConfirm: 'password1',
  nickname: '데이빗',
};

test('올바른 가입 입력은 오류가 없다', () => {
  assert.deepEqual(validateSignup(valid), {});
});

test('가입 입력 규칙을 칸별로 검사한다', () => {
  const errors = validateSignup({
    loginId: 'Abc',
    password: 'short',
    passwordConfirm: 'other',
    nickname: 'a',
  });
  assert.deepEqual(Object.keys(errors).sort(), [
    'loginId',
    'nickname',
    'password',
    'passwordConfirm',
  ]);
});

test('로그인은 빈 칸만 검사한다', () => {
  assert.deepEqual(validateLogin({ loginId: 'A', password: 'b' }), {});
  assert.deepEqual(Object.keys(validateLogin({ loginId: '', password: '' })), [
    'loginId',
    'password',
  ]);
});

test('서버 오류를 해당 입력 칸에 연결한다', () => {
  const error = (code, message) => ({ code, message });
  assert.deepEqual(toFormErrors(error('NICKNAME_TAKEN', '중복')), { nickname: '중복' });
  assert.deepEqual(toFormErrors(error('INVALID_CREDENTIALS', '불일치')), { password: '불일치' });
  assert.deepEqual(toFormErrors(error('VALIDATION_FAILED', 'nickname: 닉네임은: 2자')), {
    nickname: '닉네임은: 2자',
  });
  assert.deepEqual(toFormErrors(error('VALIDATION_FAILED', '기본 문구')), { form: '기본 문구' });
  assert.deepEqual(toFormErrors(error('VALIDATION_FAILED', 'other: 내용')), {
    form: 'other: 내용',
  });
  assert.deepEqual(toFormErrors(error('INTERNAL_ERROR', '오류')), { form: '오류' });
});

test('코드 없는 오류는 연결 실패로 보여준다', () => {
  assert.match(toFormErrors(new TypeError('Failed to fetch')).form, /연결하지 못했어요/);
});

test('알 수 없는 GitHub 오류 코드는 고정 문구로 바꾼다', () => {
  assert.equal(githubErrorMessage('<script>'), 'GitHub 로그인에 실패했어요. 다시 시도해 주세요.');
});

test('시간대별 인사를 고른다', () => {
  assert.equal(greetingFor(4), '좋은 저녁이에요');
  assert.equal(greetingFor(5), '좋은 아침이에요');
  assert.equal(greetingFor(12), '좋은 오후예요');
  assert.equal(greetingFor(18), '좋은 저녁이에요');
});

test('새 자료를 한 줄로 요약한다', () => {
  assert.equal(newMaterialsText([]), null);
  assert.equal(newMaterialsText(), null);
  assert.equal(newMaterialsText([{ courseName: '운영체제', count: 2 }]), '운영체제에 새 자료 2개');
  assert.equal(
    newMaterialsText([
      { courseName: '운영체제', count: 2 },
      { courseName: '자료구조', count: 1 },
    ]),
    '운영체제 외 1과목에 새 자료 3개',
  );
});
