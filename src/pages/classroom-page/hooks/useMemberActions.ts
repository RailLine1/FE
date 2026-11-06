import { useQueryClient } from '@tanstack/react-query';

import { useChangeRole, useKick } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';
import { showErrorMeta } from '@/lib/errorToast';

// PATCH·DELETE /courses/{courseId}/members/{memberId}. memberId에는 목록의 userId를 넣는다.
export function useMemberActions(courseId: number) {
  const queryClient = useQueryClient();
  const options = {
    mutation: { meta: showErrorMeta, onSuccess: () => queryClient.invalidateQueries() },
  };
  const { mutate: change, isPending: isChanging } = useChangeRole(options);
  const { mutate: remove, isPending: isKicking } = useKick(options);

  return {
    changeRole: (userId: number, role: 'co' | 'member', onSuccess: () => void) =>
      change({ courseId, memberId: userId, data: { role } }, { onSuccess }),
    kick: (userId: number, onSuccess: () => void) =>
      remove({ courseId, memberId: userId }, { onSuccess }),
    isPending: isChanging || isKicking,
  };
}
