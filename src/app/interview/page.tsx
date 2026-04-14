'use client';

import { useInterview } from "@/providers/InterviewProvider";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function InterviewPage() {
  const { state, addAnswer, generateQuestions } = useInterview();
  const router = useRouter();
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Initial questions generation
  useEffect(() => {
    if (state.position && state.questions.length === 0 && !state.loading) {
      generateQuestions();
    }
  }, [state.position, state.questions.length, state.loading, generateQuestions]);

  // Redirect if no position set
  useEffect(() => {
    if (!state.position && !state.loading) {
      router.replace('/start');
    }
  }, [state.position, state.loading, router]);

  // Handle auto-redirect after 5 questions
  useEffect(() => {
    if (state.currentStep > 5) {
      router.push('/results');
    }
  }, [state.currentStep, router]);

  // Simulate AI typing animation on step change
  useEffect(() => {
    if (state.questions.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [state.currentStep, state.questions.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAnswer.trim() || isTyping) return;
    
    addAnswer(currentAnswer);
    setCurrentAnswer("");
  };

  const progress = (state.currentStep / 5) * 100;
  const currentQuestion = state.questions[state.currentStep - 1] || (state.loading ? "Generando tu entrevista personalizada..." : "Preparando siguiente pregunta...");

  return (
    <main className="flex h-screen flex-col bg-background bg-hero-glow bg-subtle-pattern text-foreground overflow-hidden">
      {/* Header Professional */}
      <header className="border-b border-white/10 px-6 py-4 flex justify-between items-center bg-background/80 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center text-primary font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm md:text-base truncate">{state.position}</h2>
            <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-widest">{state.type} • {state.level}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6 shrink-0">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Progreso: {state.currentStep}/5</span>
            <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.8)]" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          </div>
          <Link href="/" className="px-4 py-2 border border-white/10 rounded-lg text-xs font-bold hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all">TERMINAR</Link>
        </div>
      </header>

      {/* Chat Area - Minimalist Dark */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col scroll-smooth relative z-10">
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-8 py-6">
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2">
               <div className="w-7 h-7 bg-primary rounded flex items-center justify-center text-[10px] text-white font-bold shadow-[0_0_15px_rgba(59,130,246,0.5)]">AI</div>
               <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest">Entrevistador</span>
            </div>
            
            <div className="bg-card/60 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-2xl shadow-2xl relative">
              {(isTyping || state.loading) ? (
                <div className="flex gap-1.5 items-center h-8">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                </div>
              ) : (
                <p className="text-xl md:text-2xl font-semibold leading-relaxed">
                  {currentQuestion}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Input Area - Controlled */}
      <div className="p-4 md:p-6 bg-background/80 backdrop-blur-md border-t border-white/10 shrink-0 relative z-20">
        <form 
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex flex-col gap-4"
        >
          <div className="relative border border-white/10 rounded-xl bg-black/40 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all shadow-inner">
            <textarea 
              autoFocus
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder={isTyping || state.loading ? "Esperando la pregunta..." : "Escribe tu respuesta aquí..."}
              disabled={isTyping || state.loading}
              className="w-full bg-transparent p-4 min-h-[100px] md:min-h-[160px] max-h-[250px] resize-none focus:outline-none text-base md:text-lg leading-relaxed disabled:opacity-50 placeholder:text-foreground/20"
            />
          </div>
          <div className="flex justify-between items-center">
             <div className="flex items-center gap-4 text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
               <span>Enter para enviar</span>
               <span className="hidden sm:inline opacity-50">•</span>
               <span className="hidden sm:inline">Shift+Enter para nueva línea</span>
             </div>
             <button 
              type="submit"
              disabled={isTyping || state.loading || !currentAnswer.trim()}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-30 disabled:grayscale text-sm shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.7)]"
            >
              Responder
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
