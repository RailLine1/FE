import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { IconButton } from '@/components/IconButton';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { SectionLabel } from '@/components/SectionLabel';
import { TabBar } from '@/components/TabBar';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { TileGrid } from '../components/TileGrid';
import { useMyCourses } from '../hooks/useMyCourses';

export default function ClassroomPage() {
  const router = useRouter();
  const { data: courses, isLoading, isError } = useMyCourses('active');

  return (
    <Screen hasTabBar>
      <AppBar
        large
        title="강의실"
        trailing={<IconButton icon="add" accessibilityLabel="과목 만들기" />}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <SectionLabel>{`내 과목 ${courses?.length ?? 0}`}</SectionLabel>
          <Pressable accessibilityRole="link" onPress={() => router.push('/classroom/past')}>
            <Text style={styles.past}>지난 강의 보기</Text>
          </Pressable>
        </View>
        <QueryStatus isLoading={isLoading} isError={isError} />
        {courses && courses.length > 0 && <TileGrid courses={courses} />}
        {courses?.length === 0 && <Text style={styles.empty}>아직 구독 중인 과목이 없어요.</Text>}
      </ScrollView>
      <TabBar selected="classroom" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: 10,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  past: {
    ...Fonts.bold,
    fontSize: 13,
    color: Palette.purpleStrong,
  },
  empty: {
    ...Fonts.semiBold,
    paddingVertical: 24,
    fontSize: 13,
    color: Palette.textSub,
    textAlign: 'center',
  },
});
