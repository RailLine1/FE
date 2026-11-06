import { useQueryClient } from '@tanstack/react-query';

import { useApprove, useApproveAll, useReject } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';
import { showErrorMeta } from '@/lib/errorToast';

// POST /courses/{courseId}/join-requests/{requestId}/approve·reject, /approve-all
export function useJoinRequestActions(courseId: number) {
  const queryClient = useQueryClient();
  const options = {
    mutation: { meta: showErrorMeta, onSuccess: () => queryClient.invalidateQueries() },
  };
  const { mutate: approveOne, isPending: isApproving } = useApprove(options);
  const { mutate: rejectOne, isPending: isRejecting } = useReject(options);
  const { mutate: approveEvery, isPending: isApprovingAll } = useApproveAll(options);

  return {
    approve: (requestId: number, onSuccess: () => void) =>
      approveOne({ courseId, requestId }, { onSuccess }),
    reject: (requestId: number, onSuccess: () => void) =>
      rejectOne({ courseId, requestId }, { onSuccess }),
    approveAll: (onSuccess: (count: number) => void) =>
      approveEvery({ courseId }, { onSuccess: ({ approved }) => onSuccess(approved ?? 0) }),
    isPending: isApproving || isRejecting || isApprovingAll,
  };
}
