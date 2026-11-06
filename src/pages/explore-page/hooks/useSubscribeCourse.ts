import { useQueryClient } from '@tanstack/react-query';

import { useSubscribe } from '@/api/4-탐색-구독/4-탐색-구독';
import { showErrorMeta } from '@/lib/errorToast';

import { MyStatus } from '../courseTypes';

// POST /explore/courses/{code}/subscribe
export function useSubscribeCourse(code: string) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useSubscribe({
    mutation: {
      meta: showErrorMeta,
      // 409 COURSE_ENDED면 다시 조회해 구독 불가 상태를 보여준다.
      onSettled: () => queryClient.invalidateQueries(),
    },
  });

  return {
    subscribe: (onSuccess: (status: MyStatus) => void) =>
      mutate({ code }, { onSuccess: ({ result }) => onSuccess(result as MyStatus) }),
    isPending,
  };
}
