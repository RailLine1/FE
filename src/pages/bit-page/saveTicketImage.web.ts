import { toPng } from 'html-to-image';
import type { RefObject } from 'react';

export type SaveResult = 'saved' | 'denied' | 'failed';

// 웹: 결과 티켓 카드(DOM)를 2배 해상도 PNG로 만들어 내려받는다.
export async function saveTicketImage(
  target: RefObject<unknown>,
  fileName: string,
): Promise<SaveResult> {
  const node = target.current as unknown as HTMLElement | null;
  if (!node) return 'failed';
  try {
    // 폰트를 넣어야 글자 폭이 화면과 같다. 다른 도메인 스타일시트(Google Fonts)는 읽지 못해
    // html-to-image가 console.error를 남기고 건너뛴다. 결과에는 영향이 없어 그 한 줄만 조용히 넘긴다.
    const original = console.error;
    console.error = (...args: unknown[]) => {
      const message = String(args[0]);
      if (
        message.includes('Error inlining remote css file') ||
        message.includes('Error while reading CSS rules')
      )
        return;
      original(...args);
    };
    let dataUrl: string;
    try {
      dataUrl = await toPng(node, { pixelRatio: 2, cacheBust: true });
    } finally {
      console.error = original;
    }
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = fileName;
    link.click();
    return 'saved';
  } catch {
    return 'failed';
  }
}
