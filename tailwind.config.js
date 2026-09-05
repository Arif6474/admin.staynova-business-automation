/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      borderColor: {
        DEFAULT: 'var(--color-border-subtle)',
        subtle: 'var(--color-border-subtle)',
        default: 'var(--color-border-default)',
        strong: 'var(--color-border-strong)',
      },
      colors: {
        // App background & surface semantic tokens
        app: 'var(--color-bg-app)',
        surface: 'var(--color-bg-surface)',
        card: {
          DEFAULT: 'var(--color-bg-card)',
          hover: 'var(--color-bg-card-hover)',
        },
        sidebar: 'var(--color-bg-sidebar)',
        topbar: 'var(--color-bg-topbar)',
        muted: 'var(--color-bg-muted)',
        input: 'var(--color-bg-input)',

        // Border semantic tokens
        border: {
          subtle: 'var(--color-border-subtle)',
          DEFAULT: 'var(--color-border-default)',
          strong: 'var(--color-border-strong)',
        },
        subtle: 'var(--color-border-subtle)',
        strong: 'var(--color-border-strong)',

        // Text semantic tokens
        txt: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          dimmed: 'var(--color-text-dimmed)',
        },

        // Brand Palette (StayNova Gold powered)
        brand: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          300: 'var(--color-brand-300)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
          950: 'var(--color-brand-950)',
        },

        // Status colors
        status: {
          success: 'var(--color-success)',
          warning: 'var(--color-warning)',
          danger: 'var(--color-danger)',
          info: 'var(--color-info)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
