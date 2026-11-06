import { useQueryClient } from '@tanstack/react-query';

import { useSubscription } from '@/api/3-과목/3-과목';
import { showErrorMeta } from '@/lib/errorToast';

// PATCH /courses/{courseId}/subscription. 저장 버튼 없이 바로 반영한다(P-NOTI-02).
export function useCourseNotify(courseId: number) {
  const queryClient = useQueryClient();
  const { mutate } = useSubscription({
    mutation: { meta: showErrorMeta, onSuccess: () => queryClient.invalidateQueries() },
  });

  return (notify: boolean) => mutate({ courseId, data: { notify } });
}
