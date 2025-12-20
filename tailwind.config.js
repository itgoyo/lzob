/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        douyin: '#FE2C55',
        douyu: '#FF7000',
        huya: '#FF7F00',
        bilibili: '#00A1D6',
      },
    },
  },
  plugins: [],
}

