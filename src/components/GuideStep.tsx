import { ReactNode } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/Button';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

// 등록 가이드(커넥터, 예약 작업)의 번호 단계. 복사할 값은 단계 안에 CopyBox로 둔다.
export function GuideStep({
  number,
  text,
  children,
}: {
  number: number;
  text: string;
  children?: ReactNode;
}) {
  return (
    <View style={styles.step}>
      <View style={styles.number}>
        <Text style={styles.numberLabel}>{number}</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.text}>{text}</Text>
        {children}
      </View>
    </View>
  );
}

export function CopyBox({
  value,
  placeholder,
  copied,
  onCopy,
}: {
  value: string;
  placeholder?: boolean;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <View style={styles.copyBox}>
      <Text selectable style={[styles.copyText, placeholder && styles.copyPlaceholder]}>
        {value}
      </Text>
      <Button
        label={copied ? '복사됨' : '복사'}
        variant="secondary"
        size="small"
        disabled={placeholder}
        onPress={onCopy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    flexDirection: 'row',
    gap: 10,
  },
  number: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
    borderRadius: 7,
    backgroundColor: Palette.surfaceMuted,
  },
  numberLabel: {
    ...Fonts.bold,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  body: {
    flex: 1,
    gap: 8,
  },
  text: {
    ...Fonts.regular,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.text,
  },
  copyBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  copyText: {
    flex: 1,
    minWidth: 0,
    // 주소 · 명령에는 띄어쓰기가 없어 웹에서 줄이 안 바뀌고 버튼을 밀어낸다.
    ...(Platform.OS === 'web' ? ({ wordBreak: 'break-all' } as object) : null),
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 18,
    color: Palette.text,
  },
  copyPlaceholder: {
    color: Palette.textSub,
  },
});
