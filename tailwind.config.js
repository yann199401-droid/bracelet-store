/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chinese-red': '#B22222',
        'chinese-red-light': '#CD5C5C',
        'chinese-red-dark': '#8B0000',
        'chinese-gold': '#D4A84B',
        'chinese-gold-light': '#E8C96A',
        'chinese-gold-dark': '#B8860B',
        'chinese-ink': '#1A1A2E',
        'chinese-ink-light': '#2D2D44',
        'chinese-ivory': '#F5F0E8',
        'chinese-ivory-dark': '#E8E0D0',
        'chinese-slate': '#708090',
        'chinese-slate-light': '#8A9AA8',
        'chinese-wood': '#8B6914',
        'chinese-jade': '#2E8B57',
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'Georgia', 'serif'],
        sans: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'cloud-pattern': "url('/images/cloud-pattern.png')",
        'wood-texture': "url('/images/wood-texture.png')",
      },
      boxShadow: {
        'chinese': '0 2px 12px rgba(0, 0, 0, 0.15)',
        'chinese-lg': '0 4px 24px rgba(0, 0, 0, 0.2)',
      },
      borderWidth: {
        '3': '3px',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        splashFadeSlide: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        slideUp: 'slideUp 0.3s ease-out',
        fadeIn: 'fadeIn 0.4s ease-out',
        splashChar: 'splashChar 0.7s ease-out forwards',
        splashLine: 'splashLine 0.6s ease-out forwards',
        splashFadeSlide: 'splashFadeSlide 0.5s ease-out forwards',
      },
    },
  },
  plugins: [],
}
