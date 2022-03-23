module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#9E9E9E',
      },
      borderColor: {
        light: '#EAEAEA',
        dark: '#252525'
      }
    },
  },
  plugins: [],
};
