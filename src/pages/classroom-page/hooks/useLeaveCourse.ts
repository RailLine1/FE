import { removeDummyCourse } from '../dummy/courses';

// import { useQueryClient } from '@tanstack/react-query';
// import { useLeave } from '@/api/3-과목/3-과목';

// POST /courses/{courseId}/leave
export function useLeaveCourse(courseId: number) {
  // API 연동 시 아래 return으로 교체
  // const queryClient = useQueryClient();
  // const { mutate, isPending } = useLeave();
  // return {
  //   leave: (onSuccess: () => void) =>
  //     mutate(
  //       { courseId },
  //       {
  //         onSuccess: () => {
  //           queryClient.invalidateQueries();
  //           onSuccess();
  //         },
  //       },
  //     ),
  //   isPending,
  // };

  return {
    leave: (onSuccess: () => void) => {
      removeDummyCourse(courseId);
      onSuccess();
    },
    isPending: false,
  };
}
