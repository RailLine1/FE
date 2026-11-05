import { ComponentProps, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Input } from '@/components/Input';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type FormFieldProps = Omit<ComponentProps<typeof Input>, 'error' | 'children'> & {
  label: string;
  hint?: string;
  error?: string;
  // 입력 칸 대신 세그먼트 등 다른 입력 컴포넌트를 넣을 때 쓴다.
  children?: ReactNode;
};

export function FormField({ label, hint, error, children, ...inputProps }: FormFieldProps) {
  const message = error ?? hint;

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children ?? <Input accessibilityLabel={label} error={Boolean(error)} {...inputProps} />}
      {message && <Text style={[styles.hint, error && styles.error]}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    ...Fonts.bold,
    fontSize: 13,
    color: Palette.text,
  },
  hint: {
    ...Fonts.semiBold,
    fontSize: 12,
    color: Palette.textSub,
  },
  error: {
    color: Palette.red,
  },
});
