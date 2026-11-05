import { StyleSheet, Text, View } from 'react-native';

import { Badge, BadgeVariant } from '@/components/Badge';
import { CourseIcon } from '@/components/CourseIcon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseDetail, CourseRole } from '../courseTypes';

const roleBadges: Record<CourseRole, { label: string; variant: BadgeVariant }> = {
  admin: { label: '관리자', variant: 'admin' },
  co: { label: '공동 관리자', variant: 'pending' },
  member: { label: '멤버', variant: 'member' },
};

export function CourseSummary({ course }: { course: CourseDetail }) {
  const isAdmin = course.role === 'admin';
  const badge = roleBadges[course.role];

  return (
    <View style={styles.summary}>
      <CourseIcon icon={course.icon} size={56} tone={isAdmin ? 'golden' : 'main'} raised={!isAdmin} />
      <View style={styles.text}>
        {course.intro && <Text style={styles.intro}>{course.intro}</Text>}
        <Text style={styles.meta}>
          {[course.term, `구독자 ${course.subscribers}명`].filter(Boolean).join(' · ')}
        </Text>
      </View>
      <View>
        <Badge label={badge.label} variant={badge.variant} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  intro: {
    ...Fonts.bold,
    fontSize: 15,
    color: Palette.text,
  },
  meta: {
    ...Fonts.regular,
    fontSize: 13,
    color: Palette.textSub,
  },
});
