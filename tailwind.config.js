module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        viral: {
          900: '#0f0518', // Deep purple/black background
          800: '#1a0b2e', // Card background
          700: '#2d1b4e', // Lighter card/border
          500: '#8b5cf6', // Primary purple
          400: '#a78bfa', // Secondary purple
          neon: '#00ff9d', // Green neon accent
          pink: '#ff00ff', // Pink neon accent
        }
      }
    },
  },
  plugins: [],
};
