import { Image } from 'react-native';

import { Palette } from '@/styles/palette';

const icons = {
  'file-20': { source: require('@/assets/icons/file-20.png'), size: 20 },
  'file-14': { source: require('@/assets/icons/file-14.png'), size: 14 },
  'check-purple-20': { source: require('@/assets/icons/check-purple-20.png'), size: 20 },
  'check-white-16': { source: require('@/assets/icons/check-white-16.png'), size: 16 },
  'check-green-22': { source: require('@/assets/icons/check-green-22.png'), size: 22 },
  'chevron-down-14': { source: require('@/assets/icons/chevron-down-14.png'), size: 14 },
  'chevron-left-22': { source: require('@/assets/icons/chevron-left-22.png'), size: 22 },
  'chevron-right-20': { source: require('@/assets/icons/chevron-right-20.png'), size: 20 },
  'close-22': { source: require('@/assets/icons/close-22.png'), size: 22 },
  'close-red-22': { source: require('@/assets/icons/close-red-22.png'), size: 22 },
  'close-white-22': { source: require('@/assets/icons/close-white-22.png'), size: 22 },
  'plus-22': { source: require('@/assets/icons/plus-22.png'), size: 22 },
  'more-22': { source: require('@/assets/icons/more-22.png'), size: 22 },
  'home-22': { source: require('@/assets/icons/home-22.png'), size: 22 },
  'home-purple-22': { source: require('@/assets/icons/home-purple-22.png'), size: 22 },
  'bit-22': { source: require('@/assets/icons/bit-22.png'), size: 22 },
  'bit-purple-22': { source: require('@/assets/icons/bit-purple-22.png'), size: 22 },
  'search-gray-20': { source: require('@/assets/icons/search-gray-20.png'), size: 20 },
  'search-gray-22': { source: require('@/assets/icons/search-gray-22.png'), size: 22 },
  'search-purple-22': { source: require('@/assets/icons/search-purple-22.png'), size: 22 },
  'profile-22': { source: require('@/assets/icons/profile-22.png'), size: 22 },
  'profile-purple-22': { source: require('@/assets/icons/profile-purple-22.png'), size: 22 },
  'github-20': { source: require('@/assets/icons/github-20.png'), size: 20 },
  'document-20': { source: require('@/assets/icons/document-20.png'), size: 20 },
  'trash-22': { source: require('@/assets/icons/trash-22.png'), size: 22 },
  'upload-26': { source: require('@/assets/icons/upload-26.png'), size: 26 },
  'memo-18': { source: require('@/assets/icons/memo-18.png'), size: 18 },
  'folder-20': { source: require('@/assets/icons/folder-20.png'), size: 20 },
  'archive-20': { source: require('@/assets/icons/archive-20.png'), size: 20 },
  'sparkle-20': { source: require('@/assets/icons/sparkle-20.png'), size: 20 },
  'settings-22': { source: require('@/assets/icons/settings-22.png'), size: 22 },
};

export type IconName = keyof typeof icons;

// 색 이름이 없는 아이콘(기본 회색 PNG)은 테마 글자색으로 칠한다. 어두운 배경에서도 보이게.
const COLORED = /-(purple|white|green|red|golden|orange)-/;

export function Icon({ name, color }: { name: IconName; color?: string }) {
  const { source, size } = icons[name];
  const tint = color ?? (COLORED.test(name) ? undefined : name.includes('-gray-') ? Palette.textSub : Palette.text);
  return <Image source={source} style={{ width: size, height: size, tintColor: tint }} />;
}
