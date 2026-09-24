import React from 'react';
import { ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[#1d2026] bg-[#090a0d] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-display font-bold text-sm tracking-wider text-[#f3f4f6] uppercase">
            Huszár Attila
          </div>
          <div className="text-xs text-[#6b7280] flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span>Gyalogos kaszkadőr</span>
            <span aria-hidden="true">·</span>
            <span>Páty, Magyarország</span>
            <span aria-hidden="true">·</span>
            <span>Független Magyar Kaszkadőrök Szövetsége</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-mono text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
            aria-label="Vissza a tetejére"
          >
            <span>VISSZA A TETEJÉRE</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
