import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { sessionId, question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const prompt = `Evaluate the following interview response:
    Question: ${question}
    Answer: ${answer}

    Provide feedback on:
    1. Clarity (0-10)
    2. Relevance (0-10)
    3. Communication Level (0-10)
    
    Total Score (0-10).
    Provide one concise piece of advice for improvement.

    Return ONLY a JSON object: { "clarity": index, "relevance": index, "communication": index, "total": index, "advice": "string" }
    No markdown, no backticks.`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    let evaluation;
    try {
      const jsonStr = content.match(/\{.*\}/s)?.[0] || content;
      evaluation = JSON.parse(jsonStr);
    } catch (e) {
      return NextResponse.json({ error: 'Evaluation failed' }, { status: 500 });
    }

    if (sessionId) {
      await supabase.from('answers').insert({
        session_id: sessionId,
        question,
        answer,
        score: evaluation.total,
        feedback: evaluation.advice
      });
    }

    return NextResponse.json(evaluation);

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
