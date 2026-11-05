import { QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/createApiFetch';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 4xx는 다시 보내도 결과가 같으므로 서버·네트워크 오류만 재시도한다.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status < 500) && failureCount < 2,
    },
  },
});
