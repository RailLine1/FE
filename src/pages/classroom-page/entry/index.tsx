import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { IconButton } from '@/components/IconButton';
import { QueryStatus } from '@/components/QueryStatus';
import { ByteEmpty } from '@/components/Byte';
import { Screen } from '@/components/Screen';
import { SectionLabel } from '@/components/SectionLabel';
import { TabBar } from '@/components/TabBar';
import { Fonts } from '@/styles/font';
import { prefetchCourse, prefetchTabs } from '@/lib/prefetch';
import { Palette } from '@/styles/palette';

import { TileGrid } from '../components/TileGrid';
import { useMyCourses } from '../hooks/useMyCourses';

export default function ClassroomPage() {
  const router = useRouter();
  const { data: courses, isLoading, isError } = useMyCourses('active');
  const queryClient = useQueryClient();

  // 첫 화면이 뜨면 다른 탭과 내 과목 상세를 미리 받아 두어 이동할 때 로딩이 없게 한다.
  useEffect(() => {
    prefetchTabs(queryClient);
  }, [queryClient]);
  useEffect(() => {
    courses?.forEach(({ courseId }) => prefetchCourse(queryClient, courseId));
  }, [courses, queryClient]);

  return (
    <Screen hasTabBar>
      <AppBar
        large
        title="강의실"
        trailing={
          <IconButton
            icon="add"
            accessibilityLabel="과목 만들기"
            onPress={() => router.push('/classroom/new')}
          />
        }
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
        {courses?.length === 0 && (
          <ByteEmpty
            pose="walk"
            title="아직 구독 중인 과목이 없어요"
            hint="탐색에서 과목 이름이나 코드로 찾아볼까요?"
          />
        )}
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
});
