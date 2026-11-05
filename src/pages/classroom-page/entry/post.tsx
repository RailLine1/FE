import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';

import { AppBar } from '@/components/AppBar';
import { BottomSheet } from '@/components/BottomSheet';
import { Button } from '@/components/Button';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { SectionLabel } from '@/components/SectionLabel';

import { MemoComposer } from '../components/MemoComposer';
import { MemoList } from '../components/MemoList';
import { PostSlides } from '../components/PostSlides';
import { Memo } from '../courseTypes';
import { useArchivePosts } from '../hooks/useArchivePosts';
import { useBitMemos } from '../hooks/useBitMemos';
import { useCourseDetail } from '../hooks/useCourseDetail';
import { useMemoActions } from '../hooks/useMemoActions';

export default function PostPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ courseId: string; bitId: string; page?: string }>();
  const courseId = Number(params.courseId);
  const bitId = Number(params.bitId);

  // 게시글 한 건을 조회하는 API가 없어 목록 응답에서 찾는다.
  const archive = useArchivePosts(courseId, Number(params.page) || 1);
  const post = archive.data?.items?.find((item) => item.bitId === bitId);
  const { data: memos } = useBitMemos(bitId);
  const { data: course } = useCourseDetail(courseId);
  const { addMemo, editMemo, deleteMemo } = useMemoActions(bitId);
  const [editing, setEditing] = useState<Memo | null>(null);
  const [deleting, setDeleting] = useState<Memo | null>(null);

  // 관리자와 공동 관리자는 모든 메모를 삭제할 수 있다(P-ARC-04).
  const canDeleteAll = course?.role === 'admin' || course?.role === 'co';

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else
      router.replace({
        pathname: '/classroom/[courseId]/archive',
        params: { courseId: params.courseId },
      });
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior="padding" style={styles.keyboard}>
        <AppBar
          title={post ? `#${post.no}` : undefined}
          leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: goBack }}
        />
        <QueryStatus
          isLoading={archive.isLoading}
          isError={archive.isError || (Boolean(archive.data) && !post)}
          errorMessage="기록을 찾을 수 없어요."
        />
        {post && (
          <>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={styles.scroll}
              contentContainerStyle={styles.content}>
              <PostSlides post={post} initialSlide={1} />
              <SectionLabel>{`메모 ${memos?.length ?? 0}`}</SectionLabel>
              {memos && (
                <MemoList
                  memos={memos}
                  canDeleteAll={canDeleteAll}
                  onEdit={setEditing}
                  onDelete={setDeleting}
                />
              )}
            </ScrollView>
            <MemoComposer
              key={editing?.memoId ?? 'new'}
              editing={editing}
              onCancelEdit={() => setEditing(null)}
              onSubmit={(body) => {
                if (editing) {
                  editMemo(editing.memoId, body);
                  setEditing(null);
                } else {
                  addMemo(body);
                }
              }}
            />
          </>
        )}
      </KeyboardAvoidingView>
      <BottomSheet
        visible={Boolean(deleting)}
        title="메모를 삭제할까요?"
        description="삭제한 메모는 되돌릴 수 없어요."
        onClose={() => setDeleting(null)}>
        <View style={styles.sheetActions}>
          <Button
            label="삭제"
            variant="danger"
            onPress={() => {
              if (deleting) {
                deleteMemo(deleting.memoId);
                if (editing?.memoId === deleting.memoId) setEditing(null);
              }
              setDeleting(null);
            }}
          />
          <Button label="취소" variant="text" onPress={() => setDeleting(null)} />
        </View>
      </BottomSheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  sheetActions: {
    gap: 12,
  },
  content: {
    gap: 10,
    paddingTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});
