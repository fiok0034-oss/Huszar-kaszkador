import React from 'react';
import {
  ExternalLink,
  Bookmark,
  Send,
  Bell,
  Calendar,
  Clock,
  Radio,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import type { MonitoredJobItem } from '../../server/monitorService';
import type { SavedProductionItem, JobStatus } from '../../server/workspaceStorage';
import { StatusSelector } from './StatusSelector';

interface StuntJobsTabProps {
  items: MonitoredJobItem[];
  savedItems: SavedProductionItem[];
  onSaveItem: (item: MonitoredJobItem) => void;
  onUpdateStatus?: (id: string, status: JobStatus) => Promise<void>;
  onOpenApplication: (item: MonitoredJobItem) => void;
  onOpenReminder: (item: MonitoredJobItem) => void;
  onOpenRecentFeed: () => void;
  showRecentFeed: boolean;
  recentItems: MonitoredJobItem[];
  isUnlocked: boolean;
}

export const StuntJobsTab: React.FC<StuntJobsTabProps> = ({
  items,
  savedItems,
  onSaveItem,
  onUpdateStatus,
  onOpenApplication,
  onOpenReminder,
  onOpenRecentFeed,
  showRecentFeed,
  recentItems,
  isUnlocked,
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

  const formatDateTime = (isoString?: string | null) => {
    if (!isoString) return 'Ismeretlen';
    try {
      const d = new Date(isoString);
      return d.toLocaleString('hu-HU', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Notification / Disclaimer */}
      <div className="p-4 border border-[#232733] bg-[#0c0d10] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={18} className="text-[#10b981] shrink-0" />
          <div className="text-xs text-[#d1d5db]">
            <span className="font-bold text-white font-mono uppercase mr-1">
              Valós Forrás Hitelesítés:
            </span>
            Kizárólag hivatalos filmes és casting hírfolyamokból kinyert, valódi kaszkadőri és akció-előadói találatok.
          </div>
        </div>
        <div className="font-mono text-[11px] text-[#9ca3af] shrink-0">
          Státusz: <strong className="text-white">GYALOGOS KASZKADŐR</strong> (Elsődleges profil)
        </div>
      </div>

      {/* Main List */}
      {items.length === 0 ? (
        /* Requirement 9: "Ha nincs valódi új találat, NE generálj semmit" */
        <div className="p-8 sm:p-12 border border-[#232733] bg-[#0e1014] text-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-[#2d3340] bg-[#161a22] flex items-center justify-center mx-auto text-[#6b7280]">
            <Radio size={22} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
              NINCS ÚJ KASZKADŐRI TALÁLAT A FIGYELT FORRÁSOKBAN
            </h4>
            <p className="text-xs text-[#9ca3af] max-w-xl mx-auto leading-relaxed">
              A rendszer folyamatosan ellenőrzi a beállított 6 hivatalos hírforrást (Kultúra.hu / MTI, Film New Europe, Filmtett, Telex, Deadline, Casting Call Hub).
              A szigorú adatvédelmi és hitelességi szabályzat értelmében a rendszer soha nem generál fiktív vagy feltételezett munkalehetőségeket.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={onOpenRecentFeed}
              className="px-4 py-2 border border-[#2b303c] bg-[#161a22] hover:bg-[#202530] text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              {showRecentFeed ? '▲ Legutóbbi pásztázott cikkek elrejtése' : '▼ Legutóbbi pásztázott filmes cikkek megtekintése (Transzparencia)'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="font-mono text-xs text-[#9ca3af] flex items-center justify-between">
            <span>TALÁLATOK ({items.length})</span>
            <span className="text-[#10b981]">● Valós forrásból szűrve</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => {
              const isSaved = savedMap.has(item.id);
              const savedData = savedMap.get(item.id);

              return (
                <div
                  key={item.id}
                  className="p-5 border border-[#232733] bg-[#0e1014] hover:border-[#383e4c] transition-all space-y-4"
                >
                  {/* Top tags */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1b1e26] pb-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 font-bold flex items-center gap-1">
                        <Sparkles size={11} />
                        ÚJ TALÁLAT
                      </span>

                      {item.stuntCategory === 'vehicle' ? (
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/30">
                          Autós kaszkadőr (Tervezett továbbképzési irány)
                        </span>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#374151]/30 text-[#d1d5db] border border-[#4b5563]">
                          Gyalogos kaszkadőr profil
                        </span>
                      )}

                      {isSaved && savedData && onUpdateStatus ? (
                        <StatusSelector
                          currentStatus={savedData.status}
                          itemId={item.id}
                          onStatusChange={(newStatus) => onUpdateStatus(item.id, newStatus)}
                        />
                      ) : isSaved ? (
                        <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 bg-[#8b5cf6]/20 text-[#c4b5fd] border border-[#8b5cf6]/40 flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          MENTVE ({savedData?.status || 'ÉRDEKEL'})
                        </span>
                      ) : null}
                    </div>

                    <div className="font-mono text-[11px] text-[#6b7280]">
                      ÉSZLELVE: <span className="text-[#9ca3af]">{formatDateTime(item.detectedAt)}</span>
                    </div>
                  </div>

                  {/* Title & Production */}
                  <div>
                    <div className="font-mono text-[10px] text-[#6b7280] uppercase tracking-wider mb-1">
                      PRODUKCIÓ [csak a valódi forrásból]
                    </div>
                    <h3 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Summary / Excerpt */}
                  {item.summary && (
                    <p className="text-xs text-[#9ca3af] leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  )}

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#08090b] border border-[#1b1e26] font-mono text-xs">
                    <div>
                      <div className="text-[10px] text-[#6b7280] uppercase">MUNKATÍPUS</div>
                      <div className="text-white font-medium mt-0.5 truncate">
                        {item.stuntCategory === 'vehicle' ? 'Autós kaszkadőr' : 'Gyalogos kaszkadőr'}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-[#6b7280] uppercase">KÖZZÉTÉVE</div>
                      <div className="text-[#d1d5db] mt-0.5">
                        {formatDate(item.publishedAt)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-[#6b7280] uppercase">FORRÁS</div>
                      <div className="text-[#38bdf8] font-medium mt-0.5 truncate" title={item.sourceName}>
                        {item.sourceName}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-[#6b7280] uppercase">HATÁRIDŐ</div>
                      <div className="mt-0.5">
                        {item.deadline ? (
                          <span className="text-[#fbbf24] font-bold">{item.deadline}</span>
                        ) : (
                          <span className="text-[#6b7280]">Nincs megadva</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Save to database */}
                      <button
                        type="button"
                        onClick={() => onSaveItem(item)}
                        className={`px-3 py-1.5 font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                          isSaved
                            ? 'border border-[#8b5cf6]/50 bg-[#8b5cf6]/10 text-[#c4b5fd]'
                            : 'border border-[#2b303c] bg-[#161a22] text-[#d1d5db] hover:text-white hover:border-[#4b5563]'
                        }`}
                      >
                        <Bookmark size={13} className={isSaved ? 'fill-current' : ''} />
                        <span>{isSaved ? '★ MENTVE' : '☆ MENTÉS'}</span>
                      </button>

                      {/* Prepare Application (Requirement 10 & 11) */}
                      <button
                        type="button"
                        onClick={() => onOpenApplication(item)}
                        className="px-3 py-1.5 border border-[#3b4354] bg-[#1f2533] hover:bg-[#2b3346] text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Send size={13} className="text-[#38bdf8]" />
                        <span>JELENTKEZÉS ELŐKÉSZÍTÉSE</span>
                      </button>

                      {/* Reminder if deadline present */}
                      {item.deadline && (
                        <button
                          type="button"
                          onClick={() => onOpenReminder(item)}
                          className="px-3 py-1.5 border border-[#443822] bg-[#221c12] hover:bg-[#2e2618] text-[#fbbf24] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Bell size={13} />
                          <span>EMLÉKEZTESS</span>
                        </button>
                      )}
                    </div>

                    {/* Open Original Source */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 border border-[#2b303c] text-[#9ca3af] hover:text-white hover:border-[#4b5563] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <span>EREDETI FORRÁS MEGNYITÁSA</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Transparency: Recently scanned feed toggle */}
      {showRecentFeed && recentItems.length > 0 && (
        <div className="p-5 border border-[#232733] bg-[#0c0d10] space-y-4">
          <div className="flex items-center justify-between border-b border-[#1b1e26] pb-3">
            <div>
              <h5 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                Legutóbbi pásztázott filmes cikkek ({recentItems.length})
              </h5>
              <p className="text-[11px] text-[#6b7280]">
                A hivatalos forrásokból beérkező cikkek listája. A rendszer szűri őket, hogy csak a valódi kaszkadőri felhívások kerüljenek kiemelésre.
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenRecentFeed}
              className="text-[#6b7280] hover:text-white font-mono text-xs"
            >
              Bezárás ✕
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {recentItems.map((rec) => (
              <div
                key={rec.id}
                className="p-3 border border-[#1b1e26] bg-[#08090b] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-[#d1d5db] line-clamp-1">{rec.title}</div>
                  <div className="font-mono text-[10px] text-[#6b7280] flex items-center gap-3">
                    <span>{rec.sourceName}</span>
                    <span>{formatDate(rec.publishedAt)}</span>
                  </div>
                </div>

                <a
                  href={rec.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-[#38bdf8] hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Megnyitás</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
