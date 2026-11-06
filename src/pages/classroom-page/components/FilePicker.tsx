import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { IconBox } from '@/components/IconBox';
import { IconButton } from '@/components/IconButton';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { PickedFile } from '../hooks/useUploadFiles';

function formatSize(size?: number) {
  if (!size) return '';
  const megabytes = size / (1024 * 1024);
  return megabytes >= 1 ? `${megabytes.toFixed(1)}MB` : `${Math.max(1, Math.round(size / 1024))}KB`;
}

export type PickedItem = {
  id: string;
  picked: PickedFile;
  error?: string;
};

type FilePickerProps = {
  items: PickedItem[];
  disabled?: boolean;
  onPick: () => void;
  onRemove: (id: string) => void;
};

export function FilePicker({ items, disabled, onPick, onRemove }: FilePickerProps) {
  if (items.length > 0) {
    return (
      <View style={styles.list}>
        {items.map(({ id, picked, error }) => (
          <View key={id} style={[styles.picked, error ? styles.pickedError : undefined]}>
            <IconBox>
              <Icon name="document-20" color={Palette.white} />
            </IconBox>
            <View style={styles.pickedText}>
              <Text numberOfLines={1} style={styles.fileName}>
                {picked.name}
              </Text>
              {error ? (
                <Text style={styles.errorMessage}>{error}</Text>
              ) : (
                <Text style={styles.fileSize}>{formatSize(picked.size)}</Text>
              )}
            </View>
            <IconButton
              compact
              icon="close"
              accessibilityLabel={`${picked.name} 빼기`}
              onPress={() => onRemove(id)}
            />
          </View>
        ))}
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={onPick}
          style={styles.add}>
          <Text style={styles.addLabel}>PDF 파일 추가</Text>
        </Pressable>
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
  list: {
    gap: 8,
  },
  add: {
    alignItems: 'center',
    padding: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    borderColor: Palette.line,
  },
  addLabel: {
    ...Fonts.bold,
    fontSize: 14,
    color: Palette.purpleStrong,
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
  pickedError: {
    borderColor: Palette.red,
    backgroundColor: Palette.redTint,
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
  errorMessage: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.red,
  },
  fileSize: {
    ...Fonts.regular,
    fontSize: 12,
    color: Palette.textSub,
  },
});
