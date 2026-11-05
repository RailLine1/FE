import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Badge, BadgeVariant } from '@/components/Badge';
import { CourseIcon } from '@/components/CourseIcon';
import { ListGroup } from '@/components/ListGroup';
import { ListRow } from '@/components/ListRow';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseAction } from '../components/CourseAction';
import { QueryStatus } from '../components/QueryStatus';
import { SectionLabel } from '../components/SectionLabel';
import { Toast } from '../components/Toast';
import { useCourseInfo } from '../hooks/useCourseInfo';
import { useGoBackToExplore } from '../hooks/useGoBackToExplore';
import { useSubscribeCourse } from '../hooks/useSubscribeCourse';
import { ExploreCourseDetail } from '../types';

const TOAST_DURATION = 2500;

function getStatusBadge({
  myStatus,
  ended,
  visibility,
}: ExploreCourseDetail): { label: string; variant: BadgeVariant } {
  if (myStatus === 'subscribed') return { label: '구독 중', variant: 'success' };
  if (ended) return { label: '수강 종료', variant: 'member' };
  if (visibility === 'private') return { label: '비공개', variant: 'member' };
  return { label: '공개 과목', variant: 'pending' };
}

export default function CourseInfoPage() {
  const router = useRouter();
  const goBack = useGoBackToExplore();
  const { code = '' } = useLocalSearchParams<{ code: string }>();
  const { data: course, isLoading, isError } = useCourseInfo(code);
  const { subscribe, isPending } = useSubscribeCourse(code);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast]);

  // 강의실 홈 화면이 만들어지면 경로를 맞춘다.
  const openClassroom = () => router.replace('/');

  const handleSubscribe = () => {
    subscribe((status) => {
      if (status === 'subscribed') openClassroom();
      else setToast('가입 요청을 보냈어요');
    });
  };

  const badge = course && getStatusBadge(course);

  return (
    <Screen>
      <AppBar
        borderless
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }}
      />
      <QueryStatus
        isLoading={isLoading}
        isError={isError}
        errorMessage="과목을 찾을 수 없어요."
      />
      {course && badge && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <CourseIcon icon={course.icon} size={64} muted={course.ended} raised={!course.ended} />
            <Text accessibilityRole="header" style={styles.name}>
              {course.name}
            </Text>
            <Text style={styles.meta}>
              {[course.term, `관리자 ${course.admin}`].filter(Boolean).join(' · ')}
            </Text>
            <View style={styles.badge}>
              <Badge label={badge.label} variant={badge.variant} />
            </View>
          </View>
          {course.myStatus !== 'subscribed' && (
            <ListGroup>
              <ListRow title="과목 코드" value={course.code} />
              {course.myStatus === 'pending' && (
                <ListRow title="내 요청" badge="승인 대기 중" badgeVariant="pending" />
              )}
            </ListGroup>
          )}
          {course.intro && (
            <>
              <SectionLabel>소개</SectionLabel>
              <ListGroup>
                <Text style={styles.intro}>{course.intro}</Text>
              </ListGroup>
            </>
          )}
          <View style={styles.spacer} />
          <CourseAction
            course={course}
            disabled={isPending}
            onSubscribe={handleSubscribe}
            onOpenClassroom={openClassroom}
          />
        </ScrollView>
      )}
      {toast && <Toast message={toast} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 16,
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  hero: {
    alignItems: 'center',
    gap: 6,
    paddingBottom: 8,
  },
  name: {
    ...Fonts.extraBold,
    marginTop: 10,
    fontSize: 26,
    letterSpacing: -0.6,
    color: Palette.text,
    textAlign: 'center',
  },
  meta: {
    ...Fonts.regular,
    fontSize: 14,
    color: Palette.textSub,
    textAlign: 'center',
  },
  badge: {
    marginTop: 4,
  },
  intro: {
    ...Fonts.regular,
    paddingVertical: 14,
    fontSize: 15,
    lineHeight: 23,
    color: Palette.textSub,
  },
  spacer: {
    flexGrow: 1,
  },
});
