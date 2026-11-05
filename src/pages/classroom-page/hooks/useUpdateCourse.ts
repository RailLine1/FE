import { UpdateCourseInput } from '../courseTypes';
import { updateDummySettings } from '../dummy/settings';

// import { useQueryClient } from '@tanstack/react-query';
// import { useUpdate1 } from '@/api/3-과목/3-과목';

// PATCH /courses/{courseId}
export function useUpdateCourse(courseId: number) {
  // API 연동 시 아래 return으로 교체
  // const queryClient = useQueryClient();
  // const { mutate, isPending } = useUpdate1();
  // return {
  //   updateCourse: (data: UpdateCourseInput, onSuccess: () => void) =>
  //     mutate(
  //       { courseId, data },
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
    updateCourse: (data: UpdateCourseInput, onSuccess: () => void) => {
      updateDummySettings(courseId, data);
      onSuccess();
    },
    isPending: false,
  };
}
