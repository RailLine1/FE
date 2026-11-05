import { useState } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { Icon } from '@/components/Icon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type InputProps = Omit<TextInputProps, 'style'> & {
  search?: boolean;
  error?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Input({ search, error, readOnly, value, style, onFocus, onBlur, ...props }: InputProps) {
  // autoFocus는 이벤트 연결 전에 포커스가 잡혀 onFocus가 오지 않는다.
  const [focused, setFocused] = useState(Boolean(props.autoFocus));

  return (
    <View
      style={[
        styles.box,
        readOnly && styles.readOnly,
        focused && !readOnly && styles.focused,
        error && styles.error,
        style,
      ]}>
      {search && <Icon name="search-gray-20" />}
      <TextInput
        {...props}
        value={value}
        readOnly={readOnly}
        placeholderTextColor={Palette.textMuted}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.field,
          value ? Fonts.semiBold : Fonts.medium,
          !search && !readOnly && styles.fieldOffset,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
  },
  focused: {
    borderColor: Palette.blue,
  },
  error: {
    borderColor: Palette.red,
  },
  readOnly: {
    backgroundColor: Palette.surfaceMuted,
  },
  field: {
    flex: 1,
    minWidth: 0,
    padding: 0,
    fontSize: 15,
    color: Palette.text,
  },
  // Figma 시안에서 일반 입력 칸의 글자는 가운데보다 2px 아래에 있다.
  fieldOffset: {
    marginTop: 4,
  },
});
