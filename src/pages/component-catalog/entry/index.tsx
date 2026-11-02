import { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Avatar } from '@/components/Avatar';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Icon, IconName } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { Input } from '@/components/Input';
import { ListRow } from '@/components/ListRow';
import { QuizChoice } from '@/components/QuizChoice';
import { TabBar } from '@/components/TabBar';
import { TabItem } from '@/components/TabItem';
import { Toggle } from '@/components/Toggle';
import { Palette } from '@/styles/palette';

// Figma 문구의 줄바꿈까지 그대로 옮겨 시안과 바로 비교할 수 있게 한다.
const CONSENT = '본인이 수강 중인 과목 자료이며, 수강생끼리만 사\n용하는 데 동의해요.';

const figmaIcons: IconName[] = [
  'file-20',
  'check-purple-20',
  'chevron-down-14',
  'chevron-left-22',
  'check-white-16',
  'home-22',
  'search-gray-22',
  'profile-22',
  'file-14',
  'bit-22',
  'chevron-right-20',
  'close-22',
  'search-purple-22',
];

function Item({
  id,
  width,
  dark,
  children,
}: {
  id: string;
  width?: number;
  dark?: boolean;
  children: ReactNode;
}) {
  return (
    <View testID={id} style={[{ width }, dark && styles.dark]}>
      {children}
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      <View style={styles.items}>{children}</View>
    </View>
  );
}

