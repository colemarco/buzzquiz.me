"use client";

import { useState, useEffect } from "react";
import DynamicInput from "./DynamicInput";

/**
 * QuizForm Component - Creates an interactive form with dynamic inputs
 *
 * @param {Object} props
 * @param {function} props.onChange - Function called when inputs change
 * @param {boolean} props.isLoading - Whether a request is currently in progress
 * @optional {Object} props.initialValues - Initial values for the inputs
 */

const topicPlaceholders = [
    "what dog breed I am",
    "which Taylor Swift era I belong in",
    "what type of pasta I would be",
    "which Hogwarts house I belong to",
    "what kind of tree I am",
    "which season matches my personality",
    "what vacation destination suits me",
    "which superhero I'd be",
    "what coffee drink represents me",
    "which classic novel character I am",
    //   "what musical instrument matches my vibe",
    //   "which historical era I should have lived in",
    "what type of pizza topping I am",
    "which Friends character I'm most like",
    "what cocktail matches my personality",
    "which planet represents me",
    "what mythical creature I would be",
    "which Disney character I am",
    "what shoe style matches my personality",
    "which ice cream flavor I would be",
];

const basisPlaceholders = [
    // "my taste in music",
    "my favorite rom com tropes",
    "my social media habits",
    "my daily routine",
    "my weekend activities",
    "my fashion choices",
    "my food preferences",
    "how I handle stress",
    "my dream vacation spots",
    "my relationship with technology",
    "my fictional character crushes",
    // "my favorite movies",
    "my fitness routine",
    "my morning rituals",
    "how I respond to awkward situations",
    "my communication style",
    "how I spend rainy days",
    "my biggest pet peeves",
    "my ideal date night",
    "my guilty pleasures",
];

const QuizForm = ({
    onChange,
    isLoading = false,
    initialValues = null, // Changed to null to avoid unexpected updates
}) => {
    const [quizTopic, setQuizTopic] = useState("");
    const [quizBasis, setQuizBasis] = useState("");

    // Update state when initialValues change, but only if explicitly provided
    useEffect(() => {
        if (initialValues) {
            setQuizTopic(initialValues.quizTopic || "");
            setQuizBasis(initialValues.quizBasis || "");
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

    // Validate and notify parent component
    const validateAndNotify = (topic, basis) => {
        const valid = topic.trim().length > 0 && basis.trim().length > 0;

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
                <span className="text-4xl font-medium">I want to know</span>
                <DynamicInput
                    value={quizTopic}
                    onChange={handleTopicChange}
                    placeholderOptions={topicPlaceholders}
                    className="text-primary font-medium text-4xl"
                    minWidth="180px"
                    inputProps={{
                        "aria-label": "Quiz topic",
                        "data-testid": "quiz-topic-input",
                        disabled: isLoading,
                    }}
                />
                <span className="text-4xl font-medium">based on</span>
                <DynamicInput
                    value={quizBasis}
                    onChange={handleBasisChange}
                    placeholderOptions={basisPlaceholders}
                    className="text-primary font-medium text-4xl"
                    minWidth="220px"
                    inputProps={{
                        "aria-label": "Quiz basis",
                        "data-testid": "quiz-basis-input",
                        disabled: isLoading,
                    }}
                />
            </div>
        </div>
    );
};

export default QuizForm;
