import type { Config } from 'tailwindcss';

/**
 * 設計方向：北歐旅行雜誌 + 高級戶外 App
 * - faroe：海藍、冷灰、草綠
 * - dolo：米白、岩石灰、暖棕
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#FAF8F4',
        ink: {
          DEFAULT: '#1C2B33',
          soft: '#4A5A64',
          faint: '#8A98A0',
        },
        faroe: {
          50: '#F1F6F8',
          100: '#DEEAF0',
          200: '#B9D2DE',
          300: '#8AB4C7',
          400: '#5892AB',
          500: '#33718D',
          600: '#255A72',
          700: '#1D475B',
          800: '#173A4A',
          900: '#122C39',
        },
        moss: {
          100: '#E6EEE0',
          300: '#AFC79E',
          500: '#6F8F5B',
          700: '#4E6940',
        },
        dolo: {
          50: '#FBF7F1',
          100: '#F3EBDF',
          200: '#E4D6C2',
          300: '#CDB99C',
          400: '#B29876',
          500: '#96795A',
          600: '#7A6047',
          700: '#5E4A38',
        },
        stone2: {
          100: '#EFEDEA',
          300: '#CBC6C0',
          500: '#948D85',
          700: '#5F5A54',
        },
        alert: {
          bg: '#FDF2E9',
          border: '#F0C9A4',
          text: '#8A4B14',
        },
        good: {
          bg: '#EDF5EF',
          border: '#BBD9C4',
          text: '#2F6B45',
        },
      },
      fontFamily: {
        sans: [
          'ui-sans-serif',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"Noto Sans TC"',
          '"PingFang TC"',
          '"Microsoft JhengHei"',
          'sans-serif',
        ],
        display: [
          'ui-serif',
          'Georgia',
          '"Noto Serif TC"',
          '"Songti TC"',
          'serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(28,43,51,0.04), 0 8px 24px -12px rgba(28,43,51,0.18)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
