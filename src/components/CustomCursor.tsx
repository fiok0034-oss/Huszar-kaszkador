import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Check if the device is a touch screen or does not support fine hover
    const isTouch = window.matchMedia('(hover: none) or (pointer: coarse)').matches;
    setIsTouchDevice(isTouch);
    if (isTouch) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if hovering an interactive target
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('a, button, input, select, textarea, [role="button"], .cursor-pointer');
        setIsHovered(!!interactive);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out select-none"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        left: 0,
        top: 0,
      }}
    >
      {/* Central Crosshair '+' */}
      <div
        className={`relative -left-1/2 -top-1/2 flex items-center justify-center transition-all duration-150 ${
          isHovered ? 'scale-125' : 'scale-100'
        }`}
      >
        {/* Reticle Ring */}
        <div
          className={`rounded-full border transition-all duration-150 ${
            isHovered
              ? 'w-7 h-7 border-[#10b981]/70 bg-[#10b981]/10'
              : 'w-4 h-4 border-[#9ca3af]/40 bg-transparent'
          }`}
        />

        {/* Center Crosshair lines */}
        <div
          className={`absolute w-2 h-[1px] ${
            isHovered ? 'bg-[#10b981]' : 'bg-[#9ca3af]/70'
          }`}
        />
        <div
          className={`absolute h-2 w-[1px] ${
            isHovered ? 'bg-[#10b981]' : 'bg-[#9ca3af]/70'
          }`}
        />
      </div>
    </div>
  );
};
