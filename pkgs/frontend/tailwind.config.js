/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      width: {
        'InputWidth': '512px',
      },

      spacing: {
        18: "72px",
        26: "104px",

        "31pct": "31%",
        "68pct": "68%",
        "85pct": "85%",
        "89pct": "89%",
        "92pct": "92%",
      },

      fontFamily: {
        sans: ["Noto Sans"],
        mono: ["Noto Sans Mono"],
      },

      fontSize: {
        "6xl": "56px",
        "Title": ['1.5rem', {
          letterSpacing: '0.028em',
          fontWeight: '400',
        }],
        "BodyStrong": ['1rem', {
          fontWeight: '500',
        }],
        "BodyMono": [ '1.5rem', {
          fontWeight: '400',
        }

        ],
        "Button": ['1rem', {
          letterSpacing: '0.028em',
          fontWeight: '600',
        }],
        "Input": ['1.5rem', {
          fontWeight: '400',
        }],
        "InputLabel": ['1.5rem', {
          fontWeight: '400',
        }],
        "InputLabelFocus": ['0.9rem', {
          fontWeight: '400',
        }],
        "AvgScore": ['6rem', {
          fontWeight: '500',
        }],
      },

      colors: {
        Primary10: "#362C49",
        Primary20: "#463D57",
        Primary30: "#665E75",
        Primary40: "#6E677A",
        Primary50: "#9691A0",
        Primary60: "#E8E8ED",
        Input10: "#144F99",
        Input20: "#807C87",
        Input30: "#EBEFF5",
        Gray10: "#DCDBE2",
        Gray20: "#ECECF1",
        Gray30: "#F9F9FA",
        "white": "#FCFDFF",
        "pink-700": "#C3ABC2",
        "blue-400": "#6AA3EB",
      },

      backgroundImage: {
        LoginGradient: 'linear-gradient(-40deg, #6AA3EB, #C3ABC2)',
      },

      opacity: {
        8: ".08",
        24: ".24",
        48: ".48",
      },

      borderWidth: {
        3: "3px",
        12: "12px",
        24: "24px",
        40: "40px",
      },

      boxShadow: {
        'md': '6px 6px 8px 0 rgba(220, 219, 226, 0.24)',
        'lg': '0 16px 32px 4px rgba(54, 44, 73, 0.2)',
      },
    },
  },
  variants: {},
  plugins: [],
};