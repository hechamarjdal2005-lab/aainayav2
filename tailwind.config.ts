import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9F2638',
        'primary-dark': '#B64A5A',
        secondary: '#C8945B',
        surface: '#FAF4EF',
        'surface-card': '#ffffff',
        'outline-variant': '#F3DDD8',
        'on-surface': '#3B2420',
        'on-surface-variant': '#6b5650',
        'sidebar-bg': '#ffffff',
      },
      fontFamily: {
        serif: ['var(--font-body)', 'serif'],
        sans: ['var(--font-body)', 'serif'],
        heading: ['var(--font-heading)', 'serif'],
        arabic: ['var(--font-arabic)', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
