import { changeDummyRole, kickDummyMember } from '../dummy/members';

// import { useQueryClient } from '@tanstack/react-query';
// import { useChangeRole, useKick } from '@/api/5-멤버-가입-요청/5-멤버-가입-요청';

// PATCH·DELETE /courses/{courseId}/members/{userId}
export function useMemberActions(courseId: number) {
  // API 연동 시 아래 return으로 교체
  // const queryClient = useQueryClient();
  // const options = { mutation: { onSuccess: () => queryClient.invalidateQueries() } };
  // const { mutate: change, isPending: isChanging } = useChangeRole(options);
  // const { mutate: remove, isPending: isKicking } = useKick(options);
  // return {
  //   changeRole: (userId: number, role: 'co' | 'member', onSuccess: () => void) =>
  //     change({ courseId, memberId: userId, data: { role } }, { onSuccess }),
  //   kick: (userId: number, onSuccess: () => void) =>
  //     remove({ courseId, memberId: userId }, { onSuccess }),
  //   isPending: isChanging || isKicking,
  // };

  return {
    changeRole: (userId: number, role: 'co' | 'member', onSuccess: () => void) => {
      changeDummyRole(courseId, userId, role);
      onSuccess();
    },
    kick: (userId: number, onSuccess: () => void) => {
      kickDummyMember(courseId, userId);
      onSuccess();
    },
    isPending: false,
  };
}
