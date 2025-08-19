module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}",
    ],
    theme: {
  extend: {
    animation: {
      "gradient-slow": "gradientBG 10s ease infinite",
    },
    keyframes: {
      gradientBG: {
        "0%, 100%": { backgroundPosition: "0% 50%" },
        "50%": { backgroundPosition: "100% 50%" },
      },
    },
  },
},
    plugins: [],
  }
  