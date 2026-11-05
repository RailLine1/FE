import { defineConfig, defineTransformer } from 'orval';

// ponytail: 배포 서버 스펙은 firstLogin이지만 실제 응답은 isFirstLogin이다. BE #38이 배포되면 지운다.
const useResponseFieldName = defineTransformer((spec) => {
  for (const name of ['AuthResponse', 'GithubAuthResponse']) {
    const properties = (spec.components?.schemas?.[name] as { properties?: Record<string, unknown> })
      ?.properties;
    if (properties?.firstLogin) {
      properties.isFirstLogin = properties.firstLogin;
      delete properties.firstLogin;
    }
  }
  return spec;
});

export default defineConfig({
  daybit: {
    input: {
      // 로컬 BE를 쓸 때: ORVAL_INPUT=http://localhost:8080/v3/api-docs npm run api:generate
      target: process.env.ORVAL_INPUT ?? 'https://daybit-api.up.railway.app/v3/api-docs',
      // BE가 변경 예정이라 연동하지 말라고 안내한 API라서 생성하지 않는다.
      filters: {
        mode: 'exclude',
        tags: ['11. AI 작업 공간'],
      },
      override: {
        transformer: useResponseFieldName,
      },
    },
    output: {
      mode: 'tags-split',
      target: 'src/api/endpoints.ts',
      schemas: 'src/api/model',
      client: 'react-query',
      httpClient: 'fetch',
      clean: true,
      override: {
        mutator: {
          path: './src/lib/apiClient.ts',
          name: 'apiFetch',
        },
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
  },
});
