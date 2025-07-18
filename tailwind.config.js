/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        blink: "blink 1s steps(2, start) infinite",  
        fadeIn: 'fadeIn 1s ease-in forwards',
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: 1 }, 
          "50%": { opacity: 0 }, 
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss'),
    require('autoprefixer'),
  ]
}

 
