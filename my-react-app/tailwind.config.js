/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        polarNight0: '#2E3440',
        polarNight1: '#3B4252',
        polarNight2: '#434C5E',
        polarNight3: '#4C566A',
        snowStorm0: '#D8DEE9',
        snowStorm1: '#E5E9F0',
        snowStorm2: '#ECEFF4',
        frost0: '#8FBCBB',
        frost1: '#88C0D0',
        frost2: '#81A1C1',
        frost3: '#5E81AC',
        auroraRed: '#BF616A',
        auroraOrange: '#D08770',
        auroraYellow: '#EBCB8B',
        auroraGreen: '#A3BE8C',
        auroraPurple: '#B48EAD',
      }
    },
  },
  plugins: [],
}