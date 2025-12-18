/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Asegúrate de que esta línea esté correcta para tu estructura de proyecto
    // Si tu código fuente está en 'src', debe apuntar a:
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
