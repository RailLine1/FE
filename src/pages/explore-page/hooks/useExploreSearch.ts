import { useSearch } from '@/api/4-탐색-구독/4-탐색-구독';

import { ExploreCourse } from '../courseTypes';
import { useDebouncedValue } from './useDebouncedValue';

// GET /explore/search?q=
export function useExploreSearch(query: string) {
  const debouncedQuery = useDebouncedValue(query);
  return useSearch<ExploreCourse[]>(
    { q: debouncedQuery },
    { query: { enabled: debouncedQuery.length > 0 } },
  );
}
