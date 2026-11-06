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
          dark: '#0c0f14',
          surface: '#141821',
          card: '#19202c',
          border: '#252e3e',
          hover: '#222b3b',
          yellow: '#e2f163',
          yellowDark: '#cde03f',
          accent: '#b8ff2e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
