import React from 'react';
import {
  ExternalLink,
  Film,
  Clapperboard,
  AlertTriangle,
  Bookmark,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import type { MonitoredJobItem } from '../../server/monitorService';
import type { SavedProductionItem, JobStatus } from '../../server/workspaceStorage';
import { StatusSelector } from './StatusSelector';

interface ProductionMonitorTabProps {
  productions: MonitoredJobItem[];
  savedItems: SavedProductionItem[];
  onSaveProduction: (item: MonitoredJobItem) => void;
  onUpdateStatus?: (id: string, status: JobStatus) => Promise<void>;
  onOpenApplication: (item: MonitoredJobItem) => void;
}

export const ProductionMonitorTab: React.FC<ProductionMonitorTabProps> = ({
  productions,
  savedItems,
  onSaveProduction,
  onUpdateStatus,
  onOpenApplication,
}) => {
  const savedMap = new Map(savedItems.map((s) => [s.id, s]));

  const formatDate = (isoString?: string | null) => {
    if (!isoString) return 'Ismeretlen';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Strict Requirement 12 Disclaimer Banner */}
      <div className="p-4 border border-[#3b3425] bg-[#1a1711] text-[#fbbf24] space-y-2">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="shrink-0" />
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider">
            FONTOS SZAKMAI KÜLÖNVÁLASZTÁS // FILM & SOROZAT FIGYELŐ
          </h4>
        </div>
        <p className="text-xs text-[#fef3c7] leading-relaxed">
          Egy filmes vagy televíziós produkció nyilvános bejelentése <strong>önmagában NEM jelent közvetlen kaszkadőri álláshirdetést</strong>.
          Ez a különálló felület a hivatalos stúdióforgatásokat, játékfilmes gyártásokat és koprodukciókat gyűjti össze tájékozódási és előkészítési célból,
          hogy időben észleld a készülő hazai és nemzetközi projekteket.
        </p>
      </div>

      {/* Production List */}
      {productions.length === 0 ? (
        <div className="p-10 border border-[#232733] bg-[#0e1014] text-center space-y-3">
          <Film size={28} className="mx-auto text-[#6b7280]" />
          <div className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            Nincs jelenleg megjeleníthető produkciós bejelentés
          </div>
          <p className="text-xs text-[#9ca3af] max-w-md mx-auto">
            A figyelő a következő frissítési ciklusban pásztázza újra a kulturális és filmes portálokat.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono text-xs text-[#9ca3af]">
            <span>NYILVÁNOSAN BEJELENTETT PRODUKCIÓK ({productions.length})</span>
            <span className="text-[#38bdf8]">Külön kategória (Iparági gyártások)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productions.map((prod, index) => {
              const isSaved = savedMap.has(prod.id);

              return (
                <div
                  key={`${prod.id}-${index}`}
                  className="p-5 border border-[#232733] bg-[#0e1014] hover:border-[#383e4c] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 border-b border-[#1b1e26] pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/30 font-semibold flex items-center gap-1">
                          <Clapperboard size={11} />
                          ÚJ PRODUKCIÓ
                        </span>
                        <span className="font-mono text-[10px] text-[#9ca3af] px-1.5 py-0.5 border border-[#22252c]">
                          {prod.productionType || 'Játékfilm / Produkció'}
                        </span>
                      </div>

                      {isSaved && onUpdateStatus ? (
                        <StatusSelector
                          currentStatus={savedMap.get(prod.id)?.status || 'ÉRDEKEL'}
                          itemId={prod.id}
                          onStatusChange={(newStatus) => onUpdateStatus(prod.id, newStatus)}
                        />
                      ) : isSaved ? (
                        <span className="font-mono text-[10px] text-[#a78bfa] flex items-center gap-1">
                          <CheckCircle2 size={12} />
                          Mentve
                        </span>
                      ) : null}
                    </div>

                    <div>
                      <div className="font-mono text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">
                        PRODUKCIÓ [forrásból]
                      </div>
                      <h3 className="font-display text-base font-bold text-white tracking-tight line-clamp-2">
                        {prod.title}
                      </h3>
                    </div>

                    {prod.summary && (
                      <p className="text-xs text-[#9ca3af] leading-relaxed line-clamp-2">
                        {prod.summary}
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#08090b] border border-[#1b1e26] font-mono text-[11px]">
                      <div>
                        <div className="text-[9px] text-[#6b7280] uppercase">TÍPUS</div>
                        <div className="text-white mt-0.5 truncate">
                          {prod.productionType || 'Filmes produkció'}
                        </div>
                      </div>

                      <div>
                        <div className="text-[9px] text-[#6b7280] uppercase">KÖZZÉTÉVE</div>
                        <div className="text-[#d1d5db] mt-0.5 truncate">
                          {formatDate(prod.publishedAt)}
                        </div>
                      </div>

                      <div className="col-span-2 pt-1 border-t border-[#16181f]">
                        <div className="text-[9px] text-[#6b7280] uppercase">FORRÁS [eredeti oldal]</div>
                        <div className="text-[#38bdf8] mt-0.5 truncate" title={prod.sourceName}>
                          {prod.sourceName}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#1b1e26]">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSaveProduction(prod)}
                        className={`px-3 py-1 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSaved
                            ? 'border border-[#8b5cf6]/50 bg-[#8b5cf6]/10 text-[#c4b5fd]'
                            : 'border border-[#2b303c] bg-[#161a22] text-[#d1d5db] hover:text-white'
                        }`}
                      >
                        <Bookmark size={12} className={isSaved ? 'fill-current' : ''} />
                        <span>{isSaved ? '★ Mentve' : '☆ Mentés'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenApplication(prod)}
                        className="px-2.5 py-1 border border-[#3b4354] bg-[#1a1f2b] hover:bg-[#252c3d] text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
                        title="Megkeresés előkészítése a produkcióhoz"
                      >
                        Jelentkezés
                      </button>
                    </div>

                    <a
                      href={prod.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 border border-[#2b303c] text-[#9ca3af] hover:text-white hover:border-[#4b5563] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <span>FORRÁS MEGNYITÁSA</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
