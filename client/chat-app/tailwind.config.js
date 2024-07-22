/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        "varela":["Varela Round","sans-serif"],
      },
      colors: {
        "navbar_background": "#1A1C21",
        "custom_background":"#222528",
        "light_gray":"#2D2E32",
        "right_message":"#1A7071",
        "left_message":"#2D2E32",
      }
    },
  },
  plugins: [],
};
