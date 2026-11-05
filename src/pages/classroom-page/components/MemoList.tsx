import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/Badge';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { Memo } from '../courseTypes';

type MemoListProps = {
  memos: Memo[];
  canDeleteAll: boolean;
  onEdit: (memo: Memo) => void;
  onDelete: (memo: Memo) => void;
};

// 작성자는 표시하지 않고 내용만 보여준다(P-ARC-03).
export function MemoList({ memos, canDeleteAll, onEdit, onDelete }: MemoListProps) {
  return (
    <View>
      {memos.map((memo, index) => {
        const canDelete = memo.mine || canDeleteAll;

        return (
          <View
            key={memo.memoId}
            style={[styles.memo, index < memos.length - 1 && styles.divider]}>
            <Text style={styles.body}>{memo.body}</Text>
            {canDelete && (
              <View style={styles.actions}>
                {memo.mine && <Badge label="내 메모" variant="subscribed" />}
                {memo.mine && (
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onEdit(memo)}
                    style={styles.action}>
                    <Text style={styles.edit}>수정</Text>
                  </Pressable>
                )}
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onDelete(memo)}
                  style={styles.action}>
                  <Text style={styles.delete}>삭제</Text>
                </Pressable>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  memo: {
    gap: 4,
    paddingVertical: 10,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: Palette.line,
  },
  body: {
    ...Fonts.regular,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.text,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  action: {
    padding: 4,
  },
  edit: {
    ...Fonts.bold,
    fontSize: 13,
    color: Palette.textSub,
  },
  delete: {
    ...Fonts.bold,
    fontSize: 13,
    color: Palette.red,
  },
});
