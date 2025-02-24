/**
 * Theme configuration for the BuzzQuiz app
 * Centralizes color and styling values for consistency across components
 */

export const theme = {
    colors: {
        primary: "var(--primary)",
        primaryDark: "var(--primary-dark)",
        primaryLight: "var(--primary-light)",
        secondary: "var(--secondary)",
        secondaryDark: "var(--secondary-dark)",
        secondaryLight: "var(--secondary-light)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        success: "var(--success)",
        warning: "var(--warning)",
        error: "var(--error)",
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
    },

    fonts: {
        sans: "var(--font-sans)",
        display: "var(--font-display)",
        mono: "var(--font-mono)",
    },

    spacing: {
        // Define any custom spacing values here
        container: "1rem",
        containerSm: "1.5rem",
        containerLg: "2rem",
    },

    borderRadius: {
        sm: "0.25rem",
        md: "0.5rem",
        lg: "1rem",
        full: "9999px",
    },

    animation: {
        fast: "150ms",
        medium: "300ms",
        slow: "500ms",
    },

    boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
};

export default theme;
