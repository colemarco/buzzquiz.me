import { NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/api/openai";

export async function POST(request) {
    try {
        const body = await request.json();
        const { quizTopic, quizBasis } = body;

        if (!quizTopic || !quizBasis) {
            return NextResponse.json(
                { error: "Missing quiz topic or basis" },
                { status: 400 }
            );
        }

        const quizData = await generateQuizQuestions({ quizTopic, quizBasis });

        return NextResponse.json(quizData);
    } catch (error) {
        console.error("API error in generate-quiz:", error);

        return NextResponse.json(
            { error: "Failed to generate quiz questions" },
            { status: 500 }
        );
    }
}
