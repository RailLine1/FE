export type ThemeName = 'dark' | 'light';

const KEY = 'daybit.theme';

// global.css가 html[data-theme]으로 스크롤바 · 바탕 · 자동 완성 색을 고른다.
function markDocument(name: ThemeName) {
  if (typeof document !== 'undefined') document.documentElement.dataset.theme = name;
}

export function readThemeName(): ThemeName {
  // 서버 렌더링 중에는 localStorage가 없다.
  if (typeof window === 'undefined') return 'light';
  let name: ThemeName = 'light';
  try {
    name = window.localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    // 저장소를 막아 둔 브라우저는 기본 테마로 그린다.
  }
  markDocument(name);
  return name;
}

export function saveThemeName(name: ThemeName) {
  markDocument(name);
  try {
    window.localStorage.setItem(KEY, name);
  } catch {
    // 저장하지 못해도 이번 접속에서는 바뀐 테마를 쓴다.
  }
}
