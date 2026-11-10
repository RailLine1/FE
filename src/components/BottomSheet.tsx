import { ReactNode } from 'react';
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
};

export function BottomSheet({ visible, onClose, title, description, children }: BottomSheetProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <Modal
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}>
      <KeyboardAvoidingView behavior="padding" style={styles.scrim}>
        <Pressable accessibilityLabel="닫기" onPress={onClose} style={styles.dismiss} />
        <View style={[styles.sheet, { paddingBottom: 28 + bottom }]}>
          <View style={styles.handle} />
          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
          {children}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: Palette.scrim,
  },
  dismiss: {
    flex: 1,
  },
  sheet: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 480,
    paddingTop: 12,
    paddingHorizontal: 16,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: Palette.sheet,
    boxShadow: '0 -8px 24px rgba(0, 0, 0, 0.12)',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    marginBottom: 12,
    borderRadius: 3,
    backgroundColor: Palette.line,
  },
  title: {
    ...Fonts.extraBold,
    marginBottom: 4,
    fontSize: 20,
    color: Palette.text,
  },
  description: {
    ...Fonts.regular,
    marginBottom: 16,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
});
