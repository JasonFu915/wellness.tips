module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e', // Brand Primary
          800: '#115e59',
          900: '#134e4a',
        },
        secondary: {
          50: '#f0fdfa', // Brand Secondary Background
          100: '#dcfce7',
        },
        accent: {
          500: '#f59e0b', // Brand Accent (Amber)
          600: '#d97706',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"PingFang SC"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
};
