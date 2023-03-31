/** @type {import('tailwindcss').Config} */

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  darkMode: "class", // or 'media' or 'class'
  content: ["./src/**/*.{html,js,vue}", "./index.html",  "./node_modules/flowbite/**/*.js"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: {
          DEFAULT: "#1f2a30",
        },
      },
    },
    fontSize: {
      sm: "0.8rem",
      base: "1rem",
      xl: "1.25rem",
      "2xl": "1.563rem",
      "3xl": "1.953rem",
      "4xl": "2.441rem",
      "5xl": "3.052rem",
      "6xl": "4.052rem",
      "7xl": "5.052rem",
      "8xl": "6.052rem",
      "9xl": "7.052rem",
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
};
