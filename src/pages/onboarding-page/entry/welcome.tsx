import { useRouter } from 'expo-router';
import {
  ActivityIndicator,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useWelcome } from '@/api/7-bit/7-bit';
import { Button } from '@/components/Button';
import { ListGroup } from '@/components/ListGroup';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';
import { pendingRoute } from '@/lib/pendingRoute';

import { HOME_ROUTE } from '../session';
import { greetingFor, newMaterialsText } from '../welcomeContent';

// P-ACC-05. 불러오지 못해도 강의실로 들어갈 수 있다.
export default function WelcomePage() {
  const router = useRouter();
  const { data, isPending } = useWelcome();

  // 서버 시간대와 달라 서버 렌더링에서는 인사를 만들지 않는다.
  if (isPending) {
    return (
      <Screen>
        <View style={styles.loading}>
          <ActivityIndicator color={Palette.purple} />
        </View>
      </Screen>
    );
  }

  const greeting = greetingFor(new Date().getHours());
  const materials = newMaterialsText(data?.newMaterials);
  const rows: { title: string; icon: ImageSourcePropType; background: string }[] = [];
  if (materials) {
    rows.push({
      title: materials,
      icon: require('@/assets/icons/folder-purple-18.png'),
      background: Palette.purpleTint,
    });
  }
  if (data?.bitsLeft) {
    rows.push({
      title: `오늘의 한 조각 ${data.bitsLeft}개`,
      icon: require('@/assets/icons/check-purple-18.png'),
      background: Palette.purpleTint,
    });
  }
  if (data?.streak) {
    rows.push({
      title: `연속 ${data.streak}일째`,
      icon: require('@/assets/icons/flame-orange-18.png'),
      background: Palette.orangeTint,
    });
  }

  return (
    <Screen>
      <View style={styles.main}>
        <View style={styles.mark}>
          <Text style={styles.markLetter}>D</Text>
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          {data?.nickname ? `${data.nickname} 님,\n${greeting}` : greeting}
        </Text>
        {rows.length > 0 && (
          <View style={styles.rows}>
            <ListGroup>
              {rows.map(({ title, icon, background }) => (
                <ListRow
                  key={title}
                  title={title}
                  leading={
                    <View style={[styles.glyph, { backgroundColor: background }]}>
                      <Image source={icon} style={styles.glyphIcon} />
                    </View>
                  }
                />
              ))}
            </ListGroup>
          </View>
        )}
        <Button
          label="시작하기"
          onPress={() => router.replace(pendingRoute.take() ?? HOME_ROUTE)}
          style={styles.start}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 56,
  },
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: Palette.purple,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  markLetter: {
    ...Fonts.black,
    fontSize: 30,
    lineHeight: 45,
    color: Palette.white,
  },
  title: {
    ...Fonts.black,
    marginTop: 22,
    fontSize: 28,
    lineHeight: 36.4,
    letterSpacing: -0.6,
    textAlign: 'center',
    color: Palette.text,
  },
  rows: {
    marginTop: 27,
  },
  glyph: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  glyphIcon: {
    width: 18,
    height: 18,
  },
  start: {
    marginTop: 28,
  },
});
