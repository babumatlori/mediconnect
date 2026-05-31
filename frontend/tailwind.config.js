/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  // If a class is not found here, it won't be included in build
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {

      // ── Custom Colors ──────────────────────────────
      // These become available as: bg-primary-600, text-danger-500 etc.
      colors: {
        primary: {
          50:  '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          500: '#3B82F6',
          600: '#2563EB',  // ← main brand blue
          700: '#1D4ED8',
          800: '#1E40AF',
          900: '#1E3A8A',
        },
        secondary: {
          50:  '#F8FAFC',  // ← page background
          100: '#F1F5F9',  // ← card background
          200: '#E2E8F0',  // ← borders
          300: '#CBD5E1',
          400: '#94A3B8',  // ← placeholder text
          500: '#64748B',
          600: '#475569',  // ← secondary text
          700: '#334155',
          800: '#1E293B',  // ← sidebar background
          900: '#0F172A',  // ← primary text, dark sidebar
        },
        success: {
          50:  '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',  // ← confirmed status
          600: '#059669',
          700: '#065F46',
        },
        warning: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',  // ← pending status
          600: '#D97706',
          700: '#92400E',
        },
        danger: {
          50:  '#FEF2F2',
          100: '#FEE2E2',
          400: '#F87171',
          500: '#EF4444',  // ← error, cancelled
          600: '#DC2626',
          700: '#991B1B',
        },
        ai: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED',  // ← all AI features use purple
          700: '#6D28D9',
        },
      },

      // ── Custom Fonts ───────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      // ── Custom Animations ──────────────────────────
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fadeIn':  'fadeIn 0.2s ease-out',
        'slideIn': 'slideIn 0.3s ease-out',
        'shimmer': 'shimmer 1.5s infinite linear',
      },

      // ── Custom Shadows ─────────────────────────────
      boxShadow: {
        'xs':    '0 1px 2px rgba(0,0,0,0.05)',
        'sm':    '0 1px 3px rgba(0,0,0,0.06)',
        'md':    '0 4px 12px rgba(0,0,0,0.10)',
        'lg':    '0 8px 24px rgba(0,0,0,0.12)',
        'focus': '0 0 0 3px rgba(37,99,235,0.2)',
      },

      // ── Custom Border Radius ───────────────────────
      borderRadius: {
        'sm':  '4px',
        'md':  '8px',
        'lg':  '12px',
        'xl':  '16px',
        '2xl': '20px',
      },

      // ── Z-Index Scale ──────────────────────────────
      zIndex: {
        '60':   60,   // modals
        '70':   70,   // toasts
        '9999': 9999, // AI chat widget
      },
    },
  },
  plugins: [],
};
