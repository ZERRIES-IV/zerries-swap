/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        uniswap_bg:
          "radial-gradient(50% 50% at 50% 50%, #27292E 0%, rgba(255, 255, 255, 0) 100%)",
      },
    },
    screens: {
      'tablet': '426px',
      // => @media (min-width: 426px) { ... }

      'laptop': '1024px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1280px',
      // => @media (min-width: 1280px) { ... }
    },
  },
  plugins: [],
}

