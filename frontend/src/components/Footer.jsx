import { ChefHat } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel mt-16 py-8 px-6 text-center text-slate-400 border-t-0">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-slate-300">
          <ChefHat size={24} className="text-orange-500" />
          <span className="text-xl font-bold">Flavour<span className="text-gradient">Book</span></span>
        </div>
        <p>© 2026 Flavour Book. A virtual cookbook system.</p>
      </div>
    </footer>
  );
}
