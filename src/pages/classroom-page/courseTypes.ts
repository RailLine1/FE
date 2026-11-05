// API 명세 2. 과목 GET /courses/mine 기준
export type MineState = 'active' | 'ended';

export type CourseTile = {
  courseId: number;
  name: string;
  icon: string;
  intro: string | null;
};
