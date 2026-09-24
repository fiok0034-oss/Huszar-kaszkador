import React, { useState } from 'react';
import { UserCheck, Compass, ArrowRight, ArrowDown, Wrench, GraduationCap } from 'lucide-react';

export const Stuntman: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(0);

  const workflow = [
    {
      phase: 'FÁZIS 01',
      stage: 'JELENLEG',
      title: 'Gyalogos kaszkadőr',
      subtitle: 'Aktív filmes státusz',
      description: 'Aktív filmes és kaszkadőri feladatok ellátása gyalogos kaszkadőrként a Független Magyar Kaszkadőrök Szövetségében.',
      statusLabel: 'Aktív kaszkadőr',
      icon: UserCheck,
      borderColor: 'border-l-[#10b981]',
      accentColor: 'text-[#10b981]',
      statusBadge: 'text-[#10b981]',
    },
    {
      phase: 'FÁZIS 02',
      stage: 'KÖVETKEZŐ LÉPÉS',
      title: 'Autós kaszkadőr továbbképzés',
      subtitle: 'Tervezett továbbképzés',
      description: 'Következő szakmai lépés és továbbképzés elvégzése az autós kaszkadőri feladatok irányába.',
      statusLabel: 'Tervezett továbbképzés',
      icon: Compass,
      borderColor: 'border-l-[#6366f1]',
      accentColor: 'text-[#818cf8]',
      statusBadge: 'text-[#818cf8]',
    },
    {
      phase: 'FÁZIS 03',
      stage: 'PROJEKT',
      title: 'BMW E30 munkaautó',
      subtitle: 'Építés alatt',
      description: 'Sport- és versenyautó építése saját kezűleg, amely az autós kaszkadőri továbbképzés közvetlen technikai alapja.',
      statusLabel: 'Munkaprojekt folyamatban',
      icon: Wrench,
      borderColor: 'border-l-[#f59e0b]',
      accentColor: 'text-[#fbbf24]',
      statusBadge: 'text-[#fbbf24]',
    },
  ];

  return (
    <section id="kaszkador" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#1d2026]">
      {/* Section Header */}
      <div className="flex items-baseline gap-4 mb-10 border-b border-[#22252c] pb-4">
        <span className="font-mono text-xs text-[#6b7280]">02</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#f3f4f6] uppercase">
          KASZKADŐR
        </h2>
      </div>

      <p className="text-sm sm:text-base text-[#9ca3af] max-w-2xl mb-8">
        Szakmai fókusz, felkészültség és szakosodási irányvonalak a Független Magyar Kaszkadőrök Szövetségének keretein belül.
      </p>

      {/* Egységes szerkezet: SZAKMAI FOLYAMAT & TOVÁBBKÉPZÉSI ÚT (3 fázis sorban) */}
      <div className="mb-10 p-4 sm:p-6 border border-[#22252c] bg-[#101216] relative overflow-hidden">
        <div className="flex items-center justify-between text-xs font-mono text-[#6b7280] mb-5 uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            SZAKMAI FOLYAMAT & TOVÁBBKÉPZÉSI ÚT
          </span>
          <span className="text-[11px] text-[#9ca3af]">3 EGYMÁSRA ÉPÜLŐ FÁZIS</span>
        </div>

        {/* 3 Fázis kártya összekötő nyíllal */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {workflow.map((item, idx) => {
            const isSelected = selectedPhase === idx;
            const Icon = item.icon;
            return (
              <div
                key={item.phase}
                onClick={() => setSelectedPhase(idx)}
                className={`p-5 sm:p-6 border border-l-4 ${item.borderColor} bg-[#111317] flex flex-col justify-between transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#3a414e] bg-[#14171f] shadow-lg'
                    : 'border-[#1f2228] hover:border-[#2d323b]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-mono tracking-widest font-semibold uppercase ${item.accentColor}`}>
                      {item.stage}
                    </span>
                    <span className="text-[10px] font-mono text-[#6b7280]">{item.phase}</span>
                  </div>

                  <div className="flex items-center gap-2.5 mb-2">
                    <Icon size={18} className={isSelected ? 'text-white' : 'text-[#6b7280]'} />
                    <h3 className="font-display font-bold text-base sm:text-lg text-white tracking-wide">
                      {item.title}
                    </h3>
                  </div>

                  <div className="text-xs font-mono text-[#9ca3af] mb-3">
                    {item.subtitle}
                  </div>

                  <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#1b1e24] flex items-center justify-between text-xs font-mono text-[#6b7280]">
                  <span>STÁTUSZ</span>
                  <span className={`font-medium ${item.statusBadge}`}>{item.statusLabel}</span>
                </div>

                {/* Connecting arrow indicator between phases */}
                {idx < 2 && (
                  <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-[#161920] border border-[#2d323b] items-center justify-center text-[#9ca3af]">
                    <ArrowRight size={13} />
                  </div>
                )}
                {idx < 2 && (
                  <div className="md:hidden flex justify-center py-2 text-[#4b5563]">
                    <ArrowDown size={14} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Különálló Lovas képzés kártya a folyamat alatt, duplikációk nélkül */}
      <div className="border border-[#22252c] border-l-4 border-l-[#9ca3af] bg-[#111317] p-6 sm:p-7 transition-colors hover:border-[#333842]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-semibold tracking-wider text-[#9ca3af] uppercase">
              KÉPZÉS
            </span>
            <span className="text-[#374151]" aria-hidden="true">·</span>
            <span className="font-mono text-xs text-[#6b7280]">KASZKADŐRI ALAPOK</span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#6b7280]">STÁTUSZ:</span>
            <span className="text-[#d1d5db] font-medium bg-[#1c1f26] px-2.5 py-1 border border-[#2a2f38]">
              Időlegesen felfüggesztve
            </span>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded bg-[#16181e] border border-[#242730] flex items-center justify-center shrink-0 text-[#9ca3af] mt-1">
            <GraduationCap size={20} />
          </div>

          <div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-2">
              Lovas képzés (Folyamatban / Felfüggesztve)
            </h3>

            <p className="text-xs sm:text-sm text-[#9ca3af] leading-relaxed max-w-3xl">
              Szakmai felkészülés és megszerzett lovas alapok a kaszkadőri és történelmi filmes munkákhoz.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
