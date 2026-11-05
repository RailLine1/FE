import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { TileGrid } from '../components/TileGrid';
import { useGoBackToClassroom } from '../hooks/useGoBackToClassroom';
import { useMyCourses } from '../hooks/useMyCourses';

export default function PastCoursesPage() {
  const goBack = useGoBackToClassroom();
  const { data: courses, isLoading, isError } = useMyCourses('ended');

  return (
    <Screen>
      <AppBar borderless leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>
          지난 강의
        </Text>
        <Text style={styles.description}>수강이 끝난 과목이에요. 자료와 기록은 그대로 남아 있어요.</Text>
        <QueryStatus isLoading={isLoading} isError={isError} />
        {courses && courses.length > 0 && <TileGrid muted courses={courses} />}
        {courses?.length === 0 && <Text style={styles.empty}>지난 강의가 없어요.</Text>}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    ...Fonts.extraBold,
    marginBottom: 6,
    fontSize: 32,
    letterSpacing: -0.8,
    color: Palette.text,
  },
  description: {
    ...Fonts.regular,
    marginBottom: 18,
    fontSize: 15,
    lineHeight: 23,
    color: Palette.textSub,
  },
  empty: {
    ...Fonts.semiBold,
    paddingVertical: 24,
    fontSize: 13,
    color: Palette.textSub,
    textAlign: 'center',
  },
});
