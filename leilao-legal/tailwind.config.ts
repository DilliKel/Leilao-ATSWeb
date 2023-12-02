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
    },
    plugins: [],
};
export default config;
