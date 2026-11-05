import { useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentRef, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { ListGroup } from '@/components/ListGroup';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseRow } from '../components/CourseRow';
import { Pagination } from '../components/Pagination';
import { useExploreCourses } from '../hooks/useExploreCourses';
import { useGoBackToExplore } from '../hooks/useGoBackToExplore';

// 페이지당 8개(P-EXP-02)
const PAGE_SIZE = 8;

const sortLabels = {
  subscribers: { title: '인기 과목', order: '인기순' },
  newest: { title: '새로 열린 과목', order: '최신순' },
};

export default function CourseListPage() {
  const router = useRouter();
  const goBack = useGoBackToExplore();
  const params = useLocalSearchParams<{ sort?: string }>();
  const sort = params.sort === 'newest' ? 'newest' : 'subscribers';
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useExploreCourses({ sort, page, size: PAGE_SIZE });
  const { title, order } = sortLabels[sort];

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <Screen>
      <AppBar title={title} leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }} />
      <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.content}>
        <QueryStatus isLoading={isLoading} isError={isError} />
        {data && (
          <>
            <Text style={styles.summary}>{`${order} · ${data.total}개`}</Text>
            <ListGroup>
              {data.items.map((course) => (
                <CourseRow
                  key={course.code}
                  compact
                  course={course}
                  onPress={() =>
                    router.push({ pathname: '/explore/[code]', params: { code: course.code } })
                  }
                />
              ))}
            </ListGroup>
            <Pagination
              page={page}
              totalPages={Math.ceil(data.total / data.size)}
              onChange={changePage}
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: 12,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  summary: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.textSub,
  },
});
