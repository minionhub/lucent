/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        'ssm': '480px',
      },
      colors: {
        'background': '#faf7ee',
        'button': '#a63755',
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
