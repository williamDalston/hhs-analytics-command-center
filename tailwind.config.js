/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc5fb',
          400: '#36a4f9',
          500: '#0c87eb',
          600: '#0069ca', // Primary HHS Blue-ish
          700: '#0054a3',
          800: '#00488a',
          900: '#003d73', // Deep HHS Blue
          950: '#002952',
        },
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
