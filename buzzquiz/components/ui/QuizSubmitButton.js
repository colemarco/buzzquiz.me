"use client";

import { useState } from "react";

/**
 * QuizSubmitButton - A dedicated button component for submitting quiz requests
 * with consistent sizing between states
 *
 * @param {Object} props
 * @param {boolean} props.isValid - Whether form inputs are valid for submission
 * @param {function} props.onSubmit - Function to call when button is clicked
 * @param {boolean} props.isLoading - Whether a request is currently in progress
 * @param {string} props.className - Additional CSS classes
 */
const QuizSubmitButton = ({
    isValid = false,
    onSubmit,
    isLoading = false,
    className = "",
}) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleClick = () => {
        if (isValid && !isLoading && onSubmit) {
            onSubmit();
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={!isValid || isLoading}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`
        mt-8 px-8 py-3 rounded-full font-bold
        transition-all duration-300 transform 
        w-[180px] h-[50px] flex items-center justify-center
        ${isHovered && isValid && !isLoading ? "scale-105" : "scale-100"}
        ${
            isValid && !isLoading
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
        }
        ${isLoading ? "bg-primary-light cursor-wait" : ""}
        ${className}
      `}
            aria-busy={isLoading}
            data-testid="quiz-submit-button"
        >
            {/* Pre-render both states but only show one */}
            <div className="relative w-full h-full flex items-center justify-center">
                {/* Normal state */}
                <span
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                        isLoading ? "opacity-0" : "opacity-100"
                    }`}
                >
                    Quiz me!
                </span>

                {/* Loading state */}
                <span
                    className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${
                        isLoading ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <svg
                        className="animate-spin -ml-1 mr-2 h-10 w-10 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    Processing...
                </span>
            </div>
        </button>
    );
};

export default QuizSubmitButton;
