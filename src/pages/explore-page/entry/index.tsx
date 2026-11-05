import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseSection } from '../components/CourseSection';
import { SearchResults } from '../components/SearchResults';
import { useExploreCourses } from '../hooks/useExploreCourses';
import { ExploreSort } from '../types';

export default function ExplorePage() {
  const router = useRouter();
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState('');
  const popular = useExploreCourses({ sort: 'subscribers', size: 5 });
  const newest = useExploreCourses({ sort: 'newest', size: 3 });

  const openCourse = (code: string) => {
    router.push({ pathname: '/explore/[code]', params: { code } });
  };
  const closeSearch = () => {
    setSearching(false);
    setQuery('');
  };
  const openList = (sort: ExploreSort) => {
    router.push({ pathname: '/explore/list', params: { sort } });
  };

  return (
    <Screen hasTabBar>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}
        contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>
          탐색
        </Text>
        {searching ? (
          <>
            <View style={styles.searchRow}>
              <Input
                autoFocus
                value={query}
                onChangeText={setQuery}
                accessibilityLabel="과목명 또는 과목 코드"
                placeholder="과목명 또는 과목 코드"
                style={styles.searchInput}
              />
              <Button
                label="취소"
                variant="text"
                size="small"
                onPress={closeSearch}
                style={styles.cancel}
              />
            </View>
            <SearchResults query={query} onPressCourse={openCourse} />
          </>
        ) : (
          <>
            <Input
              search
              placeholder="과목명 또는 과목 코드"
              accessibilityLabel="과목명 또는 과목 코드"
              onFocus={() => setSearching(true)}
            />
            <CourseSection
              title="인기 과목"
              courses={popular.data?.items}
              isLoading={popular.isLoading}
              isError={popular.isError}
              onPressAll={() => openList('subscribers')}
              onPressCourse={openCourse}
            />
            <CourseSection
              title="새로 열린 과목"
              courses={newest.data?.items}
              isLoading={newest.isLoading}
              isError={newest.isError}
              onPressAll={() => openList('newest')}
              onPressCourse={openCourse}
            />
          </>
        )}
      </ScrollView>
      <TabBar selected="explore" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: 12,
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
  },
  cancel: {
    alignSelf: 'center',
  },
  title: {
    ...Fonts.extraBold,
    marginBottom: 4,
    fontSize: 32,
    letterSpacing: -0.8,
    color: Palette.text,
  },
});
