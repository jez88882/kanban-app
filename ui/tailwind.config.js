module.exports = {
  content: ["./src/**/*.{html,js}"],
  daisyui: {
    themes: [
      {
        mytheme: {
        "primary": "#3174DE",
        "secondary": "#543CDE",
        "accent": "#26cdee",
        "neutral": "#FFFFFF",
        "base-100": "#F5F5F5",
        "info": "#53C0F3",
        "success": "#71EAD2",
        "warning": "#F3CC30",
        "error": "#E24056",
        },
      },
    ],
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  fontFamily: {
    sans: ['Poppins', 'sans-serif'],
  },
}