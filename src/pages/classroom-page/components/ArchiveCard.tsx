import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Icon } from '@/components/Icon';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { ArchivePost } from '../courseTypes';
import { formatRelativeDate } from '../formatRelativeDate';
import { PostSlides } from './PostSlides';

type ArchiveCardProps = {
  post: ArchivePost;
  last: boolean;
  onOpen: () => void;
};

export function ArchiveCard({ post, last, onOpen }: ArchiveCardProps) {
  return (
    <View style={[styles.card, !last && styles.divider]}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLabel}>D</Text>
        </View>
        <View style={styles.headerText}>
          <Text style={styles.author}>Daybit 퀴즈 · 자동 게시</Text>
          <Text style={styles.meta}>{`#${post.no} · ${formatRelativeDate(post.archivedAt)}`}</Text>
        </View>
      </View>
      <PostSlides post={post} onPress={onOpen} />
      <Pressable accessibilityRole="link" onPress={onOpen} style={styles.memo}>
        <Icon name="memo-18" />
        <Text style={styles.memoLabel}>{`메모 ${post.memoCount}`}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: 10,
    paddingVertical: 14,
  },
  divider: {
    borderBottomWidth: 2,
    borderBottomColor: Palette.line,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.purple,
  },
  avatarLabel: {
    ...Fonts.extraBold,
    fontSize: 14,
    color: Palette.white,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  author: {
    ...Fonts.bold,
    fontSize: 14,
    color: Palette.text,
  },
  meta: {
    ...Fonts.regular,
    fontSize: 12,
    color: Palette.textSub,
  },
  memo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
  },
  memoLabel: {
    ...Fonts.bold,
    fontSize: 13,
    color: Palette.textSub,
  },
});
