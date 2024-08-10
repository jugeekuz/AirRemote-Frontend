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
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
}

