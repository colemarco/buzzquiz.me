"use client";

import { SetStateAction, useState } from "react";
import QuizForm from "@/components/ui/QuizForm";
import QuizSubmitButton from "@/components/ui/QuizSubmitButton";
import QuizQuestionsContainer from "@/components/ui/QuizQuestionsContainer";
import QuizResult from "@/components/ui/QuizResult";
import AnimatedHeader from "@/components/layout/Header";

export default function Home() {
    const [quizData, setQuizData] = useState({
        quizTopic: "",
        quizBasis: "",
        isValid: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [validationError, setValidationError] = useState("");
    const [quizQuestions, setQuizQuestions] = useState(null);
    const [quizResult, setQuizResult] = useState(null);
    const [resultLoading, setResultLoading] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);

    // Handle form input changes
    const handleFormChange = (
        data: SetStateAction<{
            quizTopic: string;
            quizBasis: string;
            isValid: boolean;
        }>
    ) => {
        console.log("Form data changed:", data);
        setQuizData(data);

        if (validationError) {
            setValidationError("");
        }
        if (quizQuestions && !quizResult) {
            setQuizQuestions(null);
        }
    };

    // Handle quiz submission
    const handleQuizSubmit = async () => {
        if (!quizData.isValid) return;

        // For debugging, let's log what we're sending
        console.log("Submitting quiz with data:", {
            quizTopic: quizData.quizTopic,
            quizBasis: quizData.quizBasis,
        });

        setIsLoading(true);
        setValidationError("");

        try {
            // Bypass validation for now to debug
            const response = await fetch("/api/validate-quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quizTopic: quizData.quizTopic,
                    quizBasis: quizData.quizBasis,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to validate quiz");
            }

            const data = await response.json();
            console.log("Validation response:", data);

            if (data.isValid) {
                // Quiz is valid, proceed to generating questions directly
                generateQuizQuestions();
            } else {
                // Quiz is not valid, show error
                setValidationError(
                    "Your quiz prompt doesn't seem valid. Please try something more specific or meaningful."
                );
                setIsLoading(false);
            }

            // Temporarily skip validation and proceed directly to question generation
            generateQuizQuestions();
        } catch (error) {
            console.error("Error during quiz validation:", error);
            setValidationError("An error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    // Generate quiz questions
    const generateQuizQuestions = async () => {
        try {
            console.log("Generating questions with:", {
                quizTopic: quizData.quizTopic,
                quizBasis: quizData.quizBasis,
            });

            const response = await fetch("/api/generate-quiz", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quizTopic: quizData.quizTopic,
                    quizBasis: quizData.quizBasis,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to generate quiz questions");
            }

            const data = await response.json();
            console.log("Generated questions:", data);
            setQuizQuestions(data);
        } catch (error) {
            console.error("Error generating quiz questions:", error);
            setValidationError(
                "Failed to generate quiz questions. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    // Handle quiz answers submission
    const handleAnswersSubmit = async (userResponses: object) => {
        setResultLoading(true);

        try {
            console.log("Submitting answers:", userResponses);

            const response = await fetch("/api/process-results", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    quizTopic: quizData.quizTopic,
                    quizBasis: quizData.quizBasis,
                    userResponses,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to process quiz results");
            }

            const data = await response.json();
            console.log("Generated result:", data);
            setQuizResult(data);
        } catch (error) {
            console.error("Error processing quiz results:", error);
            setValidationError(
                "Failed to generate your results. Please try again."
            );
        } finally {
            setResultLoading(false);
        }
    };

    // Handle starting over
    const handleStartOver = () => {
        // Reset all state to initial values
        setQuizData({ quizTopic: "", quizBasis: "", isValid: false });
        setQuizQuestions(null);
        setQuizResult(null);
        setValidationError("");
        // Increment reset counter to force form reset
        setResetCounter((prev) => prev + 1);
        // Scroll to the top of the page
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <main className="container mx-auto px-4 py-8">
            <div className="quiz-container text-center">
                {/* Header/Logo will go here */}
                <AnimatedHeader />

                {/* Always show the form sentence with key to force re-render on reset */}
                <QuizForm
                    key={`quiz-form-${resetCounter}`}
                    onChange={handleFormChange}
                    isLoading={isLoading || resultLoading}
                />

                {/* Only show the button if we don't have questions yet */}
                {!quizQuestions && !quizResult && (
                    <div className="mt-4 flex justify-center flex-col items-center">
                        <QuizSubmitButton
                            isValid={quizData.isValid}
                            onSubmit={handleQuizSubmit}
                            isLoading={isLoading}
                        />

                        {/* Validation error message */}
                        {validationError && (
                            <div className="mt-4 text-red-500 max-w-md text-sm">
                                {validationError}
                            </div>
                        )}
                    </div>
                )}

                {/* Quiz Questions - only show if we have questions and no result yet */}
                {quizQuestions && !quizResult && (
                    <QuizQuestionsContainer
                        questions={quizQuestions}
                        onSubmit={handleAnswersSubmit}
                        isLoading={resultLoading}
                        // quizData={quizData}
                    />
                )}

                {/* Quiz Result - show if we have a result */}
                {quizResult && (
                    <QuizResult
                        result={quizResult}
                        onStartOver={handleStartOver}
                    />
                )}
            </div>
        </main>
    );
}
