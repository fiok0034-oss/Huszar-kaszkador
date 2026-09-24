import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, UserCheck, HardDrive, CheckCircle2 } from 'lucide-react';
import type { JobStatus } from '../../server/workspaceStorage';
import { updateLocalItemStatus } from '../../utils/localJobStorage';

interface StatusSelectorProps {
  currentStatus: JobStatus;
  itemId: string;
  onStatusChange: (status: JobStatus) => Promise<void> | void;
  compact?: boolean;
}

export const STATUS_OPTIONS: {
  value: JobStatus;
  label: string;
  code: string;
  accentColor: string;
  dotColor: string;
  badgeBg: string;
  borderColor: string;
  hoverBorder: string;
  description: string;
}[] = [
  {
    value: 'ÉRDEKEL',
    label: 'Érdekel',
    code: 'ST-01',
    accentColor: 'text-[#38bdf8]',
    dotColor: 'bg-[#38bdf8]',
    badgeBg: 'bg-[#0369a1]/15',
    borderColor: 'border-[#0284c7]/40',
    hoverBorder: 'hover:border-[#38bdf8]/70',
    description: 'Személyes figyelőlistára téve',
  },
  {
    value: 'JELENTKEZVE',
    label: 'Jelentkezve',
    code: 'ST-02',
    accentColor: 'text-[#34d399]',
    dotColor: 'bg-[#34d399]',
    badgeBg: 'bg-[#065f46]/20',
    borderColor: 'border-[#059669]/40',
    hoverBorder: 'hover:border-[#34d399]/70',
    description: 'Megkeresés / portfólió elküldve',
  },
  {
    value: 'VISSZAJELZÉSRE VÁR',
    label: 'Visszajelzésre vár',
    code: 'ST-03',
    accentColor: 'text-[#fbbf24]',
    dotColor: 'bg-[#fbbf24]',
    badgeBg: 'bg-[#92400e]/20',
    borderColor: 'border-[#d97706]/40',
    hoverBorder: 'hover:border-[#fbbf24]/70',
    description: 'Koordinátori egyeztetés alatt',
  },
  {
    value: 'LEZÁRVA',
    label: 'Lezárva',
    code: 'ST-04',
    accentColor: 'text-[#9ca3af]',
    dotColor: 'bg-[#6b7280]',
    badgeBg: 'bg-[#1f2937]/30',
    borderColor: 'border-[#4b5563]/40',
    hoverBorder: 'hover:border-[#9ca3af]/60',
    description: 'A produkció vagy felhívás zárult',
  },
  {
    value: 'ELUTASÍTVA',
    label: 'Elutasítva',
    code: 'ST-05',
    accentColor: 'text-[#f87171]',
    dotColor: 'bg-[#ef4444]',
    badgeBg: 'bg-[#7f1d1d]/20',
    borderColor: 'border-[#dc2626]/40',
    hoverBorder: 'hover:border-[#f87171]/70',
    description: 'Nem releváns vagy más döntés született',
  },
];

