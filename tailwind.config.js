module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    minWidth: {
      '0': '0',
      '1/5': '20%',
      '1/2': '50%',
      '3/4': '75%',
      'full': '100%',
    },
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { display: 'none', opacity: 0, zIndex: -1 },
          '1%': { display: 'block', opacity: 0, zIndex: 10 },
          '100%': { display: 'block', opacity: 1, zIndex: 10 },
        },
        swingGradient: {
          '0%': { backgroundPosition: '0% 49%' },
          '50%': { backgroundPosition: '100% 52%' },
          '100%': { backgroundPosition: '0% 49%' },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 100%' },
          '50%': { backgroundPosition: '66.6666% 33.3333%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        splashOpen: {
          '0%': { transform: 'scale(1)', opacity: 1, visibility: 'visible' },
          '99%': { transform: 'scale(3)', opacity: 0, visibility: 'visible' },
          '100%': { transform: 'scale(3)', opacity: 0, visibility: 'hidden' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 500ms linear forwards 500ms',
        'swing-gradient': '4s ease 0s infinite normal none running swingGradient',
        'splash-open': '4s ease-out 0s normal both splashOpen'
      },
      backgroundImage: {
        'main-logo': "url('https://archival-archetyping.github.io/assets/images/Meta16_9-2.gif')",
      },
      colors: {
        'key-green': 'rgb(0,191,165)',
        'key-orange': 'rgb(255,109,0)',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      }
    },
  },
  variants: {
    extend: {
      boxShadow: ['active'],
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
