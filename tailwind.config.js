const { nextui } = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */

module.exports ={
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '3xl': '2048px',
    },
    extend: {
      scale: {
        '110': '1.10',
        '105': '1.05',
      },
      colors:{
        primary: {
          light: '#ffffff',
          DEFAULT: '#000000',
          dark: '#000000',
        },
        secondary: {
          light: '#ffffff',
          DEFAULT: '#343434',
          dark: '#343434',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
      height: {
        '100dvh': '100dvh'
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.2)' },
          '50%': { transform: 'scale(0.9)' },
          '70%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%': {
            transform: 'rotate(1deg)',
          },
          '50%': {
            transform: 'rotate(-1.5deg)',
          },
          '100%': {
            transform: 'rotate(1deg)',
          }
        },
      },
      animation: {
        pop: 'pop 0.6s ease-in-out infinite',
        shake: 'shake 0.2s infinite ease-in-out',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

