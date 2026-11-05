import { subscribeDummyCourse } from '../dummy/courses';
import { MyStatus } from '../types';

// import { usePostExploreCourseSubscribe } from '@/api/explore';

// POST /explore/courses/{code}/subscribe
export function useSubscribeCourse(code: string) {
  // API 연동 시 아래 return으로 교체. 성공하면 탐색 쿼리를 무효화하고, 409 COURSE_ENDED를 처리한다.
  // const { mutate, isPending } = usePostExploreCourseSubscribe();
  // return {
  //   subscribe: (onSuccess: (status: MyStatus) => void) =>
  //     mutate({ code }, { onSuccess: ({ myStatus }) => onSuccess(myStatus) }),
  //   isPending,
  // };

  return {
    subscribe: (onSuccess: (status: MyStatus) => void) => onSuccess(subscribeDummyCourse(code)),
    isPending: false,
  };
}
