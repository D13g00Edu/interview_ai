'use client';

import { useRouter } from "next/navigation";
import { useInterview } from "@/providers/InterviewProvider";
import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function StartPage() {
  const { updateInfo, state } = useInterview();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: state.name || '',
    position: state.position || '',
    level: state.level || 'Mid-Level (Intermedio)',
    type: state.type || 'Comportamiento (Behavioral)',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateInfo(formData);
    router.push('/interview');
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-background bg-hero-glow bg-subtle-pattern relative">
      <div className="absolute top-0 w-full">
        <Navbar />
      </div>

      <div className="max-w-xl w-full bg-card/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative z-10 mt-20 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Nueva Sesión</h1>
          <p className="text-foreground/60">Configura los detalles de tu simulación.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold ml-1 text-foreground/80">Tu Nombre</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Ej. Juan Pérez"
              className="w-full bg-background/50 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium placeholder:text-foreground/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold ml-1 text-foreground/80">Puesto Principal</label>
            <input 
              required
              type="text" 
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              placeholder="Ej. Software Engineer"
              className="w-full bg-background/50 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium placeholder:text-foreground/20"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold ml-1 text-foreground/80">Nivel</label>
              <select 
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                className="w-full bg-background/50 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium appearance-none"
              >
                <option>Junior (Principiante)</option>
                <option>Mid-Level (Intermedio)</option>
                <option>Senior (Avanzado)</option>
                <option>Lead / Staff (Líder)</option>
                <option>Manager (Gerente)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold ml-1 text-foreground/80">Tipo</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full bg-background/50 border border-white/10 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all font-medium appearance-none"
              >
                <option>Comportamiento (Behavioral)</option>
                <option>Arquitectura Técnica</option>
                <option>Sentido de Producto</option>
                <option>Coding / Lógica</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-6">
            <button 
              type="submit"
              className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-[0_0_30px_-5px_rgba(59,130,246,0.5)] hover:shadow-[0_0_40px_-5px_rgba(59,130,246,0.7)]"
            >
              Iniciar Simulación
            </button>
            <Link 
              href="/" 
              className="w-full py-3 text-foreground/40 hover:text-foreground text-center text-sm font-medium transition-colors"
            >
              Cancelar y volver
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
