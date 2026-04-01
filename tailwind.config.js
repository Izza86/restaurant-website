/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      /* ─── Color Palette ─────────────────────────────────── */
      colors: {
        primary: {
          50:  '#fdf9ef',
          100: '#f9f0d8',
          200: '#f2dfac',
          300: '#e9ca78',
          400: '#D4AF37',   // ← warm gold (main brand)
          500: '#D4AF37',
          600: '#b8952e',
          700: '#9a7825',
          800: '#7d5f1f',
          900: '#674d1b',
          950: '#3a2a0e',
        },
        dark: {
          DEFAULT:  '#2C2C2C', // dark charcoal
          light:    '#3A3A3A',
          lighter:  '#4A4A4A',
        },
        accent: {
          DEFAULT: '#F5E6D3',  // soft cream
          light:   '#FAF3EB',
          dark:    '#E8D5BF',
        },
        cream:     { DEFAULT: '#F5E6D3' },
        charcoal:  { DEFAULT: '#2C2C2C' },
        gold:      { DEFAULT: '#D4AF37' },
        burgundy:  { DEFAULT: '#722F37' },
        olive:     { DEFAULT: '#556B2F' },
      },

      /* ─── Typography ────────────────────────────────────── */
      fontFamily: {
        heading:  ['"Playfair Display"', 'Georgia', 'serif'],
        body:     ['"Open Sans"', 'system-ui', 'sans-serif'],
        accent:   ['"Cormorant Garamond"', 'serif'],
      },
      fontSize: {
        'display-lg': ['4.5rem',  { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display':    ['3.75rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'display-sm': ['3rem',    { lineHeight: '1.2',  letterSpacing: '-0.01em' }],
      },

      /* ─── Spacing (restaurant-specific) ─────────────────── */
      spacing: {
        '18':  '4.5rem',
        '22':  '5.5rem',
        '30':  '7.5rem',
        '34':  '8.5rem',
        '42':  '10.5rem',
        '50':  '12.5rem',
        'section':     '6rem',
        'section-lg':  '8rem',
        'section-xl':  '10rem',
      },

      /* ─── Border Radius ─────────────────────────────────── */
      borderRadius: {
        'card': '1rem',
        'menu': '1.25rem',
      },

      /* ─── Box Shadows ───────────────────────────────────── */
      boxShadow: {
        'card':    '0 4px 20px rgba(44, 44, 44, 0.08)',
        'card-lg': '0 8px 40px rgba(44, 44, 44, 0.12)',
        'gold':    '0 4px 24px rgba(212, 175, 55, 0.25)',
        'menu':    '0 2px 12px rgba(44, 44, 44, 0.06)',
      },

      /* ─── Background Images ─────────────────────────────── */
      backgroundImage: {
        'hero-pattern':  "linear-gradient(rgba(44,44,44,0.65), rgba(44,44,44,0.65))",
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #F5E6D3 100%)',
        'dark-gradient': 'linear-gradient(180deg, #2C2C2C 0%, #3A3A3A 100%)',
      },

      /* ─── Animations ────────────────────────────────────── */
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in':    'fade-in 0.8s ease-out forwards',
        'shimmer':    'shimmer 2s linear infinite',
      },

      /* ─── Transitions ───────────────────────────────────── */
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
};
