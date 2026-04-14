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
    if (state.answers.length === 0 && !loading) {
      router.replace('/');
    }
  }, [state.answers.length, loading, router]);

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

  const finalScore = report?.totalScore || (state.answers.length > 0 ? "Analyzing..." : "0");

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-background text-foreground">
      <div className="max-w-4xl w-full space-y-12 py-12 animate-in fade-in duration-1000">
        <header className="text-center space-y-4">
          <div className="inline-block px-4 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase tracking-widest mb-2">
            Interview Complete
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-gradient py-1">Session Results</h1>
          <p className="text-foreground/60 text-lg">
            Great job, {state.name || 'Candidate'}! You've completed your simulation for the <strong>{state.position}</strong> role.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 text-center space-y-2 border-border-custom shadow-lg">
             <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Questions</span>
             <p className="text-4xl font-bold text-primary">{state.answers.length} / 5</p>
          </div>
          <div className="glass-card p-6 text-center space-y-2 border-border-custom shadow-lg">
             <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Estimated Score</span>
             <p className="text-4xl font-bold text-indigo-500">{finalScore}{typeof finalScore === 'number' ? '/10' : ''}</p>
          </div>
          <div className="glass-card p-6 text-center space-y-2 border-border-custom shadow-lg">
             <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Type</span>
             <p className="text-4xl font-bold text-pink-500">{state.type.split(' ')[0]}</p>
          </div>
        </div>

        {report && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-5 duration-700">
             <div className="glass-card p-8 bg-green-500/5 border-green-500/20">
                <h4 className="text-sm font-bold uppercase tracking-widest text-green-500 mb-4">Key Strengths</h4>
                <ul className="list-disc list-inside space-y-2 text-foreground/70">
                   {report.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                </ul>
             </div>
             <div className="glass-card p-8 bg-amber-500/5 border-amber-500/20">
                <h4 className="text-sm font-bold uppercase tracking-widest text-amber-500 mb-4">Focus Areas</h4>
                <ul className="list-disc list-inside space-y-2 text-foreground/70">
                   {report.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                </ul>
             </div>
          </div>
        )}

        <div className="space-y-6">
          <h3 className="text-2xl font-bold px-2">Analysis by Question</h3>
          <div className="space-y-6">
            {state.answers.map((answer, i) => (
              <div key={i} className="glass-card p-10 space-y-6 border-l-4 border-l-primary/50 border-border-custom shadow-md">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-foreground/30 uppercase tracking-widest">Question {i + 1}</span>
                  <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-widest">Completed</div>
                </div>
                <p className="text-lg font-bold text-foreground/70 italic leading-relaxed">"{state.questions[i] || `Question ${i+1}`}"</p>
                <div className="space-y-3 p-6 bg-background/40 rounded-2xl border border-border-custom">
                  <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Your Answer</span>
                  <p className="text-foreground/90 leading-relaxed text-lg">{answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {report?.improvedExample && (
           <div className="space-y-6 pt-12">
              <h3 className="text-2xl font-bold px-2">How to level up</h3>
              <div className="glass-card p-10 bg-primary/5 border-primary/20 space-y-6">
                 <div className="space-y-2">
                    <span className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Original Point</span>
                    <p className="text-foreground/60 italic">"{report.improvedExample.original}"</p>
                 </div>
                 <div className="space-y-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-widest">Recommended Version</span>
                    <p className="text-xl font-medium leading-relaxed">{report.improvedExample.improved}</p>
                 </div>
                 <div className="p-4 bg-background/50 rounded-xl border border-border-custom">
                    <p className="text-sm text-foreground/50">
                       <strong className="text-primary mr-1">Why this works:</strong> {report.improvedExample.whyBetter}
                    </p>
                 </div>
              </div>
           </div>
        )}

        <div className="flex flex-wrap justify-center gap-6 pt-12 pb-24">
          <button 
            onClick={() => {
              reset();
              router.push('/');
            }}
            className="px-10 py-5 glass-card font-bold hover:bg-white/10 transition-all border-border-custom shadow-xl"
          >
            Back to Home
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
              router.push('/interview');
            }}
            className="px-10 py-5 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-all shadow-xl shadow-indigo-500/20 hover:scale-105"
          >
            Practice Again
          </button>
        </div>
      </div>
    </main>
  );
}
