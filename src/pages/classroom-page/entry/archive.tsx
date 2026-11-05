import { useLocalSearchParams, useRouter } from 'expo-router';
import { ComponentRef, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Pagination } from '@/components/Pagination';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { ArchiveCard } from '../components/ArchiveCard';
import { useArchivePosts } from '../hooks/useArchivePosts';

export default function ArchivePage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useArchivePosts(courseId, page);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/classroom/[courseId]', params: { courseId: params.courseId } });
  };

  const changePage = (nextPage: number) => {
    setPage(nextPage);
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  };

  return (
    <Screen>
      <AppBar title="기록" leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }} />
      <QueryStatus isLoading={isLoading} isError={isError} />
      {data && (
        <ScrollView ref={scrollRef} style={styles.scroll} contentContainerStyle={styles.content}>
          {data.items.map((post, index) => (
            <ArchiveCard
              key={post.bitId}
              post={post}
              last={index === data.items.length - 1}
              onOpen={() =>
                router.push({
                  pathname: '/classroom/[courseId]/archive/[bitId]',
                  params: {
                    courseId: params.courseId,
                    bitId: String(post.bitId),
                    page: String(page),
                  },
                })
              }
            />
          ))}
          {data.items.length === 0 && <Text style={styles.empty}>아직 기록이 없어요.</Text>}
          <Pagination
            page={page}
            totalPages={Math.ceil(data.total / data.size)}
            onChange={changePage}
          />
        </ScrollView>
      )}
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
  empty: {
    ...Fonts.semiBold,
    paddingVertical: 24,
    fontSize: 13,
    color: Palette.textSub,
    textAlign: 'center',
  },
});
