/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        benzin: ["var(--font-benzin)"],
        astron: ["var(--font-astron)"],
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
