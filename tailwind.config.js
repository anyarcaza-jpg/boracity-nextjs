/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ============================================
      // COLORES DE BORACITY
      // ============================================
      colors: {
        // Color principal (Naranja Boracity)
        primary: {
          DEFAULT: '#FF4500',   // Normal
          dark: '#E63E00',      // Hover/Active
          light: '#FF6B35',     // Backgrounds claros
        },
        // Color secundario (Gris azulado)
        secondary: {
          DEFAULT: '#2C3E50',
          light: '#34495E',
        },
      },
      
      // ============================================
      // ESPACIADOS PERSONALIZADOS
      // ============================================
      spacing: {
        'xs': '0.5rem',   // 8px
        'sm': '1rem',     // 16px
        'md': '1.5rem',   // 24px
        'lg': '2rem',     // 32px
        'xl': '3rem',     // 48px
        '2xl': '4rem',    // 64px
      },
      
      // ============================================
      // ANCHOS MÁXIMOS
      // ============================================
      maxWidth: {
        'container': '1400px',
        'content': '1200px',
        'narrow': '800px',
      },
      
      // ============================================
      // FUENTES
      // ============================================
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // ============================================
      // BORDER RADIUS
      // ============================================
      borderRadius: {
        'sm': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      
      // ============================================
      // SOMBRAS
      // ============================================
      boxShadow: {
        'sm': '0 2px 4px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'xl': '0 12px 32px rgba(0, 0, 0, 0.18)',
      },
    },
  },
  plugins: [],
}