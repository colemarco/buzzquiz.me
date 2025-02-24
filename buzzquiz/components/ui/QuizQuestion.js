"use client";

import { useState } from "react";

/**
 * QuizQuestion Component - Renders a single quiz question with multiple choice options
 *
 * @param {Object} props
 * @param {Object} props.question - Question data object
 * @param {function} props.onAnswer - Function to call when an answer is selected
 * @param {string} props.selectedOption - Currently selected option (if any)
 * @param {boolean} props.disabled - Whether the question is disabled
 */
const QuizQuestion = ({
    question,
    onAnswer,
    selectedOption = null,
    disabled = false,
}) => {
    const [hoverOption, setHoverOption] = useState(null);

    if (!question) return null;

    const { question_id, question_text, options } = question;

    const handleSelectOption = (optionId) => {
        if (disabled) return;
        onAnswer && onAnswer(question_id, optionId);
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-2xl mx-auto mb-6 transition-all duration-300 hover:shadow-lg">
            <div className="p-5">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
                    {question_text}
                </h3>
            </div>

            <div className="h-px bg-gray-200 w-full"></div>

            <div className="p-2">
                {options.map((option) => (
                    <div
                        key={option.option_id}
                        className={`
              relative p-3 m-2 rounded-lg cursor-pointer transition-all duration-200
              ${
                  selectedOption === option.option_id
                      ? "bg-primary text-white"
                      : hoverOption === option.option_id
                      ? "bg-primary-light text-gray-800"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }
              ${disabled ? "opacity-70 cursor-not-allowed" : ""}
            `}
                        onClick={() => handleSelectOption(option.option_id)}
                        onMouseEnter={() => setHoverOption(option.option_id)}
                        onMouseLeave={() => setHoverOption(null)}
                    >
                        <div className="flex items-center">
                            <div
                                className={`
                flex items-center justify-center w-8 h-8 rounded-full mr-3 flex-shrink-0
                ${
                    selectedOption === option.option_id
                        ? "bg-white text-primary"
                        : "bg-white text-gray-600"
                }
              `}
                            >
                                {option.option_id}
                            </div>
                            <div
                                className={`
                text-md sm:text-lg
                ${
                    selectedOption === option.option_id
                        ? "font-medium"
                        : "font-normal"
                }
              `}
                            >
                                {option.option_text}
                            </div>
                        </div>

                        {selectedOption === option.option_id && (
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuizQuestion;
