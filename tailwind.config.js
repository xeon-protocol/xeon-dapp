/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "button-gradient": "linear-gradient(135deg, #3758FF 0%, #2447F2 100%)",
      },
      borderImage: {
        "gradient-to-transparent":
          "linear-gradient(to bottom, #f2f2f2, transparent) 1",
      },
      colors: {
        dark: "#181818",
        black: "#000000",
        fern: "#dadada",
        grey: "#f2f2f2",
        "light-blue": "#5b62f4",
        blue: "#4a64e5",
        muted: "#71637F",
        "deep-purple": "#470c85",
        "light-purple": "#aa79e5",
        lime: "#a0ee6a",
        orange: "#ffa64",
        floral: "#e5456d",
        turquoise: "#68dbff",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".border-gradient-to-transparent": {
          borderImage: "linear-gradient(to bottom, #f2f2f2, transparent) 1",
        },
      });
    },
  ],
};
