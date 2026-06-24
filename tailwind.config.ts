import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#855050',
        'primary-dark': '#6a3939',
        secondary: '#954647',
        surface: '#fff8f7',
        'surface-card': '#FAF7F5',
        'outline-variant': '#d6c2c1',
        'on-surface': '#271718',
        'on-surface-variant': '#524343',
        'sidebar-bg': '#3a2d2d',
      },
      fontFamily: {
        serif: ['var(--font-eb-garamond)', 'serif'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
