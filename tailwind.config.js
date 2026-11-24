/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chinese-red': '#805140',
        'chinese-red-light': '#A36754',
        'chinese-red-dark': '#613C2E',
        'chinese-gold': '#C5A46D',
        'chinese-gold-light': '#E3C790',
        'chinese-gold-dark': '#987745',
        'chinese-ink': '#282820',
        'chinese-ink-light': '#36382E',
        'chinese-ivory': '#F7F3EC',
        'chinese-ivory-dark': '#EEE5D7',
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
