/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        red: {
          50: 'oklch(.971 .013 17.38)',
          300: 'oklch(.808 .114 19.571)',
          500: 'oklch(.637 .237 25.331)',
          600: 'oklch(.577 .245 27.325)',
          700: 'oklch(.505 .213 27.518)',
        },
        slate: {
          50: 'oklch(.984 .003 247.858)',
          100: 'oklch(.968 .007 247.896)',
          200: 'oklch(.929 .013 255.508)',
          500: 'oklch(.554 .046 257.417)',
          600: 'oklch(.446 .043 257.281)',
          700: 'oklch(.372 .044 257.287)',
          800: 'oklch(.279 .041 260.031)',
        },
      },
    },
  },
  plugins: [],
}
