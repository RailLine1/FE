import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Icon } from '@/components/Icon';
import { IconBox } from '@/components/IconBox';
import { IconButton } from '@/components/IconButton';
import { ListRow } from '@/components/ListRow';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { AiSection } from '../components/AiSection';
import { CourseSummary } from '../components/CourseSummary';
import { GroupSection } from '../components/GroupSection';
import { LeaveSheet } from '../components/LeaveSheet';
import { MaterialSection } from '../components/MaterialSection';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useCourseFolders } from '../hooks/useCourseFolders';
import { useGoBackToClassroom } from '../hooks/useGoBackToClassroom';
import { useLeaveCourse } from '../hooks/useLeaveCourse';
import { useNextAdmin } from '../hooks/useNextAdmin';

export default function CoursePage() {
  const router = useRouter();
  const goBack = useGoBackToClassroom();
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const { data: course, isLoading, isError } = useCourseDetail(courseId);
  const canManage = course?.role === 'admin' || course?.role === 'co';
  // 원본 열람이 꺼지면 멤버에게 학습자료를 숨긴다(P-MAT-05).
  const canViewMaterials = canManage || course?.rawAllowed === true;
  const { data: folders } = useCourseFolders(courseId, canViewMaterials);
  const { nextAdmin, isLoading: isNextAdminLoading } = useNextAdmin(courseId, course?.role);
  const { leave, isPending } = useLeaveCourse(courseId);
  const [leaveVisible, setLeaveVisible] = useState(false);

  const handleLeave = () => {
    leave(() => {
      setLeaveVisible(false);
      router.replace('/classroom');
    });
  };

  return (
    <Screen>
      <AppBar
        title={course?.name}
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }}
        trailing={course && <IconButton icon="settings" accessibilityLabel="환경설정" />}
      />
      <QueryStatus isLoading={isLoading} isError={isError} errorMessage="과목을 찾을 수 없어요." />
      {course && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <CourseSummary course={course} />
          {folders && <MaterialSection courseId={courseId} folders={folders} canManage={canManage} />}
          <GroupSection title="아카이브">
            <ListRow
              title="기록"
              subtitle={`지난 퀴즈 ${course.archiveCount}개 · 메모`}
              leading={
                <IconBox tone="soft">
                  <Icon name="archive-20" color={Palette.purpleStrong} />
                </IconBox>
              }
              chevron
            />
          </GroupSection>
          <AiSection />
          <View style={styles.spacer} />
          <Pressable
            accessibilityRole="button"
            onPress={() => setLeaveVisible(true)}
            style={styles.leave}>
            <Text style={styles.leaveLabel}>탈퇴하기</Text>
          </Pressable>
        </ScrollView>
      )}
      {course && (
        <LeaveSheet
          visible={leaveVisible}
          name={course.name}
          role={course.role}
          nextAdmin={nextAdmin}
          disabled={isPending || isNextAdminLoading}
          onClose={() => setLeaveVisible(false)}
          onLeave={handleLeave}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 14,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  spacer: {
    flexGrow: 1,
  },
  leave: {
    alignSelf: 'center',
    padding: 10,
  },
  leaveLabel: {
    ...Fonts.bold,
    fontSize: 14,
    color: Palette.red,
  },
});
