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
          50: '#e5faff', // primary-lightest
          100: '#ccecf2', // primary-lighter
          200: '#97d4ea', // primary-light
          300: '#00bde3', // primary-vivid
          400: '#005ea2', // primary (official HHS primary)
          500: '#1a4480', // primary-dark
          600: '#162e51', // primary-darker
          700: '#185394', // HHS Blue (logo/seal)
          800: '#162e51', // primary-darker
          900: '#1c1d1f', // base-darkest
          950: '#0f6460', // accent-cool-darkest
        },
        // Official HHS.gov color palette
        hhs: {
          primary: {
            DEFAULT: '#005ea2',
            lightest: '#e5faff',
            lighter: '#ccecf2',
            light: '#97d4ea',
            dark: '#1a4480',
            darker: '#162e51',
            vivid: '#00bde3',
          },
          secondary: {
            DEFAULT: '#face00',
            lighter: '#fff5c2',
            light: '#fee685',
            dark: '#e5a000',
            darker: '#c2850c',
            vivid: '#ffbe2e',
          },
          accent: {
            warm: {
              DEFAULT: '#f3966d',
              lightest: '#faeee5',
              lighter: '#fbe0d0',
              light: '#f7bca2',
              dark: '#e17141',
              darker: '#d54309',
              darkest: '#8b0a03',
            },
            cool: {
              DEFAULT: '#1dc2ae',
              lightest: '#e0f7f6',
              lighter: '#7efbe1',
              light: '#29e1cb',
              dark: '#00a398',
              darker: '#008480',
              darkest: '#0f6460',
            },
          },
          base: {
            DEFAULT: '#a9aeb1',
            lightest: '#fbfcfd',
            lighter: '#f1f3f6',
            light: '#dfe1e2',
            dark: '#565c65',
            darker: '#3d4551',
            darkest: '#1c1d1f',
          },
          logo: '#185394', // HHS Blue (RGB: 24, 83, 148)
        },
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', '"Helvetica Neue"', 'Helvetica', 'Roboto', 'Arial', 'sans-serif'],
        heading: ['"Merriweather Web"', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        body: ['"Source Sans Pro"', '"Helvetica Neue"', 'Helvetica', 'Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
