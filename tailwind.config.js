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
        // Semantic Colors for Scalability
        surface: {
          950: '#020617', // Deepest background (body)
          900: '#0f172a', // Sidebar/Header
          800: '#1e293b', // Cards
          700: '#334155', // Borders
          600: '#475569', // Muted text
        },
        primary: {
          DEFAULT: '#3b82f6', // Brand Blue
          hover: '#2563eb',
          light: '#60a5fa',
          glow: 'rgba(59, 130, 246, 0.5)'
        },
        success: {
          DEFAULT: '#10b981', // Emerald
          glow: 'rgba(16, 185, 129, 0.5)'
        },
        // Legacy support (gradual migration)
        viral: {
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#3b82f6',
          400: '#60a5fa',
          300: '#93c5fd',
          neon: '#3b82f6',
          pink: '#6366f1',
        }
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
};
