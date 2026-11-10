import { useEffect, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

// 결과 화면 배경: 남색 입자감 그림(navy.jpg, 캔버스로 생성) 위에 별 몇 개가 천천히 반짝인다.
const navy = require('@/assets/bg/navy.jpg');

// 위치 · 크기 · 주기를 고정해 두어 화면이 다시 그려져도 별이 튀지 않는다.
const STARS = [
  { top: '8%', left: '14%', size: 3, period: 2600 },
  { top: '14%', left: '78%', size: 4, period: 3400 },
  { top: '24%', left: '36%', size: 2, period: 2200 },
  { top: '33%', left: '88%', size: 3, period: 3000 },
  { top: '42%', left: '6%', size: 4, period: 3800 },
  { top: '58%', left: '92%', size: 2, period: 2400 },
  { top: '66%', left: '20%', size: 3, period: 3200 },
  { top: '74%', left: '70%', size: 4, period: 2800 },
  { top: '86%', left: '42%', size: 2, period: 3600 },
  { top: '91%', left: '8%', size: 3, period: 2500 },
] as const;

type StarProps = (typeof STARS)[number] & { delay: number };

function Star({ top, left, size, period, delay }: StarProps) {
  const [glow] = useState(() => new Animated.Value(0.2));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(glow, {
          toValue: 1,
          duration: period / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glow, {
          toValue: 0.2,
          duration: period / 2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [delay, glow, period]);

  const scale = glow.interpolate({ inputRange: [0.2, 1], outputRange: [0.7, 1.25] });
  return (
    <Animated.View
      style={[
        styles.star,
        {
          top,
          left,
          width: size,
          height: size,
          borderRadius: size,
          opacity: glow,
          transform: [{ scale }],
          boxShadow: `0 0 ${size * 3}px ${size}px #cfc6ff66`,
        },
      ]}
    />
  );
}

export function NightSparkles() {
  return (
    <View pointerEvents="none" style={styles.fill}>
      <Image source={navy} resizeMode="cover" style={[styles.fill, styles.image]} />
      {STARS.map((star, index) => (
        <Star key={index} {...star} delay={index * 370} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  // 웹은 크기를 정하지 않으면 그림 원래 높이만큼 늘어나 화면이 스크롤된다.
  image: {
    width: '100%',
    height: '100%',
  },
  star: {
    position: 'absolute',
    backgroundColor: '#f3f0ff',
  },
});
