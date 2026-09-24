import React from 'react';
import { Shield, MapPin, Film, Wrench } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="rolam" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#1d2026]">
      {/* Section Header */}
      <div className="flex items-baseline gap-4 mb-12 border-b border-[#22252c] pb-4">
        <span className="font-mono text-xs text-[#6b7280]">01</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#f3f4f6] uppercase">
          RÓLAM
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Main Text Content: strictly word-for-word the verified text */}
        <div className="lg:col-span-8 space-y-6 text-base sm:text-lg text-[#d1d5db] leading-relaxed">
          <p className="text-xl sm:text-2xl text-[#f3f4f6] font-normal leading-snug">
            Huszár Attila vagyok, Pátyon élek, gyalogos kaszkadőrként dolgozom.
          </p>

          <p className="text-[#9ca3af]">
            A Független Magyar Kaszkadőrök Szövetségének tagja vagyok.
          </p>

          <p className="text-[#9ca3af]">
            Az elmúlt években több filmben is szerepeltem, ezek közül például a{' '}
            <span className="text-white font-medium">Napszállta</span> és a{' '}
            <span className="text-white font-medium">Hadik</span>.
          </p>

          <p className="text-[#9ca3af]">
            Lovas képzésen is részt vettem, jelenleg pedig az autós kaszkadőri továbbképzés felé haladok.
            Ehhez egy BMW E30 sport- és versenyautó építésén dolgozom.
          </p>

          <p className="text-[#9ca3af]">
            Szabadidőmben a saját kezűleg épített konditermemet fejlesztem.
          </p>
        </div>

        {/* Fact Block: strictly without pills or fake telemetry */}
        <div className="lg:col-span-4 border border-[#22252c] bg-[#111317] p-6 space-y-6">
          <div className="font-mono text-xs uppercase text-[#6b7280] tracking-wider border-b border-[#1f2228] pb-2">
            Adatok & Tagság
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#9ca3af] shrink-0 mt-0.5" />
              <div>
                <div className="text-[#6b7280] text-xs">Lakhely</div>
                <div className="text-white font-medium">Páty, Magyarország</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shield size={16} className="text-[#9ca3af] shrink-0 mt-0.5" />
              <div>
                <div className="text-[#6b7280] text-xs">Szakmai szervezet</div>
                <div className="text-white font-medium">Független Magyar Kaszkadőrök Szövetsége</div>
                <div className="text-[#6b7280] text-[11px] mt-0.5">Hivatalos tag</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Film size={16} className="text-[#9ca3af] shrink-0 mt-0.5" />
              <div>
                <div className="text-[#6b7280] text-xs">Filmes tapasztalat</div>
                <div className="text-white font-medium">Szereplések az elmúlt években</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Wrench size={16} className="text-[#9ca3af] shrink-0 mt-0.5" />
              <div>
                <div className="text-[#6b7280] text-xs">Műhely & Építés</div>
                <div className="text-white font-medium">BMW E30 munkaprojekt & saját konditerem</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
