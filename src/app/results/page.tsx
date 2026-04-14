'use client';

import { useInterview } from "@/providers/InterviewProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";

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
    <main className="flex min-h-screen flex-col items-center bg-background bg-hero-glow bg-subtle-pattern text-foreground pb-20 relative">
      <div className="absolute top-0 w-full">
        <Navbar />
      </div>

      <div className="max-w-5xl w-full px-6 py-12 md:py-20 mt-24 animate-in fade-in duration-1000 relative z-10">
        
        {/* Header Results */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-xs font-bold uppercase tracking-widest">
            Sesión Finalizada
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Análisis de Desempeño</h1>
          <p className="text-foreground/60 max-w-2xl mx-auto text-lg">
            Buen trabajo, <span className="text-white font-bold">{state.name || 'Candidato'}</span>. Hemos analizado tus respuestas para el puesto de <strong className="text-primary">{state.position}</strong>.
          </p>
        </div>

        {/* Global Score & Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <div className="lg:col-span-1 bg-primary text-white p-10 rounded-2xl flex flex-col items-center justify-center space-y-3 shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity" />
             <span className="text-xs font-bold uppercase tracking-[0.2em] opacity-80 z-10">Puntaje General</span>
             <p className="text-7xl font-black z-10">{finalScore}<span className="text-2xl opacity-50">/10</span></p>
          </div>
          
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-card/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Claridad</span>
              <p className="text-3xl font-bold">{report?.breakdown?.clarity || '--'}<span className="text-sm opacity-30">/10</span></p>
            </div>
            <div className="bg-card/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Relevancia</span>
              <p className="text-3xl font-bold">{report?.breakdown?.relevance || '--'}<span className="text-sm opacity-30">/10</span></p>
            </div>
            <div className="bg-card/80 backdrop-blur-md border border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center space-y-2 hover:border-primary/50 transition-colors">
              <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Comunicación</span>
              <p className="text-3xl font-bold">{report?.breakdown?.communication || '--'}<span className="text-sm opacity-30">/10</span></p>
            </div>
          </div>
        </div>

        {/* Improved Answer Section */}
        {report?.improvedExample && (
           <div className="bg-card/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 md:p-12 mb-12 shadow-lg">
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-1.5 h-6 bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                Sugerencia de Mejora Clave
              </h3>
              
              <div className="space-y-10">
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">Tu Intervención Original</h4>
                   <p className="text-foreground/70 italic text-lg leading-relaxed border-l-4 border-white/10 pl-6">"{report.improvedExample.original}"</p>
                </div>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-4">
                      <span className="px-2 py-0.5 bg-primary/20 text-primary border border-primary/30 text-[10px] font-black rounded uppercase">Versión Élite</span>
                      <div className="flex-1 h-px bg-white/10" />
                   </div>
                   <p className="text-2xl md:text-3xl font-bold leading-tight text-white drop-shadow-md">
                     {report.improvedExample.improved}
                   </p>
                   <div className="bg-black/40 border border-white/5 p-5 rounded-xl shadow-inner mt-6">
                      <p className="text-sm text-foreground/70">
                         <span className="font-bold text-primary mr-2">Por qué funciona:</span> {report.improvedExample.whyBetter}
                      </p>
                   </div>
                </div>
              </div>
           </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 border-t border-white/10 pt-12">
           <button 
             onClick={() => {
               reset();
               router.push('/');
             }}
             className="px-10 py-4 bg-transparent border border-white/20 rounded-xl font-bold hover:bg-white/5 transition-all text-sm"
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
             className="px-10 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all text-sm shadow-[0_0_30px_-5px_rgba(59,130,246,0.6)] hover:shadow-[0_0_50px_-5px_rgba(59,130,246,0.8)]"
           >
             Practicar de Nuevo
           </button>
        </div>
      </div>
    </main>
  );
}
