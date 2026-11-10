// 초를 `0:38` 형식으로 바꾼다.
export function formatSeconds(seconds = 0) {
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
}

// 0부터 시작하는 보기 번호를 ①~④로 바꾼다.
export function circledNumber(index = 0) {
  return ['①', '②', '③', '④'][index] ?? String(index + 1);
}

export function compareToAverage(elapsedSec = 0, averageSec = 0) {
  // P-SOC-03 경쟁보다 꾸준함: 평균보다 빠를 때만 차이를 말하고, 아니면 오늘 푼 것 자체를 칭찬한다
  const gap = averageSec - elapsedSec;
  if (gap > 0) return `평균보다 ${gap}초 빨라요`;
  return '오늘도 해냈어요';
}

export function evidenceText(evidence?: { file?: string; page?: number }) {
  if (!evidence?.file) return '';
  return evidence.page ? `${evidence.file} p.${evidence.page}` : evidence.file;
}

// P-BIT-13. 그날 푼 Bit 수에 따른 격자 칸의 진하기. 0개는 빈 칸이다.
export function gridOpacity(count = 0) {
  return [0, 0.4, 0.6, 0.8, 1][Math.min(count, 4)];
}

type ShareTicket = {
  courseName?: string;
  no?: number;
  concept?: string | null;
  correct?: boolean;
  elapsedSec?: number;
  streak?: number;
  week?: number[];
};

// 결과 공유 문구. 경쟁보다 오늘 배운 개념과 꾸준함을 보여 준다(P-SOC-03).
export function shareMessage(ticket: ShareTicket, link: string) {
  const time = formatSeconds(ticket.elapsedSec);
  const topic = ticket.concept ? `「${ticket.concept}」 ` : '';
  const result = ticket.correct ? `${time} 만에 정답` : '아쉽게 오답, 해설로 복습했어요';
  const week = (ticket.week ?? []).map((solved) => (solved ? '●' : '○')).join('');
  return [
    `오늘의 한 조각 · ${ticket.courseName} #${ticket.no}`,
    `${topic}${result}`,
    `이번 주 ${week}  연속 ${ticket.streak ?? 0}일째`,
    '',
    '같은 강의 듣는다면, 같이 풀어볼래요?',
    link,
  ].join('\n');
}
