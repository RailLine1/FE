import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { FormField } from '@/components/FormField';
import { Input } from '@/components/Input';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { FilePicker, PickedItem } from '../components/FilePicker';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useCourseFolders } from '../hooks/useCourseFolders';
import { useUploadFiles } from '../hooks/useUploadFiles';

const TITLE_MAX_LENGTH = 80;

export default function UploadPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId: string; folderId: string }>();
  const courseId = Number(params.courseId);
  const folderId = Number(params.folderId);

  const { data: course } = useCourseDetail(courseId);
  // 업로드는 관리자와 공동 관리자만 할 수 있다(권한표).
  const canUpload = course?.role === 'admin' || course?.role === 'co';
  const { data: folders } = useCourseFolders(courseId, canUpload);
  const folder = folders?.find((item) => item.folderId === folderId);
  const { uploadFiles, isPending } = useUploadFiles(folderId);

  const [title, setTitle] = useState('');
  const [items, setItems] = useState<PickedItem[]>([]);
  const [consent, setConsent] = useState(false);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else
      router.replace({
        pathname: '/classroom/[courseId]/folder/[folderId]',
        params: { courseId: params.courseId, folderId: params.folderId },
      });
  };

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: true,
    });
    if (result.canceled) return;

    // 같은 파일을 다시 골라도 한 번만 올린다.
    const isNew = (asset: DocumentPicker.DocumentPickerAsset) =>
      !items.some(({ id }) => id === `${asset.name}-${asset.size}`);
    const added = result.assets
      .filter(isNew)
      .map((picked) => ({ id: `${picked.name}-${picked.size}`, picked }));
    setItems([...items, ...added]);
  };

  // 자료 이름은 파일이 1개일 때만 정할 수 있다. 여러 개면 파일 이름으로 저장한다.
  const isMultiple = items.length > 1;

  const submit = async () => {
    await uploadFiles(
      items.map(({ id, picked }) => ({ id, picked, title: isMultiple ? '' : title.trim() })),
    );
    goBack();
  };

  return (
    <Screen>
      <AppBar
        title="강의자료 업로드"
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }}
      />
      <QueryStatus
        isLoading={false}
        isError={Boolean(course) && !folder}
        errorMessage="자료를 올릴 수 없는 폴더예요."
      />
      {folder && (
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.scroll}
          contentContainerStyle={styles.content}>
          <FormField label="폴더">
            <Input readOnly value={folder.name} accessibilityLabel="폴더" />
          </FormField>
          {!isMultiple && (
            <FormField
              label="자료 이름"
              value={title}
              maxLength={TITLE_MAX_LENGTH}
              onChangeText={setTitle}
            />
          )}
          <FilePicker
            items={items}
            disabled={isPending}
            onPick={pickFile}
            onRemove={(id) => setItems(items.filter((item) => item.id !== id))}
          />
          <Checkbox
            label="본인이 수강 중인 과목 자료이며, 수강생끼리만 사용하는 데 동의해요."
            checked={consent}
            onValueChange={setConsent}
          />
          <Text style={styles.note}>
            {isMultiple && '여러 파일은 파일 이름으로 저장돼요. '}처리가 끝나면 구독자의 AI가 참고
            가능해요.
          </Text>
          <View style={styles.spacer} />
          <Button
            label="업로드"
            disabled={items.length === 0 || !consent || isPending}
            onPress={submit}
          />
        </ScrollView>
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
    padding: 16,
  },
  note: {
    ...Fonts.regular,
    fontSize: 12,
    color: Palette.textSub,
  },
  spacer: {
    flexGrow: 1,
  },
});
