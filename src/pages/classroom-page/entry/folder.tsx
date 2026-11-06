import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { ListGroup } from '@/components/ListGroup';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { FileRow, getFileTitle } from '../components/FileRow';
import { CourseFile } from '../courseTypes';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useCourseFolders } from '../hooks/useCourseFolders';
import { useDeleteCourseFile } from '../hooks/useDeleteCourseFile';
import { useFolderFiles } from '../hooks/useFolderFiles';
import { useOpenFile } from '../hooks/useOpenFile';

export default function FolderPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId: string; folderId: string }>();
  const courseId = Number(params.courseId);
  const folderId = Number(params.folderId);

  const { data: course, isLoading: isCourseLoading } = useCourseDetail(courseId);
  const canManage = course?.role === 'admin' || course?.role === 'co';
  // 원본 열람이 꺼지면 멤버는 자료를 볼 수 없다(P-MAT-05).
  const canView = canManage || course?.rawAllowed === true;
  const { data: folders, isLoading: isFoldersLoading } = useCourseFolders(courseId, canView);
  const folder = folders?.find((item) => item.folderId === folderId);
  const {
    data: files,
    isLoading: isFilesLoading,
    isError,
  } = useFolderFiles(folderId, canView && Boolean(folder));
  const openFile = useOpenFile();
  const deleteFile = useDeleteCourseFile();
  const [deleting, setDeleting] = useState<CourseFile | null>(null);

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/classroom/[courseId]', params: { courseId: params.courseId } });
  };

  return (
    <Screen>
      <AppBar
        title={folder?.name}
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }}
        trailing={
          canManage && folder ? (
            <Button
              label="+ 자료"
              size="small"
              style={styles.addFile}
              onPress={() =>
                router.push({
                  pathname: '/classroom/[courseId]/folder/[folderId]/upload',
                  params: { courseId: params.courseId, folderId: params.folderId },
                })
              }
            />
          ) : undefined
        }
      />
      <QueryStatus
        isLoading={isCourseLoading || isFoldersLoading || isFilesLoading}
        isError={isError || (!isCourseLoading && !isFoldersLoading && !folder)}
        errorMessage="폴더를 찾을 수 없어요."
      />
      {course && files && folder && (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
          <Text style={styles.summary}>{`${course.name} · 자료 ${files.length}개`}</Text>
          {files.length > 0 && (
            <ListGroup>
              {files.map((file) => (
                <FileRow
                  key={file.fileId}
                  file={file}
                  canManage={canManage}
                  onOpen={() => openFile(file.fileId)}
                  onDelete={() => setDeleting(file)}
                />
              ))}
            </ListGroup>
          )}
          <Text style={styles.note}>
            {canManage
              ? [
                  '처리 중인 자료는 관리자에게만 보여요.',
                  folder.kind !== 'custom' && 'mid · final은 기본 폴더라 이름을 바꾸거나 지울 수 없어요.',
                ]
                  .filter(Boolean)
                  .join('\n')
              : '처리가 끝난 자료만 보여요. 누르면 PDF를 열어요.'}
          </Text>
        </ScrollView>
      )}
      <BottomSheet
        visible={Boolean(deleting)}
        title={deleting ? `${getFileTitle(deleting)}를 삭제할까요?` : undefined}
        description="삭제한 자료는 되돌릴 수 없어요."
        onClose={() => setDeleting(null)}>
        <View style={styles.sheetActions}>
          <Button
            label="삭제"
            variant="danger"
            onPress={() => {
              if (deleting) deleteFile(deleting.fileId);
              setDeleting(null);
            }}
          />
          <Button label="취소" variant="text" onPress={() => setDeleting(null)} />
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  addFile: {
    alignSelf: 'center',
    marginRight: 8,
  },
  scroll: {
    flex: 1,
  },
  content: {
    gap: 12,
    padding: 16,
  },
  summary: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.textSub,
  },
  sheetActions: {
    gap: 12,
  },
  note: {
    ...Fonts.semiBold,
    marginTop: 4,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
    textAlign: 'center',
  },
});
