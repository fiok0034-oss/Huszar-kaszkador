import React from 'react';
import { Radio, ExternalLink, Activity, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import type { FeedSource } from '../../server/monitorService';

interface SourcesDiagnosticsTabProps {
  sources: FeedSource[];
}

export const SourcesDiagnosticsTab: React.FC<SourcesDiagnosticsTabProps> = ({ sources }) => {
  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Még nem ellenőrizve';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('hu-HU', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 border border-[#232733] bg-[#0c0d10] flex items-center justify-between">
        <div>
          <h4 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            HIVATALOS ADATFORRÁSOK DIAGNOSZTIKÁJA ({sources.length})
          </h4>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            A rendszer kizárólag nyilvános, jogilag hozzáférhető RSS/Atom/XML hírfolyamokat figyel. Nincs scraper vagy zárt rendszer megkerülés.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sources.map((source) => (
          <div
            key={source.id}
            className="p-5 border border-[#232733] bg-[#0e1014] flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2 border-b border-[#1b1e26] pb-2">
                <span className="font-mono text-xs font-bold text-white truncate">
                  {source.name}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      source.status === 'ONLINE'
                        ? 'bg-[#10b981]'
                        : source.status === 'CHECKING'
                        ? 'bg-[#fbbf24] animate-pulse'
                        : source.status === 'UNAVAILABLE'
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#ef4444]'
                    }`}
                  />
                  <span className="font-mono text-[10px] text-[#9ca3af]">
                    {source.status === 'ONLINE'
                      ? 'ACTIVE'
                      : source.status === 'UNAVAILABLE'
                      ? 'UNAVAILABLE'
                      : source.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-[#9ca3af] leading-relaxed">
                {source.description}
              </p>

              {source.status === 'UNAVAILABLE' && (
                <div className="p-2 border border-[#f59e0b]/30 bg-[#f59e0b]/10 text-[#fbbf24] text-[10px] font-mono flex items-start gap-1.5">
                  <AlertCircle size={13} className="shrink-0 mt-0.5 text-[#f59e0b]" />
                  <div>
                    <strong className="block font-bold">SOURCE NOT AVAILABLE FOR AUTOMATIC MONITORING</strong>
                    <span className="text-[#fef3c7]">{source.notes || 'Közvetlen nyílt RSS hírfolyam hiányában automatikus figyelésre nem alkalmas.'}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-[#1b1e26] font-mono text-[11px]">
              <div className="grid grid-cols-2 gap-2 text-[#9ca3af]">
                <div>
                  <span className="text-[#6b7280]">Látencia:</span>{' '}
                  <strong className="text-white">
                    {source.status === 'UNAVAILABLE' ? '–' : source.latencyMs ? `${source.latencyMs} ms` : '–'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#6b7280]">Találatok:</span>{' '}
                  <strong className="text-white">
                    {source.status === 'UNAVAILABLE' ? 'Inaktív' : `${source.itemsRetrieved ?? 0} db`}
                  </strong>
                </div>
              </div>

              <div className="text-[#6b7280]">
                Utolsó ellenőrzés:{' '}
                <span className="text-[#d1d5db]">{formatTime(source.lastChecked)}</span>
              </div>

              {source.errorMessage && (
                <div className="text-[10px] text-[#ef4444] bg-[#ef4444]/10 p-1.5 border border-[#ef4444]/20">
                  Hiba: {source.errorMessage}
                </div>
              )}

              <div className="pt-1 flex items-center justify-between">
                <span className="text-[10px] text-[#4b5563] uppercase">Kategória: {source.category}</span>
                {source.status !== 'UNAVAILABLE' ? (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38bdf8] hover:underline flex items-center gap-1 text-[10px]"
                  >
                    <span>Közvetlen RSS Feed link</span>
                    <ExternalLink size={10} />
                  </a>
                ) : (
                  <span className="text-[10px] text-[#6b7280]">Nem elérhető közvetlen feed</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
