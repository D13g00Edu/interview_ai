import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { sessionId, question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 });
    }

    const prompt = `Evalúa la siguiente respuesta de entrevista:
    Pregunta: ${question}
    Respuesta: ${answer}

    Proporciona feedback sobre:
    1. Claridad (0-10)
    2. Relevancia (0-10)
    3. Nivel de Comunicación (0-10)
    
    Puntaje Total (0-10).
    Proporciona un consejo conciso para mejorar en ESPAÑOL.

    Devuelve ÚNICAMENTE un objeto JSON en este formato: { "clarity": index, "relevance": index, "communication": index, "total": index, "advice": "string" }
    Sin markdown, sin comillas invertidas.`;

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
