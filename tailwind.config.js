/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nri: {
          orange: '#EC691F',      // Primary University Orange
          darkorange: '#d8560f',  // Hover Orange
          maroon: '#A51C30',      // University Crest Crimson / Maroon
          charcoal: '#1E1D1D',    // Deep Charcoal Black
          grey: '#5B5B5B',        // Medium Grey Body
          peach: '#FFBC7D',       // Soft Peach Accent
          warmbg: '#FAF7F5',      // Soft Warm Background
          border: '#E5E7EB',
          white: '#FFFFFF',
        },
        brand: {
          50: '#FFF7F2',
          100: '#FFEEDE',
          200: '#FFBC7D',
          300: '#FFA054',
          400: '#FF842A',
          500: '#EC691F', // Exact University Orange
          600: '#d8560f', // Darker Orange
          700: '#A51C30', // University Maroon
          800: '#831424',
          900: '#1E1D1D', // Deep Charcoal
          950: '#111111',
        },
        gold: {
          300: '#FFD1A4',
          400: '#FFBC7D',
          500: '#EC691F',
          600: '#d8560f',
        }
      },
      fontFamily: {
        heading: ['Lato', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
