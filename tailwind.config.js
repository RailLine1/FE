const { Palette } = require('./src/styles/palette.ts');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  // 기본값(media)이면 웹에서 `Cannot manually set color scheme` 오류가 난다.
  darkMode: 'class',
  theme: {
    extend: {
      colors: Palette,
    },
  },
  plugins: [],
};
