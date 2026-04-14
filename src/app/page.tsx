import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background bg-hero-glow">
      <Navbar />

      <section className="flex flex-col items-center text-center px-6 pt-32 pb-16 md:pt-48 md:pb-24 max-w-4xl relative overflow-hidden flex-1 w-full bg-subtle-pattern">
        
        <div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 text-primary rounded-md text-xs font-bold uppercase tracking-wider mb-8">
          POTENCIADO POR GEMINI 3.1 ULTRA
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-[5rem] font-extrabold tracking-tight mb-8 leading-[1.05]">
          Maximiza tu Potencial en Entrevistas <br />
          con <span className="text-primary">Precisión Quirúrgica de IA.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-12 leading-relaxed">
          Domina cada pregunta con nuestro avanzado simulador de IA. Recibe feedback técnico instantáneo y consejos de comunicación para asegurar el trabajo de tus sueños.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link 
            href="/start" 
            className="px-10 py-5 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-[0_0_40px_-10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.8)] text-lg"
          >
            Comenzar
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-24 max-w-7xl w-full">
        <div className="p-8 rounded-2xl border border-border-custom bg-card hover:border-primary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-4">Análisis Técnico</h3>
          <p className="text-foreground/60 text-sm leading-relaxed">
            Evaluamos la profundidad de tus respuestas técnicas según el nivel de seniority requerido para la posición.
          </p>
        </div>
        
        <div className="p-8 rounded-2xl border border-border-custom bg-card hover:border-primary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21.75c-3.125 0-5.625-2.5-5.625-5.625S8.875 10.5 12 10.5s5.625 2.5 5.625 5.625-2.5 5.625-5.625 5.625z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-4">Feedback Estructural</h3>
          <p className="text-foreground/60 text-sm leading-relaxed">
            Mejoramos la estructura de tus respuestas para que transmitas confianza, claridad y liderazgo.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-border-custom bg-card hover:border-primary/50 transition-colors group relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold mb-4">Progreso Diario</h3>
          <p className="text-foreground/60 text-sm leading-relaxed">
            Identifica tus debilidades recurrentes y conviértelas en tus fortalezas más grandes mediante práctica constante.
          </p>
        </div>
      </div>

      <footer className="w-full border-t border-border-custom py-12 px-6 text-center text-foreground/40 text-sm bg-background/80 backdrop-blur-md relative z-10">
        <p>© 2026 InterviewCoach IA. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
