'use client';

import { useRouter } from "next/navigation";
import { useInterview } from "@/providers/InterviewProvider";
import Link from "next/link";
import { useState } from "react";

export default function StartPage() {
  const { updateInfo, state } = useInterview();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: state.name || '',
    position: state.position || '',
    level: state.level || 'Mid-Level',
    type: state.type || 'Comportamiento (Behavioral)',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateInfo(formData);
    router.push('/interview');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-3xl w-full glass-card p-12 space-y-10 animate-in slide-in-from-bottom-10 duration-700 border-border-custom shadow-2xl">
        <div className="space-y-4 text-center">
          <h1 className="text-4xl font-bold text-gradient py-1">Prepara el Escenario</h1>
          <p className="text-foreground/60 font-medium">Configura tu sesión para obtener la experiencia más relevante.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Tu Nombre (Opcional)</label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="ej. Diego"
                className="w-full bg-background border border-border-custom p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium placeholder:text-foreground/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Puesto Objetivo</label>
              <input 
                required
                type="text" 
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                placeholder="ej. Desarrollador Senior Frontend"
                className="w-full bg-background border border-border-custom p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium placeholder:text-foreground/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Nivel de Experiencia</label>
              <select 
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full bg-background border border-border-custom p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium appearance-none"
              >
                <option>Junior (Principiante)</option>
                <option>Mid-Level (Intermedio)</option>
                <option>Senior (Avanzado)</option>
                <option>Lead / Staff (Líder)</option>
                <option>Manager (Gerente)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">Tipo de Entrevista</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-background border border-border-custom p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all font-medium appearance-none"
              >
                <option>Comportamiento (Behavioral)</option>
                <option>Arquitectura Técnica</option>
                <option>Sentido de Producto</option>
                <option>Coding / Lógica</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center pt-8">
            <Link href="/" className="text-foreground/40 hover:text-foreground transition-colors font-bold text-sm uppercase tracking-widest">
              ← Volver
            </Link>
            <button 
              type="submit"
              className="px-10 py-4 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-indigo-500/25"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