export const StatusSelector: React.FC<StatusSelectorProps> = ({
  currentStatus,
  itemId,
  onStatusChange,
  compact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastSelectedLabel, setLastSelectedLabel] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption =
    STATUS_OPTIONS.find((opt) => opt.value === currentStatus) || STATUS_OPTIONS[0];

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelectStatus = async (newStatus: JobStatus) => {
    if (newStatus === currentStatus) {
      setIsOpen(false);
      return;
    }

    const chosenOption = STATUS_OPTIONS.find((opt) => opt.value === newStatus);
    setUpdating(true);
    setIsOpen(false);

    try {
      // 1. Immediately persist to client-side localStorage
      updateLocalItemStatus(itemId, newStatus);

      // 2. Call handler for server sync & parent state update
      await onStatusChange(newStatus);

      setLastSelectedLabel(chosenOption ? chosenOption.label : newStatus);
      setShowFeedback(true);
      setTimeout(() => setShowFeedback(false), 2600);
    } catch (err) {
      console.error('Status change error:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div ref={dropdownRef} className="relative inline-flex flex-col gap-1 select-none">
      {/* Label and interactive trigger button */}
      <div className="flex items-center gap-1.5">
        <span
          className="font-mono text-[10px] text-[#6b7280] uppercase tracking-wider flex items-center gap-1 cursor-default select-none"
          title="Kizárólag a te döntésedet tükrözi – localStorage-ben és adatbázisban rögzítve"
        >
          <UserCheck size={11} className="text-[#10b981]" />
          <span>STÁTUSZ:</span>
        </span>

        {/* Műhely Technical Trigger Button */}
        <button
          type="button"
          onClick={() => !updating && setIsOpen((prev) => !prev)}
          onKeyDown={handleKeyDown}
          disabled={updating}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label="Jelentkezési státusz kiválasztása"
          className={`group relative inline-flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-none border transition-all duration-150 cursor-pointer font-mono text-[11px] font-semibold uppercase tracking-wider ${
            currentOption.badgeBg
          } ${currentOption.accentColor} ${currentOption.borderColor} ${
            isOpen
              ? 'border-white/40 bg-[#161a23] ring-1 ring-white/20'
              : 'hover:bg-[#12161f] hover:border-[#3f4756]'
          } ${updating ? 'opacity-60 cursor-wait' : ''}`}
        >
          {/* Subtle Industrial Corner Reticle Marks */}
          <span className="absolute -top-[1px] -left-[1px] w-1 h-1 border-t border-l border-[#6b7280]/60 pointer-events-none group-hover:border-white/70 transition-colors" />
          <span className="absolute -bottom-[1px] -right-[1px] w-1 h-1 border-b border-r border-[#6b7280]/60 pointer-events-none group-hover:border-white/70 transition-colors" />

          {/* Mechanical Square Pip */}
          <span
            className={`w-1.5 h-1.5 rounded-none shrink-0 ${currentOption.dotColor} shadow-[0_0_6px_currentColor] transition-transform duration-150 group-hover:scale-110`}
          />

          {/* Selected Status Label */}
          <span className="truncate max-w-[130px] sm:max-w-none">
            {currentOption.label}
          </span>

          {/* Technical Part Code */}
          <span className="hidden sm:inline font-mono text-[9px] text-[#6b7280] group-hover:text-[#9ca3af] transition-colors">
            [{currentOption.code}]
          </span>

          {/* Precision Industrial Chevron */}
          <ChevronDown
            size={12}
            className={`text-[#9ca3af] group-hover:text-white transition-transform duration-150 ${
              isOpen ? 'rotate-180 text-white' : ''
            } ${updating ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* Műhely Technical Dropdown Menu Panel */}
      {isOpen && (
        <div
          role="listbox"
          className="absolute z-50 top-full left-0 mt-1 min-w-[220px] sm:min-w-[260px] bg-[#0c0e13] border border-[#262c37] shadow-[0_12px_32px_rgba(0,0,0,0.85)] animate-in fade-in zoom-in-95 duration-100 divide-y divide-[#171b23]"
        >
          {/* Panel Technical Header */}
          <div className="px-3 py-1.5 bg-[#080a0e] flex items-center justify-between font-mono text-[9px] text-[#6b7280] tracking-widest uppercase border-b border-[#1b2029]">
            <span>MŰHELY // STÁTUSZ</span>
            <span className="text-[#10b981] flex items-center gap-1">
              <HardDrive size={9} />
              <span>LOCALSTORAGE</span>
            </span>
          </div>

          {/* Options List */}
          <div className="p-1 space-y-0.5">
            {STATUS_OPTIONS.map((opt) => {
              const isSelected = opt.value === currentStatus;

              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectStatus(opt.value)}
                  className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between gap-2 font-mono transition-all duration-100 cursor-pointer border-l-2 ${
                    isSelected
                      ? `bg-[#141822] ${opt.accentColor} border-l-current font-bold`
                      : `text-[#9ca3af] hover:text-[#f3f4f6] hover:bg-[#12151c] hover:border-l-[#4b5563] border-l-transparent`
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* Mechanical Indicator */}
                    <span
                      className={`w-1.5 h-1.5 rounded-none shrink-0 ${opt.dotColor} ${
                        isSelected ? 'ring-1 ring-white/50' : 'opacity-70'
                      }`}
                    />

                    <div>
                      <div className="text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <span>{opt.label}</span>
                        <span className="text-[9px] text-[#6b7280] font-normal">
                          [{opt.code}]
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6b7280] font-normal tracking-normal lowercase first-letter:uppercase">
                        {opt.description}
                      </div>
                    </div>
                  </div>

                  {/* Active Selection Check Indicator */}
                  {isSelected && (
                    <Check size={13} className="shrink-0 text-[#10b981]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Panel Footer Disclaimer */}
          <div className="px-2.5 py-1 bg-[#08090c] text-[9px] font-mono text-[#525966] leading-tight flex items-center gap-1">
            <span className="text-[#10b981]">●</span>
            <span>Kizárólag a te döntésed alapján frissül.</span>
          </div>
        </div>
      )}

      {/* Explicit User Confirmation & Local Storage Feedback */}
      {showFeedback && (
        <div className="font-mono text-[10px] text-[#34d399] flex items-center gap-1 animate-in fade-in duration-150">
          <CheckCircle2 size={11} />
          <HardDrive size={10} className="text-[#10b981]" />
          <span>Státusz rögzítve: &quot;{lastSelectedLabel}&quot;</span>
        </div>
      )}
    </div>
  );
};
