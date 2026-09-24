/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Stuntman } from './components/Stuntman';
import { Films } from './components/Films';
import { BmwE30 } from './components/BmwE30';
import { Handmade } from './components/Handmade';
import { StuntJobMonitor } from './components/StuntJobMonitor';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { CustomCursor } from './components/CustomCursor';
import { StuntModeOverlay } from './components/StuntModeOverlay';

export default function App() {
  const [activeSection, setActiveSection] = useState('rolam');
  const [stuntMode, setStuntMode] = useState(false);

  useEffect(() => {
    const sectionIds = ['rolam', 'kaszkador', 'filmek', 'e30', 'workspace', 'figyelo', 'kapcsolat'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen bg-[#0c0d0f] text-[#d1d5db] selection:bg-[#2b2f38] selection:text-white flex flex-col justify-between w-full overflow-x-hidden ${stuntMode ? 'stunt-mode' : ''}`}>
      {/* Desktop Custom Precision Cursor */}
      <CustomCursor />

      {/* Stunt Mode Telemetry HUD Overlay */}
      <StuntModeOverlay
        isActive={stuntMode}
        onToggle={() => setStuntMode(!stuntMode)}
      />

      {/* Top Bar Navigation */}
      <Navbar
        activeSection={activeSection}
        stuntMode={stuntMode}
        onToggleStuntMode={() => setStuntMode(!stuntMode)}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full">
        {/* 1. Hero / Nyitóképernyő */}
        <Hero />

        {/* 2. Bemutatkozás */}
        <About />

        {/* 3. Kaszkadőr - JELENLEG -> KÖVETKEZŐ LÉPÉS -> PROJEKT */}
        <Stuntman />

        {/* 4. Filmek - Napszállta & Hadik */}
        <Films />

        {/* 5. BMW E30 - Interaktív Műhelyrajz & Hotspotok */}
        <BmwE30 />

        {/* 6. Saját kézzel - Konditerem & Műhely */}
        <Handmade />

        {/* 7. Kaszkadőr Munka Figyelő - Valós idejű nyilvános forrásfigyelő */}
        <StuntJobMonitor />

        {/* 8. Kapcsolat */}
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
