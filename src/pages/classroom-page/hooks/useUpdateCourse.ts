import { useQueryClient } from '@tanstack/react-query';

import { useUpdate1 } from '@/api/3-과목/3-과목';
import { showErrorMeta } from '@/lib/errorToast';

import { UpdateCourseInput } from '../courseTypes';

// PATCH /courses/{courseId}. 뺀 항목은 그대로 두고, null을 보낸 항목은 지운다.
export function useUpdateCourse(courseId: number) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useUpdate1({ mutation: { meta: showErrorMeta } });

  return {
    updateCourse: (data: UpdateCourseInput, onSuccess: () => void) =>
      mutate(
        { courseId, data },
        {
          onSuccess: () => {
            queryClient.invalidateQueries();
            onSuccess();
          },
        },
      ),
    isPending,
  };
}
