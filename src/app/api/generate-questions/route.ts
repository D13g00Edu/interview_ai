import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const { position, level, type, name } = await req.json();

    if (!position || !level || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const prompt = `Eres un entrevistador profesional. Crea 5 preguntas de entrevista para un candidato con el siguiente perfil:
    - Puesto: ${position}
    - Nivel de Seniority: ${level}
    - Tipo de Entrevista: ${type}
    ${name ? `- Nombre del Candidato: ${name}` : ''}

    Enfócate en ${type.includes('Comportamiento') ? 'habilidades blandas y situaciones pasadas' : 'profundidad técnica y resolución de problemas'}.
    Devuelve ÚNICAMENTE un array JSON de strings con las preguntas en ESPAÑOL. Ejemplo: ["Pregunta 1", "Pregunta 2", ...]
    No incluyas formato markdown ni comillas invertidas, solo el array JSON puro.`;

    if (!process.env.GEMINI_API_KEY) {
      console.error('CRITICAL: GEMINI_API_KEY is not defined in environment variables.');
      return NextResponse.json({ error: 'AI Service configuration missing' }, { status: 500 });
    }

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    let questions;
    try {
      const jsonStr = content.match(/\[.*\]/s)?.[0] || content;
      questions = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse Gemini response. Content received:', content);
      return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
    }

    const { data: session, error: sbError } = await supabase
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

    if (sbError) {
      console.error('Supabase Error during session creation:', sbError);
      // We continue to allow the interview to proceed locally even if DB fails
    }

    return NextResponse.json({ 
      questions, 
      sessionId: session?.id 
    });

  } catch (error: any) {
    console.error('Unhandled API Error in generate-questions:', error);
    return NextResponse.json({ 
      error: error.message || 'Internal Server Error',
      details: error.stack || 'No stack trace available'
    }, { status: 500 });
  }
}
