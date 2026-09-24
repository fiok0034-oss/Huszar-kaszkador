import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Award,
  Film,
  Wrench,
  Dumbbell,
  Check,
  ExternalLink,
} from 'lucide-react';
import {
  VERIFIED_STUNT_PROFILE,
  generateStuntResumePdf,
} from '../../utils/generateStuntPdf';

export const ProfessionalProfileTab: React.FC = () => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  /**
   * Generates and downloads the professional PDF resume based strictly
   * on verified existing personal information without adding artificial data.
   */
  const handleDownloadResumePdf = () => {
    setDownloading(true);
    try {
      const doc = generateStuntResumePdf(VERIFIED_STUNT_PROFILE);
      const dateStr = new Date().toISOString().split('T')[0];
      doc.save(`Huszar_Attila_Szakmai_Oneletrajz_CV_${dateStr}.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('PDF Resume generation error:', err);
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Download & Print Actions */}
      <div className="p-4 border border-[#232733] bg-[#0c0d10] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              SZAKMAI PROFIL &amp; ÖNÉLETRAJZ // HIVATALOS ADATOK
            </span>
            <span className="font-mono text-[10px] text-[#10b981] px-1.5 py-0.5 border border-[#10b981]/30 bg-[#10b981]/10 flex items-center gap-1 font-semibold">
              <ShieldCheck size={11} />
              <span>Hitelesített adatok</span>
            </span>
          </div>
          <p className="text-xs text-[#9ca3af] mt-1">
            Kizárólag valós, leigazolt szakmai tényekből generált professzionális önéletrajz. Nincs kitalált adat, nincs generált filmográfia.
          </p>
        </div>

        {/* Action Buttons: Resume PDF Download & Print */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleDownloadResumePdf}
            disabled={downloading}
            className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)] disabled:opacity-60"
            title="Szakmai önéletrajz (CV) letöltése PDF formátumban"
          >
            <Download size={14} className={downloading ? 'animate-bounce' : ''} />
            <span>{downloading ? 'PDF Generálása...' : 'Önéletrajz (PDF) Letöltése'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 border border-[#2b303c] bg-[#161a22] hover:bg-[#202530] text-[#d1d5db] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
            title="Nyomtatási nézet megnyitása"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Nyomtatás</span>
          </button>
        </div>
      </div>

      {/* Download Success Toast Notice */}
      {downloadSuccess && (
        <div className="p-3 border border-[#1b3826] bg-[#0c1f14] text-[#34d399] font-mono text-xs flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>
              A hivatalos szakmai önéletrajz (PDF) sikeresen letöltve! Közvetlenül csatolható casting koordinátoroknak és rendezői megkeresésekhez.
            </span>
          </div>
          <span className="font-mono text-[10px] text-[#10b981] uppercase tracking-wider border border-[#10b981]/40 px-1.5 py-0.5">
            A4 Formátum
          </span>
        </div>
      )}

      {/* Structured Technical Sheet */}
      <div className="border border-[#232733] bg-[#0e1014] p-6 sm:p-8 space-y-8">
        {/* Header Block */}
        <div className="border-b border-[#222630] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="font-mono text-xs text-[#6b7280] uppercase tracking-widest mb-1 flex items-center gap-2">
              <span>FÜGGETLEN MAGYAR KASZKADŐRÖK SZÖVETSÉGE // TAGI PROFIL</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {VERIFIED_STUNT_PROFILE.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 font-mono text-xs">
              <span className="text-[#10b981] font-bold uppercase">
                {VERIFIED_STUNT_PROFILE.currentStatus}
              </span>
              <span className="text-[#4b5563]">•</span>
              <span className="text-[#d1d5db] flex items-center gap-1">
                <MapPin size={13} className="text-[#6b7280]" />
                {VERIFIED_STUNT_PROFILE.location}
              </span>
            </div>
          </div>

          <div className="font-mono text-xs text-[#9ca3af] space-y-1 text-left md:text-right">
            <div>
              E-mail: <strong className="text-white">{VERIFIED_STUNT_PROFILE.contact.email}</strong>
            </div>
            <div>
              Telefon: <strong className="text-white">{VERIFIED_STUNT_PROFILE.contact.phone}</strong>
            </div>
            <div>
              Weboldal: <strong className="text-white">{VERIFIED_STUNT_PROFILE.contact.website}</strong>
            </div>
          </div>
        </div>

        {/* Section 0: Szakmai Összefoglaló (Summary) */}
        <div className="space-y-2 p-4 bg-[#0a0c10] border border-[#1a1e27]">
          <div className="font-mono text-[10px] text-[#6b7280] uppercase tracking-wider flex items-center gap-1.5">
            <FileText size={12} className="text-[#10b981]" />
            <span>Szakmai Összefoglaló (Önéletrajzi kivonat)</span>
          </div>
          <p className="text-xs sm:text-sm text-[#d1d5db] leading-relaxed">
            {VERIFIED_STUNT_PROFILE.summary}
          </p>
        </div>

        {/* Section 1: Szakmai Státusz & Szervezet */}
        <div className="space-y-3">
          <div className="font-mono text-xs text-[#6b7280] uppercase tracking-wider border-b border-[#1b1e26] pb-1 flex items-center gap-1.5">
            <Award size={13} className="text-[#10b981]" />
            <span>1. Szakmai Besorolás &amp; Szervezeti Tagság</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-3.5 border border-[#1b1e26] bg-[#08090b] space-y-1">
              <div className="text-[10px] text-[#6b7280] uppercase">Jelenlegi besorolás</div>
              <div className="text-base text-white font-bold">{VERIFIED_STUNT_PROFILE.currentStatus}</div>
              <div className="text-[11px] text-[#9ca3af]">Gyalogos és játékakciós kaszkadőri feladatok ellátása.</div>
            </div>

            <div className="p-3.5 border border-[#1b1e26] bg-[#08090b] space-y-1">
              <div className="text-[10px] text-[#6b7280] uppercase">Szakmai szervezet</div>
              <div className="text-base text-white font-bold">{VERIFIED_STUNT_PROFILE.membership}</div>
              <div className="text-[11px] text-[#9ca3af]">Hivatalos szövetségi tagság és szakmai háttér.</div>
            </div>
          </div>
        </div>

        {/* Section 2: Képzés és Következő Lépés */}
        <div className="space-y-3">
          <div className="font-mono text-xs text-[#6b7280] uppercase tracking-wider border-b border-[#1b1e26] pb-1 flex items-center gap-1.5">
            <Wrench size={13} className="text-[#38bdf8]" />
            <span>2. Képzettség &amp; Szakmai Fejlődési Irány</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 border border-[#1b1e26] bg-[#08090b] space-y-1">
              <div className="text-[10px] text-[#6b7280] uppercase">Elvégzett képzés</div>
              <div className="text-white font-semibold">{VERIFIED_STUNT_PROFILE.training}</div>
              <div className="text-[11px] text-[#9ca3af]">Lovas kaszkadőri és történelmi forgatási alapok.</div>
            </div>

            <div className="p-3.5 border border-[#1b1e26] bg-[#08090b] space-y-1">
              <div className="text-[10px] text-[#6b7280] uppercase">Következő lépés / Cél</div>
              <div className="text-[#38bdf8] font-bold">{VERIFIED_STUNT_PROFILE.nextStep}</div>
              <div className="text-[11px] text-[#9ca3af]">Tervezett továbbképzés, autós akciófeladatok irányába.</div>
            </div>
          </div>
        </div>

        {/* Section 3: Igazolt Filmográfia */}
        <div className="space-y-3">
          <div className="font-mono text-xs text-[#6b7280] uppercase tracking-wider border-b border-[#1b1e26] pb-1 flex items-center gap-1.5">
            <Film size={13} className="text-[#a78bfa]" />
            <span>3. Igazolt Filmográfia (Szigorúan valós filmes referenciák)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {VERIFIED_STUNT_PROFILE.films.map((film, idx) => (
              <div
                key={film.title}
                className="p-4 border border-[#222630] bg-[#12141a] flex items-center justify-between"
              >
                <div>
                  <div className="font-mono text-[10px] text-[#6b7280]">
                    PRODUKCIÓ [0{idx + 1}]
                  </div>
                  <div className="font-display text-lg font-bold text-white tracking-wide">
                    {film.title}
                  </div>
                  <div className="font-mono text-[11px] text-[#9ca3af] mt-0.5">
                    {film.type} • {film.role}
                  </div>
                </div>
                <span className="font-mono text-xs text-[#10b981] border border-[#10b981]/30 bg-[#10b981]/10 px-2 py-1">
                  Igazolt
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Műszaki & Fizikai Háttér */}
        <div className="space-y-3">
          <div className="font-mono text-xs text-[#6b7280] uppercase tracking-wider border-b border-[#1b1e26] pb-1 flex items-center gap-1.5">
            <Dumbbell size={13} className="text-[#fbbf24]" />
            <span>4. Műszaki és Fizikai Háttér</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3.5 border border-[#1b1e26] bg-[#08090b] space-y-1">
              <div className="text-[10px] text-[#6b7280] uppercase">Műszaki projekt</div>
              <div className="text-white font-semibold">{VERIFIED_STUNT_PROFILE.project}</div>
              <div className="text-[11px] text-[#9ca3af]">Az autós kaszkadőri továbbképzés közvetlen gyakorlati bázisa.</div>
            </div>

            <div className="p-3.5 border border-[#1b1e26] bg-[#08090b] space-y-1">
              <div className="text-[10px] text-[#6b7280] uppercase">Fizikai felkészülés</div>
              <div className="text-white font-semibold">{VERIFIED_STUNT_PROFILE.gym}</div>
              <div className="text-[11px] text-[#9ca3af]">Funkcionális erőnléti és akciójeleneti állóképesség.</div>
            </div>
          </div>
        </div>

        {/* Section 5: Compliance Guarantee */}
        <div className="p-4 border border-[#232733] bg-[#08090c] flex items-start gap-3">
          <ShieldCheck size={20} className="text-[#10b981] shrink-0 mt-0.5" />
          <div className="text-xs text-[#9ca3af] space-y-1 leading-relaxed">
            <div className="font-mono text-white font-bold uppercase tracking-wider text-[11px]">
              Hitelességi Nyilatkozat
            </div>
            <div>
              Ez a szakmai adatlap és a letölthető PDF önéletrajz kizárólag a valós, leigazolt tényeket tartalmazza: nem tartalmaz mesterségesen generált referenciát, kitalált kaszkadőri specializációt vagy fiktív filmográfiát.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
