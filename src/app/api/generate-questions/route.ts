import { NextResponse } from 'next/server';
import { geminiModel } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';

const sanitize = (text: string) => (text || '').replace(/[<>]/g, '').slice(0, 150);

export async function POST(req: Request) {
  try {
    const { position, level, type, name } = await req.json();

    if (!position || !level || !type) {
      return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 });
    }

    const safePos = sanitize(position);
    const safeLevel = sanitize(level);
    const safeType = sanitize(type);
    const safeName = sanitize(name);

    const prompt = `Eres un entrevistador profesional. Crea 5 preguntas de entrevista para un candidato con el siguiente perfil:
    - Puesto: ${safePos}
    - Nivel de Seniority: ${safeLevel}
    - Tipo de Entrevista: ${safeType}
    ${safeName ? `- Nombre del Candidato: ${safeName}` : ''}

    Enfócate en ${safeType.includes('Comportamiento') ? 'habilidades blandas y situaciones pasadas' : 'profundidad técnica y resolución de problemas'}.
    Devuelve ÚNICAMENTE un array JSON de strings con las preguntas en ESPAÑOL. Ejemplo: ["Pregunta 1", "Pregunta 2", ...]
    No incluyas formato markdown ni comillas invertidas, solo el array JSON puro.`;

    if (!process.env.GEMINI_API_KEY) {
      console.error('CRITICAL: GEMINI_API_KEY is not defined.');
      return NextResponse.json({ error: 'Error de configuración del servicio IA' }, { status: 500 });
    }

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    let questions;
    try {
      const jsonStr = content.match(/\[.*\]/s)?.[0] || content;
      questions = JSON.parse(jsonStr);
    } catch (e) {
      console.error('Failed to parse Gemini response:', content);
      return NextResponse.json({ error: 'Error al generar preguntas' }, { status: 500 });
    }

    const { data: session, error: sbError } = await supabase
      .from('sessions')
      .insert({
        candidate_name: safeName || 'Anónimo',
        position: safePos,
        level: safeLevel,
        type: safeType,
        status: 'active'
      })
      .select()
      .single();

    if (sbError) {
      console.error('Supabase Error:', sbError);
    }

    return NextResponse.json({ 
      questions, 
      sessionId: session?.id 
    });

  } catch (error: any) {
    console.error('API Error in generate-questions:', error.message);
    return NextResponse.json({ error: 'Ocurrió un error en el servidor' }, { status: 500 });
  }
}
