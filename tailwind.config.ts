import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'ku-bg':      '#0a0a0a',
        'ku-surface': '#111111',
        'ku-card':    '#161616',
        'ku-gold':    '#c8a96e',
        'ku-cream':   '#f5f2ed',
        'ku-accent':  '#7c6bff',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 32s linear infinite',
        'blink':  'blink 1.4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blink: {
          '0%,100%': { opacity: '1' },
          '50%':     { opacity: '0.2' },
        },
      },
    },
  },
  plugins: [],
}
export default config
