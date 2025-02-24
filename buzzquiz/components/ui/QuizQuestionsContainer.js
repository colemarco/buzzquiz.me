"use client";

import { useState } from "react";
import QuizQuestion from "./QuizQuestion";

/**
 * QuizQuestionsContainer - Manages multiple quiz questions and their answers
 *
 * @param {Object} props
 * @param {Array} props.questions - Array of question objects
 * @param {function} props.onSubmit - Function to call when all questions are answered
 * @param {boolean} props.isLoading - Whether the form is currently submitting
 * @param {Object} props.quizData - Quiz topic and basis
 */
const QuizQuestionsContainer = ({
    questions,
    onSubmit,
    isLoading = false,
    quizData,
}) => {
    const [answers, setAnswers] = useState({});

    if (!questions || questions.length === 0) return null;

    const handleAnswer = (questionId, optionId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: optionId,
        }));
    };

    const isComplete = questions.every((q) => answers[q.question_id]);

    const handleSubmit = () => {
        if (isComplete && onSubmit && !isLoading) {
            // Format answers with both IDs and text for better context
            const formattedAnswers = Object.entries(answers).map(
                ([questionId, optionId]) => {
                    const question = questions.find(
                        (q) =>
                            q.question_id.toString() === questionId.toString()
                    );
                    const option = question
                        ? question.options.find((o) => o.option_id === optionId)
                        : null;

                    return {
                        question_id: questionId,
                        question_text: question ? question.question_text : "",
                        selected_option_id: optionId,
                        selected_option_text: option ? option.option_text : "",
                    };
                }
            );

            onSubmit(formattedAnswers);
        }
    };

    return (
        <div className="mt-8 mb-8">
            {/* Questions */}
            {questions.map((question) => (
                <QuizQuestion
                    key={question.question_id}
                    question={question}
                    onAnswer={handleAnswer}
                    selectedOption={answers[question.question_id]}
                    disabled={isLoading}
                />
            ))}

            {/* Submit button */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleSubmit}
                    disabled={!isComplete || isLoading}
                    className={`
            px-8 py-3 rounded-full font-bold
            transition-all duration-300 transform
            w-[180px] h-[50px] flex items-center justify-center
            ${
                isComplete && !isLoading
                    ? "bg-primary text-white hover:bg-primary-dark hover:scale-105"
                    : "bg-neutral-300 text-neutral-500 cursor-not-allowed"
            }
            ${isLoading ? "bg-primary-light cursor-wait" : ""}
          `}
                >
                    {isLoading ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                            <span className="absolute inset-0 flex items-center justify-center">
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                    ) : (
                        "Submit"
                    )}
                </button>
            </div>
        </div>
    );
};

export default QuizQuestionsContainer;
