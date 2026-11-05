import { useLocalSearchParams, useRouter } from 'expo-router';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';

import { ManagerSettings } from '../components/ManagerSettings';
import { MemberSettings } from '../components/MemberSettings';
import { useCourseSettings } from '../hooks/useCourseSettings';

export default function SettingsPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId: string }>();
  const courseId = Number(params.courseId);
  const { data: settings, isLoading, isError } = useCourseSettings(courseId);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/classroom/[courseId]', params: { courseId: params.courseId } });
  };

  return (
    <Screen>
      <AppBar
        title="환경설정"
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }}
      />
      <QueryStatus isLoading={isLoading} isError={isError} errorMessage="과목을 찾을 수 없어요." />
      <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
        {settings?.role === 'member' && <MemberSettings courseId={courseId} settings={settings} />}
        {settings && settings.role !== 'member' && (
          <ManagerSettings courseId={courseId} settings={settings} onSaved={goBack} />
        )}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
});
