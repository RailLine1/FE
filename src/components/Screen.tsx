import { usePathname } from 'expo-router';
import { ReactNode, useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Palette } from '@/styles/palette';

type ScreenProps = {
  children: ReactNode;
  // 화면마다 따로 칠할 때만 넘긴다. 없으면 공통 밤하늘 배경을 깐다.
  background?: string;
  // 하단 안전 영역은 TabBar가 맡는다.
  hasTabBar?: boolean;
};

// 직접 그린 가로 3배 파노라마 밤하늘(sky-wide.jpg, 캔버스로 생성).
// 탭(강의실 → Bit → 탐색 → 내 정보)마다 하늘의 다른 부분을 보여 주고, 옮길 때 부드럽게 흘러간다.
const sky = require('@/assets/bg/sky-wide.jpg');
const SECTIONS = ['/classroom', '/bit', '/explore', '/profile'];

function skyPosition(pathname: string) {
  const index = SECTIONS.findIndex((section) => pathname.startsWith(section));
  return index < 0 ? 0 : index / (SECTIONS.length - 1);
}

// 화면이 바뀌면 새 Screen이 마운트되므로, 직전 위치에서 출발하도록 모듈에 기억해 둔다.
let lastPosition = 0;
// 첫 접속에서 그림을 받는 동안은 어두운 바탕만 보이다가, 받아지면 부드럽게 떠오른다. 한 번 받은 뒤에는 바로 보인다.
let skyLoaded = false;

export function Screen({ children, background, hasTabBar }: ScreenProps) {
  const edges = hasTabBar ? (['top'] as const) : (['top', 'bottom'] as const);
  const target = skyPosition(usePathname());
  const [position] = useState(() => new Animated.Value(lastPosition));
  const [skyOpacity] = useState(() => new Animated.Value(skyLoaded ? 1 : 0));
  const showSky = () => {
    if (skyLoaded) return skyOpacity.setValue(1);
    skyLoaded = true;
    Animated.timing(skyOpacity, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    Animated.timing(position, {
      toValue: target,
      duration: 700,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
    lastPosition = target;
  }, [position, target]);

  if (background) {
    return (
      <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: background }}>
        {children}
      </SafeAreaView>
    );
  }

  // 그림 폭은 화면의 3배. 0이면 왼쪽 끝, 1이면 오른쪽 끝(-200%)을 보여 준다.
  const left = position.interpolate({ inputRange: [0, 1], outputRange: ['0%', '-200%'] });

  return (
    <View style={styles.frame}>
      <Animated.Image
        source={sky}
        resizeMode="cover"
        onLoad={showSky}
        style={[styles.sky, { left, opacity: skyOpacity }]}
      />
      <View style={styles.veil} />
      <SafeAreaView edges={edges} style={styles.content}>
        {children}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: Palette.bg,
  },
  sky: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '300%',
    height: '100%',
  },
  veil: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Palette.veil,
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
