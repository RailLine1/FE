import { useQueryClient } from '@tanstack/react-query';

import { useCreate } from '@/api/3-과목/3-과목';
import { showErrorMeta } from '@/lib/errorToast';

import { CreatedCourse, CreateCourseInput } from '../courseTypes';

// POST /courses. 퀴즈 출처를 빼면 서버가 기본값(default)으로 넣는다.
export function useCreateCourse() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreate({ mutation: { meta: showErrorMeta } });

  return {
    createCourse: (input: CreateCourseInput, onSuccess: (course: CreatedCourse) => void) =>
      mutate(
        { data: input },
        {
          onSuccess: (course) => {
            queryClient.invalidateQueries();
            onSuccess(course as CreatedCourse);
          },
        },
      ),
    isPending,
  };
}
