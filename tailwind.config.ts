import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'train-blue': '#1e3a8a',
        'train-orange': '#fb923c',
        'train-yellow': '#fbbf24',
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'sans-serif'],
      },
      animation: {
        'dice-roll': 'diceRoll 1s ease-in-out',
        'piece-move': 'pieceMove 0.5s ease-in-out',
        'confetti': 'confetti 3s ease-out infinite',
      },
      keyframes: {
        diceRoll: {
          '0%, 100%': { transform: 'rotateX(0deg) rotateY(0deg)' },
          '25%': { transform: 'rotateX(180deg) rotateY(90deg)' },
          '50%': { transform: 'rotateX(360deg) rotateY(180deg)' },
          '75%': { transform: 'rotateX(180deg) rotateY(270deg)' },
        },
        pieceMove: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2) translateY(-10px)' },
          '100%': { transform: 'scale(1)' },
        },
        confetti: {
          '0%': { transform: 'translateY(-100vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(100vh) rotate(720deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
