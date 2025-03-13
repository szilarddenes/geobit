/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ecd06f',
          dark: '#c9ad4f',
          light: '#f4df9c',
        },
        dark: {
          DEFAULT: '#222222',
          lighter: '#2d2d2d',
          light: '#333333',
          card: '#2d2d2d',
          'card-hover': '#3a3a3a',
          border: '#444444',
        },
        light: {
          DEFAULT: '#f5f5f5',
          muted: '#cccccc',
        },
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        pixel: ['"Press Start 2P"', 'cursive'],
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
      },
      typography: (theme) => ({
        dark: {
          css: {
            color: theme('colors.light.DEFAULT'),
            h1: {
              color: theme('colors.primary.DEFAULT'),
            },
            h2: {
              color: theme('colors.primary.DEFAULT'),
            },
            h3: {
              color: theme('colors.primary.DEFAULT'),
            },
            h4: {
              color: theme('colors.primary.DEFAULT'),
            },
            strong: {
              color: theme('colors.light.DEFAULT'),
            },
            a: {
              color: theme('colors.primary.DEFAULT'),
              '&:hover': {
                color: theme('colors.primary.light'),
              },
            },
            code: {
              color: theme('colors.primary.DEFAULT'),
            },
            blockquote: {
              color: theme('colors.light.muted'),
              borderLeftColor: theme('colors.dark.border'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
}
