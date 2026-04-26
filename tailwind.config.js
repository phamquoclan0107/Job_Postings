/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:             '#ffffff',
        'bg-card':      '#ffffff',
        'bg-hover':     '#f9fafb',
        border:         '#e5e7eb',
        'border-light': '#f3f4f6',
        accent:         '#111827',
        'accent-dim':   'rgba(17,24,39,0.06)',
        'text-pri':     '#111827',
        'text-sec':     '#374151',
        'text-mute':    '#9ca3af',
        green:          '#16a34a',
        red:            '#ef4444',
        blue:           '#1d4ed8',
      },
      fontFamily: {
        head: ['DM Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        sm:      '6px',
        DEFAULT: '8px',
        lg:      '12px',
        xl:      '16px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.08)',
        glow: '0 0 0 3px rgba(17,24,39,0.12)',
      },
    },
  },
  plugins: [],
}
