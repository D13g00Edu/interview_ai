import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { position, level, type, name } = await req.json();

    if (!position || !level || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `You are a professional interviewer. Create 5 interview questions for a candidate with the following profile:
    - Position: ${position}
    - Seniority Level: ${level}
    - Interview Type: ${type}
    ${name ? `- Candidate Name: ${name}` : ''}

    Focus on ${type === 'Behavioral' ? 'situational and soft skills' : 'technical depth and problem solving'}.
    Return ONLY a JSON array of strings containing the questions. Example: ["Question 1", "Question 2", ...]
    Do not include markdown formatting or backticks, just the raw JSON array.`;

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    let questions;
    try {
      // Clean potential markdown or extra text
      const jsonStr = content.match(/\[.*\]/s)?.[0] || content;
      questions = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse Gemini response', content);
      return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
    }

    const { data: session } = await supabase
      .from('sessions')
      .insert({
        candidate_name: name || 'Anonymous',
        position,
        level,
        type,
        status: 'active'
      })
      .select()
      .single();

    return NextResponse.json({ 
      questions, 
      sessionId: session?.id 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