// ponytail: Figma 비교와 개발 중 확인용 화면이라 배포본에서는 렌더링하지 않는다.
export default function ComponentCatalog() {
  if (!__DEV__) return null;

  return (
    <ScrollView style={styles.page} contentContainerStyle={styles.content}>
      <Section title="Button · 15">
        <Item id="button-primary" width={358}><Button label="제출" /></Item>
        <Item id="button-primary-wide-small" width={151}><Button label="개인 주소 복사" size="small" style={styles.fill} /></Item>
        <Item id="button-secondary-wide-small" width={153}><Button label="새로 발급" variant="secondary" size="small" style={styles.fill} /></Item>
        <Item id="button-primary-small"><Button label="풀기" size="small" /></Item>
        <Item id="button-secondary-small"><Button label="변경" variant="secondary" size="small" /></Item>
        <Item id="button-danger" width={358}><Button label="나가기" variant="danger" /></Item>
        <Item id="button-text" width={358}><Button label="취소" variant="text" /></Item>
        <Item id="button-danger-small"><Button label="거절" variant="dangerOutline" size="small" /></Item>
        <Item id="button-surface" width={358}><Button label="공유하기" variant="surface" /></Item>
        <Item id="button-text-emphasis" width={358} dark><Button label="순위 보기" variant="textInverse" /></Item>
        <Item id="button-text-small"><Button label="건너뛰기" variant="text" size="small" /></Item>
        <Item id="button-social" width={358}><Button label="GitHub으로 계속하기" variant="neutral" icon="github-20" /></Item>
        <Item id="button-disabled" width={358}><Button label="제출" disabled /></Item>
        <Item id="button-success" width={358}><Button label="계속" variant="success" /></Item>
        <Item id="button-pending" width={358}><Button label="대기 중" variant="secondary" disabled /></Item>
      </Section>

      <Section title="Input · 8">
        <Item id="input-default" width={175}><Input placeholder="날짜 선택" /></Item>
        <Item id="input-filled" width={175}><Input value="2026.10.22" /></Item>
        <Item id="input-hint" width={358}><Input placeholder="2~12자, 한글·영문·숫자" /></Item>
        <Item id="input-focus" width={358}><Input value="나" autoFocus /></Item>
        <Item id="input-readonly" width={358}><Input value="final" readOnly /></Item>
        <Item id="input-body" width={358}><Input value="lec09 파일 시스템" /></Item>
        <Item id="input-memo" width={358}><Input value="내가 만든 과목 · 스터디 공유용" /></Item>
        <Item id="input-search" width={358}><Input search placeholder="과목명 또는 과목 코드" /></Item>
      </Section>

      <Section title="Avatar · 3">
        <Item id="avatar-purple"><Avatar label="새" /></Item>
        <Item id="avatar-blue"><Avatar label="밤" color="blue" /></Item>
        <Item id="avatar-orange"><Avatar label="O" color="orange" /></Item>
      </Section>

      <Section title="Badge · 3">
        <Item id="badge-success"><Badge label="정답" variant="success" /></Item>
        <Item id="badge-pending"><Badge label="처리 중" variant="pending" /></Item>
        <Item id="badge-subscribed"><Badge label="구독 중" variant="subscribed" /></Item>
      </Section>

      <Section title="ListRow · 3">
        <Item id="listrow-info" width={322}><ListRow title="과목 코드" value="AL55PC" /></Item>
        <Item id="listrow-subscribed" width={322}><ListRow rank={1} title="자료구조" subtitle="알고조교 · 구독 58" badge="구독 중" /></Item>
        <Item id="listrow-default" width={322}><ListRow rank={2} title="확률과 통계" subtitle="관리자8 · 구독 55" /></Item>
      </Section>

      <Section title="QuizChoice · 5">
        <Item id="quiz-default" width={358}><QuizChoice number={1} label="FIFO (First-In First-Out)" /></Item>
        <Item id="quiz-selected" width={358}><QuizChoice number={2} label="LRU (Least Recently Used)" state="selected" /></Item>
        <Item id="quiz-correct" width={358}><QuizChoice number={2} label="LRU (Least Recently Used)" state="correct" /></Item>
        <Item id="quiz-wrong" width={358}><QuizChoice number={3} label="OPT (Optimal)" state="wrong" explanation={'OPT는 앞으로 가장 오래 사용되지 않을 페이지\n를 교체하는 이론적 기준이에요.'} /></Item>
        <Item id="quiz-trial" width={358}><QuizChoice number={1} label="FIFO (First-In First-Out)" /></Item>
      </Section>

      <Section title="Toggle · 3">
        <Item id="toggle-long" width={322}><Toggle title="원본 열람 허용" description={'끄면 멤버에게 학습자료가 보이지 않아요. 커넥터\n로 AI가 참고하는 건 그대로예요.'} value divider /></Item>
        <Item id="toggle-short" width={322}><Toggle title="이 과목 알림" description="오늘의 한 조각, 새 자료" value /></Item>
        <Item id="toggle-title" width={322}><Toggle title="오늘의 한 조각 알림" value /></Item>
      </Section>

      <Section title="IconButton · 5">
        <Item id="iconbutton-back"><IconButton icon="back" accessibilityLabel="뒤로" /></Item>
        <Item id="iconbutton-close"><IconButton icon="close" accessibilityLabel="닫기" /></Item>
        <Item id="iconbutton-close-inverse" dark><IconButton icon="closeInverse" accessibilityLabel="닫기" /></Item>
        <Item id="iconbutton-add"><IconButton icon="add" accessibilityLabel="추가" /></Item>
        <Item id="iconbutton-more"><IconButton icon="more" accessibilityLabel="더보기" /></Item>
      </Section>

      <Section title="TabItem · 8">
        <Item id="tabitem-home" width={93.5}><TabItem tab="classroom" /></Item>
        <Item id="tabitem-bit-on" width={93.5}><TabItem tab="bit" selected /></Item>
        <Item id="tabitem-search" width={93.5}><TabItem tab="explore" /></Item>
        <Item id="tabitem-profile" width={93.5}><TabItem tab="profile" /></Item>
        <Item id="tabitem-home-on" width={93.5}><TabItem tab="classroom" selected /></Item>
        <Item id="tabitem-bit" width={93.5}><TabItem tab="bit" /></Item>
        <Item id="tabitem-search-on" width={93.5}><TabItem tab="explore" selected /></Item>
        <Item id="tabitem-profile-on" width={93.5}><TabItem tab="profile" selected /></Item>
      </Section>

      <Section title="Checkbox · 2">
        <Item id="checkbox-off" width={358}><Checkbox label={CONSENT} checked={false} /></Item>
        <Item id="checkbox-on" width={358}><Checkbox label={CONSENT} checked /></Item>
      </Section>

      <Section title="TabBar · 3">
        <Item id="tabbar-bit" width={390}><TabBar selected="bit" /></Item>
        <Item id="tabbar-search" width={390}><TabBar selected="explore" /></Item>
        <Item id="tabbar-profile" width={390}><TabBar selected="profile" /></Item>
      </Section>

      <Section title="Icon · 13">
        {figmaIcons.map((name) => (
          <Item key={name} id={`icon-${name}`} dark={name === 'check-white-16'}><Icon name={name} /></Item>
        ))}
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: Palette.white,
  },
  content: {
    gap: 48,
    padding: 24,
  },
  section: {
    gap: 16,
  },
  heading: {
    fontSize: 24,
    color: Palette.text,
  },
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 24,
  },
  dark: {
    backgroundColor: Palette.navy,
  },
  fill: {
    alignSelf: 'stretch',
  },
});
