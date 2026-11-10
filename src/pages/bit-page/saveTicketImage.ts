// v58의 기본 API는 새 Asset 방식이라, 한 줄 저장은 안정 API(legacy)를 쓴다.
import * as MediaLibrary from 'expo-media-library/legacy';
import type { RefObject } from 'react';
import { captureRef } from 'react-native-view-shot';

export type SaveResult = 'saved' | 'denied' | 'failed';

// 앱: 결과 티켓 카드를 PNG로 찍어 사진 앨범에 저장한다. 처음 한 번 저장 권한을 묻는다.
export async function saveTicketImage(
  target: RefObject<unknown>,
  _fileName: string,
): Promise<SaveResult> {
  try {
    const permission = await MediaLibrary.requestPermissionsAsync(true);
    if (!permission.granted) return 'denied';
    const uri = await captureRef(target as Parameters<typeof captureRef>[0], {
      format: 'png',
      quality: 1,
    });
    await MediaLibrary.saveToLibraryAsync(uri);
    return 'saved';
  } catch {
    return 'failed';
  }
}
