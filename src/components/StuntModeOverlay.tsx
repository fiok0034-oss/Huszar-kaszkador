import React from 'react';
import { Crosshair, ShieldCheck, X } from 'lucide-react';

interface StuntModeOverlayProps {
  isActive: boolean;
  onToggle: () => void;
}

export const StuntModeOverlay: React.FC<StuntModeOverlayProps> = ({ isActive, onToggle }) => {
  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 select-none overflow-hidden" aria-hidden="true">
      {/* Background blueprint fine grid enhancement */}
      <div className="absolute inset-0 bg-blueprint-fine opacity-20" />

      {/* Top Left Telemetry Crosshairs */}
      <div className="absolute top-20 left-4 text-[10px] font-mono text-[#10b981]/70 flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5 font-bold">
          <Crosshair size={12} className="text-[#10b981]" />
          <span>STUNT TELEMETRY // CALIBRATED</span>
        </div>
        <div className="text-[#6b7280]">LOC: PÁTY [47.5028° N, 18.8361° E]</div>
        <div className="text-[#6b7280]">CHASSIS: E30 / GYALOGOS CAS: OK</div>
      </div>

      {/* Top Right Guide Marker */}
      <div className="absolute top-20 right-4 text-[10px] font-mono text-[#6b7280] text-right hidden sm:block">
        <div>SYS: FÜGGETLEN MAGYAR KASZKADŐRÖK</div>
        <div className="text-[#10b981]/60">STATUS: PRO READY</div>
      </div>

      {/* Corner Precision Framing Marks */}
      <div className="absolute top-16 left-2 w-3 h-3 border-t border-l border-[#10b981]/40" />
      <div className="absolute top-16 right-2 w-3 h-3 border-t border-r border-[#10b981]/40" />
      <div className="absolute bottom-16 left-2 w-3 h-3 border-b border-l border-[#10b981]/40" />
      <div className="absolute bottom-16 right-2 w-3 h-3 border-b border-r border-[#10b981]/40" />

      {/* Fixed bottom status indicator badge with pointer-events-auto so it can be closed */}
      <div className="fixed bottom-4 right-4 pointer-events-auto z-50">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0e1014]/95 border border-[#10b981]/60 text-white rounded text-xs font-mono shadow-lg backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
          <span className="text-[#10b981] font-semibold">STUNT MODE AKTÍV</span>
          <button
            type="button"
            onClick={onToggle}
            className="ml-2 text-[#9ca3af] hover:text-white transition-colors cursor-pointer"
            title="Stunt Mode kikapcsolása"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
