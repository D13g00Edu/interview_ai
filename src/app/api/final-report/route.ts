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

    const prompt = `Basado en la siguiente transcripción de entrevista, genera un reporte final de desempeño en ESPAÑOL:
    
    ${conversation}

    Proporciona:
    1. Puntaje General (/10)
    2. Desglose de puntajes (/10) para: Claridad, Relevancia, Comunicación.
    3. Fortalezas (top 2)
    4. Debilidades (top 2)
    5. Un ejemplo de una respuesta que podría mejorarse significativamente, y muestra una versión de "Alta Calidad" de esa misma respuesta.

    Devuelve ÚNICAMENTE un objeto JSON en este formato: { 
      "totalScore": number, 
      "breakdown": { "clarity": number, "relevance": number, "communication": number },
      "strengths": [], 
      "weaknesses": [], 
      "improvedExample": { "original": "", "improved": "", "whyBetter": "" } 
    }
    No uses formato markdown.`;

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
