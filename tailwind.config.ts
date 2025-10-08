import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        bg_light: "#ffffff",
        bg_secondary: "#FBFAFC",
        event_management_bg: "#F4F5FE",

        text: {
          primary: "#1f1f1f",
        },
        primary: {
          DEFAULT: "#502E91", // Main color
          dark: "#293050",
          50: "#F3EBF8",
          100: "#E1D0F1",
          200: "#B8A1E3",
          300: "#9A78D5",
          400: "#6741AE",
          500: "#502E91", // Main color
          600: "#462582",
          700: "#3C1F73",
          800: "#2F1763",
          900: "#261253",
        },
        secondary: {
          DEFAULT: "#5865F2", // Main color
          100: "#D4D7FB",
          200: "#B3B8F4",
          300: "#8E9BE7",
          400: "#6A7CE1",
          500: "#5865F2", // Main color
          600: "#4C59E1",
          700: "#414CE1",
          800: "#3741D4",
          900: "#2E38C6",
        },
        lightViolet: {
          DEFAULT: "#D9DBFA",
          50: "#F4F5FC",
          100: "#E9EAF9",
          150: "#EBF2FF",
          200: "#D0D5F7",
          300: "#B8C0F5",
          400: "#A0A9F3",
          500: "#D9DBFA", // Main color
          600: "#8C8FF0",
          700: "#6A70E6",
          800: "#4E55DC",
          900: "#3C43D3",
        },
        lightPurple: {
          DEFAULT: "#F1EAFF",
          50: "#F9F5FF",
          100: "#F6ECFE",
          200: "#F0D9FD",
          300: "#EBC6FC",
          400: "#E2B3FB",
          500: "#F1EAFF", // Main color
          600: "#D9A9F9",
          700: "#C787F3",
          800: "#B563ED",
          900: "#9B4EE7",
        },
        pastelLavender: {
          DEFAULT: "#D6C4E3",
          50: "#F0E8F5",
          100: "#E6D9F0",
          200: "#D5B9E2",
          300: "#C79ACF",
          400: "#B57BC1",
          500: "#D6C4E3", // Main color
          600: "#9F6FBB",
          700: "#7F5498",
          800: "#663D7A",
          900: "#4E2960",
        },

        gray: {
          DEFAULT: "#F2F4F6",
          light: "#E0E0E0",
          dark: "#CED4DA",
          bg: "#F9FAFB",
          50: "#E7E9EB",
          100: "#E9ECEF",
          150: "#E6E6E6",
          200: "#DEE2E6",
          300: "#CED4DA",
          400: "#ADB5BD",
          500: "#6C757D",
          600: "#495057",
          700: "#343A40",
          800: "#202224",
          900: "#121416",
          1000: "#F8F7FA",
        },
        info: {
          DEFAULT: "#17A2B8", // primary info color
          light: "#62C6D9",
          dark: "#117D8F",
          50: "#E7F7FA",
          100: "#C7ECF3",
          200: "#96DDEB",
          300: "#62C6D9",
          400: "#35AEC4",
          500: "#17A2B8",
          600: "#117D8F",
          700: "#0D5A68",
          800: "#073740",
          900: "#032127",
        },
        success: {
          DEFAULT: "#28A745", // Green success color
          light: "#77D089",
          dark: "#208034",
          50: "#E5F6EB",
          100: "#C9EBD4",
          200: "#94D7A7",
          300: "#77D089",
          400: "#4CB96C",
          500: "#28A745",
          600: "#208034",
          700: "#175B24",
          800: "#0D3715",
          900: "#051A0A",
        },
        warning: {
          DEFAULT: "#FFC107", // Yellow warning color
          light: "#FFD75A",
          dark: "#C98A00",
          50: "#FFF8E1",
          100: "#FFECB3",
          200: "#FFE082",
          300: "#FFD75A",
          400: "#FFC107",
          500: "#FFA000",
          600: "#C98A00",
          700: "#997200",
          800: "#5A3E00",
          900: "#3E2A00",
        },
        error: {
          DEFAULT: "#DC3545", // Red error color
          light: "#E57373",
          dark: "#B92D3A",
          50: "#F9D9D9",
          100: "#F4B3B3",
          200: "#E57373",
          300: "#D75454",
          400: "#B92D3A",
          500: "#DC3545",
          600: "#AC1E29",
          700: "#7C0F16",
          800: "#560912",
          900: "#2E040A",
        },
        darkMode: {
          bg_dark: "rgb(84, 87, 103)",
          bg_dark_form: "#2F3349",
          bg_input_field: "#393D53",
          text_dark: "#D0CDE4",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
