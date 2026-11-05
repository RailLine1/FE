import { ReactNode } from 'react';
import { DimensionValue, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

// 위치는 Figma 일러스트(358x300) 기준이다. 화면 폭이 달라도 그림은 가운데에 같은 크기로 둔다.
function Frame({ children }: { children: ReactNode }) {
  return (
    <View style={styles.frame}>
      <View style={styles.canvas}>{children}</View>
    </View>
  );
}

function Bars({ widths, accent }: { widths: DimensionValue[]; accent?: number }) {
  return widths.map((width, index) => (
    <View
      key={index}
      style={[styles.bar, { width }, index === accent && { backgroundColor: Palette.purple }]}
    />
  ));
}

function Paper({ rotate, left, top, accent, lastWidth }: {
  rotate: string;
  left: number;
  top: number;
  accent?: number;
  lastWidth: number;
}) {
  return (
    <View style={[styles.paper, { left, top, transform: [{ rotate }] }]}>
      <Bars widths={[78, 78, lastWidth]} accent={accent} />
    </View>
  );
}

function FloatingBadge({ label, color, style }: { label: string; color: string; style: ViewStyle }) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={[styles.badgeLabel, { color }]}>{label}</Text>
    </View>
  );
}

const TILES = ['solved', 'solved', 'solved', 'today', 'solved', 'solved', 'next', 'empty'] as const;

export function MaterialsIllustration() {
  return (
    <Frame>
      <Paper rotate="-8deg" left={92} top={56} lastWidth={46.8} />
      <Paper rotate="7deg" left={160} top={44} accent={0} lastWidth={54.6} />
      <View style={styles.folder}>
        <View style={styles.folderSlot} />
      </View>
    </Frame>
  );
}

export function AiIllustration() {
  return (
    <Frame>
      <View style={styles.document}>
        <Bars widths={[72, 72, 72, 43.2]} accent={1} />
      </View>
      <View style={styles.answer}>
        <View style={[styles.answerBar, { width: 148 }]} />
        <View style={[styles.answerBar, { width: 96 }]} />
      </View>
      <View style={styles.question}>
        <View style={[styles.bar, { width: 108 }]} />
      </View>
      <FloatingBadge
        label="LEC07 P.12 참고"
        color={Palette.purpleStrong}
        style={{ left: 160, top: 238 }}
      />
    </Frame>
  );
}

export function StreakIllustration() {
  return (
    <Frame>
      <View style={styles.grid}>
        {TILES.map((tile, index) => (
          <View key={index} style={[styles.tile, styles[tile]]} />
        ))}
      </View>
      <FloatingBadge label="연속 6일" color={Palette.orange} style={{ left: 147, top: 202 }} />
    </Frame>
  );
}

const styles = StyleSheet.create({
  frame: {
    alignItems: 'center',
    overflow: 'hidden',
    height: 300,
    borderRadius: 28,
    backgroundColor: Palette.purpleTint,
  },
  canvas: {
    width: 358,
    height: 300,
  },
  bar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Palette.line,
  },
  paper: {
    position: 'absolute',
    gap: 10,
    width: 110,
    height: 140,
    paddingTop: 18,
    paddingLeft: 14,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
  },
  folder: {
    position: 'absolute',
    left: 60,
    top: 146,
    alignItems: 'center',
    width: 238,
    height: 110,
    paddingTop: 51,
    borderRadius: 18,
    backgroundColor: Palette.purple,
    boxShadow: `0 6px 0 ${Palette.purpleShadow}`,
  },
  folderSlot: {
    width: 56,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff99',
  },
  document: {
    position: 'absolute',
    left: 32,
    top: 70,
    gap: 10,
    width: 104,
    height: 140,
    paddingTop: 18,
    paddingLeft: 14,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
  },
  answer: {
    position: 'absolute',
    left: 160,
    top: 56,
    gap: 10,
    width: 180,
    height: 76,
    paddingTop: 18,
    paddingLeft: 16,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    backgroundColor: Palette.purple,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  answerBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffffbf',
  },
  question: {
    position: 'absolute',
    left: 196,
    top: 156,
    width: 144,
    height: 56,
    paddingTop: 20,
    paddingLeft: 16,
    borderWidth: 2,
    borderRadius: 18,
    borderBottomRightRadius: 4,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
  },
  grid: {
    position: 'absolute',
    left: 69,
    top: 98,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: 220,
  },
  tile: {
    width: 46,
    height: 46,
    borderRadius: 14,
  },
  solved: {
    backgroundColor: Palette.purple,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  today: {
    backgroundColor: Palette.golden,
    boxShadow: `0 4px 0 ${Palette.goldenShadow}`,
  },
  next: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Palette.purple,
    backgroundColor: Palette.white,
  },
  empty: {
    borderWidth: 2,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
  },
  badge: {
    position: 'absolute',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: Palette.white,
  },
  badgeLabel: {
    ...Fonts.bold,
    fontSize: 12,
    lineHeight: 18,
  },
});
