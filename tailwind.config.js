/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
      },
      colors: {
        Mars: {
          100: '#fcdcc3',
          500: '#c1440e',
          900: '#4a1a05',
        },
        espace: {
          800: '#0b0d17',
          900: '#050608',
        }
      }
    },
  },
  plugins: [],
}
