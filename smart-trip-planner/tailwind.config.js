/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        sand: {
          50: '#fdf8f0',
          100: '#f7eed8',
          200: '#edd9a3',
          300: '#e3c46f',
          400: '#d9a83c',
          500: '#c48f1f',
        },
        ocean: {
          50: '#eef6fb',
          100: '#d4eaf6',
          200: '#9dcde9',
          300: '#5fa8d3',
          400: '#2f85bb',
          500: '#1a6a9a',
          600: '#135080',
          700: '#0e3d66',
          800: '#0a2d4d',
          900: '#071d33',
        },
        terra: {
          100: '#f5e6d8',
          200: '#e8c4a0',
          300: '#d49b65',
          400: '#b8743a',
          500: '#8f5020',
        }
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
