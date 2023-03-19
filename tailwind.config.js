/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
    keyframes: {
      zoomIn: {
        '0%': { transform: 'scale(0)' },
        '100%': { transform: 'scale(1)' },
      },
      zoomOut: {
        '0%': { transform: 'scale(1)' },
        '100%': { transform: 'scale(0)' },
      },
      spin: {
        '0%': { transform: 'rotate(0deg)' },
        '100%': { transform: 'rotate(360deg)' },
      },
    },
    animation: {
      zoomIn: 'zoomIn 0.3s ease-in-out',
      zoomOut: 'zoomOut 0.3s ease-in-out',
      spin: 'spin 1s linear infinite',
    },
  },
  plugins: [],
};
