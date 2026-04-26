/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:             '#0d0f14',
        'bg-card':      '#13161e',
        'bg-hover':     '#1a1e28',
        border:         '#232736',
        'border-light': '#2d3244',
        accent:         '#f0c040',
        'accent-dim':   'rgba(240,192,64,0.15)',
        'text-pri':     '#f0f2f8',
        'text-sec':     '#8a90a8',
        'text-mute':    '#4e5468',
        green:          '#3ecf8e',
        red:            '#ef4444',
        blue:           '#4f9cf9',
      },
      fontFamily: {
        head: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        sm:      '6px',
        DEFAULT: '10px',
        lg:      '16px',
        xl:      '20px',
      },
      boxShadow: {
        card: '0 24px 80px rgba(0,0,0,0.5)',
        glow: '0 0 24px rgba(240,192,64,0.35)',
      },
    },
  },
  plugins: [],
}