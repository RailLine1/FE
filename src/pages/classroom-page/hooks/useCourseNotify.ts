import { updateDummyNotify } from '../dummy/settings';

// import { useQueryClient } from '@tanstack/react-query';
// import { useSubscription } from '@/api/3-과목/3-과목';

// PATCH /courses/{courseId}/subscription. 저장 버튼 없이 바로 반영한다(P-NOTI-02).
export function useCourseNotify(courseId: number) {
  // API 연동 시 아래 return으로 교체
  // const queryClient = useQueryClient();
  // const { mutate } = useSubscription({
  //   mutation: { onSuccess: () => queryClient.invalidateQueries() },
  // });
  // return (notify: boolean) => mutate({ courseId, data: { notify } });

  return (notify: boolean) => updateDummyNotify(courseId, notify);
}
