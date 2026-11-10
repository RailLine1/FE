import { StyleSheet, Text, View } from 'react-native';

import { ByteEmpty } from '@/components/Byte';
import { ListGroup } from '@/components/ListGroup';
import { QueryStatus } from '@/components/QueryStatus';
import { SectionLabel } from '@/components/SectionLabel';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { useExploreSearch } from '../hooks/useExploreSearch';
import { CourseRow } from './CourseRow';

type SearchResultsProps = {
  query: string;
  onPressCourse: (code: string) => void;
};

export function SearchResults({ query, onPressCourse }: SearchResultsProps) {
  const keyword = query.trim();
  const { data, isLoading, isError } = useExploreSearch(keyword);

  if (!keyword) return null;
  if (isLoading || isError) return <QueryStatus isLoading={isLoading} isError={isError} />;

  if (!data?.length) {
    return (
      <ByteEmpty
        pose="kilo"
        title="찾는 과목이 없어요"
        hint={'킬로가 우주까지 찾아봤어요.\n비공개 과목은 과목 코드 전체를 입력해 주세요.'}
      />
    );
  }

  return (
    <View style={styles.results}>
      <SectionLabel>{`'${keyword}' 검색 결과 ${data.length}`}</SectionLabel>
      <ListGroup>
        {data.map((course) => (
          <CourseRow
            key={course.code}
            course={course}
            highlight={keyword}
            onPress={() => onPressCourse(course.code)}
          />
        ))}
      </ListGroup>
      <Text style={styles.note}>비공개 과목은 과목 코드 전체를 입력해야 나와요.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  results: {
    gap: 12,
    marginTop: 8,
  },
  note: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.textSub,
    textAlign: 'center',
  },
});
