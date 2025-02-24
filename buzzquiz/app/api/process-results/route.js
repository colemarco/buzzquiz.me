import { NextResponse } from "next/server";
import { callOpenAI } from "@/lib/api/openai";

export async function POST(request) {
    try {
        const body = await request.json();
        const { quizTopic, quizBasis, userResponses } = body;

        if (!quizTopic || !quizBasis || !userResponses) {
            return NextResponse.json(
                { error: "Missing required parameters" },
                { status: 400 }
            );
        }

        const messages = [
            {
                role: "system",
                content: `You are a quiz result generator. Based on the user's responses to a "${quizTopic}" quiz related to "${quizBasis}", 
        determine what ${quizTopic} they are.
        
        Return ONLY a valid JSON object with the following structure:
        
        {
          "result": "The specific ${quizTopic} name/type. If the use was asking what type of tree they'd be, your result would be some type of tree.",
          "explanation": "A witty explanation with reasoning, hopefully well-thought out crafted to relate their answers to the answer. A short paragrah."
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

        const response = await callOpenAI(messages, {
            temperature: 0.8,
            max_tokens: 800,
        });

        const contentText = response.choices[0].message.content.trim();

        try {
            const resultData = JSON.parse(contentText);
            return NextResponse.json(resultData);
        } catch (parseError) {
            console.error("Failed to parse OpenAI response:", parseError);
            console.error("Raw content:", contentText);
            return NextResponse.json(
                { error: "Invalid response format from OpenAI" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("API error in process-results:", error);

        return NextResponse.json(
            { error: "Failed to process quiz results" },
            { status: 500 }
        );
    }
}
