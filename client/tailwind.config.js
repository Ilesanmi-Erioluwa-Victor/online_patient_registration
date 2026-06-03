export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0B6E4F',
          light: '#13A068',
          dark: '#084D37',
          pale: '#E6F4EF'
        },
        accent: {
          DEFAULT: '#1A73E8',
          light: '#D2E3FC',
          dark: '#1558B0'
        },
        neutral: {
          50: '#F8FAFB',
          100: '#F1F4F6',
          200: '#E2E8ED',
          300: '#C8D2DA',
          400: '#97A3AE',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
        },
        status: {
          success: '#16A34A',
          warning: '#D97706',
          danger: '#DC2626',
          info: '#0891B2'
        }
      }
    }
  },
  plugins: []
};
