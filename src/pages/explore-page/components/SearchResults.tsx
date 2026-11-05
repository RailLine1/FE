import { StyleSheet, Text, View } from 'react-native';

import { ListGroup } from '@/components/ListGroup';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { useExploreSearch } from '../hooks/useExploreSearch';
import { CourseRow } from './CourseRow';
import { QueryStatus } from './QueryStatus';
import { SectionLabel } from './SectionLabel';

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
      <View style={styles.empty}>
        <View style={styles.bits}>
          <View style={styles.bit} />
          <View style={styles.nextBit} />
          <View style={styles.nextBit} />
          <View style={styles.bit} />
        </View>
        <Text style={styles.emptyTitle}>찾는 과목이 없어요</Text>
        <Text style={styles.emptyMessage}>
          비공개 과목은 과목 코드 전체를{'\n'}입력해야 찾을 수 있어요.
        </Text>
      </View>
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
  empty: {
    alignItems: 'center',
    gap: 14,
    paddingVertical: 56,
    paddingHorizontal: 16,
  },
  bits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    width: 72,
  },
  bit: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: Palette.line,
  },
  nextBit: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderColor: Palette.purple,
  },
  emptyTitle: {
    ...Fonts.bold,
    fontSize: 17,
    color: Palette.text,
  },
  emptyMessage: {
    ...Fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.textSub,
    textAlign: 'center',
  },
});
