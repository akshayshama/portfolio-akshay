export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { primary: '#0a0a0f', secondary: '#12121a', tertiary: '#1a1a24' },
        primary: '#00d4aa',
        secondary: '#6366f1',
        border: '#1e293b'
      },
      fontFamily: { sans: ['DM Sans', 'sans-serif'], mono: ['JetBrains Mono', 'monospace'] }
    }
  },
  plugins: []
};