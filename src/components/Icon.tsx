import { Image } from 'react-native';

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
  'settings-22': { source: require('@/assets/icons/settings-22.png'), size: 22 },
};

export type IconName = keyof typeof icons;

export function Icon({ name, color }: { name: IconName; color?: string }) {
  const { source, size } = icons[name];
  return <Image source={source} style={{ width: size, height: size, tintColor: color }} />;
}
