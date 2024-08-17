/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: '#EF6144',
          400: '#FEE7E2'
        },
      },
      backgroundImage: {
        'login-page': "url('/bg.jpg')"
      }
    },
  },
  plugins: [],
}