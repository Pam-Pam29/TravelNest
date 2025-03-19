/** @type {import('tailwindcss').Config} */
module.exports = {
  // Specify which files Tailwind should scan for classes
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],

  // Extend or customize the default theme
  theme: {
    extend: {
      // Custom color palette
      colors: {
        'travenest-primary': {
          50: '#e6f1ff',
          100: '#b3d7ff',
          200: '#80bdff',
          300: '#4da3ff',
          400: '#1a89ff',
          500: '#0070e0',
          600: '#0059b3',
          700: '#004080',
          800: '#00264d',
          900: '#000d1a'
        },
        'travenest-accent': {
          50: '#fff2e6',
          100: '#ffd9b3',
          200: '#ffbf80',
          300: '#ffa64d',
          400: '#ff8c1a',
          500: '#e67300',
          600: '#b35900',
          700: '#804000',
          800: '#4d2600',
          900: '#1a0d00'
        }
      },
      // Custom font families
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      // Custom shadow
      boxShadow: {
        'travel-card': '0 4px 6px -1px rgba(0, 112, 224, 0.1), 0 2px 4px -1px rgba(0, 112, 224, 0.06)'
      }
    },
  },
  // Add any Tailwind plugins
  plugins: [],
};