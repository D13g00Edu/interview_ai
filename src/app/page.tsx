import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-premium">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex absolute top-10 px-10">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-border/50 bg-background/50 pb-6 pt-8 backdrop-blur-2xl lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-card-custom lg:p-4 shadow-sm">
          <p className="flex items-center gap-2 font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI Interview Coach <span className="opacity-40 font-normal">v1.0</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-8 animate-in fade-in duration-1000 mt-20">
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-gradient py-2">
          Master Your Next <br /> Big Interview
        </h1>
        <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl leading-relaxed">
          Powered by Anthropic AI to provide real-time feedback and realistic simulations tailored to your career goals.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link 
            href="/start" 
            className="px-10 py-5 bg-primary text-white rounded-full font-bold hover:opacity-90 transition-all hover:scale-105 shadow-xl shadow-indigo-500/25"
          >
            Get Started
          </Link>
          <button className="px-10 py-5 glass-card font-bold hover:bg-white/10 transition-all border-border-custom">
            Learn More
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-6xl w-full">
        <div className="glass-card p-8 space-y-4 border-border-custom">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Real-time Feedback</h3>
          <p className="text-foreground/60 leading-relaxed">Get instant analysis of your answers using advanced LLMs.</p>
        </div>
        <div className="glass-card p-8 space-y-4 border-border-custom">
          <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04kM12 21.75c-3.125 0-5.625-2.5-5.625-5.625S8.875 10.5 12 10.5s5.625 2.5 5.625 5.625-2.5 5.625-5.625 5.625z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Personalized Prep</h3>
          <p className="text-foreground/60 leading-relaxed">Scenarios generated based on your resume and target role.</p>
        </div>
        <div className="glass-card p-8 space-y-4 border-border-custom">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold">Detailed Analytics</h3>
          <p className="text-foreground/60 leading-relaxed">Track your progress and identify areas for improvement.</p>
        </div>
      </div>
    </main>
  );
}
