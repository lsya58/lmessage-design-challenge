/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#08bf5a',
          light: '#f4fbf2',
          dark: '#23814d',
        },
        text: {
          main: '#222222',
          sub: '#888888',
        },
        border: {
          DEFAULT: '#e0e0e0',
          dark: '#dddddd',
        },
        bg: {
          gray: '#f8f8f8',
          light: '#f0f0f0',
        },
        link: {
          DEFAULT: '#5799DB',
          light: '#edf4fb',
          dark: '#004b85',
        },
        error: {
          DEFAULT: '#f44336',
          light: '#fdebe9',
          dark: '#a10000',
        },
        warning: {
          DEFAULT: '#fea600',
          light: '#fef5e4',
        }
      }
    },
  },
  plugins: [],
}