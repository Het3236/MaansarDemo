/** Maansar Studios — design system.
 *  Palette, type and rhythm are taken directly from the brand guide:
 *  terracotta is the only strong colour, everything else stays quiet. */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        terracotta: '#A57764', // the logo colour
        clay: '#7A5343', // buttons and links
        plaster: '#F2EAE3', // tinted panels
        limewash: '#FAF8F5', // page background
        ink: '#2A2320', // text and dark sections
        indigo: '#2F3E52', // used rarely
        // derived, for hairlines and muted text only
        'ink-60': 'rgba(42,35,32,0.60)',
        'ink-40': 'rgba(42,35,32,0.40)',
        'ink-12': 'rgba(42,35,32,0.12)',
        'limewash-60': 'rgba(250,248,245,0.60)',
        'limewash-40': 'rgba(250,248,245,0.40)',
        'limewash-16': 'rgba(250,248,245,0.16)',
      },
      fontFamily: {
        // Playfair for headings, Karla for text — both from Google Fonts
        display: ['"Playfair Display"', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['Karla', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        // body never drops below 16px
        body: ['1.0625rem', { lineHeight: '1.65' }], // 17px
        'body-lg': ['1.1875rem', { lineHeight: '1.6' }],
        label: ['0.6875rem', { lineHeight: '1.2', letterSpacing: '0.18em' }],
        'label-lg': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.16em' }],
      },
      letterSpacing: {
        label: '0.18em',
        tighter2: '-0.03em',
      },
      spacing: {
        gutter: 'var(--gutter)',
        section: 'var(--section)',
      },
      maxWidth: {
        measure: '62ch',
        shell: '110rem',
      },
      transitionTimingFunction: {
        // one easing family across the whole site
        arch: 'cubic-bezier(0.22, 1, 0.36, 1)',
        archIn: 'cubic-bezier(0.62, 0, 0.30, 1)',
      },
      transitionDuration: {
        400: '400ms',
        600: '600ms',
        900: '900ms',
        1200: '1200ms',
      },
      keyframes: {
        'line-grow': { from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'line-grow': 'line-grow 1s cubic-bezier(0.22,1,0.36,1) forwards',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
        drift: 'drift 3.4s ease-in-out infinite',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [],
}
