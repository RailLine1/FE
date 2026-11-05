import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { courseIconNames, CourseIcon } from '@/components/CourseIcon';
import { CourseIconPicker } from '@/components/CourseIconPicker';
import { DateField } from '@/components/DateField';
import { FormField } from '@/components/FormField';
import { Screen } from '@/components/Screen';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseVisibility } from '../courseTypes';
import { useCreateCourse } from '../hooks/useCreateCourse';

const NAME_MAX_LENGTH = 40;
const INTRO_MAX_LENGTH = 30;
const TERM_MAX_LENGTH = 20;

const visibilityOptions = [
  { value: 'private', label: '비공개' },
  { value: 'public', label: '공개' },
] as const;

const visibilityHints: Record<CourseVisibility, string> = {
  private: '초대받은 사람이 가입 요청을 보내고, 내가 승인해야 참여해요.',
  public: '과목 검색에 노출되고 누구나 바로 구독할 수 있어요.',
};

function getCurrentTerm() {
  const today = new Date();
  return `${today.getFullYear()}년 ${today.getMonth() >= 7 ? 2 : 1}학기`;
}

export default function CreateCoursePage() {
  const router = useRouter();
  const { createCourse, isPending } = useCreateCourse();

  const [icon, setIcon] = useState<string>(courseIconNames[0]);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [term, setTerm] = useState(getCurrentTerm);
  const [midExamDate, setMidExamDate] = useState<string | null>(null);
  const [finalExamDate, setFinalExamDate] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<CourseVisibility>('private');

  // 처음 아이콘은 랜덤이다(P-COURSE-01). 서버 렌더링과 맞추려고 화면이 뜬 뒤에 고른다.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIcon(courseIconNames[Math.floor(Math.random() * courseIconNames.length)]);
  }, []);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/classroom');
  };

  const submit = () => {
    createCourse(
      {
        name: name.trim(),
        icon,
        intro: intro.trim() || null,
        term: term.trim(),
        visibility,
        midExamDate,
        finalExamDate,
      },
      ({ code }) =>
        router.replace({
          pathname: '/classroom/created',
          params: { name: name.trim(), icon, code },
        }),
    );
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
        <AppBar
          title="과목 만들기"
          leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }}
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.keyboard}
          contentContainerStyle={styles.content}>
          <View style={styles.field}>
            <Text style={styles.label}>아이콘</Text>
            <View style={styles.iconRow}>
              <CourseIcon icon={icon} size={64} raised />
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
            label="과목명"
            value={name}
            maxLength={NAME_MAX_LENGTH}
            onChangeText={setName}
          />
          <FormField
            label="한 줄 소개 (선택)"
            value={intro}
            maxLength={INTRO_MAX_LENGTH}
            placeholder="예: 3-2 전공필수 · 월수 2교시"
            hint="강의실 타일에 과목명 아래 한 줄로 보여요."
            onChangeText={setIntro}
          />
          <FormField
            label="학기"
            value={term}
            maxLength={TERM_MAX_LENGTH}
            onChangeText={setTerm}
          />
          <View style={styles.field}>
            <Text style={styles.label}>시험일 (선택)</Text>
            <View style={styles.dates}>
              <DateField label="중간" value={midExamDate} onChange={setMidExamDate} />
              <DateField label="기말" value={finalExamDate} onChange={setFinalExamDate} />
            </View>
            <Text style={styles.hint}>
              시험일이 지나면 Bit 출제 범위가 다음 폴더로 넘어가요. 나중에 환경설정에서 바꿀 수 있어요.
            </Text>
          </View>
          <FormField label="공개 여부" hint={visibilityHints[visibility]}>
            <SegmentedControl
              options={visibilityOptions}
              value={visibility}
              onChange={setVisibility}
            />
          </FormField>
          <View style={styles.spacer} />
          <Button
            label="과목 만들기"
            disabled={!name.trim() || !term.trim() || isPending}
            onPress={submit}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    gap: 18,
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
