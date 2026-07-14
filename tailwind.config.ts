import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        fontSize: {
            minusculo: ["10px", "14px"],
            quaseminusculo: ["12px", "14px"],
            sm: ["14px", "15px"],
            base: ["16px", "24px"],
            lg: ["20px", "28px"],
            xl: ["24px", "32px"],
        },
        extend: {
            fontFamily: {
                display: ["var(--font-display)", "serif"],
            },
            boxShadow: {
                gold: "0 0 0 1px rgba(251,191,36,0.35), 0 12px 32px -12px rgba(251,191,36,0.45)",
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(6px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.25s ease-out forwards",
            },
        },
    },
    plugins: [],
};
export default config;
