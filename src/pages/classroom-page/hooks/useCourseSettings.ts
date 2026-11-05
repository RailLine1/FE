import { useSyncExternalStore } from 'react';

import { CourseSettings } from '../courseTypes';
import { dummySettingsStore, getDummySettings } from '../dummy/settings';

// import { useSettings } from '@/api/3-과목/3-과목';

// GET /courses/{courseId}/settings
export function useCourseSettings(courseId: number) {
  // API 연동 시 아래 return으로 교체
  // return useSettings<CourseSettings>(courseId);

  const stored = useSyncExternalStore(
    dummySettingsStore.subscribe,
    dummySettingsStore.getStored,
    dummySettingsStore.getStored,
  );
  const data: CourseSettings | undefined = getDummySettings(stored, courseId);
  return { data, isLoading: false, isError: !data };
}
