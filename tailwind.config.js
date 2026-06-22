/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0b0a08',
        'bg-secondary': '#100f0c',
        'bg-surface': '#161410',
        'bg-elevated': '#1e1b15',
        accent: '#d4a853',
        'accent-hover': '#e8c070',
        'accent-dim': '#8a6b2e',
        'text-primary': '#f0ead8',
        'text-secondary': '#a09070',
        'text-muted': '#7a6a4a',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
