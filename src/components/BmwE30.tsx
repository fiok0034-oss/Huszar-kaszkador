import React from 'react';
import { BmwE30Blueprint } from './BmwE30Blueprint';
import { Wrench, Gauge, Compass } from 'lucide-react';

export const BmwE30: React.FC = () => {
  return (
    <section id="e30" className="relative py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#1d2026] overflow-hidden">
      {/* Subtle Technical Blueprint Frame & Coordinate System SVG Overlay */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">
        {/* Background fine drafting grid */}
        <div className="absolute inset-0 bg-blueprint-fine opacity-20" />

        {/* Blueprint coordinate frame SVG */}
        <svg
          className="w-full h-full absolute inset-0 text-[#4b5563] opacity-35"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Pattern for ruler scale ticks on the top edge */}
            <pattern id="ruler-ticks" width="20" height="8" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="4" stroke="#4b5563" strokeWidth="0.75" />
              <line x1="10" y1="0" x2="10" y2="7" stroke="#6b7280" strokeWidth="0.75" />
            </pattern>
          </defs>

          {/* Top and Bottom millimeter scale rulers */}
          <rect x="0" y="0" width="100%" height="8" fill="url(#ruler-ticks)" />
          <rect x="0" y="calc(100% - 8px)" width="100%" height="8" fill="url(#ruler-ticks)" />

          {/* Corner Precision Reticles & Brackets */}
          {/* Top-Left */}
          <path d="M 8 28 L 8 8 L 28 8" fill="none" stroke="#6b7280" strokeWidth="1" />
          <circle cx="8" cy="8" r="1.5" fill="#9ca3af" />
          <text x="34" y="16" fill="#6b7280" fontSize="9" fontFamily="monospace">COORD: 00 // WORKSHOP</text>

          {/* Top-Right */}
          <path d="M calc(100% - 8px) 28 L calc(100% - 8px) 8 L calc(100% - 28px) 8" fill="none" stroke="#6b7280" strokeWidth="1" />
          <circle cx="calc(100% - 8px)" cy="8" r="1.5" fill="#9ca3af" />
          <text x="calc(100% - 145px)" y="16" fill="#6b7280" fontSize="9" fontFamily="monospace">GRID: 1000.00 / REF</text>

          {/* Bottom-Left */}
          <path d="M 8 calc(100% - 28px) L 8 calc(100% - 8px) L 28 calc(100% - 8px)" fill="none" stroke="#6b7280" strokeWidth="1" />
          <circle cx="8" cy="calc(100% - 8px)" r="1.5" fill="#9ca3af" />
          <text x="34" y="calc(100% - 14px)" fill="#6b7280" fontSize="9" fontFamily="monospace">CHASSIS: E30 / AXIS-0</text>

          {/* Bottom-Right */}
          <path d="M calc(100% - 8px) calc(100% - 28px) L calc(100% - 8px) calc(100% - 8px) L calc(100% - 28px) calc(100% - 8px)" fill="none" stroke="#6b7280" strokeWidth="1" />
          <circle cx="calc(100% - 8px)" cy="calc(100% - 8px)" r="1.5" fill="#9ca3af" />
          <text x="calc(100% - 120px)" y="calc(100% - 14px)" fill="#6b7280" fontSize="9" fontFamily="monospace">E30-PLATFORM</text>

          {/* Subtle horizontal and vertical guide datum lines */}
          <line x1="0" y1="48" x2="100%" y2="48" stroke="#374151" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="24" y1="0" x2="24" y2="100%" stroke="#374151" strokeWidth="0.5" strokeDasharray="4 6" />
          <line x1="calc(100% - 24px)" y1="0" x2="calc(100% - 24px)" y2="100%" stroke="#374151" strokeWidth="0.5" strokeDasharray="4 6" />

          {/* Precision Crosshair Target Marker */}
          <g transform="translate(24, 48)">
            <circle cx="0" cy="0" r="4" fill="none" stroke="#9ca3af" strokeWidth="0.75" />
            <line x1="-8" y1="0" x2="8" y2="0" stroke="#9ca3af" strokeWidth="0.75" />
            <line x1="0" y1="-8" x2="0" y2="8" stroke="#9ca3af" strokeWidth="0.75" />
          </g>
        </svg>
      </div>
      {/* Section Header */}
      <div className="flex items-baseline gap-4 mb-12 border-b border-[#22252c] pb-4">
        <span className="font-mono text-xs text-[#6b7280]">04</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#f3f4f6] uppercase">
          E30
        </h2>
      </div>

      <div className="space-y-8">
        {/* Main Text Content */}
        <div className="max-w-3xl">
          <p className="text-lg sm:text-xl text-[#f3f4f6] font-medium leading-relaxed">
            „Jelenleg egy BMW E30 sport- és versenyautó építésén dolgozom, amely az autós kaszkadőri továbbképzéshez kapcsolódó következő lépés.”
          </p>
          <p className="mt-4 text-sm text-[#9ca3af] leading-relaxed">
            A járműépítés célja egy megbízható, precízen irányítható sport- és versenymunkaautó kialakítása, amely alapjául szolgál a jövőbeli autós kaszkadőr felkészülésnek és továbbképzésnek.
          </p>
        </div>

        {/* Technical Blueprint Container */}
        <div className="pt-2">
          <BmwE30Blueprint />
        </div>

        {/* Műszaki és műhely-jellemzők (szigorúan kitalált technikai adatok NÉLKÜL) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="p-5 border border-[#22252c] bg-[#111317]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#6b7280] mb-2 uppercase">
              <Compass size={14} className="text-[#9ca3af]" />
              <span>ALAPMODELL</span>
            </div>
            <div className="text-white font-medium text-sm sm:text-base">BMW 3-as széria (E30)</div>
            <div className="text-xs text-[#9ca3af] mt-1">Klasszikus sportalap és karosszéria</div>
          </div>

          <div className="p-5 border border-[#22252c] bg-[#111317]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#6b7280] mb-2 uppercase">
              <Wrench size={14} className="text-[#9ca3af]" />
              <span>MUNKAFOLYAMAT</span>
            </div>
            <div className="text-white font-medium text-sm sm:text-base">Sport- és versenyautó építés</div>
            <div className="text-xs text-[#9ca3af] mt-1">Folyamatban lévő saját építés</div>
          </div>

          <div className="p-5 border border-[#22252c] bg-[#111317]">
            <div className="flex items-center gap-2 text-xs font-mono text-[#6b7280] mb-2 uppercase">
              <Gauge size={14} className="text-[#9ca3af]" />
              <span>SZAKMAI CÉL</span>
            </div>
            <div className="text-white font-medium text-sm sm:text-base">Autós továbbképzés</div>
            <div className="text-xs text-[#9ca3af] mt-1">Felkészülés a következő kaszkadőr szintre</div>
          </div>
        </div>
      </div>
    </section>
  );
};
