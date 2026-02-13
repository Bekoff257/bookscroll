/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        card: '0 2px 14px rgba(0,0,0,0.05)'
      }
    }
  },
  plugins: []
};
