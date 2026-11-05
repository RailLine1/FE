// 실행: npm test. BE의 1회용 리프레시 토큰을 흉내 낸 로컬 서버로 확인한다.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { after, before, beforeEach, test } from 'node:test';

import { ApiError, createApiFetch } from './createApiFetch.ts';

let server;
let baseUrl;
let validAccess;
let validRefresh;
let refreshCalls;
let refreshFails;
let rotateToUnusable;
let slowDone;

const sendJson = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
};
const sendError = (res, status, code) => sendJson(res, status, { error: { code, message: code } });

before(async () => {
  server = createServer(async (req, res) => {
    let raw = '';
    for await (const chunk of req) raw += chunk;

    if (req.url === '/api/v1/auth/refresh') {
      refreshCalls += 1;
      if (refreshFails) return sendError(res, 500, 'INTERNAL_ERROR');
      if (JSON.parse(raw).refreshToken !== validRefresh) {
        return sendError(res, 401, 'INVALID_REFRESH_TOKEN');
      }
      const accessToken = `access-${refreshCalls + 1}`;
      validAccess = rotateToUnusable ? 'nothing-matches' : accessToken;
      validRefresh = `refresh-${refreshCalls + 1}`;
      return sendJson(res, 200, {
        user: { id: 1 },
        isFirstLogin: false,
        tokens: { accessToken, refreshToken: validRefresh, expiresIn: 1800 },
      });
    }
    if (req.url === '/api/v1/auth/login') return sendError(res, 401, 'INVALID_CREDENTIALS');
    if (req.url === '/api/v1/gateway') {
      res.writeHead(502, { 'Content-Type': 'text/html' });
      return res.end('<html>Bad Gateway</html>');
    }
    // 느린 요청은 응답 직전에 토큰을 검사해서, 그사이 토큰이 바뀐 상황을 만든다.
    if (req.url === '/api/v1/slow' && !slowDone) {
      slowDone = true;
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    if (req.headers.authorization !== `Bearer ${validAccess}`) {
      return sendError(res, 401, 'UNAUTHORIZED');
    }
    if (req.url === '/api/v1/empty') {
      res.writeHead(204);
      return res.end();
    }
    return sendJson(res, 200, { path: req.url, auth: req.headers.authorization });
  });
  await new Promise((resolve) => server.listen(0, resolve));
  baseUrl = `http://localhost:${server.address().port}/api/v1`;
});

after(() => server.close());

beforeEach(() => {
  validAccess = 'access-1';
  validRefresh = 'refresh-1';
  refreshCalls = 0;
  refreshFails = false;
  rotateToUnusable = false;
  slowDone = false;
});

function setup(initial) {
  let stored = initial;
  let expired = 0;
  const storage = {
    get: async () => stored,
    set: async (tokens) => {
      stored = tokens;
    },
    clear: async () => {
      stored = null;
    },
  };
  const apiFetch = createApiFetch({ baseUrl, storage, onSessionExpired: () => (expired += 1) });
  return { apiFetch, stored: () => stored, expired: () => expired };
}

const fresh = { accessToken: 'access-1', refreshToken: 'refresh-1' };
const stale = { accessToken: 'old', refreshToken: 'refresh-1' };

test('토큰을 붙이고 /api/v1이 겹치지 않게 보낸다', async () => {
  const { apiFetch } = setup(fresh);
  const body = await apiFetch('/api/v1/me');
  assert.equal(body.path, '/api/v1/me');
  assert.equal(body.auth, 'Bearer access-1');
});

test('401이면 갱신 후 원래 요청을 다시 보내고 새 토큰을 저장한다', async () => {
  const { apiFetch, stored } = setup(stale);
  const body = await apiFetch('/api/v1/me');
  assert.equal(body.auth, 'Bearer access-2');
  assert.equal(refreshCalls, 1);
  assert.deepEqual(
    { accessToken: stored().accessToken, refreshToken: stored().refreshToken },
    { accessToken: 'access-2', refreshToken: 'refresh-2' },
  );
});

test('동시에 401을 받아도 갱신은 한 번만 하고 모두 성공한다', async () => {
  const { apiFetch } = setup(stale);
  const bodies = await Promise.all(Array.from({ length: 5 }, () => apiFetch('/api/v1/me')));
  assert.equal(refreshCalls, 1);
  assert.ok(bodies.every((body) => body.auth === 'Bearer access-2'));
});

test('늦게 도착한 401은 다시 갱신하지 않고 이미 받은 토큰으로 재시도한다', async () => {
  // access-1로 보낸 느린 요청이 응답을 기다리는 동안 다른 요청이 토큰을 갱신한다.
  const { apiFetch } = setup(fresh);
  const slow = apiFetch('/api/v1/slow');
  await new Promise((resolve) => setTimeout(resolve, 20));
  validAccess = 'expired-on-server';
  const other = await apiFetch('/api/v1/me');
  assert.equal(other.auth, 'Bearer access-2');
  const slowBody = await slow;
  assert.equal(slowBody.auth, 'Bearer access-2');
  assert.equal(refreshCalls, 1);
});

test('리프레시 토큰이 무효면 토큰을 지우고 세션 만료를 알린다', async () => {
  const { apiFetch, stored, expired } = setup({ accessToken: 'old', refreshToken: 'used' });
  await assert.rejects(apiFetch('/api/v1/me'), (error) => {
    assert.ok(error instanceof ApiError);
    assert.equal(error.code, 'INVALID_REFRESH_TOKEN');
    return true;
  });
  assert.equal(stored(), null);
  assert.equal(expired(), 1);
});

test('갱신 중 서버 오류가 나면 로그인을 유지한다', async () => {
  refreshFails = true;
  const { apiFetch, stored, expired } = setup(stale);
  await assert.rejects(apiFetch('/api/v1/me'), { status: 500 });
  assert.deepEqual(stored(), stale);
  assert.equal(expired(), 0);
});

test('갱신이 실패한 뒤에는 다음 요청에서 다시 갱신할 수 있다', async () => {
  refreshFails = true;
  const { apiFetch } = setup(stale);
  await assert.rejects(apiFetch('/api/v1/me'), { status: 500 });
  refreshFails = false;
  const body = await apiFetch('/api/v1/me');
  assert.equal(body.auth, 'Bearer access-3');
});

test('로그인 실패 같은 다른 401에서는 갱신하지 않는다', async () => {
  const { apiFetch } = setup(fresh);
  await assert.rejects(apiFetch('/api/v1/auth/login', { method: 'POST' }), {
    code: 'INVALID_CREDENTIALS',
  });
  assert.equal(refreshCalls, 0);
});

test('토큰 없이 받은 401은 갱신하지 않는다', async () => {
  const { apiFetch, expired } = setup(null);
  await assert.rejects(apiFetch('/api/v1/me'), { code: 'UNAUTHORIZED' });
  assert.equal(refreshCalls, 0);
  assert.equal(expired(), 0);
});

test('갱신 후에도 401이면 반복하지 않고 실패한다', async () => {
  rotateToUnusable = true;
  const { apiFetch } = setup(stale);
  await assert.rejects(apiFetch('/api/v1/me'), { code: 'UNAUTHORIZED' });
  assert.equal(refreshCalls, 1);
});

test('본문 없는 응답과 JSON이 아닌 오류를 처리한다', async () => {
  const { apiFetch } = setup(fresh);
  assert.equal(await apiFetch('/api/v1/empty'), undefined);
  await assert.rejects(apiFetch('/api/v1/gateway'), { status: 502, code: 'UNKNOWN' });
});
