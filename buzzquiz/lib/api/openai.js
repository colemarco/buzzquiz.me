/**
 * OpenAI API utility functions for BuzzQuiz
 */

// Function to validate API environment variables
const validateEnv = () => {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error("Missing OPENAI_API_KEY environment variable");
    }
};

/**
 * Makes a request to the OpenAI API
 *
 * @param {Array} messages - Array of message objects in the OpenAI format
 * @param {Object} options - Additional options for the API call
 * @returns {Promise<Object>} - The API response
 */
export async function callOpenAI(messages, options = {}) {
    validateEnv();

    const defaultOptions = {
        model: "gpt-3.5-turbo",
        temperature: 0.7,
        max_tokens: 1000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    };

    const requestOptions = {
        ...defaultOptions,
        ...options,
        messages,
    };

    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify(requestOptions),
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("OpenAI API Error:", error);
            throw new Error(
                `OpenAI API error: ${error.error?.message || "Unknown error"}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        throw error;
    }
}

/**
 * Validates a quiz prompt to ensure it's valid and possible to generate
 *
 * @param {Object} quizData - Object containing quizTopic and quizBasis
 * @returns {Promise<boolean>} - Whether the quiz is valid
 */
export async function validateQuizPrompt(quizData) {
    const { quizTopic, quizBasis } = quizData;

    const messages = [
        {
            role: "system",
            content: `You are a quiz validation assistant. Your job is to determine if a quiz topic and basis make sense 
        and could be used to generate a meaningful BuzzFeed-style personality quiz. Respond with ONLY 'true' or 'false'.
        
        Examples of valid quiz prompts:
        - "I want to know what type of tree I am based on my favorite rom com tropes" (true)
        - "I want to know what Greek dish I am based on my travel preferences" (true)
        - "I want to know what 90s song I am based on my morning routine" (true)
        
        Examples of invalid quiz prompts:
        - "asdfjkl based on qwerty" (false)
        - "I want to know what fgdfsgs I am based on my tyiophj" (false)
        - nonsensical or extremely offensive prompts (false)
        
        Only respond with the word 'true' or 'false' - no other text.`,
        },
        {
            role: "user",
            content: `Quiz Topic: "${quizTopic}"
        Quiz Basis: "${quizBasis}"
        
        Is this a valid quiz prompt that could generate a meaningful personality quiz? Answer only 'true' or 'false'.`,
        },
    ];

    try {
        const response = await callOpenAI(messages, {
            temperature: 0.3, // Lower temperature for more consistent responses
            max_tokens: 10, // We only need a short response
        });

        const result = response.choices[0].message.content.trim().toLowerCase();
        return result === "true";
    } catch (error) {
        console.error("Error validating quiz prompt:", error);
        throw error;
    }
}

/**
 * Generates quiz questions based on the quiz topic and basis
 *
 * @param {Object} quizData - Object containing quizTopic and quizBasis
 * @returns {Promise<Object>} - Quiz questions in structured format
 */
export async function generateQuizQuestions(quizData) {
    const { quizTopic, quizBasis } = quizData;

    const messages = [
        {
            role: "system",
            content: `You are a quiz generation assistant. Create a fun BuzzFeed-style quiz based on the given topic and basis.
        Generate between 5 and 9 multiple-choice questions that will help determine what ${quizTopic} the user is. The questions must all be related in some way to the basis.
        
        Return ONLY a valid JSON object with the following structure:
        
        {
          "quiz_title": "What ${quizTopic} Are You Based On ${quizBasis}?",
          "questions": [
            {
              "question_id": 1,
              "question_text": "Question text here",
              "options": [
                {"option_id": "A", "option_text": "Option text"},
                {"option_id": "B", "option_text": "Option text"},
                {"option_id": "C", "option_text": "Option text"},
                {"option_id": "D", "option_text": "Option text"}
              ]
            }
            // Questions 2-5 follow the same structure
          ]
        }
        
        Do not include any explanations or additional text - just the JSON object.`,
        },
        {
            role: "user",
            content: `Quiz Topic: "${quizTopic}"
        Quiz Basis: "${quizBasis}"
        
        Generate a fun personality quiz with 5 multiple-choice questions.`,
        },
    ];

    try {
        const response = await callOpenAI(messages, {
            temperature: 0.7,
            max_tokens: 1000,
        });

        const contentText = response.choices[0].message.content.trim();

        // Try to parse the JSON response
        try {
            return JSON.parse(contentText);
        } catch (parseError) {
            console.error("Failed to parse OpenAI JSON response:", parseError);
            console.error("Raw content:", contentText);
            throw new Error("Invalid JSON format in OpenAI response");
        }
    } catch (error) {
        console.error("Error generating quiz questions:", error);
        throw error;
    }
}

/**
 * Processes quiz results based on user responses
 *
 * @param {Object} quizData - Quiz topic and basis
 * @param {Object} userResponses - User's answers to quiz questions
 * @returns {Promise<Object>} - Quiz result in structured format
 */
export async function processQuizResults(quizData, userResponses) {
    const { quizTopic, quizBasis } = quizData;

    const messages = [
        {
            role: "system",
            content: `You are a quiz result generator. Based on the user's responses to a "${quizTopic}" quiz related to "${quizBasis}", 
        determine what ${quizTopic} they are.
        
        Return ONLY a valid JSON object with the following structure:
        
        {
          "result": "The specific ${quizTopic} name/type. If the user was asking what type of candy they'd be, your result would be some type of candy.",
          "explanation": "A witty explanation with reasoning, hopefully well-thought out crafted to relate their answers to the answer. Do not directly respond to every answer, but create a narrative that matches the vibe of their answers. A short paragrah with an excited tone.",
        }
        
        Do not include any explanations or additional text - just the JSON object.`,
        },
        {
            role: "user",
            content: `Quiz Topic: "${quizTopic}"
        Quiz Basis: "${quizBasis}"
        
        User Responses:
        ${JSON.stringify(userResponses, null, 2)}
        
        Generate a personalized result for what ${quizTopic} this person is.`,
        },
    ];

    try {
        const response = await callOpenAI(messages, {
            temperature: 0.9, // Higher temperature for more creative results
            max_tokens: 800,
        });

        const contentText = response.choices[0].message.content.trim();

        // Try to parse the JSON response
        try {
            return JSON.parse(contentText);
        } catch (parseError) {
            console.error("Failed to parse OpenAI JSON response:", parseError);
            console.error("Raw content:", contentText);
            throw new Error("Invalid JSON format in OpenAI response");
        }
    } catch (error) {
        console.error("Error processing quiz results:", error);
        throw error;
    }
}
