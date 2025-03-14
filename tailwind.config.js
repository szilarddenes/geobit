/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'indigo': {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81'
        },
        'primary': '#eccc58', // Yellow color
        'primary-light': '#eccc58',
        'primary-dark': '#eccc58',
        'dark': '#121212', // Main dark background
        'dark-lighter': '#1E1E1E', // Slightly lighter dark
        'dark-light': '#2A2A2A', // Even lighter dark
        'dark-card': '#1A1A1A', // Card background
        'dark-card-hover': '#252525', // Card hover background
        'dark-border': '#333333', // Border color
        'light': '#FFFFFF', // Main text color
        'light-muted': '#AAAAAA', // Muted text color
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive']
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4)'
      }
    },
  },
  plugins: [],
};