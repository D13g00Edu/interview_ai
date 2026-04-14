import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between p-6 md:px-12 fixed top-0 z-50 bg-background/50 backdrop-blur-md border-b border-white/5">
      <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white text-xs">
          IA
        </div>
        <span>Interview<span className="text-white">Coach</span></span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-foreground/80">
        <Link href="/#features" className="hover:text-white transition-colors flex items-center gap-1">
          Características 
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </Link>
        <Link href="/how-it-works" className="hover:text-white transition-colors">Cómo funciona</Link>
        <Link href="/start" className="px-5 py-2.5 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all ml-4">
          Empezar
        </Link>
      </div>
    </nav>
  );
}
