import React, { useState, useMemo } from 'react';
import {
  Bookmark,
  ExternalLink,
  Trash2,
  Send,
  Bell,
  Clock,
  Calendar,
  Edit3,
  Check,
  AlertCircle,
  FileText,
  CheckCircle2,
  UserCheck,
  Filter,
} from 'lucide-react';
import type { SavedProductionItem, JobStatus } from '../../server/workspaceStorage';
import { StatusSelector } from './StatusSelector';

interface SavedItemsTabProps {
  savedItems: SavedProductionItem[];
  onUpdateStatus: (id: string, status: JobStatus) => Promise<void>;
  onUpdateNotes: (id: string, notes: string) => Promise<void>;
  onRemoveItem: (id: string) => Promise<void>;
  onOpenApplication: (item: any) => void;
  onOpenReminder: (item: any) => void;
}

export const SavedItemsTab: React.FC<SavedItemsTabProps> = ({
  savedItems,
  onUpdateStatus,
  onUpdateNotes,
  onRemoveItem,
  onOpenApplication,
  onOpenReminder,
}) => {
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [savedStatusFilter, setSavedStatusFilter] = useState<'ALL' | JobStatus>('ALL');

  const startEditNotes = (item: SavedProductionItem) => {
    setEditingNotesId(item.id);
    setTempNotes(item.userNotes || '');
  };

  const handleSaveNotes = async (id: string) => {
    setSavingNotes(true);
    try {
      await onUpdateNotes(id, tempNotes);
      setEditingNotesId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  };

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

  // Status counts
  const erdekelCount = savedItems.filter((i) => i.status === 'ÉRDEKEL').length;
  const jelentkezveCount = savedItems.filter((i) => i.status === 'JELENTKEZVE').length;
  const visszajelzesreVarCount = savedItems.filter((i) => i.status === 'VISSZAJELZÉSRE VÁR').length;

  const filteredItems = useMemo(() => {
    if (savedStatusFilter === 'ALL') return savedItems;
    return savedItems.filter((i) => i.status === savedStatusFilter);
  }, [savedItems, savedStatusFilter]);

  return (
    <div className="space-y-6">
      {/* Informative Header Banner with User Interaction Guarantee */}
      <div className="p-4 border border-[#232733] bg-[#0c0d10] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="font-mono text-xs font-bold text-white uppercase flex items-center gap-2">
            <Bookmark size={14} className="text-[#38bdf8]" />
            <span>MENTETT PRODUKCIÓK &amp; JELENTKEZÉS KÖVETŐ ({savedItems.length})</span>
          </div>
          <p className="text-[11px] text-[#9ca3af] flex items-center gap-1.5">
            <UserCheck size={13} className="text-[#10b981] shrink-0" />
            <span>
              A státuszok kizárólag a <strong>felhasználói döntést és interakciót</strong> tükrözik. A rendszer soha nem módosítja őket automatikusan.
            </span>
          </p>
        </div>

        {/* Status Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 md:pt-0">
          <button
            type="button"
            onClick={() => setSavedStatusFilter('ALL')}
            className={`px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase border transition-all cursor-pointer ${
              savedStatusFilter === 'ALL'
                ? 'border-white/50 text-white bg-[#171a22] font-bold shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                : 'border-[#22252c] text-[#858d9d] bg-[#0a0c10] hover:border-[#383e4a] hover:text-[#d1d5db]'
            }`}
          >
            Mind ({savedItems.length})
          </button>

          <button
            type="button"
            onClick={() => setSavedStatusFilter('ÉRDEKEL')}
            className={`px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase border transition-all cursor-pointer ${
              savedStatusFilter === 'ÉRDEKEL'
                ? 'border-[#38bdf8]/60 text-[#38bdf8] bg-[#0369a1]/20 font-bold shadow-[0_0_10px_rgba(56,189,248,0.1)]'
                : 'border-[#22252c] text-[#858d9d] bg-[#0a0c10] hover:border-[#38bdf8]/40 hover:text-[#38bdf8]'
            }`}
          >
            Érdekel ({erdekelCount})
          </button>

          <button
            type="button"
            onClick={() => setSavedStatusFilter('JELENTKEZVE')}
            className={`px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase border transition-all cursor-pointer ${
              savedStatusFilter === 'JELENTKEZVE'
                ? 'border-[#34d399]/60 text-[#34d399] bg-[#065f46]/20 font-bold shadow-[0_0_10px_rgba(52,211,153,0.1)]'
                : 'border-[#22252c] text-[#858d9d] bg-[#0a0c10] hover:border-[#34d399]/40 hover:text-[#34d399]'
            }`}
          >
            Jelentkezve ({jelentkezveCount})
          </button>

          <button
            type="button"
            onClick={() => setSavedStatusFilter('VISSZAJELZÉSRE VÁR')}
            className={`px-2.5 py-1 text-[11px] font-mono tracking-wider uppercase border transition-all cursor-pointer ${
              savedStatusFilter === 'VISSZAJELZÉSRE VÁR'
                ? 'border-[#fbbf24]/60 text-[#fbbf24] bg-[#92400e]/20 font-bold shadow-[0_0_10px_rgba(251,191,36,0.1)]'
                : 'border-[#22252c] text-[#858d9d] bg-[#0a0c10] hover:border-[#fbbf24]/40 hover:text-[#fbbf24]'
            }`}
          >
            Visszajelzésre vár ({visszajelzesreVarCount})
          </button>
        </div>
      </div>

      {savedItems.length === 0 ? (
        <div className="p-12 border border-[#232733] bg-[#0e1014] text-center space-y-3">
          <Bookmark size={32} className="mx-auto text-[#4b5563]" />
          <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
            Nincs még mentett produkció vagy munka
          </h4>
          <p className="text-xs text-[#9ca3af] max-w-md mx-auto">
            A &apos;KASZKADŐR FIGYELŐ&apos; vagy a &apos;FILM &amp; SOROZAT FIGYELŐ&apos; füleken a &apos;☆ MENTÉS&apos; gombra kattintva rögzíthetsz produkciókat a munkafelületedre.
          </p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-8 border border-[#232733] bg-[#0e1014] text-center space-y-2">
          <div className="font-mono text-xs text-[#9ca3af]">
            Nincs tétel a kiválasztott státusz-szűrővel ({savedStatusFilter}).
          </div>
          <button
            type="button"
            onClick={() => setSavedStatusFilter('ALL')}
            className="text-xs font-mono text-[#38bdf8] underline cursor-pointer"
          >
            Összes mentett tétel mutatása
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item, index) => {
            const isEditingNotes = editingNotesId === item.id;

            return (
              <div
                key={`${item.id}-${index}`}
                className="p-5 border border-[#232733] bg-[#0e1014] hover:border-[#383e4c] transition-all space-y-4"
              >
                {/* Header row: Status Selector & Type */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1b1e26] pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Status Dropdown Component */}
                    <StatusSelector
                      currentStatus={item.status}
                      itemId={item.id}
                      onStatusChange={(newStatus) => onUpdateStatus(item.id, newStatus)}
                    />

                    <span className="font-mono text-[10px] text-[#9ca3af] px-2 py-0.5 border border-[#22252c]">
                      {item.itemType === 'stunt' ? 'Kaszkadőr munka' : 'Filmes produkció'}
                    </span>
                  </div>

                  <div className="font-mono text-[10px] text-[#6b7280]">
                    MENTVE: {formatDate(item.savedAt)}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-display text-lg font-bold text-white tracking-tight">
                    {item.title}
                  </h3>
                  {item.summary && (
                    <p className="text-xs text-[#9ca3af] leading-relaxed mt-1 line-clamp-2">
                      {item.summary}
                    </p>
                  )}
                </div>

                {/* Metadata & Deadlines */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#08090b] border border-[#1b1e26] font-mono text-xs">
                  <div>
                    <div className="text-[10px] text-[#6b7280] uppercase">FORRÁS</div>
                    <div className="text-[#38bdf8] font-medium mt-0.5 truncate" title={item.sourceName}>
                      {item.sourceName}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#6b7280] uppercase">KÖZZÉTÉTEL</div>
                    <div className="text-[#d1d5db] mt-0.5">
                      {formatDate(item.publishedAt)}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#6b7280] uppercase">HATÁRIDŐ</div>
                    <div className="mt-0.5">
                      {item.deadline ? (
                        <span className="text-[#fbbf24] font-bold">{item.deadline}</span>
                      ) : (
                        <span className="text-[#6b7280]">Nincs megadva a forrásban</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#6b7280] uppercase">EMLÉKEZTETŐ</div>
                    <div className="mt-0.5">
                      {item.reminderActive ? (
                        <span className="text-[#34d399] font-medium flex items-center gap-1">
                          <Bell size={11} /> Aktív {item.reminderDate ? `(${formatDate(item.reminderDate)})` : ''}
                        </span>
                      ) : (
                        <span className="text-[#6b7280]">Kikapcsolva</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="p-3 bg-[#0a0c0f] border border-[#1d2028] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[#9ca3af] uppercase tracking-wider flex items-center gap-1.5">
                      <FileText size={12} className="text-[#6b7280]" />
                      Személyes Munkajegyzet:
                    </span>
                    {!isEditingNotes && (
                      <button
                        type="button"
                        onClick={() => startEditNotes(item)}
                        className="text-[10px] font-mono text-[#38bdf8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 size={11} />
                        <span>Szerkesztés</span>
                      </button>
                    )}
                  </div>

                  {isEditingNotes ? (
                    <div className="space-y-2">
                      <textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Írd ide a személyes feljegyzéseidet, casting egyeztetéseket, telefonszámokat..."
                        rows={3}
                        className="w-full bg-[#12151c] border border-[#2b303c] p-2 text-white font-mono text-xs focus:border-[#4b5563] focus:outline-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingNotesId(null)}
                          className="px-2.5 py-1 border border-[#2b303c] text-[#9ca3af] font-mono text-[11px] cursor-pointer"
                        >
                          Mégse
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveNotes(item.id)}
                          disabled={savingNotes}
                          className="px-3 py-1 bg-[#10b981] hover:bg-[#059669] text-black font-mono text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          {savingNotes ? 'Mentés...' : 'Jegyzet Mentése'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#d1d5db] font-mono italic">
                      {item.userNotes ? item.userNotes : <span className="text-[#4b5563]">Nincs rögzített személyes jegyzet ehhez a tételhez.</span>}
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1b1e26]">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Prepare Application */}
                    <button
                      type="button"
                      onClick={() => onOpenApplication(item)}
                      className="px-3 py-1.5 border border-[#3b4354] bg-[#1f2533] hover:bg-[#2b3346] text-white font-mono text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={13} className="text-[#38bdf8]" />
                      <span>JELENTKEZÉS ELŐKÉSZÍTÉSE</span>
                    </button>

                    {/* Set Reminder */}
                    <button
                      type="button"
                      onClick={() => onOpenReminder(item)}
                      className="px-3 py-1.5 border border-[#2b303c] bg-[#161a22] hover:bg-[#1f2430] text-[#d1d5db] font-mono text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                    >
                      <Bell size={13} className={item.reminderActive ? 'text-[#34d399]' : ''} />
                      <span>{item.reminderActive ? 'Emlékeztető módosítása' : 'Emlékeztető beállítása'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* External source */}
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 border border-[#2b303c] text-[#9ca3af] hover:text-white font-mono text-xs uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <span>EREDETI FORRÁS</span>
                      <ExternalLink size={12} />
                    </a>

                    {/* Remove button */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 border border-[#3b2525] bg-[#1c1212] hover:bg-[#2e1818] text-[#f87171] transition-colors cursor-pointer"
                      title="Eltávolítás a mentett tételek közül"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
