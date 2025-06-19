/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#131605',
        text: '#fffefd',
        primary: '#d1803c',
        secondary: '#869c26',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        vinyl: {
          "primary": "#d1803c",
          "secondary": "#869c26",
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#131605",
          "base-content": "#fffefd",
        },
      },
    ],
  },
}
