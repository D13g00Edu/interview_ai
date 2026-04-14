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
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border-custom p-6 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold">
            IA
          </div>
          <div>
            <h2 className="font-bold tracking-tight">Entrevista para {state.position}</h2>
            <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-widest">{state.type} • {state.level}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Progreso: {state.currentStep}/5</span>
            <Link href="/" className="text-xs font-bold text-red-500 uppercase tracking-widest hover:underline">Salir</Link>
          </div>
          <div className="w-48 h-1.5 bg-muted-custom rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col gap-8 pb-32">
        {/* Current Question Bubble */}
        <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] text-white font-bold">ALEX</div>
             <span className="text-xs font-bold text-foreground/30 uppercase tracking-widest leading-none">Entrevistador</span>
          </div>
          
          <div className="glass-card p-10 relative border-border-custom shadow-xl">
            {(isTyping || state.loading) ? (
              <div className="flex gap-1.5 items-center h-8">
                <div className="w-2.5 h-2.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2.5 h-2.5 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2.5 h-2.5 bg-primary/50 rounded-full animate-bounce" />
                <span className="text-xs ml-2 text-foreground/40 italic font-medium anim-pulse">
                  {state.loading ? "Generando preguntas personalizadas..." : "Alex está escribiendo..."}
                </span>
              </div>
            ) : (
              <p className="text-2xl md:text-3xl font-medium leading-relaxed">
                {currentQuestion}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background via-background to-transparent z-40">
        <form 
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto glass-card p-4 flex flex-col gap-4 shadow-2xl border-primary/20 overflow-hidden"
        >
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
            placeholder={isTyping || state.loading ? "Esperando pregunta..." : "Escribe tu respuesta aquí..."}
            disabled={isTyping || state.loading}
            className="w-full bg-transparent p-4 min-h-[140px] max-h-[300px] resize-none focus:outline-none text-xl leading-relaxed disabled:opacity-50 placeholder:text-foreground/10"
          />
          <div className="flex justify-between items-center border-t border-border-custom pt-4 px-2">
            <span className="text-[10px] font-bold text-foreground/20 uppercase tracking-widest">Presiona Enter para enviar</span>
            <button 
              type="submit"
              disabled={isTyping || state.loading || !currentAnswer.trim()}
              className="px-10 py-3 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-30 disabled:grayscale hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20"
            >
              Responder
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
