import { Image } from 'react-native';

import { IconBox } from '@/components/IconBox';
import { Palette } from '@/styles/palette';

const sources: Record<string, number> = {
  atom: require('@/assets/icons/course/atom.png'),
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

const glyphSizes = { 32: 18, 36: 20, 48: 26, 64: 30 };

type CourseIconProps = {
  // API의 과목 icon 값. 모르는 값이면 책 아이콘을 보여준다.
  icon: string;
  size?: keyof typeof glyphSizes;
  muted?: boolean;
  raised?: boolean;
};

export function CourseIcon({ icon, size = 36, muted, raised }: CourseIconProps) {
  const glyph = glyphSizes[size];

  return (
    <IconBox size={size} tone={muted ? 'muted' : 'main'} raised={raised}>
      <Image
        source={sources[icon] ?? sources.book}
        style={{ width: glyph, height: glyph, tintColor: muted ? Palette.textSub : Palette.white }}
      />
    </IconBox>
  );
}
