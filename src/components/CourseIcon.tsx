import { Image } from 'react-native';

import { IconBox } from '@/components/IconBox';
import { Palette } from '@/styles/palette';

const sources: Record<string, number> = {
  atom: require('@/assets/icons/course/atom.png'),
  bulb: require('@/assets/icons/course/lightbulb.png'),
  calc: require('@/assets/icons/course/calculator.png'),
  cap: require('@/assets/icons/course/graduation.png'),
  tree: require('@/assets/icons/course/network.png'),
  book: require('@/assets/icons/course/book.png'),
  calculator: require('@/assets/icons/course/calculator.png'),
  chart: require('@/assets/icons/course/chart.png'),
  code: require('@/assets/icons/course/code.png'),
  compass: require('@/assets/icons/course/compass.png'),
  cpu: require('@/assets/icons/course/cpu.png'),
  database: require('@/assets/icons/course/database.png'),
  flask: require('@/assets/icons/course/flask.png'),
  globe: require('@/assets/icons/course/globe.png'),
  graduation: require('@/assets/icons/course/graduation.png'),
  layers: require('@/assets/icons/course/layers.png'),
  lightbulb: require('@/assets/icons/course/lightbulb.png'),
  music: require('@/assets/icons/course/music.png'),
  network: require('@/assets/icons/course/network.png'),
  pen: require('@/assets/icons/course/pen.png'),
  sigma: require('@/assets/icons/course/sigma.png'),
  terminal: require('@/assets/icons/course/terminal.png'),
};

// 아이콘 선택에 보여줄 18개. 값은 API의 icon으로 저장한다(P-COURSE-01).
export const courseIconNames = [
  'book',
  'cpu',
  'globe',
  'database',
  'tree',
  'layers',
  'sigma',
  'code',
  'terminal',
  'flask',
  'calc',
  'chart',
  'pen',
  'compass',
  'bulb',
  'music',
  'cap',
  'atom',
] as const;

export const getCourseIconSource = (icon: string) => sources[icon] ?? sources.book;

const glyphSizes = { 32: 18, 36: 20, 48: 26, 56: 28, 64: 30, 72: 34 };

const glyphColors = {
  main: Palette.white,
  soft: Palette.purpleStrong,
  muted: Palette.textSub,
  golden: Palette.goldenInk,
};

type CourseIconProps = {
  // API의 과목 icon 값. 모르는 값이면 책 아이콘을 보여준다.
  icon: string;
  size?: keyof typeof glyphSizes;
  tone?: keyof typeof glyphColors;
  raised?: boolean;
};

export function CourseIcon({ icon, size = 36, tone = 'main', raised }: CourseIconProps) {
  const glyph = glyphSizes[size];

  return (
    <IconBox size={size} tone={tone} raised={raised}>
      <Image
        source={getCourseIconSource(icon)}
        style={{ width: glyph, height: glyph, tintColor: glyphColors[tone] }}
      />
    </IconBox>
  );
}
