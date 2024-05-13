/** @type {import('tailwindcss').Config} */
const matcha = {
  text: "#7A7A7A",
  background: "#FBF9F8",
  primary: "#D2D7C6",
  secondary: "#4F5E50",
};

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    themes: {
      fantasy: {},
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["fantasy", "forest"],
  },
};
