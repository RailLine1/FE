import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useToday } from '@/api/7-bit/7-bit';
import type { BitTicket } from '@/api/model';
import { Button } from '@/components/Button';
import { Mascot, MascotEmpty } from '@/components/Mascot';
import { CourseIcon } from '@/components/CourseIcon';
import { Icon } from '@/components/Icon';
import { QueryStatus } from '@/components/QueryStatus';
import { Screen } from '@/components/Screen';
import { TabBar } from '@/components/TabBar';
import { Fonts } from '@/styles/font';
import { Palette } from '@/styles/palette';

import { formatSeconds } from '../bitFormat';

// P-BIT-07. 안 푼 티켓이 위에 오도록 BE가 정렬해 준다.
export default function BitPage() {
  const router = useRouter();
  const { data: tickets, isLoading, isError } = useToday();

  const openTicket = ({ bitId, courseId, courseName, status }: BitTicket) => {
    const params = {
      bitId: String(bitId),
      courseId: String(courseId),
      courseName: courseName ?? '',
    };
    router.push(
      status === 'done'
        ? { pathname: '/bit/[bitId]/result', params }
        : { pathname: '/bit/[bitId]/quiz', params },
    );
  };

  return (
    <Screen hasTabBar>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>
          Bit
        </Text>
        <Text style={styles.subtitle}>과목마다 하루 한 조각 · 매일 17:00</Text>
        {tickets && tickets.length > 0 && (
          <View style={styles.byte}>
            {tickets.some((ticket) => ticket.status !== 'done') ? (
              <Mascot pose="byte" says="오늘의 조각을 물어 왔어요. 한 입에 풀어 봐요!" />
            ) : (
              <Mascot pose="kilo" says="오늘 조각은 다 풀었어요. 내일 17시에 또 만나요!" />
            )}
          </View>
        )}

        <QueryStatus isLoading={isLoading} isError={isError} />
        {tickets?.length === 0 && (
          <MascotEmpty
            pose="kilo"
            title="오늘 열린 조각이 없어요"
            hint="구독한 과목에 문제가 준비되면 17시에 물어 올게요"
          />
        )}

        <View style={styles.tickets}>
          {tickets?.map((ticket) => {
            const done = ticket.status === 'done';
            return (
              <Pressable
                key={ticket.bitId}
                // 안 푼 티켓은 안쪽 [풀기]가 버튼 역할을 한다. 웹에서 버튼은 중첩할 수 없다.
                accessibilityRole={done ? 'button' : undefined}
                onPress={() => openTicket(ticket)}
                style={[styles.ticket, done ? styles.doneTicket : styles.openTicket]}>
                <View style={styles.ticketTop}>
                  {done ? (
                    <View style={styles.doneGlyph}>
                      <Icon name="check-purple-20" color={Palette.green} />
                    </View>
                  ) : (
                    <CourseIcon icon={ticket.icon ?? ''} size={36} raised />
                  )}
                  <View style={styles.ticketText}>
                    <Text numberOfLines={1} style={styles.courseName}>
                      {ticket.courseName}
                    </Text>
                    {ticket.intro && (
                      <Text numberOfLines={1} style={styles.intro}>
                        {ticket.intro}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={[styles.ticketBottom, done && styles.doneBottom]}>
                  <Text style={styles.streak}>{`${ticket.streak ?? 0}일`}</Text>
                  {done ? (
                    <Text style={styles.doneLabel}>
                      {`${formatSeconds(ticket.elapsedSec ?? 0)} 완료 ›`}
                    </Text>
                  ) : (
                    <>
                      <View style={styles.week}>
                        {ticket.week?.map((solved, index) => (
                          <View
                            key={index}
                            style={[styles.weekBit, solved ? styles.solvedBit : styles.emptyBit]}
                          />
                        ))}
                      </View>
                      <Button
                        label="풀기"
                        size="small"
                        onPress={() => openTicket(ticket)}
                        style={styles.solve}
                      />
                    </>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
      <TabBar selected="bit" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    paddingTop: 28,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    ...Fonts.black,
    fontSize: 32,
    lineHeight: 48,
    letterSpacing: -0.8,
    color: Palette.text,
  },
  subtitle: {
    ...Fonts.regular,
    marginTop: 4,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.textSub,
  },
  byte: {
    marginTop: 20,
  },
  tickets: {
    gap: 14,
    marginTop: 20,
  },
  ticket: {
    paddingHorizontal: 16,
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: Palette.surface,
  },
  openTicket: {
    borderColor: Palette.purple,
    boxShadow: `0 4px 0 ${Palette.purpleShadow}`,
  },
  doneTicket: {
    borderColor: Palette.line,
    backgroundColor: Palette.surfaceMuted,
  },
  ticketTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    height: 70,
  },
  doneGlyph: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Palette.greenTint,
  },
  ticketText: {
    flex: 1,
    minWidth: 0,
  },
  courseName: {
    ...Fonts.bold,
    fontSize: 16,
    lineHeight: 24,
    color: Palette.text,
  },
  intro: {
    ...Fonts.regular,
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSub,
  },
  divider: {
    height: 2,
    backgroundColor: Palette.line,
  },
  ticketBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 62,
  },
  doneBottom: {
    justifyContent: 'space-between',
    height: 48,
  },
  streak: {
    ...Fonts.bold,
    fontSize: 15,
    lineHeight: 22.5,
    color: Palette.text,
  },
  week: {
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
  weekBit: {
    width: 12,
    height: 12,
    borderRadius: 4,
  },
  solvedBit: {
    backgroundColor: Palette.purple,
    boxShadow: `0 2px 0 ${Palette.purpleShadow}`,
  },
  emptyBit: {
    backgroundColor: Palette.line,
    boxShadow: `0 2px 0 ${Palette.lineStrong}`,
  },
  solve: {
    alignSelf: 'center',
  },
  doneLabel: {
    ...Fonts.bold,
    fontSize: 13,
    lineHeight: 19.5,
    color: Palette.textSub,
  },
});
