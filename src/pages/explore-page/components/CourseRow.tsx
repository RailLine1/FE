import { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { BadgeVariant } from '@/components/Badge';
import { CourseIcon } from '@/components/CourseIcon';
import { ListRow } from '@/components/ListRow';
import { Palette } from '@/styles/palette';

import { ExploreCourse } from '../courseTypes';

function getBadge({ myStatus, ended }: ExploreCourse): { label: string; variant: BadgeVariant } | null {
  if (myStatus === 'subscribed') return { label: '구독 중', variant: 'subscribed' };
  if (myStatus === 'managing') return { label: '관리 중', variant: 'admin' };
  if (myStatus === 'pending') return { label: '대기 중', variant: 'pending' };
  if (ended) return { label: '종료', variant: 'member' };
  return null;
}

function highlightName(name: string, keyword?: string): ReactNode {
  const start = keyword ? name.toLowerCase().indexOf(keyword.toLowerCase()) : -1;
  if (!keyword || start < 0) return name;

  const end = start + keyword.length;
  return (
    <>
      {name.slice(0, start)}
      <Text style={styles.highlight}>{name.slice(start, end)}</Text>
      {name.slice(end)}
    </>
  );
}

type CourseRowProps = {
  course: ExploreCourse;
  // 전체보기 목록은 아이콘과 화살표 없이 보여준다.
  compact?: boolean;
  highlight?: string;
  onPress: () => void;
};

export function CourseRow({ course, compact, highlight, onPress }: CourseRowProps) {
  const badge = getBadge(course);

  return (
    <ListRow
      title={highlightName(course.name, highlight)}
      subtitle={course.admin}
      leading={compact ? undefined : <CourseIcon icon={course.icon} size={32} />}
      badge={badge?.label}
      badgeVariant={badge?.variant}
      chevron={!compact && !badge}
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  highlight: {
    color: Palette.purpleStrong,
  },
});
