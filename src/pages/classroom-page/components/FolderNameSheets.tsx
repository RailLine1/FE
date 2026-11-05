import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { FormField } from '@/components/FormField';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { CourseFolder } from '../courseTypes';

const NAME_MAX_LENGTH = 30;

type NewFolderSheetProps = {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
};

export function NewFolderSheet({ visible, onClose, onCreate }: NewFolderSheetProps) {
  const [name, setName] = useState('');

  const close = () => {
    setName('');
    onClose();
  };

  return (
    <BottomSheet visible={visible} title="새 폴더" onClose={close}>
      <View style={styles.body}>
        <FormField
          autoFocus
          label="폴더 이름"
          value={name}
          maxLength={NAME_MAX_LENGTH}
          onChangeText={setName}
        />
        <View style={styles.actions}>
          <Button
            label="만들기"
            disabled={!name.trim()}
            onPress={() => {
              onCreate(name.trim());
              close();
            }}
          />
          <Button label="취소" variant="text" onPress={close} />
        </View>
      </View>
    </BottomSheet>
  );
}

type EditFolderSheetProps = {
  folder: CourseFolder;
  onClose: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
};

// 폴더를 고를 때마다 key로 새로 만들어 입력값을 초기화한다.
export function EditFolderSheet({ folder, onClose, onRename, onDelete }: EditFolderSheetProps) {
  const [name, setName] = useState(folder.name);

  return (
    <BottomSheet visible title={folder.name} onClose={onClose}>
      <View style={styles.body}>
        <FormField
          label="폴더 이름"
          value={name}
          maxLength={NAME_MAX_LENGTH}
          onChangeText={setName}
        />
        <Button
          label="이름 저장"
          disabled={!name.trim()}
          onPress={() => {
            onRename(name.trim());
            onClose();
          }}
        />
        <View style={styles.divider} />
        <View style={styles.deleteInfo}>
          <Text style={styles.deleteTitle}>폴더 삭제</Text>
          <Text style={styles.deleteDescription}>삭제한 폴더는 되돌릴 수 없어요.</Text>
        </View>
        <Button
          label="폴더 삭제"
          variant="danger"
          onPress={() => {
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
  actions: {
    gap: 12,
    marginTop: 4,
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
    lineHeight: 19.5,
    color: Palette.textSub,
  },
});
