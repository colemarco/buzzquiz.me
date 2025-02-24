/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: "var(--primary)",
                    dark: "var(--primary-dark)",
                    light: "var(--primary-light)",
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    dark: "var(--secondary-dark)",
                    light: "var(--secondary-light)",
                },
                neutral: {
                    50: "var(--neutral-50)",
                    100: "var(--neutral-100)",
                    200: "var(--neutral-200)",
                    300: "var(--neutral-300)",
                    400: "var(--neutral-400)",
                    500: "var(--neutral-500)",
                    600: "var(--neutral-600)",
                    700: "var(--neutral-700)",
                    800: "var(--neutral-800)",
                    900: "var(--neutral-900)",
                },
                success: "var(--success)",
                warning: "var(--warning)",
                error: "var(--error)",
            },
            backgroundColor: {
                primary: "var(--primary)",
                "primary-dark": "var(--primary-dark)",
                "primary-light": "var(--primary-light)",
            },
            textColor: {
                primary: "var(--primary)",
                "primary-dark": "var(--primary-dark)",
                "primary-light": "var(--primary-light)",
            },
            borderColor: {
                primary: "var(--primary)",
                "primary-dark": "var(--primary-dark)",
                "primary-light": "var(--primary-light)",
            },
        },
    },
    plugins: [],
};
