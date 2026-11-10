import { Image } from 'react-native';

import { COURSE_ICON_KEYS, CourseIconKey, toCourseIcon } from '@/components/courseIcons';
import { IconBox } from '@/components/IconBox';
import { Palette } from '@/styles/palette';

const sources: Record<CourseIconKey, number> = {
  activity: require('@/assets/line/activity.png'),
  atom: require('@/assets/line/atom.png'),
  banknote: require('@/assets/line/banknote.png'),
  'book-open': require('@/assets/line/book-open.png'),
  brain: require('@/assets/line/brain.png'),
  briefcase: require('@/assets/line/briefcase.png'),
  calculator: require('@/assets/line/calculator.png'),
  calendar: require('@/assets/line/calendar.png'),
  camera: require('@/assets/line/camera.png'),
  'chart-pie': require('@/assets/line/chart-pie.png'),
  clapperboard: require('@/assets/line/clapperboard.png'),
  code: require('@/assets/line/code.png'),
  cog: require('@/assets/line/cog.png'),
  cpu: require('@/assets/line/cpu.png'),
  database: require('@/assets/line/database.png'),
  dna: require('@/assets/line/dna.png'),
  drama: require('@/assets/line/drama.png'),
  dumbbell: require('@/assets/line/dumbbell.png'),
  'flask-conical': require('@/assets/line/flask-conical.png'),
  gavel: require('@/assets/line/gavel.png'),
  globe: require('@/assets/line/globe.png'),
  'graduation-cap': require('@/assets/line/graduation-cap.png'),
  hammer: require('@/assets/line/hammer.png'),
  'heart-pulse': require('@/assets/line/heart-pulse.png'),
  landmark: require('@/assets/line/landmark.png'),
  languages: require('@/assets/line/languages.png'),
  layers: require('@/assets/line/layers.png'),
  leaf: require('@/assets/line/leaf.png'),
  lightbulb: require('@/assets/line/lightbulb.png'),
  'map-pin': require('@/assets/line/map-pin.png'),
  microscope: require('@/assets/line/microscope.png'),
  music: require('@/assets/line/music.png'),
  newspaper: require('@/assets/line/newspaper.png'),
  palette: require('@/assets/line/palette.png'),
  'pen-tool': require('@/assets/line/pen-tool.png'),
  pill: require('@/assets/line/pill.png'),
  quote: require('@/assets/line/quote.png'),
  scale: require('@/assets/line/scale.png'),
  'scroll-text': require('@/assets/line/scroll-text.png'),
  sigma: require('@/assets/line/sigma.png'),
  star: require('@/assets/line/star.png'),
  stethoscope: require('@/assets/line/stethoscope.png'),
  syringe: require('@/assets/line/syringe.png'),
  target: require('@/assets/line/target.png'),
  telescope: require('@/assets/line/telescope.png'),
  'trending-up': require('@/assets/line/trending-up.png'),
  users: require('@/assets/line/users.png'),
  vote: require('@/assets/line/vote.png'),
};

// 새 과목의 기본 아이콘과 무작위 선택에 쓴다.
export const courseIconNames = COURSE_ICON_KEYS;

export const getCourseIconSource = (icon: string) => sources[toCourseIcon(icon)];

const glyphSizes = { 32: 18, 36: 20, 48: 26, 56: 28, 64: 30, 72: 34 };

const glyphColors = {
  main: Palette.white,
  soft: Palette.purpleStrong,
  muted: Palette.textSub,
  golden: Palette.goldenInk,
};

type CourseIconProps = {
  // API의 과목 icon 값. 예전 아이콘 값도 가까운 아이콘으로, 모르는 값이면 책으로 보여 준다.
  icon: string;
  size?: keyof typeof glyphSizes;
  tone?: keyof typeof glyphColors;
  raised?: boolean;
};

// 원래 모양 그대로(꽉 찬 칸 + 흰 선 아이콘). 아이콘 종류만 분야별 48개로 늘렸다.
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
