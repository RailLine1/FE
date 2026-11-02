import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

const states = {
  default: { border: Palette.line, shadow: Palette.line, background: Palette.white, number: Palette.textMuted },
  selected: { border: Palette.purple, shadow: Palette.purple, background: Palette.purpleTint, number: Palette.purpleStrong },
  correct: { border: Palette.green, shadow: Palette.greenShadow, background: Palette.greenTint, number: Palette.white },
  wrong: { border: Palette.red, shadow: Palette.redShadow, background: Palette.redTint, number: Palette.red },
};

type QuizChoiceProps = {
  number: number;
  label: string;
  state?: keyof typeof states;
  explanation?: string;
  onPress?: () => void;
};

export function QuizChoice({ number, label, state = 'default', explanation, onPress }: QuizChoiceProps) {
  const colors = states[state];
  const wrong = state === 'wrong';
  const correct = state === 'correct';

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.box,
        {
          borderColor: colors.border,
          backgroundColor: colors.background,
          boxShadow: `0 2px 0 ${colors.shadow}`,
        },
      ]}>
      <View style={styles.row}>
        <View
          style={[
            styles.numberBox,
            { borderColor: colors.border },
            correct && { backgroundColor: colors.border },
          ]}>
          <Text style={[styles.number, { color: colors.number }]}>{number}</Text>
        </View>
        <Text style={[styles.label, wrong && styles.labelWrong]}>{label}</Text>
        {correct && <Icon name="check-green-22" />}
        {wrong && <Icon name="close-red-22" />}
      </View>
      {explanation && <Text style={styles.explanation}>{explanation}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  numberBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderWidth: 2,
    borderRadius: 8,
  },
  number: {
    ...Fonts.extraBold,
    fontSize: 13,
    lineHeight: 19.5,
  },
  label: {
    ...Fonts.semiBold,
    flex: 1,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.text,
  },
  labelWrong: {
    color: Palette.textSub,
    textDecorationLine: 'line-through',
  },
  explanation: {
    ...Fonts.medium,
    marginTop: 16,
    paddingLeft: 40,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
});
