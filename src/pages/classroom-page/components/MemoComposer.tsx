import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Palette } from '@/styles/palette';

import { Memo } from '../courseTypes';

const BODY_MAX_LENGTH = 500;

type MemoComposerProps = {
  // 수정할 메모. 고를 때마다 key로 새로 만들어 입력값을 맞춘다.
  editing: Memo | null;
  onSubmit: (body: string) => void;
  onCancelEdit: () => void;
};

export function MemoComposer({ editing, onSubmit, onCancelEdit }: MemoComposerProps) {
  const [body, setBody] = useState(editing?.body ?? '');

  return (
    <View style={styles.composer}>
      <Input
        autoFocus={Boolean(editing)}
        value={body}
        maxLength={BODY_MAX_LENGTH}
        placeholder="메모 남기기"
        accessibilityLabel="메모"
        onChangeText={setBody}
        style={styles.input}
      />
      {editing && <Button label="취소" variant="text" size="small" onPress={onCancelEdit} style={styles.button} />}
      <Button
        label={editing ? '저장' : '등록'}
        size="small"
        disabled={!body.trim()}
        onPress={() => {
          onSubmit(body.trim());
          setBody('');
        }}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopWidth: 2,
    borderTopColor: Palette.line,
    backgroundColor: Palette.surface,
  },
  input: {
    flex: 1,
  },
  button: {
    alignSelf: 'center',
  },
});
