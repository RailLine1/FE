import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ListGroup } from '@/components/ListGroup';
import { QueryStatus } from '@/components/QueryStatus';
import { SectionLabel } from '@/components/SectionLabel';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { ExploreCourse } from '../courseTypes';
import { CourseRow } from './CourseRow';

type CourseSectionProps = {
  title: string;
  courses?: ExploreCourse[];
  isLoading: boolean;
  isError: boolean;
  onPressAll: () => void;
  onPressCourse: (code: string) => void;
};

export function CourseSection({
  title,
  courses,
  isLoading,
  isError,
  onPressAll,
  onPressCourse,
}: CourseSectionProps) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <SectionLabel>{title}</SectionLabel>
        <Pressable accessibilityRole="link" onPress={onPressAll}>
          <Text style={styles.all}>전체보기</Text>
        </Pressable>
      </View>
      <QueryStatus isLoading={isLoading} isError={isError} />
      {courses && (
        <ListGroup>
          {courses.map((course) => (
            <CourseRow key={course.code} course={course} onPress={() => onPressCourse(course.code)} />
          ))}
        </ListGroup>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  all: {
    ...Fonts.bold,
    fontSize: 13,
    color: Palette.purpleStrong,
  },
});
