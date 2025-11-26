/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        regular: ['Nunito_400Regular'],
        semibold: ['Nunito_600SemiBold'],
        bold: ['Nunito_700Bold'],
      },
      colors: {
        primary: '#6366F1',    // Indigo
        primaryLight: '#EEF2FF', // Indigo muito claro
        secondary: '#14B8A6',  // Teal
        secondaryLight: '#F0FDFA', // Teal muito claro
        background: '#F8FAFC', // Off-white
        surface: '#FFFFFF',
        text: '#1E293B',       // Slate 800
        textLight: '#64748B',  // Slate 500
        sos: '#F43F5E',        // Coral
      }
    },
  },
  plugins: [],
}

