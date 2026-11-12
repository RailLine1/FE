import { useEffect, useState } from 'react';
import { Animated, Easing, Image, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

// 마스코트(도트): 바이트(귀 쫑긋 강아지, 매일 문제를 물어 오는 bite) · 킬로(납작 외계인, 바이트보다 큰 친구).
// 16x16 도트를 8배(128px)로 키운 그림이라 32 · 64 · 128처럼 나눠 떨어지는 크기로 쓰면 또렷하다.
const poses = {
  byte: require('@/assets/mascot/byte.png'),
  kilo: require('@/assets/mascot/kilo.png'),
};
const blinks = {
  byte: require('@/assets/mascot/byte-blink.png'),
  kilo: require('@/assets/mascot/kilo-blink.png'),
};
const names = { byte: '바이트', kilo: '킬로' };

type MascotPose = keyof typeof poses;

type MascotProps = {
  pose?: MascotPose;
  size?: 32 | 64 | 128;
  // 말풍선 문구. 없으면 캐릭터만 보인다.
  says?: string;
};

export function Mascot({ pose = 'byte', size = 64, says }: MascotProps) {
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

  // 깜빡: 3.4초마다 0.15초 눈을 감는다.
  useEffect(() => {
    let open: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setEyesClosed(true);
      open = setTimeout(() => setEyesClosed(false), 150);
    }, 3400);
    return () => {
      clearInterval(timer);
      clearTimeout(open);
    };
  }, []);

  const translateY = hop.interpolate({ inputRange: [0, 1], outputRange: [0, -size / 8] });
  const source = eyesClosed ? blinks[pose] : poses[pose];

  return (
    <View style={styles.row}>
      <Animated.View style={{ transform: [{ translateY }] }}>
        <Image
          accessibilityLabel={names[pose]}
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

// 빈 화면 안내: 가운데 캐릭터 + 제목 + 다음에 할 일 한 줄.
export function MascotEmpty({ pose = 'byte', title, hint }: { pose?: MascotPose; title: string; hint?: string }) {
  return (
    <View style={emptyStyles.box}>
      <Mascot pose={pose} size={64} />
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
