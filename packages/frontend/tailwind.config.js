// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        nav: '#00000080',
        navFont: '#FFFFFFA6',
        'modal-bg-color': 'rgba(75, 85, 99,0.20)',
        'play-hand-color': '#1B0D2A',
        'play-comp-color': '#FFFFFF14',
      },
      fontFamily: {
        poppins: ['Poppins'],
        montserrat: ['Montserrat'],
      },
      backgroundImage: {
        'main-bg': "url('/src/assets/main-background.jpg')",
      },
      maxWidth: {
        '1/2': '50%',
        '1/4': '25%',
        '3/4': '75%',
      },
      maxHeight: {
        '1/2': '50%',
        '1/4': '25%',
        '3/4': '75%',
      },
      borderColor: theme => ({
        DEFAULT: theme('colors.gray.300', 'currentColor'),
        'play-hand-btn': '#5946bc',
      }),
      flex: {
        1: '1 1 0%',
        '3/4': '0.75 0.75 0%',
        '1/4': '0.25 0.25 0%',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
