import { useEffect, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

// 마스코트 바이트(도트 강아지). 16x16 도트를 8배(128px)로 키운 그림이라 32 · 64 · 128처럼 나눠 떨어지는 크기로 쓰면 또렷하다.
const poses = {
  idle: require('@/assets/byte/byte-idle.png'),
  walk: require('@/assets/byte/byte-walk.png'),
  bite: require('@/assets/byte/byte-bite.png'),
  sit: require('@/assets/byte/byte-sit.png'),
};
const blink = require('@/assets/byte/byte-blink.png');

type BytePose = keyof typeof poses;

type ByteProps = {
  pose?: BytePose;
  size?: 32 | 64 | 128;
  // 말풍선 문구. 없으면 바이트만 보인다.
  says?: string;
};

export function Byte({ pose = 'idle', size = 64, says }: ByteProps) {
  const [hop] = useState(() => new Animated.Value(0));
  const [eyesClosed, setEyesClosed] = useState(false);

  // 통통: 1.6초마다 한 번 살짝 뛰어오른다. 도트 느낌이 나게 두 칸 높이만.
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(hop, { toValue: 1, duration: 160, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(hop, { toValue: 0, duration: 160, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.delay(1300),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [hop]);

  // 깜빡: 정면(idle)일 때만 3.4초마다 0.15초 눈을 감는다.
  useEffect(() => {
    if (pose !== 'idle') return;
    let open: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setEyesClosed(true);
      open = setTimeout(() => setEyesClosed(false), 150);
    }, 3400);
    return () => {
      clearInterval(timer);
      clearTimeout(open);
    };
  }, [pose]);

  const translateY = hop.interpolate({ inputRange: [0, 1], outputRange: [0, -size / 8] });
  const source = pose === 'idle' && eyesClosed ? blink : poses[pose];

  return (
    <View style={styles.row}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Image
          accessibilityLabel="바이트"
          source={source}
          style={{ width: size, height: size }}
        />
      </Animated.View>
      {says && (
        <View style={styles.bubble}>
          <View style={styles.tail} />
          <Text style={styles.says}>{says}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bubble: {
    flexShrink: 1,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderRadius: 14,
    borderColor: Palette.line,
    backgroundColor: Palette.surface,
  },
  // 말풍선 꼬리: 왼쪽으로 튀어나온 작은 네모(도트 느낌)
  tail: {
    position: 'absolute',
    left: -7,
    top: '50%',
    width: 10,
    height: 10,
    marginTop: -5,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: Palette.line,
    backgroundColor: Palette.sheet,
    transform: [{ rotate: '45deg' }],
  },
  says: {
    ...Fonts.bold,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.text,
  },
});

// 빈 화면 안내: 가운데 바이트 + 제목 + 다음에 할 일 한 줄.
export function ByteEmpty({ pose = 'sit', title, hint }: { pose?: BytePose; title: string; hint?: string }) {
  return (
    <View style={emptyStyles.box}>
      <Byte pose={pose} size={64} />
      <Text style={emptyStyles.title}>{title}</Text>
      {hint && <Text style={emptyStyles.hint}>{hint}</Text>}
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  box: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: 32,
  },
  title: {
    ...Fonts.bold,
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: Palette.text,
    textAlign: 'center',
  },
  hint: {
    ...Fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: Palette.textSub,
    textAlign: 'center',
  },
});
