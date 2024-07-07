/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "pixel":["Pixelify Sans","sans-serif"],
      },
      colors: {
        "navbar_background": "#1a1d20",
        "custom_background":"#222429"
      }
    },
  },
  plugins: [],
};
