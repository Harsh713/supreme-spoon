/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: "class", // ✅ Enables dark mode via "class"
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], // ✅ Ensure JSX files are included
    theme: {
      extend: {},
    },
    plugins: [],
  };
