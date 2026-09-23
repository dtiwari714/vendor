/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Deep navy sidebar + a single confident blue accent, kept out of
        // "generic SaaS" territory by leaning slightly indigo rather than
        // the default #2563eb-everywhere look.
        navy: {
          900: "#101828",
          800: "#182234",
          700: "#212d42",
        },
        brand: {
          600: "#3454d1",
          700: "#2b44ac",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
