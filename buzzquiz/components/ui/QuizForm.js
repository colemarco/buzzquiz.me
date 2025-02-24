"use client";

import { useState, useEffect } from "react";
import DynamicInput from "./DynamicInput";

/**
 * QuizForm Component - Creates an interactive form with dynamic inputs
 *
 * @param {Object} props
 * @param {function} props.onChange - Function called when inputs change
 * @param {boolean} props.isLoading - Whether a request is currently in progress
 * @param {Object} props.initialValues - Initial values for the inputs
 */
const QuizForm = ({
    onChange,
    isLoading = false,
    initialValues = null, // Changed to null to avoid unexpected updates
}) => {
    const [quizTopic, setQuizTopic] = useState("");
    const [quizBasis, setQuizBasis] = useState("");
    const [isValid, setIsValid] = useState(false);

    // Update state when initialValues change, but only if explicitly provided
    useEffect(() => {
        if (initialValues) {
            setQuizTopic(initialValues.quizTopic || "");
            setQuizBasis(initialValues.quizBasis || "");
            validateForm(
                initialValues.quizTopic || "",
                initialValues.quizBasis || ""
            );
        }
    }, [initialValues]);

    // Update validation status whenever inputs change
    const handleTopicChange = (e) => {
        const newTopic = e.target.value;
        setQuizTopic(newTopic);
        validateAndNotify(newTopic, quizBasis);
    };

    const handleBasisChange = (e) => {
        const newBasis = e.target.value;
        setQuizBasis(newBasis);
        validateAndNotify(quizTopic, newBasis);
    };

    // Validate that both inputs have content
    const validateForm = (topic, basis) => {
        setIsValid(topic.trim().length > 0 && basis.trim().length > 0);
    };

    // Validate and notify parent component
    const validateAndNotify = (topic, basis) => {
        const valid = topic.trim().length > 0 && basis.trim().length > 0;
        setIsValid(valid);

        if (onChange) {
            onChange({
                quizTopic: topic,
                quizBasis: basis,
                isValid: valid,
            });
        }
    };

    return (
        <div className="my-6">
            <div className="text-lg sm:text-xl md:text-2xl leading-relaxed inline-flex flex-wrap items-baseline justify-center gap-x-2">
                <span>I want to know</span>
                <DynamicInput
                    value={quizTopic}
                    onChange={handleTopicChange}
                    placeholder="what type of tree I am"
                    className="text-primary font-medium"
                    minWidth="180px"
                    inputProps={{
                        "aria-label": "Quiz topic",
                        "data-testid": "quiz-topic-input",
                        disabled: isLoading,
                    }}
                />
                <span>based on</span>
                <DynamicInput
                    value={quizBasis}
                    onChange={handleBasisChange}
                    placeholder="my favorite rom com tropes"
                    className="text-primary font-medium"
                    minWidth="220px"
                    inputProps={{
                        "aria-label": "Quiz basis",
                        "data-testid": "quiz-basis-input",
                        disabled: isLoading,
                    }}
                />
                <span>.</span>
            </div>
        </div>
    );
};

export default QuizForm;
