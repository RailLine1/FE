// 과목 아이콘(P-COURSE-01). 선 아이콘(Lucide, ISC)을 분야별 48개로. 모양은 원래 CourseIcon 그대로.
// 값(키)은 API의 icon으로 저장한다(20자 이하). 선택 창은 분야별로 묶어 보여 준다.
export const COURSE_ICON_GROUPS = [
  {
    label: '인문',
    keys: ['book-open', 'scroll-text', 'languages', 'pen-tool', 'landmark', 'quote'],
  },
  { label: '사회', keys: ['users', 'globe', 'map-pin', 'newspaper', 'vote', 'brain'] },
  {
    label: '경영 · 법',
    keys: ['briefcase', 'trending-up', 'scale', 'banknote', 'chart-pie', 'gavel'],
  },
  { label: '자연', keys: ['flask-conical', 'dna', 'atom', 'telescope', 'leaf', 'sigma'] },
  { label: '공학', keys: ['code', 'cpu', 'database', 'cog', 'hammer', 'layers'] },
  {
    label: '의약',
    keys: ['stethoscope', 'pill', 'heart-pulse', 'microscope', 'syringe', 'activity'],
  },
  { label: '예체능', keys: ['palette', 'music', 'clapperboard', 'camera', 'drama', 'dumbbell'] },
  {
    label: '기타',
    keys: ['graduation-cap', 'lightbulb', 'calculator', 'star', 'calendar', 'target'],
  },
] as const;

export type CourseIconKey = (typeof COURSE_ICON_GROUPS)[number]['keys'][number];
export const COURSE_ICON_KEYS: readonly CourseIconKey[] = COURSE_ICON_GROUPS.flatMap(
  ({ keys }) => keys,
);

// 예전 아이콘 값은 가장 가까운 선 아이콘으로 보여 준다.
const LEGACY: Record<string, CourseIconKey> = {
  book: 'book-open',
  globe: 'globe',
  database: 'database',
  tree: 'code',
  network: 'code',
  layers: 'layers',
  sigma: 'sigma',
  code: 'code',
  terminal: 'code',
  cpu: 'cpu',
  flask: 'flask-conical',
  calc: 'calculator',
  calculator: 'calculator',
  chart: 'trending-up',
  pen: 'pen-tool',
  compass: 'map-pin',
  bulb: 'lightbulb',
  lightbulb: 'lightbulb',
  music: 'music',
  cap: 'graduation-cap',
  graduation: 'graduation-cap',
  atom: 'atom',
};

export function toCourseIcon(icon: string): CourseIconKey {
  if ((COURSE_ICON_KEYS as readonly string[]).includes(icon)) return icon as CourseIconKey;
  return LEGACY[icon] ?? 'book-open';
}
