import { useArchive } from '@/api/8-기록-메모/8-기록-메모';

import { ArchivePage } from '../courseTypes';

export const ARCHIVE_PAGE_SIZE = 10;

// GET /courses/{courseId}/archive?page&size
export function useArchivePosts(courseId: number, page: number) {
  return useArchive<ArchivePage>(courseId, { page, size: ARCHIVE_PAGE_SIZE });
}
