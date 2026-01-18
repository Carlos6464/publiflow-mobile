/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#f31b58",
        background: {
          light: "#f8f5f6",
          dark: "#221015",
        },
        surface: "#333333",
        textGray: "#8C8C8C",
      },
      fontFamily: {
        display: ["Inter"],
      },
    },
  },
  plugins: [],
}
