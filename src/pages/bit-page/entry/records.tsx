import { useQueryClient } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useSubscription } from '@/api/3-과목/3-과목';
import { getRecordsQueryKey, useRecords, useTicket } from '@/api/7-bit/7-bit';
import type { RecordsDay } from '@/api/model';
import { AppBar } from '@/components/AppBar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { ListGroup } from '@/components/ListGroup';
import { ListRow } from '@/components/ListRow';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { SectionLabel } from '@/components/SectionLabel';
import { SegmentedControl } from '@/components/SegmentedControl';
import { Toggle } from '@/components/Toggle';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { circledNumber, evidenceText, formatSeconds, gridOpacity } from '../bitFormat';

const DAYS = [
  { value: 'today', label: '오늘' },
  { value: 'yesterday', label: '어제' },
] as const;

// P-BIT-12
export default function RecordsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useLocalSearchParams<{ bitId: string; courseId: string; courseName: string }>();
  const courseId = Number(params.courseId);
  const [day, setDay] = useState<RecordsDay>('today');

  const { data: ticket } = useTicket(Number(params.bitId));
  const { data: records, isLoading, isError } = useRecords(courseId, { day });
  const { mutate: updateNotify } = useSubscription();
  const [notifyOverride, setNotifyOverride] = useState<boolean>();
  const notify = notifyOverride ?? records?.notify ?? false;

  const changeNotify = (value: boolean) => {
    setNotifyOverride(value);
    updateNotify(
      { courseId, data: { notify: value } },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: getRecordsQueryKey(courseId, { day }) }),
        // 실패하면 서버 값으로 되돌린다.
        onError: () => setNotifyOverride(undefined),
      },
    );
  };

  const back = () => {
    if (router.canGoBack()) router.back();
    else router.replace({ pathname: '/bit/[bitId]/result', params });
  };

  const mine = records?.mine;
  const explanation = records?.explanation;
  const myChoice = explanation?.myChoice;
  const evidence = evidenceText(explanation?.evidence);

  return (
    <Screen>
      <AppBar
        title="오늘의 결과"
        leading={{ icon: 'back', accessibilityLabel: '뒤로', onPress: back }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.summary}>
          <View style={styles.summaryText}>
            <Text style={styles.summaryTitle}>
              {`${ticket?.courseName ?? params.courseName} #${ticket?.no ?? ''}`}
            </Text>
            {ticket && (
              <Text style={styles.summaryBody}>
                {`${ticket.correct ? '정답' : '오답'} · ${formatSeconds(ticket.elapsedSec)} · 오늘 평균 ${formatSeconds(ticket.averageSec)}`}
              </Text>
            )}
          </View>
          <Button
            label="결과"
            variant="secondary"
            size="small"
            onPress={() => router.navigate({ pathname: '/bit/[bitId]/result', params })}
            style={styles.resultButton}
          />
        </View>

        <SegmentedControl options={DAYS} value={day} onChange={setDay} />

        <QueryStatus isLoading={isLoading} isError={isError} />

        {records && (
          <>
            <SectionLabel>함께 듣는 사람</SectionLabel>
            {records.people?.length ? (
              <ListGroup>
                {records.people.map((person) => (
                  <ListRow
                    key={person.userId}
                    title={<Text style={styles.personName}>{person.nickname}</Text>}
                    highlighted={person.me}
                    onPress={
                      person.me
                        ? undefined
                        : () =>
                            router.push({
                              pathname: '/users/[userId]',
                              params: { userId: String(person.userId) },
                            })
                    }
                    trailing={
                      <View style={styles.personResult}>
                        <Text style={styles.personTime}>{formatSeconds(person.elapsedSec)}</Text>
                        <Badge
                          label={person.correct ? '정답' : '오답'}
                          variant={person.correct ? 'success' : 'danger'}
                        />
                      </View>
                    }
                  />
                ))}
              </ListGroup>
            ) : (
              <Text style={styles.empty}>
                {day === 'today' ? '아직 기록이 없어요.' : '어제 기록이 없어요.'}
              </Text>
            )}

            <SectionLabel>내 비트</SectionLabel>
            <View style={styles.myBit}>
              <View style={styles.myStats}>
                <View style={styles.stats}>
                  {[
                    { label: '연속', value: `${mine?.streak ?? 0}일` },
                    { label: '최장', value: `${mine?.best ?? 0}일` },
                    { label: '정답률', value: `${mine?.accuracy ?? 0}%` },
                  ].map(({ label, value }) => (
                    <View key={label} style={styles.stat}>
                      <Text style={styles.statValue}>{value}</Text>
                      <Text style={styles.statLabel}>{label}</Text>
                    </View>
                  ))}
                </View>
                {/* P-BIT-13. 한 열이 한 주이고 위에서 아래로 날짜가 이어진다. */}
                <View style={styles.grid}>
                  {mine?.grid?.map((count, index) => (
                    <View key={index} style={styles.gridCell}>
                      <View style={[styles.gridFill, { opacity: gridOpacity(count) }]} />
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.notify}>
                <Toggle title="이 과목 알림" value={notify} onValueChange={changeNotify} />
              </View>
            </View>

            {explanation && (
              <>
                <SectionLabel>해설</SectionLabel>
                <View style={styles.explanation}>
                  <View style={styles.answerRow}>
                    <Text style={styles.answer}>
                      {`정답 ${circledNumber(explanation.answer)} ${explanation.choices?.[explanation.answer ?? 0] ?? ''}`}
                    </Text>
                    {myChoice !== null && myChoice !== undefined && (
                      <Text
                        style={[
                          styles.myChoice,
                          myChoice !== explanation.answer && styles.wrongChoice,
                        ]}>
                        {`내 선택 ${circledNumber(myChoice)}`}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.explanationText}>{explanation.text}</Text>
                  {evidence !== '' && <Text style={styles.evidence}>{`근거 · ${evidence}`}</Text>}
                </View>
              </>
            )}
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: 10,
    paddingTop: 8,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 72,
    paddingHorizontal: 14,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.line,
  },
  summaryText: {
    flex: 1,
    minWidth: 0,
  },
  summaryTitle: {
    ...Fonts.bold,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.text,
  },
  summaryBody: {
    ...Fonts.regular,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  resultButton: {
    alignSelf: 'center',
  },
  personName: {
    ...Fonts.bold,
  },
  personResult: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  personTime: {
    ...Fonts.bold,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  empty: {
    ...Fonts.semiBold,
    paddingVertical: 16,
    fontSize: 13,
    textAlign: 'center',
    color: Palette.textSub,
  },
  myBit: {
    paddingTop: 12,
    paddingHorizontal: 14,
    paddingBottom: 2,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.line,
  },
  myStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...Fonts.bold,
    fontSize: 17,
    lineHeight: 25.5,
    color: Palette.text,
  },
  statLabel: {
    ...Fonts.bold,
    fontSize: 11,
    lineHeight: 16.5,
    color: Palette.textSub,
  },
  grid: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    gap: 3,
    width: 62,
    height: 88,
  },
  gridCell: {
    overflow: 'hidden',
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: Palette.line,
  },
  gridFill: {
    flex: 1,
    backgroundColor: Palette.purple,
  },
  notify: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: Palette.line,
  },
  explanation: {
    gap: 5,
    padding: 14,
    borderWidth: 2,
    borderRadius: 16,
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  answer: {
    ...Fonts.bold,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.text,
  },
  myChoice: {
    ...Fonts.bold,
    fontSize: 14,
    lineHeight: 21,
    color: Palette.green,
  },
  wrongChoice: {
    color: Palette.red,
  },
  explanationText: {
    ...Fonts.regular,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
  evidence: {
    ...Fonts.bold,
    marginTop: 1,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.purpleStrong,
  },
});
