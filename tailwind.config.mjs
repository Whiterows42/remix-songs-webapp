/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffffff', // White for light mode
          dark: '#000000',  // Black for dark mode
        },
        text: {
          light: '#000000', // Black text for light mode
          dark: '#ffffff',  // White text for dark mode
        },
      },
    },
  },
  plugins: [],
};
