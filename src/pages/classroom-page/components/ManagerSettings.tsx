import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { CourseIcon } from '@/components/CourseIcon';
import { CourseIconPicker } from '@/components/CourseIconPicker';
import { DateField } from '@/components/DateField';
import { FormField } from '@/components/FormField';
import { ListRow } from '@/components/ListRow';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Toggle } from '@/components/Toggle';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseSettings, CourseVisibility, UpdateCourseInput } from '../courseTypes';
import { useCourseNotify } from '../hooks/useCourseNotify';
import { useMemberSummary } from '../hooks/useMemberSummary';
import { useUpdateCourse } from '../hooks/useUpdateCourse';
import { GroupSection } from './GroupSection';
import { SettingsSummary } from './SettingsSummary';

const INTRO_MAX_LENGTH = 30;

const visibilityOptions = [
  { value: 'private', label: '비공개' },
  { value: 'public', label: '공개' },
] as const;

type ManagerSettingsProps = {
  courseId: number;
  settings: CourseSettings;
  onSaved: () => void;
};

// 관리자와 공동 관리자의 전체 설정(P-ROLE-01). 알림만 개인 설정이라 바로 저장한다.
export function ManagerSettings({ courseId, settings, onSaved }: ManagerSettingsProps) {
  const { updateCourse, isPending } = useUpdateCourse(courseId);
  const updateNotify = useCourseNotify(courseId);
  const { coCount, memberCount, requestCount } = useMemberSummary(courseId);

  const [icon, setIcon] = useState(settings.icon ?? 'book');
  const [pickerVisible, setPickerVisible] = useState(false);
  const [intro, setIntro] = useState(settings.intro ?? '');
  const [visibility, setVisibility] = useState<CourseVisibility>(settings.visibility ?? 'private');
  const [midExamDate, setMidExamDate] = useState(settings.midExamDate);
  const [finalExamDate, setFinalExamDate] = useState(settings.finalExamDate);
  const [rawAllowed, setRawAllowed] = useState(settings.rawAllowed ?? true);

  const save = () => {
    const next: UpdateCourseInput = {
      icon,
      intro: intro.trim() || null,
      visibility,
      midExamDate,
      finalExamDate,
      rawAllowed,
    };
    const changes = Object.fromEntries(
      Object.entries(next).filter(([key, value]) => value !== settings[key as keyof CourseSettings]),
    );

    if (Object.keys(changes).length === 0) onSaved();
    else updateCourse(changes, onSaved);
  };

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.scroll}
      contentContainerStyle={styles.content}>
      <SettingsSummary settings={settings} />
      <View style={styles.field}>
        <Text style={styles.label}>아이콘</Text>
        <View style={styles.iconRow}>
          <CourseIcon icon={icon} size={56} raised />
          <Button
            label={pickerVisible ? '닫기' : '변경'}
            variant="secondary"
            size="small"
            onPress={() => setPickerVisible(!pickerVisible)}
            style={styles.iconButton}
          />
        </View>
        {pickerVisible && <CourseIconPicker value={icon} onChange={setIcon} />}
      </View>
      <FormField
        label="과목 소개"
        value={intro}
        maxLength={INTRO_MAX_LENGTH}
        hint="탐색 화면에 보여요."
        onChangeText={setIntro}
      />
      <FormField label="공개 여부">
        <SegmentedControl options={visibilityOptions} value={visibility} onChange={setVisibility} />
      </FormField>
      <View style={styles.field}>
        <Text style={styles.label}>시험일</Text>
        <View style={styles.dates}>
          <DateField label="중간" value={midExamDate} onChange={setMidExamDate} />
          <DateField label="기말" value={finalExamDate} onChange={setFinalExamDate} />
        </View>
        <Text style={styles.hint}>시험일이 지나면 Bit 출제 범위가 다음 폴더로 넘어가요.</Text>
      </View>
      <GroupSection title="멤버">
        {visibility === 'private' && (
          <ListRow
            title="가입 요청"
            badge={requestCount > 0 ? `${requestCount}건 대기` : undefined}
            badgeVariant="danger"
            meta={requestCount > 0 ? undefined : '없음'}
            chevron
          />
        )}
        <ListRow title="멤버 관리" meta={`공동 관리자 ${coCount} · 멤버 ${memberCount}`} chevron />
      </GroupSection>
      <GroupSection title="자료 · 알림">
        <Toggle
          divider
          title="원본 열람 허용"
          description="끄면 멤버에게 학습자료가 보이지 않아요. 커넥터로 AI가 참고하는 건 그대로예요."
          value={rawAllowed}
          onValueChange={setRawAllowed}
        />
        <Toggle
          title="이 과목 알림"
          description="오늘의 한 조각"
          value={settings.notify}
          onValueChange={updateNotify}
        />
      </GroupSection>
      <View style={styles.spacer} />
      <Button label="저장" disabled={isPending} onPress={save} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 16,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  field: {
    gap: 6,
  },
  label: {
    ...Fonts.bold,
    fontSize: 13,
    color: Palette.text,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    alignSelf: 'center',
  },
  dates: {
    flexDirection: 'row',
    gap: 8,
  },
  hint: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.textSub,
  },
  spacer: {
    flexGrow: 1,
  },
});
