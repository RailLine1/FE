import { ComponentRef, useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { ArchivePost } from '../courseTypes';

const circledNumbers = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧'];

const choiceLabel = (choices: string[], index: number) =>
  `${circledNumbers[index] ?? `${index + 1}.`} ${choices[index] ?? ''}`;

function formatSeconds(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function QuestionSlide({ post }: { post: ArchivePost }) {
  return (
    <View style={[styles.slide, styles.question]}>
      <Text style={[styles.label, styles.questionLabel]}>문제</Text>
      <Text style={styles.stem}>{post.stem}</Text>
      {post.choices.map((_, index) => (
        <Text key={index} style={styles.choice}>
          {choiceLabel(post.choices, index)}
        </Text>
      ))}
    </View>
  );
}

function AnswerSlide({ post }: { post: ArchivePost }) {
  const { attempts, accuracy, averageSec } = post.stats;
  const stats = [
    { value: `${attempts}명`, label: '응시' },
    { value: `${accuracy}%`, label: '정답률' },
    { value: formatSeconds(averageSec), label: '평균' },
  ];

  return (
    <View style={[styles.slide, styles.answer]}>
      <Text style={[styles.label, styles.answerLabel]}>정답</Text>
      <Text style={styles.answerChoice}>{choiceLabel(post.choices, post.answer)}</Text>
      <Text style={styles.explanation}>{post.explanation}</Text>
      <Text style={styles.evidence}>
        {`근거 · ${post.evidence.file} p.${post.evidence.page}`}
      </Text>
      <View style={styles.stats}>
        {stats.map(({ value, label }) => (
          <View key={label} style={styles.stat}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

type PostSlidesProps = {
  post: ArchivePost;
  // 0: 문제, 1: 정답
  initialSlide?: 0 | 1;
  onPress?: () => void;
};

// 정사각형 2장을 옆으로 넘겨 본다(P-ARC-02).
export function PostSlides({ post, initialSlide = 0, onPress }: PostSlidesProps) {
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [width, setWidth] = useState(0);
  const [current, setCurrent] = useState<number>(initialSlide);

  useEffect(() => {
    if (width && initialSlide) scrollRef.current?.scrollTo({ x: width, animated: false });
  }, [width, initialSlide]);

  return (
    <View style={styles.container}>
      <View
        onLayout={({ nativeEvent }) => setWidth(nativeEvent.layout.width)}
        style={[styles.viewport, !width && styles.placeholder]}>
        {width > 0 && (
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={({ nativeEvent }) =>
              setCurrent(Math.round(nativeEvent.contentOffset.x / width))
            }>
            {[QuestionSlide, AnswerSlide].map((Slide, index) => (
              <Pressable
                key={index}
                accessibilityRole={onPress ? 'link' : undefined}
                disabled={!onPress}
                onPress={onPress}
                style={{ width, minHeight: width }}>
                <Slide post={post} />
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
      <View style={styles.dots}>
        {[0, 1].map((index) => (
          <View key={index} style={[styles.dot, index === current && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  viewport: {
    width: '100%',
  },
  placeholder: {
    aspectRatio: 1,
  },
  slide: {
    flex: 1,
    padding: 18,
    borderRadius: 18,
  },
  question: {
    gap: 8,
    backgroundColor: Palette.purpleTint,
  },
  answer: {
    gap: 10,
    borderWidth: 2,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  label: {
    ...Fonts.extraBold,
    fontSize: 11,
    letterSpacing: 2,
  },
  questionLabel: {
    color: Palette.purpleStrong,
  },
  answerLabel: {
    color: Palette.green,
  },
  stem: {
    ...Fonts.extraBold,
    marginBottom: 6,
    fontSize: 16,
    lineHeight: 22.4,
    color: Palette.text,
  },
  choice: {
    ...Fonts.semiBold,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.line,
    backgroundColor: Palette.white,
    fontSize: 14,
    color: Palette.text,
  },
  answerChoice: {
    ...Fonts.extraBold,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: Palette.green,
    backgroundColor: Palette.greenTint,
    fontSize: 15,
    color: Palette.text,
  },
  explanation: {
    ...Fonts.regular,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  evidence: {
    ...Fonts.bold,
    fontSize: 12,
    color: Palette.purpleStrong,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 'auto',
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: Palette.line,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Fonts.black,
    fontSize: 16,
    color: Palette.text,
  },
  statLabel: {
    ...Fonts.bold,
    fontSize: 11,
    color: Palette.textSub,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Palette.line,
  },
  dotActive: {
    backgroundColor: Palette.purple,
  },
});
