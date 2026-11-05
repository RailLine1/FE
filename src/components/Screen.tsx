import { ReactNode } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette } from '@/styles/palette';

type ScreenProps = {
  children: ReactNode;
  background?: string;
  // 하단 안전 영역은 TabBar가 맡는다.
  hasTabBar?: boolean;
};

export function Screen({ children, background = Palette.white, hasTabBar }: ScreenProps) {
  return (
    <SafeAreaView
      edges={hasTabBar ? ['top'] : ['top', 'bottom']}
      style={{ flex: 1, backgroundColor: background }}>
      {children}
    </SafeAreaView>
  );
}
