import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { IconBox } from '@/components/IconBox';
import { IconButton } from '@/components/IconButton';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { PickedFile } from '../hooks/useUploadFile';

function formatSize(size?: number) {
  if (!size) return '';
  const megabytes = size / (1024 * 1024);
  return megabytes >= 1 ? `${megabytes.toFixed(1)}MB` : `${Math.max(1, Math.round(size / 1024))}KB`;
}

type FilePickerProps = {
  picked: PickedFile | null;
  onPick: () => void;
  onRemove: () => void;
};

export function FilePicker({ picked, onPick, onRemove }: FilePickerProps) {
  if (picked) {
    return (
      <View style={styles.picked}>
        <IconBox>
          <Icon name="document-20" color={Palette.white} />
        </IconBox>
        <View style={styles.pickedText}>
          <Text numberOfLines={1} style={styles.fileName}>
            {picked.name}
          </Text>
          <Text style={styles.fileSize}>{formatSize(picked.size)}</Text>
        </View>
        <IconButton compact icon="close" accessibilityLabel="파일 빼기" onPress={onRemove} />
      </View>
    );
  }

  return (
    <Pressable accessibilityRole="button" onPress={onPick} style={styles.empty}>
      <IconBox size={48} tone="soft">
        <Icon name="upload-26" color={Palette.purpleStrong} />
      </IconBox>
      <Text style={styles.emptyTitle}>PDF 파일 선택</Text>
      <Text style={styles.emptyDescription}>노트북·태블릿·휴대폰 어디서든 올릴 수 있어요</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: 'center',
    gap: 6,
    padding: 28,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    borderColor: Palette.line,
  },
  emptyTitle: {
    ...Fonts.bold,
    fontSize: 15,
    color: Palette.text,
  },
  emptyDescription: {
    ...Fonts.regular,
    fontSize: 12,
    color: Palette.textSub,
    textAlign: 'center',
  },
  picked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.purple,
    backgroundColor: Palette.purpleTint,
  },
  pickedText: {
    flex: 1,
    minWidth: 0,
  },
  fileName: {
    ...Fonts.bold,
    fontSize: 15,
    color: Palette.text,
  },
  fileSize: {
    ...Fonts.regular,
    fontSize: 12,
    color: Palette.textSub,
  },
});
