/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f8fafc', // Very light, premium slate background
        foreground: '#0f172a', // Slate 900 for sharp, high-contrast text
        primary: {
          DEFAULT: '#6366f1', // Indigo 500 for primary actions
          hover: '#4f46e5', // Indigo 600
        },
        surface: '#ffffff', // Cards and panels
        border: '#e2e8f0', // Subtle borders
        muted: {
          DEFAULT: '#f1f5f9', // Slate 100
          foreground: '#64748b' // Slate 500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 40px -10px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
