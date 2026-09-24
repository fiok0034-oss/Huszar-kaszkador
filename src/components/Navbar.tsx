import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  stuntMode?: boolean;
  onToggleStuntMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, stuntMode = false, onToggleStuntMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'RÓLAM', href: '#rolam', id: 'rolam' },
    { label: 'KASZKADŐR', href: '#kaszkador', id: 'kaszkador' },
    { label: 'FILMEK', href: '#filmek', id: 'filmek' },
    { label: 'E30', href: '#e30', id: 'e30' },
    { label: 'WORKSPACE', href: '#workspace', id: 'workspace' },
    { label: 'KAPCSOLAT', href: '#kapcsolat', id: 'kapcsolat' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#0c0d0f]/90 backdrop-blur-md border-b border-[#22252a] py-3'
          : 'bg-transparent py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#f1f2f4] hover:text-white transition-colors uppercase whitespace-nowrap"
        >
          Huszár Attila
        </a>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest text-[#9ca3af]">
          {navItems.map((item) => {
            const isActive = activeSection === item.id || (item.id === 'workspace' && activeSection === 'figyelo');
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`transition-colors relative py-1 hover:text-[#f1f2f4] ${
                  isActive ? 'text-white' : ''
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#9ca3af]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Actions + Stunt Mode Easter Egg toggle */}
        <div className="hidden md:flex items-center gap-3">
          {onToggleStuntMode && (
            <button
              type="button"
              onClick={onToggleStuntMode}
              className={`text-[11px] font-mono tracking-wider uppercase px-2.5 py-1.5 border transition-all cursor-pointer flex items-center gap-1.5 ${
                stuntMode
                  ? 'border-[#10b981] text-[#10b981] bg-[#10b981]/10'
                  : 'border-[#2d323b] text-[#6b7280] hover:text-[#9ca3af] hover:border-[#3e4450]'
              }`}
              title="Stunt Mode Easter Egg"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${stuntMode ? 'bg-[#10b981] animate-pulse' : 'bg-[#4b5563]'}`} />
              <span>STUNT MODE</span>
            </button>
          )}

          <a
            href="#kapcsolat"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('#kapcsolat');
            }}
            className="text-xs font-semibold tracking-wider uppercase px-4 py-2 border border-[#33373e] text-[#d1d5db] hover:text-white hover:border-[#6b7280] hover:bg-[#181a1e] transition-all whitespace-nowrap"
          >
            Kapcsolatfelvétel
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#9ca3af] hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#9ca3af]"
            aria-label={mobileMenuOpen ? 'Menü bezárása' : 'Menü megnyitása'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0e1013] border-b border-[#22252a] px-5 py-6 space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col space-y-3 text-xs tracking-widest font-medium">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.href);
                }}
                className={`py-2 border-b border-[#1b1d22] transition-colors ${
                  activeSection === item.id || (item.id === 'workspace' && activeSection === 'figyelo')
                    ? 'text-white font-bold pl-1 border-l-2 border-l-white'
                    : 'text-[#9ca3af]'
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#kapcsolat"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#kapcsolat');
              }}
              className="mt-2 text-center py-2.5 px-4 text-xs font-semibold tracking-wider uppercase border border-[#373b42] text-white bg-[#16181c]"
            >
              Kapcsolatfelvétel
            </a>

            {onToggleStuntMode && (
              <button
                type="button"
                onClick={() => {
                  onToggleStuntMode();
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-2.5 px-4 text-xs font-mono tracking-wider uppercase border transition-colors flex items-center justify-center gap-2 ${
                  stuntMode
                    ? 'border-[#10b981] text-[#10b981] bg-[#10b981]/10'
                    : 'border-[#22262e] text-[#6b7280]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${stuntMode ? 'bg-[#10b981]' : 'bg-[#4b5563]'}`} />
                <span>STUNT MODE: {stuntMode ? 'BEKAPCSOLVA' : 'KIKAPCSOLVA'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
