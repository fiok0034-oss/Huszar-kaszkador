import React, { useState, useRef } from 'react';
import { Target, Layers, Sparkles } from 'lucide-react';

interface BlueprintProps {
  minimal?: boolean;
}

interface Hotspot {
  id: string;
  x: number;
  y: number;
  label: string;
  code: string;
  detail: string;
}

export const BmwE30Blueprint: React.FC<BlueprintProps> = ({ minimal = false }) => {
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>('hs-1');
  const [transformStyle, setTransformStyle] = useState<string>('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  const containerRef = useRef<HTMLDivElement>(null);

  const hotspots: Hotspot[] = [
    {
      id: 'hs-1',
      x: 180,
      y: 195,
      label: 'BMW E30',
      code: 'CHASSIS // BASE',
      detail: 'Klasszikus sportalap és karosszéria a továbbképzéshez.',
    },
    {
      id: 'hs-2',
      x: 450,
      y: 220,
      label: 'ÉPÍTÉS ALATT',
      code: 'STATUS // WORKSHOP',
      detail: 'Folyamatban lévő saját építésű sport- és versenymunkaautó.',
    },
    {
      id: 'hs-3',
      x: 580,
      y: 140,
      label: 'SPORT / VERSENY MUNKAAUTÓ',
      code: 'SPEC // PURPOSE',
      detail: 'Speciális munkajárműként funkcionáló kaszkadőri platform.',
    },
    {
      id: 'hs-4',
      x: 750,
      y: 210,
      label: 'AUTÓS KASZKADŐR TOVÁBBKÉPZÉS',
      code: 'PHASE // TARGET',
      detail: 'A következő szakmai szinthez szükséges gyakorlati felkészülés.',
    },
  ];

  // Mouse tilt interaction for desktop
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || window.innerWidth < 768) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3; // max 3 deg
    const rotateY = ((x - centerX) / centerX) * 4; // max 4 deg
    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg)');
  };

  const currentPoint = hotspots.find((h) => h.id === activeHotspot) || hotspots[0];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle, transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
      className="w-full relative rounded-lg border border-[#22252b] bg-[#0f1115] overflow-hidden transition-shadow duration-300 hover:border-[#343944] hover:shadow-[0_8px_30px_rgba(0,0,0,0.5)]"
    >
      {/* Blueprint grid background */}
      <div className={`absolute inset-0 pointer-events-none ${showGrid ? 'bg-blueprint-grid opacity-60' : 'opacity-0'} transition-opacity duration-300`} />
      
      {/* Header bar of the schematic / technical view */}
      <div className="relative z-10 flex flex-wrap items-center justify-between px-4 py-3 border-b border-[#1f2228] bg-[#121418]/90 text-xs font-mono text-[#9ca3af]">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            SCHEMATIC // BMW E30
          </span>
          <span className="hidden sm:inline text-[#4b5563]">|</span>
          <span className="hidden sm:inline text-[#6b7280]">INTERAKTÍV MŰHELYRAJZ</span>
        </div>

        {!minimal && (
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                showGrid
                  ? 'border-[#4b5563] text-white bg-[#1a1d24]'
                  : 'border-[#262930] text-[#6b7280] hover:text-[#9ca3af]'
              }`}
            >
              RÁCS: {showGrid ? 'BE' : 'KI'}
            </button>
            <button
              type="button"
              onClick={() => setShowAxes(!showAxes)}
              className={`px-2.5 py-1 text-[11px] border transition-colors cursor-pointer ${
                showAxes
                  ? 'border-[#4b5563] text-white bg-[#1a1d24]'
                  : 'border-[#262930] text-[#6b7280] hover:text-[#9ca3af]'
              }`}
            >
              TENGELYEK: {showAxes ? 'BE' : 'KI'}
            </button>
          </div>
        )}
      </div>

      {/* SVG Canvas with Interactive Hotspots */}
      <div className="relative p-2 sm:p-6 flex flex-col items-center justify-center">
        <svg
          viewBox="0 0 900 380"
          className="w-full max-w-4xl h-auto select-none"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#6b7280" />
            </marker>
          </defs>

          {/* Technical Axes & Datum lines */}
          {showAxes && (
            <g className="text-datum opacity-40 font-mono text-[9px] fill-[#6b7280]" stroke="#374151" strokeWidth="0.75" strokeDasharray="4 4">
              {/* Ground baseline */}
              <line x1="40" y1="310" x2="860" y2="310" stroke="#4b5563" strokeDasharray="none" />
              <text x="825" y="325" fill="#9ca3af" stroke="none">BASE: 0.00</text>

              {/* Center vertical datum */}
              <line x1="450" y1="40" x2="450" y2="340" />
              <circle cx="450" cy="180" r="3" fill="none" stroke="#9ca3af" strokeWidth="1" />
              <text x="458" y="184" fill="#9ca3af" stroke="none">DATUM X:0</text>

              {/* Front axle line */}
              <line x1="220" y1="50" x2="220" y2="330" />
              <text x="205" y="338" fill="#6b7280" stroke="none">W1</text>

              {/* Rear axle line */}
              <line x1="680" y1="50" x2="680" y2="330" />
              <text x="665" y="338" fill="#6b7280" stroke="none">W2</text>

              {/* Roof max height guideline */}
              <line x1="100" y1="90" x2="800" y2="90" />
              <text x="50" y="94" fill="#6b7280" stroke="none">ROOF LINE</text>

              {/* Beltline guideline */}
              <line x1="100" y1="180" x2="800" y2="180" />
              <text x="50" y="184" fill="#6b7280" stroke="none">BELTLINE</text>

              {/* Dimension line front to rear axle */}
              <line x1="220" y1="330" x2="680" y2="330" stroke="#4b5563" strokeDasharray="none" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
              <text x="415" y="348" fill="#9ca3af" stroke="none">TENGELYTÁV</text>
            </g>
          )}

          {/* BMW E30 Silhouette & Body Lines */}
          <g stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {/* Outer Silhouette */}
            <path
              d="
                M 80 290 
                L 90 280 
                L 92 250 
                L 100 240 
                L 96 215 
                L 104 205 
                L 115 195
                L 260 185
                L 345 105
                L 570 95
                L 690 180
                L 795 185
                L 815 195
                L 812 250
                L 820 270
                L 815 285
                L 800 290
              "
              className="transition-all duration-300"
            />

            {/* Underbody line between wheels */}
            <path
              d="
                M 130 290
                L 165 290
                A 55 55 0 0 1 275 290
                L 625 290
                A 55 55 0 0 1 735 290
                L 775 290
              "
              stroke="#94a3b8"
              strokeWidth="1.8"
            />

            {/* Front wheel arch flare */}
            <path d="M 160 290 A 60 60 0 0 1 280 290" stroke="#cbd5e1" strokeWidth="2" />
            {/* Rear wheel arch flare */}
            <path d="M 620 290 A 60 60 0 0 1 740 290" stroke="#cbd5e1" strokeWidth="2" />

            {/* Greenhouse (Windows) */}
            <path
              d="
                M 345 115
                L 565 105
                L 675 182
                L 270 182
                Z
              "
              stroke="#94a3b8"
              strokeWidth="1.5"
              fill="rgba(255, 255, 255, 0.02)"
            />

            {/* B-pillar divider */}
            <line x1="475" y1="108" x2="470" y2="182" stroke="#64748b" strokeWidth="2" />

            {/* Door shutlines */}
            <path d="M 270 182 L 270 286" stroke="#475569" strokeWidth="1.5" />
            <path d="M 525 182 L 515 286" stroke="#475569" strokeWidth="1.5" />

            {/* Character Waist Line */}
            <line x1="110" y1="210" x2="810" y2="200" stroke="#64748b" strokeWidth="1.2" />

            {/* Lower door molding */}
            <line x1="120" y1="262" x2="795" y2="262" stroke="#475569" strokeWidth="1" />

            {/* Twin Round Headlight Indicators */}
            <circle cx="106" cy="216" r="6" stroke="#e2e8f0" strokeWidth="1.5" fill="#1e293b" />
            <circle cx="120" cy="214" r="5" stroke="#94a3b8" strokeWidth="1" fill="#0f172a" />

            {/* Front turn signal indicator */}
            <rect x="100" y="235" width="14" height="6" stroke="#94a3b8" strokeWidth="1" fill="none" />

            {/* Rear taillight block indicator */}
            <path
              d="M 808 205 L 812 245 L 795 245 L 795 205 Z"
              stroke="#e2e8f0"
              strokeWidth="1.5"
              fill="#1e293b"
            />

            {/* Front Wheel */}
            <g stroke="#cbd5e1" strokeWidth="1.5">
              <circle cx="220" cy="275" r="44" stroke="#e2e8f0" strokeWidth="2" fill="#090a0d" />
              <circle cx="220" cy="275" r="32" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="220" cy="275" r="10" stroke="#cbd5e1" strokeWidth="1.5" fill="#1e293b" />
              <line x1="220" y1="243" x2="220" y2="307" stroke="#64748b" strokeWidth="1" />
              <line x1="188" y1="275" x2="252" y2="275" stroke="#64748b" strokeWidth="1" />
              <line x1="197" y1="252" x2="243" y2="298" stroke="#64748b" strokeWidth="1" />
              <line x1="197" y1="298" x2="243" y2="252" stroke="#64748b" strokeWidth="1" />
            </g>

            {/* Rear Wheel */}
            <g stroke="#cbd5e1" strokeWidth="1.5">
              <circle cx="680" cy="275" r="44" stroke="#e2e8f0" strokeWidth="2" fill="#090a0d" />
              <circle cx="680" cy="275" r="32" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="680" cy="275" r="10" stroke="#cbd5e1" strokeWidth="1.5" fill="#1e293b" />
              <line x1="680" y1="243" x2="680" y2="307" stroke="#64748b" strokeWidth="1" />
              <line x1="648" y1="275" x2="712" y2="275" stroke="#64748b" strokeWidth="1" />
              <line x1="657" y1="252" x2="703" y2="298" stroke="#64748b" strokeWidth="1" />
              <line x1="657" y1="298" x2="703" y2="252" stroke="#64748b" strokeWidth="1" />
            </g>

            {/* Side Mirror */}
            <path d="M 320 182 L 310 172 L 328 170 L 332 182 Z" stroke="#94a3b8" strokeWidth="1.2" fill="#1e293b" />
          </g>

          {/* Interactive Inspection Hotspots on the vehicle */}
          {hotspots.map((hs) => {
            const isSelected = activeHotspot === hs.id;
            return (
              <g
                key={hs.id}
                className="cursor-pointer group"
                onClick={() => setActiveHotspot(hs.id)}
              >
                {/* Outer pulsing ping when selected */}
                {isSelected && (
                  <circle
                    cx={hs.x}
                    cy={hs.y}
                    r="16"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="1"
                    opacity="0.4"
                    className="animate-ping"
                  />
                )}
                {/* Outer Target Circle */}
                <circle
                  cx={hs.x}
                  cy={hs.y}
                  r="10"
                  fill={isSelected ? '#10b981' : '#1f2937'}
                  stroke={isSelected ? '#6ee7b7' : '#9ca3af'}
                  strokeWidth="1.5"
                  className="transition-colors duration-200"
                />
                {/* Inner Reticle Dot */}
                <circle
                  cx={hs.x}
                  cy={hs.y}
                  r="3"
                  fill={isSelected ? '#064e3b' : '#ffffff'}
                />
                {/* Crosshairs */}
                <line x1={hs.x - 14} y1={hs.y} x2={hs.x - 8} y2={hs.y} stroke={isSelected ? '#6ee7b7' : '#6b7280'} strokeWidth="1" />
                <line x1={hs.x + 8} y1={hs.y} x2={hs.x + 14} y2={hs.y} stroke={isSelected ? '#6ee7b7' : '#6b7280'} strokeWidth="1" />
                <line x1={hs.x} y1={hs.y - 14} x2={hs.x} y2={hs.y - 8} stroke={isSelected ? '#6ee7b7' : '#6b7280'} strokeWidth="1" />
                <line x1={hs.x} y1={hs.y + 8} x2={hs.x} y2={hs.y + 14} stroke={isSelected ? '#6ee7b7' : '#6b7280'} strokeWidth="1" />

                {/* Hotspot Code label in SVG */}
                <text
                  x={hs.x}
                  y={hs.y - 18}
                  textAnchor="middle"
                  fill={isSelected ? '#10b981' : '#9ca3af'}
                  fontSize="8"
                  fontFamily="monospace"
                  fontWeight={isSelected ? 'bold' : 'normal'}
                >
                  {hs.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Interactive Hotspot Inspector Readout Panel */}
        <div className="w-full mt-4 p-4 border border-[#22252c] bg-[#121418] rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded bg-[#1c2027] border border-[#2e333d] flex items-center justify-center shrink-0 text-[#10b981]">
              <Target size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-[#10b981] tracking-wider uppercase font-semibold">
                  {currentPoint.code}
                </span>
                <span className="text-[#374151]" aria-hidden="true">·</span>
                <span className="font-display text-sm font-bold text-white uppercase">
                  {currentPoint.label}
                </span>
              </div>
              <p className="text-xs text-[#9ca3af] mt-0.5 leading-relaxed">
                {currentPoint.detail}
              </p>
            </div>
          </div>

          {/* Quick select buttons on touch / mobile / desktop */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {hotspots.map((hs, i) => (
              <button
                key={hs.id}
                type="button"
                onClick={() => setActiveHotspot(hs.id)}
                className={`px-2.5 py-1 text-[11px] font-mono border transition-all cursor-pointer ${
                  activeHotspot === hs.id
                    ? 'border-[#10b981] text-white bg-[#064e3b]/30'
                    : 'border-[#262a32] text-[#6b7280] hover:text-[#9ca3af] hover:border-[#383e4a]'
                }`}
              >
                0{i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Blueprint footer metadata */}
      <div className="px-4 py-2.5 border-t border-[#1f2228] bg-[#111317] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#6b7280]">
        <div>TÍPUS: BMW 3-AS SOROZAT (E30)</div>
        <div className="flex items-center gap-2">
          <span className="text-[#4b5563]">KATTINTS A PONTOKRA A VIZSGÁLATHOZ</span>
          <span className="text-[#9ca3af]">| CÉL: SPORT / VERSENY MUNKAAUTÓ</span>
        </div>
      </div>
    </div>
  );
};
