// API 명세 3. 탐색 · 구독 기준
export type MyStatus = 'subscribed' | 'pending' | 'none';

export type ExploreSort = 'subscribers' | 'newest';

export type ExploreCourse = {
  code: string;
  name: string;
  icon: string;
  admin: string;
  ended: boolean;
  myStatus: MyStatus;
};

export type ExploreCourseDetail = ExploreCourse & {
  term: string | null;
  visibility: 'public' | 'private';
  intro: string | null;
};

export type ExploreCoursePage = {
  items: ExploreCourse[];
  total: number;
  page: number;
  size: number;
};
