/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#080808',
        surface: {
          50: '#18181b',
          100: '#141416',
          200: '#101012',
          300: '#0c0c0e',
          DEFAULT: '#0a0a0c',
        },
        metallic: {
          light: '#e2e8f0',
          DEFAULT: '#cbd5e1',
          dark: '#64748b',
          dim: '#334155',
        },
        electric: {
          blue: '#00f0ff',
          glow: 'rgba(0, 240, 255, 0.35)',
          deep: '#0284c7',
        },
        titanium: {
          DEFAULT: '#8a8f98',
          highlight: '#d1d5db',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Syne', 'Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'radial-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'subtle-grid': 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
