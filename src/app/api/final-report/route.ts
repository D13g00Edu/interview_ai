import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const { data: answers, error: dbError } = await supabase
      .from('answers')
      .select('*')
      .eq('session_id', sessionId);

    if (dbError || !answers || answers.length === 0) {
      return NextResponse.json({ error: 'No data found for session' }, { status: 404 });
    }

    const conversation = answers.map(a => `Q: ${a.question}\nA: ${a.answer}`).join('\n\n');

    const prompt = `Based on the following interview transcript, generate a final performance report:
    
    ${conversation}

    Provide:
    1. Overall Score (/10)
    2. Strengths (top 2)
    3. Weaknesses (top 2)
    4. One example of an answer that could be significantly improved, and show a "High Quality" version of that same answer.

    Return ONLY a JSON object: { "totalScore": number, "strengths": [], "weaknesses": [], "improvedExample": { "original": "", "improved": "", "whyBetter": "" } }
    Do not use markdown formatting.`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    let report;
    try {
      const jsonStr = content.match(/\{.*\}/s)?.[0] || content;
      report = JSON.parse(jsonStr);
    } catch (e) {
      return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
    }

    await supabase
      .from('sessions')
      .update({ status: 'completed' })
      .eq('id', sessionId);

    return NextResponse.json(report);

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
