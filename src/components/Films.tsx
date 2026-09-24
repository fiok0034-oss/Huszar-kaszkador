import React, { useState } from 'react';
import { Film as FilmIcon, Clapperboard, Sparkles } from 'lucide-react';

export const Films: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const films = [
    {
      title: 'NAPSZÁLLTA',
      note: 'Játékfilm · Magyar produkció',
      index: '01',
      period: 'Referencia',
    },
    {
      title: 'HADIK',
      note: 'Történelmi játékfilm · Magyar produkció',
      index: '02',
      period: 'Referencia',
    },
  ];

  return (
    <section id="filmek" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#1d2026]">
      {/* Section Header */}
      <div className="flex items-baseline gap-4 mb-10 border-b border-[#22252c] pb-4">
        <span className="font-mono text-xs text-[#6b7280]">03</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#f3f4f6] uppercase">
          FILMEK
        </h2>
      </div>

      {/* Quote / Editorial note as specified */}
      <div className="mb-10 p-4 sm:p-5 border-l-2 border-[#6b7280] bg-[#111317] text-[#d1d5db] text-sm sm:text-base italic flex items-center justify-between gap-4">
        <span>„Az elmúlt években több filmben is szerepeltem.”</span>
        <span className="hidden sm:inline font-mono text-[11px] not-italic text-[#6b7280] uppercase tracking-wider">
          SZEREPVÁLLALÁSOK
        </span>
      </div>

      {/* Interactive Film Cards connected with a subtle timeline trace */}
      <div className="relative">
        {/* Subtle connecting track line on desktop */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2d323b] to-transparent -translate-y-1/2 pointer-events-none z-0" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {films.map((film, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <div
                key={film.title}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group relative border bg-[#111317] p-5 sm:p-7 md:p-8 transition-all duration-300 overflow-hidden cursor-default ${
                  isHovered
                    ? 'border-[#4b5563] bg-[#14161c] shadow-[0_4px_24px_rgba(0,0,0,0.6)]'
                    : 'border-[#22252c]'
                }`}
              >
                {/* Subtle top hairline progress indicator */}
                <div
                  className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#9ca3af] to-transparent transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9ca3af]" />
                    <span className="font-mono text-xs text-[#6b7280] tracking-wider">
                      PRODUKCIÓ // {film.index}
                    </span>
                  </div>
                  <Clapperboard
                    size={18}
                    className={`transition-all duration-300 ${
                      isHovered
                        ? 'text-white -rotate-6 scale-110'
                        : 'text-[#6b7280]'
                    }`}
                  />
                </div>

                {/* Animated Film Title with subtle displacement */}
                <h3
                  className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-white uppercase mb-4 leading-tight tracking-tight break-words [overflow-wrap:anywhere] transition-transform duration-200 group-hover:translate-x-1"
                  style={{
                    wordBreak: 'break-word',
                    hyphens: 'auto',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {film.title}
                </h3>

                <div className="pt-4 border-t border-[#1b1e24] flex flex-col xs:flex-row xs:items-center justify-between gap-1 text-xs font-mono text-[#9ca3af]">
                  <span>{film.note}</span>
                  <span className="text-[#6b7280] group-hover:text-[#9ca3af] transition-colors">
                    KASZKADŐR SZEREPVÁLLALÁS
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footnote */}
      <div className="mt-8 flex items-center gap-2 text-xs font-mono text-[#6b7280]">
        <FilmIcon size={14} className="text-[#4b5563]" />
        <span>Részletes produkciós referenciák és egyeztetés szakmai felkérés esetén elérhető.</span>
      </div>
    </section>
  );
};
