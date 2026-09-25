import React, { useState } from 'react';
import { Hammer, Dumbbell, Compass, Crosshair } from 'lucide-react';

export const Handmade: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'all' | 'structure'>('all');

  return (
    <section className="py-10 sm:py-20 lg:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#1d2026]">
      {/* Section Header */}
      <div className="flex items-baseline gap-4 mb-10 border-b border-[#22252c] pb-4">
        <span className="font-mono text-xs text-[#6b7280]">05</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#f3f4f6] uppercase">
          SAJÁT KÉZZEL
        </h2>
      </div>

      <div className="border border-[#22252c] bg-[#111317] p-6 sm:p-10 lg:p-12 relative overflow-hidden transition-colors hover:border-[#383d47] group">
        {/* Subtle background technical grid line */}
        <div className="absolute inset-0 bg-blueprint-fine opacity-15 pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Text Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3 text-xs font-mono text-[#9ca3af] uppercase tracking-wider">
              <Hammer size={16} className="text-[#6b7280]" />
              <span>KÉZMŰVES FELKÉSZÜLÉS & EDZÉSTÉR</span>
            </div>

            <blockquote className="text-xl sm:text-2xl text-white font-normal leading-relaxed">
              „Szabadidőmben a saját kezűleg épített konditermemet fejlesztem.”
            </blockquote>

            <p className="text-sm text-[#9ca3af] leading-relaxed">
              A kaszkadőri hivatás alapja az állandó, fegyelmezett fizikai kondíció és a precíz kézügyesség. A saját edzőtér önálló tervezése és megépítése ezt a kettős felkészülést szolgálja.
            </p>

            <div className="pt-4 border-t border-[#1f2228] flex flex-wrap items-center gap-6 text-xs font-mono text-[#6b7280]">
              <div className="flex items-center gap-2">
                <Dumbbell size={14} className="text-[#9ca3af]" />
                <span className="text-[#d1d5db]">Fizikai edzés és felkészülés</span>
              </div>
              <span className="text-[#374151]">·</span>
              <div className="flex items-center gap-2">
                <span className="text-[#d1d5db]">Saját kivitelezésű műhely & konditerem</span>
              </div>
            </div>
          </div>

          {/* Technical Blueprint Wireframe Illustration of Handmade Workshop Gear */}
          <div className="lg:col-span-5 border border-[#22252c] bg-[#0c0d10] p-4 sm:p-5 rounded relative overflow-hidden group-hover:border-[#3b424e] transition-colors">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#6b7280] mb-3 pb-2 border-b border-[#1b1d22]">
              <span className="flex items-center gap-1.5 text-[#9ca3af]">
                <Crosshair size={12} className="text-[#10b981]" />
                MŰSZAKI VÁZLAT // ACÉLSZERKEZET
              </span>
              <span>1:1 ARÁNY</span>
            </div>

            {/* SVG Technical Drawing of a precision rack frame / pull-up bar */}
            <svg
              viewBox="0 0 320 220"
              className="w-full h-auto select-none"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Reference Grid lines */}
              <line x1="20" y1="195" x2="300" y2="195" stroke="#374151" strokeWidth="0.75" />
              <line x1="20" y1="30" x2="20" y2="195" stroke="#262c36" strokeWidth="0.5" strokeDasharray="3 3" />
              <line x1="300" y1="30" x2="300" y2="195" stroke="#262c36" strokeWidth="0.5" strokeDasharray="3 3" />

              {/* Steel Uprights (Posts) */}
              {/* Left Column */}
              <rect x="70" y="40" width="16" height="155" stroke="#94a3b8" strokeWidth="1.5" fill="#14171d" />
              {/* Left Column holes */}
              {[60, 80, 100, 120, 140, 160, 180].map((y) => (
                <circle key={y} cx="78" cy={y} r="2.5" stroke="#64748b" strokeWidth="1" fill="#0c0d10" />
              ))}

              {/* Right Column */}
              <rect x="234" y="40" width="16" height="155" stroke="#94a3b8" strokeWidth="1.5" fill="#14171d" />
              {/* Right Column holes */}
              {[60, 80, 100, 120, 140, 160, 180].map((y) => (
                <circle key={y} cx="242" cy={y} r="2.5" stroke="#64748b" strokeWidth="1" fill="#0c0d10" />
              ))}

              {/* Top Crossbar / Chin-up bar */}
              <rect x="60" y="45" width="200" height="8" stroke="#cbd5e1" strokeWidth="1.5" fill="#1e242d" />
              {/* Mid Bracing Crossmember */}
              <line x1="86" y1="110" x2="234" y2="110" stroke="#64748b" strokeWidth="1.2" strokeDasharray="4 2" />

              {/* Base Feet (Stability triangles) */}
              <path d="M 45 195 L 70 170 L 86 195 Z" stroke="#64748b" strokeWidth="1" fill="#14171d" />
              <path d="M 234 195 L 250 170 L 275 195 Z" stroke="#64748b" strokeWidth="1" fill="#14171d" />

              {/* Barbell Bar resting on J-cups */}
              <line x1="40" y1="120" x2="280" y2="120" stroke="#f1f5f9" strokeWidth="2.5" />
              {/* J-cups */}
              <path d="M 64 120 L 70 120 L 70 130" stroke="#e2e8f0" strokeWidth="2" fill="none" />
              <path d="M 250 120 L 256 120 L 256 130" stroke="#e2e8f0" strokeWidth="2" fill="none" />

              {/* Weight Plates */}
              <rect x="46" y="100" width="8" height="40" rx="1" stroke="#94a3b8" strokeWidth="1.5" fill="#1e242d" />
              <rect x="56" y="105" width="6" height="30" rx="1" stroke="#64748b" strokeWidth="1.2" fill="#14171d" />

              <rect x="266" y="100" width="8" height="40" rx="1" stroke="#94a3b8" strokeWidth="1.5" fill="#1e242d" />
              <rect x="258" y="105" width="6" height="30" rx="1" stroke="#64748b" strokeWidth="1.2" fill="#14171d" />

              {/* Technical dimension line */}
              <g className="font-mono text-[8px] fill-[#6b7280]">
                <line x1="78" y1="205" x2="242" y2="205" stroke="#4b5563" strokeWidth="0.75" />
                <line x1="78" y1="202" x2="78" y2="208" stroke="#4b5563" strokeWidth="0.75" />
                <line x1="242" y1="202" x2="242" y2="208" stroke="#4b5563" strokeWidth="0.75" />
                <text x="135" y="215" fill="#9ca3af">SZÉLESSÉG</text>
                <text x="255" y="70" fill="#6b7280">ACÉLVÁZ</text>
              </g>
            </svg>

            <div className="mt-2 pt-2 border-t border-[#1b1d22] flex items-center justify-between text-[10px] font-mono text-[#6b7280]">
              <span>KIVITELEZÉS: SAJÁT KÉZZEL</span>
              <span className="text-[#10b981]">HELYSZÍN: MŰHELY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
