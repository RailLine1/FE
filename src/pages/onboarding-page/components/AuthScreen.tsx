import { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { AppBar } from '@/components/AppBar';
import { Screen } from '@/components/Screen';

type AuthScreenProps = {
  children: ReactNode;
  onBack?: () => void;
  contentStyle?: StyleProp<ViewStyle>;
};

// 온보딩 화면의 공통 틀. 작은 화면과 키보드가 올라온 상태에서는 스크롤된다.
export function AuthScreen({ children, onBack, contentStyle }: AuthScreenProps) {
  return (
    <Screen>
      {onBack && (
        <AppBar
          borderless
          leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: onBack }}
        />
      )}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          style={styles.flex}
          contentContainerStyle={[styles.content, contentStyle]}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
