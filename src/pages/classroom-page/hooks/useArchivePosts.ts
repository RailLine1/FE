import { useSyncExternalStore } from 'react';

import { ArchivePage } from '../courseTypes';
import { dummyArchiveStore, getDummyArchive } from '../dummy/archive';

// import { useArchive } from '@/api/8-기록-메모/8-기록-메모';

export const ARCHIVE_PAGE_SIZE = 10;

// GET /courses/{courseId}/archive?page&size
export function useArchivePosts(courseId: number, page: number) {
  // API 연동 시 아래 return으로 교체
  // return useArchive<ArchivePage>(courseId, { page, size: ARCHIVE_PAGE_SIZE });

  const memos = useSyncExternalStore(
    dummyArchiveStore.subscribe,
    dummyArchiveStore.getMemos,
    dummyArchiveStore.getMemos,
  );
  const data: ArchivePage = getDummyArchive(memos, page, ARCHIVE_PAGE_SIZE);
  return { data, isLoading: false, isError: false };
}
