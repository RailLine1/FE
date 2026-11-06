import { useQueryClient } from '@tanstack/react-query';

import { useLeave } from '@/api/3-과목/3-과목';
import { showErrorMeta } from '@/lib/errorToast';

// POST /courses/{courseId}/leave
export function useLeaveCourse(courseId: number) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useLeave({ mutation: { meta: showErrorMeta } });

  return {
    leave: (onSuccess: () => void) =>
      mutate(
        { courseId },
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
