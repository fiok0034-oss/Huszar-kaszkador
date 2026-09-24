import React, { useState } from 'react';
import { X, Bell, Calendar, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    sourceName: string;
    deadline?: string | null;
    reminderActive?: boolean;
    reminderDate?: string | null;
  } | null;
  onSaveReminder: (id: string, reminderActive: boolean, reminderDate?: string | null) => Promise<void>;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveReminder,
}) => {
  if (!isOpen || !item) return null;

  const [reminderActive, setReminderActive] = useState<boolean>(Boolean(item.reminderActive));
  const [customDate, setCustomDate] = useState<string>(
    item.reminderDate ||
      (item.deadline ? item.deadline : new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0])
  );
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveReminder(item.id, reminderActive, customDate);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121418] border border-[#2b303c] rounded-none max-w-md w-full text-[#d1d5db] shadow-2xl p-6">
        <div className="flex items-center justify-between border-b border-[#222630] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-[#fbbf24]" />
            <h3 className="font-display font-bold text-white text-base uppercase">
              Határidő Emlékeztető
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#9ca3af] hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-4 text-xs space-y-2">
          <div className="text-[#9ca3af] font-mono text-[11px] uppercase tracking-wider">
            Érintett tétel:
          </div>
          <div className="text-white font-semibold">{item.title}</div>
          <div className="text-[#9ca3af] font-mono text-[11px]">
            Forrás: {item.sourceName}
          </div>

          {/* Genuine deadline status */}
          <div className="p-3 border border-[#222630] bg-[#0c0d10] mt-2">
            <div className="text-[10px] font-mono text-[#6b7280] uppercase tracking-wider mb-1">
              Forrásban talált határidő:
            </div>
            {item.deadline ? (
              <div className="text-sm font-mono text-[#fbbf24] font-bold flex items-center gap-1.5">
                <Calendar size={14} />
                <span>{item.deadline}</span>
              </div>
            ) : (
              <div className="text-[11px] font-mono text-[#9ca3af] flex items-center gap-1.5">
                <AlertTriangle size={13} className="text-[#6b7280]" />
                <span>Nincs megadott határidő az eredeti forrásban (nincs kitalált dátum).</span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 p-3 border border-[#232733] bg-[#0e1014]">
            <input
              type="checkbox"
              id="reminderCheck"
              checked={reminderActive}
              onChange={(e) => setReminderActive(e.target.checked)}
              className="w-4 h-4 rounded-none accent-[#10b981] bg-[#1a1e26] border-[#374151]"
            />
            <label htmlFor="reminderCheck" className="text-xs text-white cursor-pointer select-none font-medium">
              Emlékeztető bekapcsolása ehhez a munkához
            </label>
          </div>

          {reminderActive && (
            <div>
              <label className="block text-[11px] font-mono text-[#9ca3af] uppercase tracking-wider mb-1.5">
                Emlékeztetés dátuma:
              </label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="w-full bg-[#0a0c0e] border border-[#2b303c] px-3 py-2 text-white font-mono text-xs focus:border-[#4b5563] focus:outline-none"
                required
              />
            </div>
          )}

          {savedSuccess && (
            <div className="p-2.5 border border-[#1b3826] bg-[#0c1f14] text-[#34d399] font-mono text-xs flex items-center gap-2">
              <CheckCircle2 size={15} />
              <span>Emlékeztető sikeresen mentve az adatbázisba!</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222630]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 border border-[#2b303c] text-[#9ca3af] hover:text-white font-mono text-xs cursor-pointer"
            >
              Mégse
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-1.5 bg-[#222732] hover:bg-[#2c3342] text-white border border-[#3b4354] font-mono text-xs font-semibold uppercase tracking-wider cursor-pointer"
            >
              {isSaving ? 'Mentés...' : 'Mentés'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
