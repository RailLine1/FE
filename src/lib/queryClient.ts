import { MutationCache, QueryClient } from '@tanstack/react-query';

import { ApiError } from '@/lib/createApiFetch';
import { showErrorToast } from '@/lib/errorToast';

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.showError) showErrorToast(error);
    },
  }),
  defaultOptions: {
    queries: {
      // 30초 안에 다시 들어온 화면은 캐시를 그대로 쓴다. 그 뒤에는 캐시를 먼저 보여 주고 뒤에서 새로 받는다.
      staleTime: 30_000,
      // 4xx는 다시 보내도 결과가 같으므로 서버·네트워크 오류만 재시도한다.
      retry: (failureCount, error) =>
        !(error instanceof ApiError && error.status < 500) && failureCount < 2,
    },
  },
});
