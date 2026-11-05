export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export type TokenStorage = {
  get: () => Promise<Tokens | null>;
  set: (tokens: Tokens) => Promise<void>;
  clear: () => Promise<void>;
};

type ApiFetchOptions = {
  baseUrl: string;
  storage: TokenStorage;
  onSessionExpired: () => void;
};

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

// BE 오류 형식: { "error": { "code", "message" } }
async function toApiError(response: Response) {
  const body = await response.json().catch(() => null);
  return new ApiError(
    response.status,
    body?.error?.code ?? 'UNKNOWN',
    body?.error?.message ?? `요청에 실패했어요 (${response.status})`,
  );
}

export function createApiFetch({ baseUrl, storage, onSessionExpired }: ApiFetchOptions) {
  let refreshing: Promise<string> | null = null;

  async function runRefresh() {
    const tokens = await storage.get();
    const response = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens?.refreshToken }),
    });

    if (!response.ok) {
      const error = await toApiError(response);
      // 서버 장애나 네트워크 오류에서는 로그인을 유지하고, 토큰이 무효일 때만 로그아웃한다.
      if (error.code === 'INVALID_REFRESH_TOKEN') {
        await storage.clear();
        onSessionExpired();
      }
      throw error;
    }

    const { tokens: next } = await response.json();
    await storage.set(next);
    return next.accessToken as string;
  }

  // 리프레시 토큰은 1회용이라 동시에 401을 받아도 갱신 요청은 하나만 보낸다.
  function refresh() {
    refreshing ??= runRefresh().finally(() => {
      refreshing = null;
    });
    return refreshing;
  }

  function send(url: string, options: RequestInit, accessToken?: string) {
    const headers = new Headers(options.headers);
    if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
    // Orval 경로에 포함된 /api/v1이 EXPO_PUBLIC_API_URL과 겹치지 않게 뺀다.
    return fetch(`${baseUrl}${url.replace(/^\/api\/v1/, '')}`, { ...options, headers });
  }

  return async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
    const tokens = await storage.get();
    let response = await send(url, options, tokens?.accessToken);

    if (response.status === 401 && tokens) {
      const error = await toApiError(response.clone());
      if (error.code === 'UNAUTHORIZED') {
        // 이 요청이 도는 사이 다른 요청이 이미 갱신했다면 그 토큰으로 다시 보낸다.
        const current = await storage.get();
        const accessToken =
          current && current.accessToken !== tokens.accessToken
            ? current.accessToken
            : await refresh();
        response = await send(url, options, accessToken);
      }
    }

    if (!response.ok) throw await toApiError(response);

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  };
}
