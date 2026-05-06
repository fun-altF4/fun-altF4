import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--color-background) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        'primary-dark': 'hsl(var(--color-primary-dark) / <alpha-value>)',
        secondary: 'hsl(var(--color-secondary) / <alpha-value>)',
        'secondary-dark': 'hsl(var(--color-secondary-dark) / <alpha-value>)',
        accent: 'hsl(var(--color-accent) / <alpha-value>)',
        text: {
          primary: 'hsl(var(--color-text-primary) / <alpha-value>)',
          secondary: 'hsl(var(--color-text-secondary) / <alpha-value>)',
          tertiary: 'hsl(var(--color-text-tertiary) / <alpha-value>)',
        },
        border: 'hsl(var(--color-border) / <alpha-value>)',
      },
      fontSize: {
        xs: ['12px', { lineHeight: '16px', letterSpacing: '0' }],
        sm: ['14px', { lineHeight: '20px', letterSpacing: '0' }],
        base: ['16px', { lineHeight: '24px', letterSpacing: '0' }],
        lg: ['18px', { lineHeight: '28px', letterSpacing: '0' }],
        xl: ['20px', { lineHeight: '28px', letterSpacing: '0' }],
        '2xl': ['24px', { lineHeight: '32px', letterSpacing: '0' }],
        '3xl': ['30px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
        '4xl': ['36px', { lineHeight: '44px', letterSpacing: '-0.02em' }],
      },
      fontFamily: {
        sans: 'var(--font-inter)',
        display: 'var(--font-sohne-breit)',
        mono: 'var(--font-jetbrains-mono)',
      },
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        6: '24px',
        8: '32px',
        12: '48px',
        16: '64px',
        24: '96px',
      },
      animation: {
        'pulse-dim': 'pulse-dim 1s cubic-bezier(0.16, 1, 0.3, 1) infinite',
        'fade-in': 'fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        'pulse-dim': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
