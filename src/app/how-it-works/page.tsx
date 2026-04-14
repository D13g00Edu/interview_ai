import Navbar from "@/components/Navbar";

export default function HowItWorksPage() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-background bg-hero-glow">
      <Navbar />

      <section className="flex flex-col items-center text-center px-6 pt-32 pb-24 md:pt-48 max-w-5xl relative overflow-hidden flex-1 w-full border-x border-border-custom bg-subtle-pattern">
        
        <div className="inline-block px-4 py-1.5 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
          Arquitectura Transparente
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8 leading-[1.1]">
          Cómo funciona la magia <br/>
          <span className="text-primary">al descubierto.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/60 max-w-2xl mb-24 leading-relaxed mx-auto">
          El motor de InterviewCoach combina la gestión de estado local con la potencia de los LLMs modernos para ofrecer una experiencia en tiempo real casi indetectable.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full text-left">
          
          <div className="flex flex-col space-y-6 relative">
            <div className="w-14 h-14 bg-card border border-border-custom text-primary rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-black/50 z-10 relative">1</div>
            <div className="absolute top-7 left-14 right-0 h-px bg-gradient-to-r from-border-custom to-transparent hidden md:block" />
            <h3 className="text-xl font-bold">Captura de Contexto</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">
              El motor de React gestiona tus preferencias (puesto, seniority) en un estado global persistente (Context API + SessionStorage). Esto asegura que la simulación siga activa aunque recargues la página accidentalmente, sin perder un solo dato.
            </p>
          </div>
          
          <div className="flex flex-col space-y-6 relative">
            <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-primary/20 z-10 relative">2</div>
            <div className="absolute top-7 left-14 right-0 h-px bg-gradient-to-r from-primary/30 to-transparent hidden md:block" />
            <h3 className="text-xl font-bold text-primary">Cerebro Gemini 3.1</h3>
            <p className="text-foreground/80 text-sm leading-relaxed">
              Enviamos tu perfil a través de API Routes (Next.js serverless) a Google Gemini. La IA interpreta prompts diseñados milimétricamente para generar preguntas técnicas concisas y evaluar tu desempeño comunicativo <strong>mientras escribes</strong>.
            </p>
          </div>

          <div className="flex flex-col space-y-6 relative">
            <div className="w-14 h-14 bg-card border border-border-custom text-primary rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-black/50 z-10 relative">3</div>
            <h3 className="text-xl font-bold">Persistencia y Reporte</h3>
            <p className="text-foreground/60 text-sm leading-relaxed">
              Guardamos la transcripción completa en tiempo real en Supabase (PostgreSQL). Al terminar, consolidamos los datos y la IA redacta un reporte final con métricas de 1 a 10 y versiones élite de tus propias respuestas.
            </p>
          </div>
          
        </div>
      </section>

      <footer className="w-full border-t border-border-custom py-12 px-6 text-center text-foreground/40 text-sm bg-background relative z-10">
        <p>© 2026 InterviewCoach IA. Todos los derechos reservados.</p>
      </footer>
    </main>
  );
}
