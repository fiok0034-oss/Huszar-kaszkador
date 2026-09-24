import React, { useState } from 'react';
import { X, Check, Copy, Mail, ShieldAlert, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { VERIFIED_STUNT_PROFILE, generateStuntProfilePdf } from '../../utils/generateStuntPdf';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    link: string;
    sourceName: string;
    deadline?: string | null;
  } | null;
  onConfirmApplied?: (id: string, notes?: string) => Promise<void>;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  item,
  onConfirmApplied,
}) => {
  if (!isOpen || !item) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState(
    `Szakmai jelentkezés: ${item.title.slice(0, 50)} – Huszár Attila (Gyalogos Kaszkadőr)`
  );
  const [messageBody, setMessageBody] = useState(
    `Tisztelt Produkció / Casting Csapat!

Huszár Attila vagyok, Pátyon élő gyalogos kaszkadőr, a Független Magyar Kaszkadőrök Szövetségének (FMKSZ) tagja.

A(z) ${item.sourceName} forrásban megjelent szakmai felhívás kapcsán szeretném jelezni szakmai rendelkezésre állásomat a(z) "${item.title}" produkció előkészítési és forgatási időszakára.

Szakmai háttér összefoglaló:
- Jelenlegi státusz: GYALOGOS KASZKADŐR
- Szervezet: Független Magyar Kaszkadőrök Szövetsége
- Speciális képzés: Lovas képzés
- Továbbképzési irány: Autós kaszkadőr felkészülés (BMW E30 projekt)
- Igazolt filmes munkák: Napszállta (Sunset), Hadik

Szakmai adatlapomat és hivatalos elérhetőségeimet mellékelten átadom. Személyes castingon, koordinátori egyeztetésen és fizikai felmérésen készséggel részt veszek.

Eredeti forrásfelhívás: ${item.link}

Tisztelettel:
Huszár Attila
Gyalogos Kaszkadőr
Bázis: Páty, Magyarország
Telefon: ${VERIFIED_STUNT_PROFILE.contact.phone}
E-mail: ${VERIFIED_STUNT_PROFILE.contact.email}
Weboldal: ${VERIFIED_STUNT_PROFILE.contact.website}`
  );

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationRecorded, setApplicationRecorded] = useState(false);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(`Tárgy: ${subject}\n\n${messageBody}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleOpenMailClient = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(messageBody)}`;
    window.location.href = mailtoUrl;
  };

  const handleDownloadPdf = () => {
    const doc = generateStuntProfilePdf();
    doc.save(`Huszar_Attila_Szakmai_Kaszkador_Lap_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleRecordApplication = async () => {
    if (onConfirmApplied) {
      setIsSubmitting(true);
      try {
        await onConfirmApplied(item.id, `Jelentkezési levél előkészítve és jóváhagyva: ${new Date().toLocaleDateString('hu-HU')}`);
        setApplicationRecorded(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#121418] border border-[#2b303c] rounded-none max-w-2xl w-full my-8 text-[#d1d5db] shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#222630] bg-[#161920]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#9ca3af] uppercase tracking-widest px-2 py-0.5 border border-[#2d3340] bg-[#0c0d0f]">
                STUNT WORKSPACE
              </span>
              <span className="font-mono text-xs text-[#10b981] font-semibold">
                JELENTKEZÉS ELŐKÉSZÍTÉSE
              </span>
            </div>
            <h3 className="font-display text-lg font-bold text-white mt-1 line-clamp-1">
              {item.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9ca3af] hover:text-white p-1 hover:bg-[#222630] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* 3-Step Pipeline Indicator */}
        <div className="grid grid-cols-3 border-b border-[#222630] text-center font-mono text-[11px] bg-[#0d0f12]">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`py-2.5 px-2 border-r border-[#222630] flex items-center justify-center gap-1.5 transition-colors ${
              step === 1 ? 'bg-[#1b202a] text-white font-bold' : 'text-[#6b7280] hover:text-[#9ca3af]'
            }`}
          >
            <span className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center">1</span>
            <span>ELLENŐRZÉS</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(2)}
            className={`py-2.5 px-2 border-r border-[#222630] flex items-center justify-center gap-1.5 transition-colors ${
              step === 2 ? 'bg-[#1b202a] text-white font-bold' : 'text-[#6b7280] hover:text-[#9ca3af]'
            }`}
          >
            <span className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center">2</span>
            <span>JÓVÁHAGYÁS</span>
          </button>
          <button
            type="button"
            onClick={() => setStep(3)}
            className={`py-2.5 px-2 flex items-center justify-center gap-1.5 transition-colors ${
              step === 3 ? 'bg-[#1b202a] text-[#10b981] font-bold' : 'text-[#6b7280] hover:text-[#9ca3af]'
            }`}
          >
            <span className="w-4 h-4 rounded-full border border-current text-[10px] flex items-center justify-center">3</span>
            <span>KÜLDÉS / EXPORT</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Security Notice */}
          <div className="flex items-start gap-2.5 p-3 border border-[#3b3425] bg-[#231e14] text-[#fbbf24]">
            <ShieldAlert size={16} className="shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <span className="font-semibold block uppercase tracking-wider font-mono">
                SZABÁLY: Nincs automatikus küldés
              </span>
              A rendszer soha nem küld önállóan e-mailt vagy casting anyagot. A kommunikáció kizárólag a te jóváhagyásoddal, a saját leveleződből vagy másolt szövegként történhet.
            </div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div className="p-3 border border-[#232733] bg-[#0d0f12] space-y-2">
                <div className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider">
                  Célzott felhívás forrásadatai:
                </div>
                <div className="font-semibold text-white text-sm">{item.title}</div>
                <div className="flex flex-wrap items-center gap-4 text-[#9ca3af] font-mono text-[11px]">
                  <span>Forrás: <strong className="text-white">{item.sourceName}</strong></span>
                  {item.deadline ? (
                    <span className="text-[#fbbf24]">Határidő: {item.deadline}</span>
                  ) : (
                    <span className="text-[#6b7280]">Nincs megadott határidő</span>
                  )}
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[#3b82f6] hover:underline font-mono text-[11px] mt-1"
                >
                  Eredeti forrásoldal ellenőrzése új lapon &rarr;
                </a>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#9ca3af] uppercase tracking-wider mb-1.5">
                  Címzett E-mail cím (ha a forrás tartalmazza):
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="pl. casting@produkcio.hu vagy koordinátor címe"
                  className="w-full bg-[#0a0c0e] border border-[#2b303c] px-3 py-2 text-white font-mono text-xs focus:border-[#4b5563] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#9ca3af] uppercase tracking-wider mb-1.5">
                  Üzenet tárgysora:
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#0a0c0e] border border-[#2b303c] px-3 py-2 text-white font-mono text-xs focus:border-[#4b5563] focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 bg-[#222732] hover:bg-[#2c3342] text-white font-mono text-xs uppercase tracking-wider flex items-center gap-2 border border-[#3b4354] cursor-pointer"
                >
                  <span>Tovább a szöveg szerkesztéséhez és jóváhagyásához</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-mono text-[#9ca3af] uppercase tracking-wider">
                    Szakmai jelentkezési levél (szerkeszthető szöveg):
                  </label>
                  <span className="text-[10px] font-mono text-[#6b7280]">
                    Kizárólag valós adatokkal előtöltve
                  </span>
                </div>
                <textarea
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  rows={12}
                  className="w-full bg-[#0a0c0e] border border-[#2b303c] p-3 text-white font-mono text-xs focus:border-[#4b5563] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-3 py-1.5 border border-[#2b303c] text-[#9ca3af] hover:text-white font-mono text-xs"
                >
                  &larr; Vissza
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-black font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Üzenet jóváhagyása & Küldési opciók</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 border border-[#1b3826] bg-[#0c1f14] text-[#34d399] flex items-center gap-3">
                <CheckCircle2 size={20} className="shrink-0" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-wider font-mono">
                    Jóváhagyva – Kész a kiküldésre
                  </div>
                  <div className="text-[11px] text-[#a7f3d0] mt-0.5">
                    Az üzenetet ellenőrizted. Válaszd ki az alábbi lehetőségek egyikét a megkeresés elküldéséhez:
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mail Client Button */}
                <button
                  type="button"
                  onClick={handleOpenMailClient}
                  className="p-3.5 border border-[#2b303c] bg-[#161a22] hover:bg-[#1f2430] hover:border-[#4b5563] text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-white font-mono text-xs font-bold mb-1">
                    <Mail size={16} className="text-[#38bdf8] group-hover:scale-110 transition-transform" />
                    <span>Megnyitás Levelezőben</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                    Megnyitja a gépeden beállított alapértelmezett e-mail programot a betöltött tárggyal és szöveggel.
                  </p>
                </button>

                {/* Copy to Clipboard */}
                <button
                  type="button"
                  onClick={handleCopyText}
                  className="p-3.5 border border-[#2b303c] bg-[#161a22] hover:bg-[#1f2430] hover:border-[#4b5563] text-left transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-white font-mono text-xs font-bold mb-1">
                    {copied ? (
                      <Check size={16} className="text-[#10b981]" />
                    ) : (
                      <Copy size={16} className="text-[#a78bfa] group-hover:scale-110 transition-transform" />
                    )}
                    <span>{copied ? 'Vágólapra másolva!' : 'Másolás Vágólapra'}</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                    A teljes megfogalmazást kimásolja, így könnyen beillesztheted Messengerbe, WhatsAppra vagy webes űrlapra.
                  </p>
                </button>

                {/* PDF Download */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="p-3.5 border border-[#2b303c] bg-[#161a22] hover:bg-[#1f2430] hover:border-[#4b5563] text-left transition-all group cursor-pointer sm:col-span-2"
                >
                  <div className="flex items-center gap-2 text-white font-mono text-xs font-bold mb-1">
                    <FileText size={16} className="text-[#fbbf24] group-hover:scale-110 transition-transform" />
                    <span>Hivatalos PDF Szakmai Adatlap Letöltése (Mellékletként csatolható)</span>
                  </div>
                  <p className="text-[11px] text-[#9ca3af] leading-relaxed">
                    Letölti a letisztult, egyoldalas szakmai kaszkadőr adatlapot a valós referenciákkal (Napszállta, Hadik, FMKSZ, Páty).
                  </p>
                </button>
              </div>

              {/* Status Update in Database */}
              <div className="pt-3 border-t border-[#222630] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-[11px] text-[#9ca3af]">
                  {applicationRecorded ? (
                    <span className="text-[#10b981] font-mono font-semibold flex items-center gap-1.5">
                      <CheckCircle2 size={14} />
                      Státusz rögzítve az adatbázisban: JELENTKEZVE
                    </span>
                  ) : (
                    <span>Szeretnéd a munkafüzetben rögzíteni ezt a lépést?</span>
                  )}
                </div>

                {!applicationRecorded && onConfirmApplied && (
                  <button
                    type="button"
                    onClick={handleRecordApplication}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-[#3b4354] bg-[#1f2533] hover:bg-[#2b3346] text-white font-mono text-xs font-semibold uppercase tracking-wider cursor-pointer"
                  >
                    {isSubmitting ? 'Rögzítés...' : 'Státusz átállítása: JELENTKEZVE'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#222630] bg-[#14171d] flex items-center justify-between">
          <div className="text-[10px] font-mono text-[#6b7280]">
            Huszár Attila Személyes Szakmai Munkafelület
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 border border-[#2b303c] text-[#9ca3af] hover:text-white font-mono text-xs cursor-pointer"
          >
            Bezárás
          </button>
        </div>
      </div>
    </div>
  );
};
