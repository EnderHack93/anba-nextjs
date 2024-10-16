import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        royalBlue: {
          light: '#A5B4FC',       // Botones deshabilitados
          DEFAULT: '#4169E1',     // Principal
          dark: '#374ABE',        // Hover
          darker: '#2C3E91',      // Muy Oscuro
        },
        emeraldGreen: {
          light: '#A6E5C7',       // Botones deshabilitados
          DEFAULT: '#50C878',     // Principal
          dark: '#3CA165',        // Hover
          darker: '#2E7A52',      // Muy Oscuro
        },
        vividMagenta: {
          light: '#FF99C8',       // Botones deshabilitados
          DEFAULT: '#FF007F',     // Principal
          dark: '#CC0066',        // Hover
          darker: '#99004D',      // Muy Oscuro
        },
        coralRed: {
          light: '#FFA1A1',       // Botones deshabilitados
          DEFAULT: '#FF4040',     // Principal
          dark: '#D93636',        // Hover
          darker: '#B22C2C',      // Muy Oscuro
        },
      },
    },
  },
  plugins: [],
};
export default config;
