/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: [
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        sans: [
          '"SF Pro Text"',
          '"SF Pro Display"',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"SF Mono"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        /* Apple Design System semantic tokens backed by CSS variables */
        surface: {
          bg: 'var(--bg)',
          card: 'var(--card)',
          subtle: 'var(--surface-subtle)',
        },
        ink: {
          primary: 'var(--text)',
          muted: 'var(--muted)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
        },
        status: {
          green: 'var(--status-green)',
          amber: 'var(--status-amber)',
          red: 'var(--status-red)',
        },
        /* Legacy aliases remapped cleanly to Apple monochrome + single blue accent */
        navy: { 950: '#000000', 900: '#1c1c1e', 800: '#2c2c2e', 700: '#3a3a3c' },
        electric: { 400: '#2997ff', 500: '#0071e3', 600: '#0071e3' },
        tealaccent: { 400: '#2997ff', 500: '#0071e3' },
      },
      borderRadius: {
        '3xl': '1.5rem', /* 24px Apple product card radius */
      },
      boxShadow: {
        apple: '0 4px 24px -2px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'apple-dark': '0 12px 40px -8px rgba(0, 0, 0, 0.65)',
        'apple-hover': '0 16px 40px -10px rgba(0, 0, 0, 0.14)',
      },
    },
  },
  plugins: [],
};
