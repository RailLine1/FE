import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseFile } from '../courseTypes';
import { getFileTitle } from './FileRow';

// PATCH /files/{fileId}의 title 상한과 같다.
const TITLE_MAX_LENGTH = 80;

type EditFileSheetProps = {
  file: CourseFile;
  onClose: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
};

// 폴더 편집 시트와 같은 모양. 자료를 고를 때마다 key로 새로 만들어 입력값을 초기화한다.
export function EditFileSheet({ file, onClose, onRename, onDelete }: EditFileSheetProps) {
  const [title, setTitle] = useState(file.title);
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <BottomSheet visible title={getFileTitle(file)} onClose={onClose}>
      <View style={styles.body}>
        <FormField
          label="자료 이름"
          value={title}
          maxLength={TITLE_MAX_LENGTH}
          onChangeText={setTitle}
        />
        <Button
          label="이름 저장"
          disabled={!title.trim() || title.trim() === file.title}
          onPress={() => {
            onRename(title.trim());
            onClose();
          }}
        />
        <View style={styles.divider} />
        <View style={styles.deleteInfo}>
          <Text style={styles.deleteTitle}>자료 삭제</Text>
          <Text style={styles.deleteDescription}>삭제한 자료는 되돌릴 수 없어요.</Text>
        </View>
        <Button
          label={confirmDelete ? '한 번 더 누르면 삭제돼요' : '자료 삭제'}
          variant="danger"
          onPress={() => {
            if (!confirmDelete) return setConfirmDelete(true);
            onDelete();
            onClose();
          }}
        />
        <Button label="취소" variant="text" onPress={onClose} />
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: 14,
    marginTop: 10,
  },
  divider: {
    height: 2,
    backgroundColor: Palette.line,
  },
  deleteInfo: {
    gap: 4,
  },
  deleteTitle: {
    ...Fonts.bold,
    fontSize: 15,
    color: Palette.text,
  },
  deleteDescription: {
    ...Fonts.regular,
    fontSize: 13,
    color: Palette.textSub,
  },
});
