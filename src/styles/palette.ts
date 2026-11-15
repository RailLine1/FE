import { readThemeName, saveThemeName, type ThemeName } from '@/lib/themeStorage';

export type { ThemeName };

// 기본은 어두운 밤하늘 테마. 뒤의 1f · 2e 같은 값은 투명도다.
// bg는 화면 배경, surface는 카드 · 입력칸 배경. white는 색 있는 버튼 위 글자처럼 언제나 흰색인 곳에 쓴다.
const dark = {
  white: '#ffffff',
  bg: '#13111c',
  // 배경 그림 위에 깔리는 어두운 막과, 그 위의 반투명 카드
  veil: '#0a091299',
  surface: '#1a1828c7',
  // 탭 바: 하늘이 살짝 비치는 반투명
  bar: '#0d0b18d9',
  // 아래에서 올라오는 시트: 뒤가 비치지 않게 불투명
  sheet: '#1a1828',
  purple: '#8b6cf6',
  purpleStrong: '#b9a5ff',
  purpleShadow: '#5a3fc0',
  purpleTint: '#8b6cf62e',
  blue: '#4cc2ff',
  blueTint: '#4cc2ff26',
  green: '#5fd38d',
  greenShadow: '#2f9e5f',
  greenTint: '#5fd38d26',
  red: '#ff6b6b',
  redShadow: '#c94a4a',
  redTint: '#ff6b6b26',
  orange: '#ffa94d',
  orangeTint: '#ffa94d26',
  golden: '#ffd166',
  goldenShadow: '#c9a043',
  goldenInk: '#ffd166',
  goldenTint: '#ffd16626',
  navy: '#0b0a12',
  navyShadow: '#33323e',
  scrim: '#000000a6',
  text: '#f7f7f8',
  textSub: '#a1a0ab',
  textMuted: '#6f6d7c',
  line: '#ffffff1f',
  lineStrong: '#545260',
  checkboxLine: '#878593',
  surfaceMuted: '#ffffff0f',
};

export type PaletteColors = { readonly [K in keyof typeof dark]: string };

// 밤하늘 테마 이전의 흰 테마(Figma `7. 공통 컴포넌트` 측정값). 그때 없던 bg · surface 같은 값은 흰 바탕에 맞춰 채웠다.
const light: PaletteColors = {
  white: '#ffffff',
  bg: '#ffffff',
  veil: '#ffffff00',
  surface: '#ffffff',
  bar: '#fffffff2',
  sheet: '#ffffff',
  purple: '#b18cff',
  purpleStrong: '#7c3dff',
  purpleShadow: '#8952ff',
  purpleTint: '#b18cff1f',
  blue: '#1cb0f6',
  blueTint: '#1cb0f61f',
  green: '#58cc02',
  greenShadow: '#61b800',
  greenTint: '#58cc021f',
  red: '#ff4b4b',
  redShadow: '#cc3c3c',
  redTint: '#ff4b4b1f',
  orange: '#ff9600',
  orangeTint: '#ff96001a',
  golden: '#ffc800',
  goldenShadow: '#d9a900',
  goldenInk: '#b8920f',
  goldenTint: '#ffc80026',
  navy: '#100f3e',
  navyShadow: '#88879f',
  scrim: '#100f3e73',
  text: '#4b4b4b',
  textSub: '#777777',
  textMuted: '#afafaf',
  line: '#e5e5e5',
  lineStrong: '#cfcfcf',
  checkboxLine: '#767676',
  surfaceMuted: '#fafafa',
};

let current: ThemeName = readThemeName();
// 테마가 바뀔 때마다 1씩 오른다. themed()가 이 값으로 다시 계산할지 정한다.
let version = 0;
const listeners = new Set<() => void>();

// 화면 코드는 지금처럼 Palette.text로 읽는다. 읽는 순간의 테마 색이 나온다.
export const Palette: PaletteColors = new Proxy({ ...dark }, {
  get: (_, key) => (current === 'light' ? light : dark)[key as keyof PaletteColors],
});

export const themeName = () => current;
export const isLight = () => current === 'light';
export const themeVersion = () => version;

export function setTheme(name: ThemeName) {
  if (name === current) return;
  current = name;
  version += 1;
  saveThemeName(name);
  listeners.forEach((listener) => listener());
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// 모듈에서 한 번 만드는 스타일(StyleSheet.create)을 테마가 바뀌면 다시 만든다.
// 쓰는 쪽은 styles.title처럼 그대로 읽으면 된다.
export function themed<T extends object>(make: () => T): T {
  let value = make();
  let builtAt = version;
  const now = () => {
    if (builtAt !== version) {
      value = make();
      builtAt = version;
    }
    return value as Record<PropertyKey, unknown>;
  };
  // 빈 껍데기를 대상으로 둔다. 얼려 둔 스타일을 대상으로 두면 값이 바뀔 때 Proxy 규칙에 걸린다.
  const shell = Array.isArray(value) ? [] : {};
  return new Proxy(shell as T, {
    get: (_, key) => now()[key],
    has: (_, key) => key in now(),
    ownKeys: () => Reflect.ownKeys(now()),
    getOwnPropertyDescriptor: (_, key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(now(), key);
      // 배열 length처럼 껍데기에도 있는 고정 속성은 그대로, 나머지는 바꿀 수 있는 속성으로 알린다.
      if (!descriptor || Reflect.getOwnPropertyDescriptor(shell, key)) return descriptor;
      return { ...descriptor, configurable: true };
    },
  });
}
