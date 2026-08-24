/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#003fb1',
          container: '#1a56db',
          fixed: '#dbe1ff',
          dim: '#b5c4ff'
        },
        secondary: {
          DEFAULT: '#006a61',
          container: '#86f2e4',
          fixed: '#89f5e7'
        },
        tertiary: {
          DEFAULT: '#005439',
          container: '#006f4d',
          fixed: '#85f8c4'
        },
        surface: {
          DEFAULT: '#f9f9ff',
          dim: '#d3daef',
          bright: '#f9f9ff',
          'container-lowest': '#ffffff',
          'container-low': '#f1f3ff',
          container: '#e9edff',
          'container-high': '#e1e8fd',
          'container-highest': '#dce2f7'
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#d4dcff',
        'on-secondary': '#ffffff',
        'on-secondary-container': '#006f66',
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#7ff2be',
        'on-surface': '#141b2b',
        'on-surface-variant': '#434654',
        outline: '#737686',
        'outline-variant': '#c3c5d7',
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
