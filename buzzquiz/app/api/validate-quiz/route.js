import { NextResponse } from 'next/server';
import { validateQuizPrompt } from '@/lib/api/openai';

export async function POST(request) {
  try {
    const body = await request.json();
    const { quizTopic, quizBasis } = body;
    
    if (!quizTopic || !quizBasis) {
      return NextResponse.json(
        { error: 'Missing quiz topic or basis' },
        { status: 400 }
      );
    }
    
    const isValid = await validateQuizPrompt({ quizTopic, quizBasis });
    
    return NextResponse.json({ isValid });
  } catch (error) {
    console.error('API error in validate-quiz:', error);
    
    return NextResponse.json(
      { error: 'Failed to validate quiz prompt' },
      { status: 500 }
    );
  }
}