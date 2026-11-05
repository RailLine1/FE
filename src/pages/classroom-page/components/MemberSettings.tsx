import { ScrollView, StyleSheet, Text } from 'react-native';

import { Toggle } from '@/components/Toggle';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseSettings } from '../courseTypes';
import { useCourseNotify } from '../hooks/useCourseNotify';
import { GroupSection } from './GroupSection';
import { SettingsSummary } from './SettingsSummary';

type MemberSettingsProps = {
  courseId: number;
  settings: CourseSettings;
};

// 멤버는 과목 코드, 내 권한, 알림만 본다(P-ROLE-01).
export function MemberSettings({ courseId, settings }: MemberSettingsProps) {
  const updateNotify = useCourseNotify(courseId);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      <SettingsSummary settings={settings} />
      <GroupSection title="알림">
        <Toggle
          title="이 과목 알림"
          description="오늘의 한 조각"
          value={settings.notify}
          onValueChange={updateNotify}
        />
      </GroupSection>
      <Text style={styles.note}>과목 정보와 멤버는 관리자만 바꿀 수 있어요.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 16,
  },
  note: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.textSub,
    textAlign: 'center',
  },
});
