import React from 'react';
import { ArrowDown, ShieldCheck, MapPin } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-between pt-24 pb-12 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
      {/* Background subtle technical grid lines */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-40 bg-blueprint-grid" />

      {/* Top subtle status info / technical marker */}
      <div className="pt-8 sm:pt-12 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#6b7280] border-b border-[#1f2228] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
          <span className="text-[#9ca3af] uppercase">Aktív tagság: Független Magyar Kaszkadőrök Szövetsége</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span>47°30'N · 18°50'E</span>
          <span className="text-[#374151]">|</span>
          <span className="text-[#9ca3af]">PÁTY, HU</span>
        </div>
      </div>

      {/* Main Massive Typography Centerpiece */}
      <div className="my-auto py-12 sm:py-16">
        <div className="relative">
          {/* Subtle technical crosshair corner markers */}
          <div className="absolute -top-6 -left-2 text-[#374151] font-mono text-xs select-none">⌜ 01</div>
          <div className="absolute -top-6 -right-2 text-[#374151] font-mono text-xs select-none">02 ⌝</div>

          <h1
            className="font-display font-extrabold text-[clamp(1.25rem,6.6vw,5.75rem)] text-[#f3f4f6] uppercase select-none w-full block whitespace-nowrap tracking-[-0.02em] leading-none"
            style={{
              fontSize: 'clamp(1.25rem, 6.6vw, 5.75rem)',
              lineHeight: 1,
              whiteSpace: 'nowrap',
              letterSpacing: '-0.02em',
            }}
          >
            HUSZÁR ATTILA
          </h1>

          <div className="mt-8 pt-6 border-t border-[#23272f]">
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl tracking-widest text-[#9ca3af] uppercase">
              KASZKADŐR
            </h2>

            {/* Subline strictly using provided info */}
            <div className="mt-4 flex flex-wrap items-center gap-y-2 gap-x-3 text-sm sm:text-base text-[#d1d5db] font-medium">
              <span className="text-white font-semibold">Gyalogos kaszkadőr</span>
              <span className="text-[#4b5563]" aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5 text-[#9ca3af]">
                <MapPin size={15} className="text-[#6b7280]" />
                Páty / Magyarország
              </span>
            </div>
          </div>
        </div>

        {/* Technical highlight card / workshop note */}
        <div className="mt-12 max-w-xl border-l-2 border-[#4b5563] pl-4 sm:pl-5 py-1 text-xs sm:text-sm text-[#9ca3af] leading-relaxed">
          Hiteles, fegyelmezett filmes kaszkadőri jelenlét. Szakmai felkészülés, fizikai edzés és technikai építés a műhelytől a forgatásig.
        </div>
      </div>

      {/* Hero Bottom Navigation Trigger */}
      <div className="pt-6 border-t border-[#1f2228] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#6b7280]">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-[#9ca3af]" />
          <span>FÜGGETLEN MAGYAR KASZKADŐRÖK SZÖVETSÉGE</span>
        </div>

        <a
          href="#rolam"
          className="flex items-center gap-2 text-[#9ca3af] hover:text-white transition-colors group"
        >
          <span>BEMUTATKOZÁS</span>
          <ArrowDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
        </a>
      </div>
    </section>
  );
};
