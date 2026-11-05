import { subscribeDummyCourse } from '../dummy/courses';
import { MyStatus } from '../types';

// import { useQueryClient } from '@tanstack/react-query';
// import { useSubscribe } from '@/api/4-탐색-구독/4-탐색-구독';

// POST /explore/courses/{code}/subscribe
export function useSubscribeCourse(code: string) {
  // API 연동 시 아래 return으로 교체. 성공하면 탐색 쿼리를 무효화하고, 409 COURSE_ENDED를 처리한다.
  // const queryClient = useQueryClient();
  // const { mutate, isPending } = useSubscribe();
  // return {
  //   subscribe: (onSuccess: (status: MyStatus) => void) =>
  //     mutate(
  //       { code },
  //       {
  //         onSuccess: ({ result }) => {
  //           queryClient.invalidateQueries();
  //           onSuccess(result as MyStatus);
  //         },
  //       },
  //     ),
  //   isPending,
  // };

  return {
    subscribe: (onSuccess: (status: MyStatus) => void) => onSuccess(subscribeDummyCourse(code)),
    isPending: false,
  };
}
