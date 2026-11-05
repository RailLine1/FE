import {
  approveAllDummyRequests,
  approveDummyRequest,
  rejectDummyRequest,
} from '../dummy/members';

// import { useQueryClient } from '@tanstack/react-query';
// import { useApprove, useApproveAll, useReject } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';

// POST /courses/{courseId}/join-requests/{requestId}/approve·reject, /approve-all
export function useJoinRequestActions(courseId: number) {
  // API 연동 시 아래 return으로 교체
  // const queryClient = useQueryClient();
  // const options = { mutation: { onSuccess: () => queryClient.invalidateQueries() } };
  // const { mutate: approveOne, isPending: isApproving } = useApprove(options);
  // const { mutate: rejectOne, isPending: isRejecting } = useReject(options);
  // const { mutate: approveEvery, isPending: isApprovingAll } = useApproveAll(options);
  // return {
  //   approve: (requestId: number, onSuccess: () => void) =>
  //     approveOne({ courseId, requestId }, { onSuccess }),
  //   reject: (requestId: number, onSuccess: () => void) =>
  //     rejectOne({ courseId, requestId }, { onSuccess }),
  //   approveAll: (onSuccess: (count: number) => void) =>
  //     approveEvery({ courseId }, { onSuccess: ({ approved }) => onSuccess(approved ?? 0) }),
  //   isPending: isApproving || isRejecting || isApprovingAll,
  // };

  return {
    approve: (requestId: number, onSuccess: () => void) => {
      approveDummyRequest(courseId, requestId);
      onSuccess();
    },
    reject: (requestId: number, onSuccess: () => void) => {
      rejectDummyRequest(courseId, requestId);
      onSuccess();
    },
    approveAll: (onSuccess: (count: number) => void) => {
      onSuccess(approveAllDummyRequests(courseId));
    },
    isPending: false,
  };
}
