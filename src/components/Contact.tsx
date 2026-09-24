import React, { useState } from 'react';
import { MapPin, Shield, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Filmes produkció',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <section id="kapcsolat" className="py-20 sm:py-28 px-4 sm:px-6 max-w-6xl mx-auto border-t border-[#1d2026]">
      {/* Section Header */}
      <div className="flex items-baseline gap-4 mb-12 border-b border-[#22252c] pb-4">
        <span className="font-mono text-xs text-[#6b7280]">06</span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#f3f4f6] uppercase">
          KAPCSOLAT
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info & Location column */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h3 className="font-display text-2xl font-bold text-white uppercase mb-3">
              Kapcsolatfelvétel
            </h3>
            <p className="text-sm text-[#9ca3af] leading-relaxed">
              Szakmai megkeresésekhez, kaszkadőri és produkciós egyeztetésekhez kérjük használja az alábbi űrlapot.
            </p>
          </div>

          <div className="border border-[#22252c] bg-[#111317] p-6 space-y-5">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#9ca3af] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono text-[#6b7280] uppercase">Helyszín</div>
                <div className="text-white font-medium text-sm">Páty, Magyarország</div>
                <div className="text-xs text-[#9ca3af] mt-0.5">Pest vármegye</div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1b1e24] flex items-start gap-3">
              <Shield size={18} className="text-[#9ca3af] shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono text-[#6b7280] uppercase">Szervezeti háttér</div>
                <div className="text-white font-medium text-sm">Független Magyar Kaszkadőrök Szövetsége</div>
                <div className="text-xs text-[#9ca3af] mt-0.5">Szövetségi tag</div>
              </div>
            </div>

            {/* Clearly designated slot for future contact additions as instructed */}
            <div className="pt-4 border-t border-[#1b1e24]">
              <div className="text-xs font-mono text-[#6b7280] uppercase mb-1">Közvetlen elérhetőség</div>
              <div className="text-xs text-[#9ca3af] bg-[#16191f] p-3 border border-[#22262e] rounded">
                Közvetlen telefonszám és email elérhetőség hamarosan itt kerül közzétételre. Jelenleg kapcsolatfelvétel az űrlapon keresztül lehetséges.
              </div>
            </div>
          </div>
        </div>

        {/* Form column */}
        <div className="lg:col-span-7">
          <div className="border border-[#22252c] bg-[#111317] p-6 sm:p-8">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 size={42} className="mx-auto text-[#10b981]" />
                <h4 className="font-display text-2xl font-bold text-white uppercase">
                  Üzenet elküldve
                </h4>
                <p className="text-sm text-[#9ca3af] max-w-md mx-auto">
                  Köszönjük a megkeresést! Az üzenet sikeresen elküldve, hamarosan válaszolunk.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'Filmes produkció', message: '' });
                  }}
                  className="mt-6 text-xs font-mono tracking-wider uppercase px-4 py-2 border border-[#373b42] text-white hover:bg-[#1f2228] transition-colors"
                >
                  Új üzenet küldése
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono text-[#9ca3af] uppercase mb-1.5">
                    Név <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Az Ön vagy a produkció neve"
                    className="w-full bg-[#0c0d0f] border border-[#262a32] px-3.5 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#9ca3af] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-[#9ca3af] uppercase mb-1.5">
                    Email cím <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="pelda@produkcio.hu"
                    className="w-full bg-[#0c0d0f] border border-[#262a32] px-3.5 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#9ca3af] transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-xs font-mono text-[#9ca3af] uppercase mb-1.5">
                    Tárgy / Típus
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-[#0c0d0f] border border-[#262a32] px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#9ca3af] transition-colors"
                  >
                    <option value="Filmes produkció">Filmes produkció felkérés</option>
                    <option value="Kaszkadőr egyeztetés">Kaszkadőri egyeztetés</option>
                    <option value="Szakmai megkeresés">Szakmai megkeresés</option>
                    <option value="Egyéb">Egyéb kérdés</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-mono text-[#9ca3af] uppercase mb-1.5">
                    Üzenet <span className="text-[#ef4444]">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Írja le a megkeresés részleteit..."
                    className="w-full bg-[#0c0d0f] border border-[#262a32] px-3.5 py-2.5 text-sm text-white placeholder-[#4b5563] focus:outline-none focus:border-[#9ca3af] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#f3f4f6] text-[#0c0d0f] font-semibold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
                >
                  <Send size={14} />
                  <span>Üzenet elküldése</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
