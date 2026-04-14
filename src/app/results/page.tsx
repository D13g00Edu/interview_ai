'use client';

import { useInterview } from "@/providers/InterviewProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const { state, reset, updateInfo } = useInterview();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if no interview data
  useEffect(() => {
    if ((!state.answers || state.answers.length === 0) && !loading) {
      router.replace('/');
    }
  }, [state.answers, loading, router]);

  // Fetch final report
  useEffect(() => {
    async function getReport() {
      if (state.sessionId && !report && !loading) {
        setLoading(true);
        try {
          const res = await fetch('/api/final-report', {
            method: 'POST',
            body: JSON.stringify({ sessionId: state.sessionId })
          });
          const data = await res.json();
          setReport(data);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
    }
    getReport();
  }, [state.sessionId, report, loading]);

  const finalScore = report?.totalScore || (state.answers.length > 0 ? "..." : "0");

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-6 bg-background text-foreground">
      <div className="max-w-4xl w-full space-y-8 md:space-y-12 py-8 md:py-12 animate-in fade-in duration-1000">
        <header className="text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
            Entrevista Completada
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gradient py-1">Resultados de la Sesión</h1>
          <p className="text-foreground/60 text-base md:text-lg max-w-2xl mx-auto">
            ¡Buen trabajo, {state.name || 'Candidato/a'}! Has completado tu simulación para el puesto de <strong>{state.position}</strong>.
          </p>
        </header>

        {/* Top Score Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="glass-card p-6 text-center space-y-2 border-primary/20 bg-primary/5 shadow-xl">
             <span className="text-xs font-bold text-primary uppercase tracking-widest">Puntaje General</span>
             <p className="text-5xl font-bold text-foreground">{finalScore}<span className="text-xl opacity-30">/10</span></p>
          </div>
          
          {report?.breakdown && (
            <>
              <div className="glass-card p-6 text-center space-y-2 border-border-custom bg-card/30">
                <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Claridad</span>
                <p className="text-3xl font-bold text-indigo-400">{report.breakdown.clarity}<span className="text-sm opacity-30">/10</span></p>
              </div>
              <div className="glass-card p-6 text-center space-y-2 border-border-custom bg-card/30">
                <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Relevancia</span>
                <p className="text-3xl font-bold text-pink-400">{report.breakdown.relevance}<span className="text-sm opacity-30">/10</span></p>
              </div>
              <div className="glass-card p-6 text-center space-y-2 border-border-custom bg-card/30">
                <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Comunicación</span>
                <p className="text-3xl font-bold text-purple-400">{report.breakdown.communication}<span className="text-sm opacity-30">/10</span></p>
              </div>
            </>
          )}
        </div>

        {/* Strengths & Weaknesses */}
        {report && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 animate-in slide-in-from-bottom-5 duration-700">
             <div className="glass-card p-6 md:p-8 bg-green-500/5 border-green-500/20">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-green-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  Fortalezas Clave
                </h4>
                <ul className="space-y-3">
                   {report.strengths.map((s: string, i: number) => (
                     <li key={i} className="flex gap-3 text-foreground/80 text-sm md:text-base">
                        <span className="text-green-500">•</span> {s}
                     </li>
                   ))}
                </ul>
             </div>
             <div className="glass-card p-6 md:p-8 bg-amber-500/5 border-amber-500/20">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-amber-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Áreas de Mejora
                </h4>
                <ul className="space-y-3">
                   {report.weaknesses.map((w: string, i: number) => (
                     <li key={i} className="flex gap-3 text-foreground/80 text-sm md:text-base">
                        <span className="text-amber-500">•</span> {w}
                     </li>
                   ))}
                </ul>
             </div>
          </div>
        )}

        {/* Featured Improved Answer */}
        {report?.improvedExample && (
           <div className="space-y-6 pt-4 md:pt-8 animate-in slide-in-from-bottom-10 duration-1000">
              <h3 className="text-2xl md:text-3xl font-bold px-2">Eleva tu Nivel de Comunicación</h3>
              <div className="glass-card p-6 md:p-10 bg-gradient-to-br from-primary/10 via-background to-secondary/10 border-primary/30 relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                 </div>
                 
                 <div className="space-y-8 relative z-10">
                   <div className="space-y-3">
                      <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-[0.2em] border-b border-border-custom pb-1">Tu Respuesta Original</span>
                      <p className="text-foreground/60 italic text-sm md:text-base leading-relaxed">"{report.improvedExample.original}"</p>
                   </div>
                   
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-tighter">Versión Élite (Sugerida)</span>
                         <div className="flex-1 h-px bg-primary/20" />
                      </div>
                      <p className="text-xl md:text-2xl font-semibold leading-relaxed text-foreground">
                        {report.improvedExample.improved}
                      </p>
                   </div>
                   
                   <div className="p-4 bg-background/60 backdrop-blur-md rounded-xl border border-primary/20 shadow-inner">
                      <p className="text-sm text-foreground/70 leading-relaxed">
                         <strong className="text-primary font-bold uppercase tracking-widest text-[10px] mr-2">¿Por qué es mejor?</strong> {report.improvedExample.whyBetter}
                      </p>
                   </div>
                 </div>
              </div>
           </div>
        )}

        {/* Detailed Questions List */}
        <div className="space-y-6 pt-8">
          <h3 className="text-xl md:text-2xl font-bold px-2">Análisis Detallado</h3>
          <div className="space-y-4 md:space-y-6">
            {state.answers.map((answer, i) => (
              <div key={i} className="glass-card p-6 md:p-10 space-y-6 border-l-4 border-l-primary/50 border-border-custom shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.2em]">Pregunta {i + 1}</span>
                  <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest px-2 py-1 bg-primary/5 rounded border border-primary/10">Análisis Completado</span>
                </div>
                <p className="text-lg md:text-xl font-bold text-foreground/80 leading-relaxed italic">"{state.questions[i] || `Pregunta ${i+1}`}"</p>
                <div className="space-y-3 p-5 md:p-6 bg-background/50 rounded-2xl border border-border-custom shadow-inner">
                  <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Tu Respuesta</span>
                  <p className="text-foreground/90 leading-relaxed text-base md:text-lg">{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-12 pb-24">
          <button 
            onClick={() => {
              reset();
              router.push('/');
            }}
            className="w-full sm:w-auto px-10 py-5 glass-card font-bold hover:bg-background/80 transition-all border-border-custom shadow-xl text-sm uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/50"
          >
            Volver al Inicio
          </button>
          <button 
            onClick={() => {
              const currentInfo = {
                name: state.name,
                position: state.position,
                level: state.level,
                type: state.type
              };
              reset();
              updateInfo(currentInfo);
              router.push('/start');
            }}
            className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95 text-sm uppercase tracking-widest outline-none focus:ring-4 focus:ring-primary/30"
          >
            Practicar de nuevo
          </button>
        </div>
      </div>
    </main>
  );
}
