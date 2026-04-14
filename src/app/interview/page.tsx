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
    <main className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="border-b border-border-custom p-3 flex justify-between items-center bg-background/80 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-2 max-w-[60%]">
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary font-bold text-xs shrink-0">
            IA
          </div>
          <div className="min-w-0">
            <h2 className="font-bold tracking-tight text-xs truncate">Entrevista para {state.position}</h2>
            <p className="text-[8px] text-foreground/50 font-bold uppercase tracking-widest truncate">{state.type} • {state.level}</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest whitespace-nowrap">{state.currentStep}/5</span>
            <Link href="/" className="text-[9px] font-bold text-red-500 uppercase tracking-widest hover:underline whitespace-nowrap">Salir</Link>
          </div>
          <div className="w-16 md:w-32 h-1 bg-muted-custom rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }} 
            />
          </div>
        </div>
      </header>

      {/* Chat Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 scroll-smooth">
        <div className="max-w-3xl mx-auto w-full flex flex-col gap-6 py-4">
          {/* Current Question Bubble */}
          <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[8px] text-white font-bold">ALEX</div>
               <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest leading-none">Entrevistador</span>
            </div>
            
            <div className="glass-card p-5 md:p-10 relative border-border-custom shadow-xl">
              {(isTyping || state.loading) ? (
                <div className="flex gap-1.5 items-center h-6">
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" />
                </div>
              ) : (
                <p className="text-base md:text-2xl font-medium leading-relaxed">
                  {currentQuestion}
                </p>
              )}
            </div>
          </div>

          {/* Spacer to push content up if keyboard is not present, 
              but since we are flex-col it will be naturally handled */}
        </div>
      </div>

      {/* Input Area - Not fixed, just at the bottom of the flex container */}
      <div className="p-4 bg-background/80 backdrop-blur-xl border-t border-border-custom shrink-0">
        <form 
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto glass-card p-3 flex flex-col gap-3 shadow-lg border-primary/20 overflow-hidden"
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
            placeholder={isTyping || state.loading ? "Esperando..." : "Escribe tu respuesta..."}
            disabled={isTyping || state.loading}
            className="w-full bg-transparent p-1 min-h-[60px] md:min-h-[120px] max-h-[150px] md:max-h-[250px] resize-none focus:outline-none text-sm md:text-lg leading-relaxed disabled:opacity-50 placeholder:text-foreground/20"
          />
          <div className="flex justify-between items-center border-t border-border-custom pt-3">
             <span className="text-[8px] font-bold text-foreground/20 uppercase tracking-widest hidden sm:block">Shift+Enter para nueva línea</span>
             <button 
              type="submit"
              disabled={isTyping || state.loading || !currentAnswer.trim()}
              className="w-full sm:w-auto px-6 py-2 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-all disabled:opacity-30 hover:scale-[1.02] active:scale-95 text-xs md:text-sm shadow-lg shadow-indigo-500/20"
            >
              Responder
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
