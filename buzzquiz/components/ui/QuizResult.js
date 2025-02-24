"use client";

/**
 * QuizResult Component - Displays the final quiz result
 *
 * @param {Object} props
 * @param {Object} props.result - Result data from the API
 * @param {function} props.onStartOver - Function to handle starting over
 */
const QuizResult = ({ result, onStartOver }) => {
    if (!result) return null;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-2xl mx-auto mt-8 mb-6 p-6 text-center transition-all duration-300 hover:shadow-lg">
            <div className="text-4xl font-extrabold text-primary mb-6">
                {result.result}
            </div>

            <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {result.explanation}
            </p>

            <button
                onClick={onStartOver}
                className="px-8 py-3 rounded-full font-bold bg-primary text-white hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
            >
                Start a New Quiz
            </button>
        </div>
    );
};

export default QuizResult;
