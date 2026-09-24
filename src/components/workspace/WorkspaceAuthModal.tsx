import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, ShieldAlert, X, Check } from 'lucide-react';

interface WorkspaceAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
}

export const WorkspaceAuthModal: React.FC<WorkspaceAuthModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
}) => {
  if (!isOpen) return null;

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Default master PIN for Attila's private stunt session
    if (pin.trim().toLowerCase() === 'stunt2026' || pin.trim() === '1987' || pin.trim() === 'e30') {
      onUnlock();
      onClose();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  };

  const handleQuickOwnerUnlock = () => {
    onUnlock();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#121418] border border-[#2b303c] rounded-none max-w-sm w-full text-[#d1d5db] shadow-2xl p-6">
        <div className="flex items-center justify-between border-b border-[#222630] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Lock size={16} className="text-[#10b981]" />
            <h3 className="font-display font-bold text-white text-base uppercase">
              Szakmai Feloldás
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

        <p className="text-xs text-[#9ca3af] leading-relaxed mb-4">
          A mentett produkciók, a jelentkezési státuszok és a személyes jegyzetek védettek. Add meg a szakmai hozzáférési kódot a szerkesztéshez:
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-[11px] font-mono text-[#9ca3af] uppercase tracking-wider mb-1.5">
              Személyes PIN vagy Mester Kód:
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="pl. stunt2026"
              className="w-full bg-[#0a0c0e] border border-[#2b303c] px-3 py-2 text-white font-mono text-center tracking-widest text-sm focus:border-[#4b5563] focus:outline-none"
              autoFocus
            />
            {error && (
              <p className="text-[11px] font-mono text-[#f87171] mt-1.5">
                Érvénytelen kód. (Mester kód: stunt2026)
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="submit"
              className="w-full py-2 bg-[#10b981] hover:bg-[#059669] text-black font-mono text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Feloldás PIN Kóddal
            </button>

            <button
              type="button"
              onClick={handleQuickOwnerUnlock}
              className="w-full py-2 border border-[#2b303c] bg-[#161a22] hover:bg-[#202530] text-[#d1d5db] font-mono text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
            >
              <KeyRound size={13} />
              <span>Szakmai Belépés (Huszár Attila)</span>
            </button>
          </div>
        </form>

        <div className="mt-4 pt-3 border-t border-[#222630] text-[10px] font-mono text-[#6b7280] text-center">
          A feloldott állapot a böngészési munkamenet idejére érvényes.
        </div>
      </div>
    </div>
  );
};
