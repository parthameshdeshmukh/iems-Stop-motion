import React, { useRef, useState, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Eye, Layers, Compass, Radio, Sparkles } from 'lucide-react';
import DeconstructionCanvas from '../canvas/DeconstructionCanvas';
import { audioEngine } from '../../utils/audio';
import { useInView } from '../../hooks/useInView';

gsap.registerPlugin(ScrollTrigger);

// Static technical specifications database (instantiated once outside component)
const componentsList = [
  {
    id: 'faceplate',
    name: 'CNC Titanium Faceplate',
    category: 'Enclosure',
    maxDisplacement: '36.2 mm',
    spec: 'Grade 5 Aerospace Titanium',
    detail: 'Milled to 0.02mm precision with acoustic chamfer ring, bass relief vent, and laser-etched insignia to eliminate external resonant feedback.',
    range: [0.12, 1.0],
    coord: 'POS [X: +0.3, Y: +0.6, Z: +3.6]',
  },
  {
    id: 'shell',
    name: 'Smoky Acoustic Resin Shell',
    category: 'Cavity',
    maxDisplacement: '28.5 mm',
    spec: 'DLP Medical Grade Resin',
    detail: 'Anatomically sculpted ear cavity offering 26dB passive isolation and custom-modeled internal acoustic routing channels.',
    range: [0.2, 1.0],
    coord: 'POS [X: -2.2, Y: -0.3, Z: -2.5]',
  },
  {
    id: 'dynamic_driver',
    name: '10mm Beryllium Sub-Woofer',
    category: 'Low Frequency',
    maxDisplacement: '42.0 mm',
    spec: 'Pure Beryllium Vapor Dome // N52 Neodymium',
    detail: 'Delivers sub-bass down to 5Hz with ultra-low inertia and distortion below 0.05% at 94dB SPL.',
    range: [0.35, 1.0],
    coord: 'POS [X: -2.8, Y: -2.4, Z: +0.8]',
  },
  {
    id: 'mid_ba',
    name: 'Dual Mid Balanced Armatures',
    category: 'Mid Frequencies',
    maxDisplacement: '38.4 mm',
    spec: 'Custom Vented Knowles Array',
    detail: 'Dedicated acoustic chamber producing lush vocal texture, lightning-fast transient snap, and surgical instrument separation.',
    range: [0.38, 1.0],
    coord: 'POS [X: +2.4, Y: +2.2, Z: +1.2]',
  },
  {
    id: 'high_ba',
    name: 'Dual Ultra-High Tweeter Array',
    category: 'Treble / Air',
    maxDisplacement: '45.1 mm',
    spec: 'Sonion Micro Armature // 10kHz - 45kHz',
    detail: 'Extends microscopic overtone nuances without harshness or sibilance, unlocking breathtaking soundstage openness.',
    range: [0.42, 1.0],
    coord: 'POS [X: +2.8, Y: +1.4, Z: +2.2]',
  },
  {
    id: 'crossover',
    name: '4-Way Passive Crossover PCB',
    category: 'Electronics',
    maxDisplacement: '32.8 mm',
    spec: 'Linear-Phase Audiophile Film Caps',
    detail: 'Custom printed circuit architecture ensuring seamless phase alignment and zero time-domain smearing between drivers.',
    range: [0.45, 1.0],
    coord: 'POS [X: +1.4, Y: -2.6, Z: -0.8]',
  },
  {
    id: 'helmholtz',
    name: 'Helmholtz Resonance Damper',
    category: 'Acoustics',
    maxDisplacement: '25.0 mm',
    spec: 'Helical CNC Aluminum Core',
    detail: 'Physically suppresses ear-canal resonance peaks at 4kHz - 6kHz, eliminating listener fatigue during extended mastering sessions.',
    range: [0.5, 1.0],
    coord: 'POS [X: -1.6, Y: -1.8, Z: -2.0]',
  },
  {
    id: 'nozzle',
    name: '42° Stepped Titanium Sound Bore',
    category: 'Output Port',
    maxDisplacement: '48.2 mm',
    spec: 'Machined Nozzle with Retention Lip',
    detail: 'Solid titanium stem fitted with a laser micro-perforated acoustic mesh ensuring pure, uninterrupted wavefront projection.',
    range: [0.55, 1.0],
    coord: 'POS [X: +2.2, Y: -1.6, Z: -3.5]',
  },
  {
    id: 'eartip',
    name: 'Umbrella Silicone Eartip',
    category: 'Seal & Comfort',
    maxDisplacement: '52.0 mm',
    spec: 'Medical-Grade Dual-Density Silicone',
    detail: 'Ergonomic flared mushroom flange that conforms gently to ear canal contours, maintaining acoustic seal and sub-bass pressurization.',
    range: [0.60, 1.0],
    coord: 'POS [X: +3.2, Y: -2.4, Z: -5.2]',
  },
  {
    id: 'connector',
    name: '0.78mm 2-Pin Cable & Plug',
    category: 'Signal Interface',
    maxDisplacement: '30.0 mm',
    spec: 'Gold-Plated Pins // 8-Core SPC Litz',
    detail: 'Low-impedance detachable audiophile cable with over-ear memory wire hook ensuring zero microphonics and rock-solid stage stability.',
    range: [0.25, 1.0],
    coord: 'POS [X: -1.8, Y: +2.2, Z: -1.5]',
  },
];

const phases = [
  {
    title: 'Phase 01 // Assembled State',
    desc: 'Complete acoustic capsule in resting equilibrium.',
    phaseNumber: '01/04',
  },
  {
    title: 'Phase 02 // Enclosure Uncoupling',
    desc: 'Titanium faceplate unlocks from the internal resonance chamber.',
    phaseNumber: '02/04',
  },
  {
    title: 'Phase 03 // Driver Core & Circuit Ejection',
    desc: 'Beryllium dynamic driver, BA packs, and crossover decoupling from housing.',
    phaseNumber: '03/04',
  },
  {
    title: 'Phase 04 // Full Acoustic Deconstruction',
    desc: 'All 11 micro-engineered components separated along calculated 3D vectors.',
    phaseNumber: '04/04',
  },
];

export default function DeconstructionSection() {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const progressRef = useRef(0);
  const currentPhaseRef = useRef(0);
  const labelsVisibleRef = useRef(false);

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [activeComponent, setActiveComponent] = useState(null);
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);

  // Direct DOM references for 60-120fps telemetry updates without React reconciliation
  const percentBadgeRef = useRef(null);
  const progressBarRef = useRef(null);
  const displacementRef = useRef(null);

  // Viewport tracking: pause canvas rendering when off-screen
  const [inViewRef, isInView] = useInView({ threshold: 0.01, rootMargin: '200px 0px' });

  useEffect(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: '+=350%',
        pin: true,
        scrub: 0.35,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          progressRef.current = p;

          // Zero-re-render direct DOM telemetry updates
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${(p * 100).toFixed(1)}%`;
          }
          if (percentBadgeRef.current) {
            percentBadgeRef.current.textContent = `${Math.round(p * 100)}%`;
          }
          if (displacementRef.current) {
            displacementRef.current.textContent = `DISPLACEMENT: ${(p * 48.2).toFixed(2)} mm / 48.20 mm`;
          }

          // Labels toggle state
          const showLabels = p > 0.12;
          if (showLabels !== labelsVisibleRef.current) {
            labelsVisibleRef.current = showLabels;
            setLabelsVisible(showLabels);
          }

          // Discrete phase update
          const nextPhase = p >= 0.75 ? 3 : p >= 0.45 ? 2 : p >= 0.15 ? 1 : 0;
          if (nextPhase !== currentPhaseRef.current) {
            currentPhaseRef.current = nextPhase;
            setPhaseIndex(nextPhase);
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeComponentRef = useRef(null);

  const handleHoverComponent = useCallback((id) => {
    if (id === activeComponentRef.current) return;
    activeComponentRef.current = id;
    setActiveComponent(id);
    if (id) audioEngine.playComponentSound(id);
  }, []);

  // Quick jump to a specific deconstruction phase
  const handleJumpToPhase = (phaseNumber) => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;
    const progressMap = [0.0, 0.28, 0.58, 0.95];
    const targetProgress = progressMap[phaseNumber] ?? 0;
    const rect = triggerEl.getBoundingClientRect();
    const currentScroll = window.scrollY;
    const triggerTop = currentScroll + rect.top;
    const totalDistance = triggerEl.offsetHeight * 3.5;
    const targetScroll = triggerTop + targetProgress * totalDistance;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    audioEngine.playHapticBlip(1200, 0.04, 0.06);
  };

  const currentPhase = phases[phaseIndex];

  return (
    <section
      id="deconstruction"
      ref={(el) => {
        containerRef.current = el;
        inViewRef.current = el;
      }}
      className="relative w-full bg-[#080808] text-white"
    >
      <div
        ref={triggerRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between"
      >
        {/* Full-screen 3D Exploded View Canvas */}
        <DeconstructionCanvas
          progressRef={progressRef}
          activeComponent={activeComponent}
          onHoverComponent={handleHoverComponent}
          isInView={isInView}
          isWireframe={isWireframe}
        />

        {/* Top HUD Overlay (Editorial luxury title & phase info) */}
        <div className="relative z-10 pt-24 px-6 md:px-12 flex flex-col md:flex-row md:items-start justify-between pointer-events-none gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-electric-blue animate-pulse" />
              <span className="font-mono-tech text-xs tracking-[0.3em] uppercase text-electric-blue">
                // CINEMATIC DECONSTRUCTION SEQUENCE
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-gradient-silver">
              THE EXPLODED ARCHITECTURE
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 max-w-md mt-1 tracking-wide">
              Scroll down to dismantle the capsule into its fundamental acoustic components. Scroll up to reassemble with micron-precision.
            </p>
          </div>

          {/* Right Action HUD: Phase Tracker & X-Ray Toggle */}
          <div className="flex flex-col items-end gap-2.5 pointer-events-auto">
            {/* Phase tracker card */}
            <div className="glass-panel px-5 py-3 rounded-xl border border-white/10 flex items-center gap-4">
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-[11px] font-mono-tech text-neutral-400 gap-6">
                  <span>STAGE DISPLACEMENT</span>
                  <span className="text-electric-blue font-bold">{currentPhase.phaseNumber}</span>
                </div>
                <span className="font-semibold text-sm text-white">{currentPhase.title}</span>
                <span className="text-[11px] text-neutral-400 max-w-[240px] truncate">
                  {currentPhase.desc}
                </span>
              </div>
              <div
                ref={percentBadgeRef}
                className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/10 flex items-center justify-center font-mono-tech text-xs font-bold text-electric-blue"
              >
                0%
              </div>
            </div>

            {/* Quick-Jump Phase Pills & X-Ray Toggle Bar */}
            <div className="flex items-center gap-2">
              <div className="glass-panel px-2 py-1 rounded-lg border border-white/10 flex items-center gap-1 text-[10px] font-mono-tech">
                <span className="text-neutral-500 uppercase px-1 hidden sm:inline">JUMP:</span>
                {phases.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleJumpToPhase(idx)}
                    className={`px-2 py-1 rounded font-mono-tech transition-all ${
                      phaseIndex === idx
                        ? 'bg-electric-blue text-black font-bold'
                        : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    PH 0{idx + 1}
                  </button>
                ))}
              </div>

              {/* X-Ray / Wireframe Mode Toggle */}
              <button
                onClick={() => {
                  setIsWireframe(!isWireframe);
                  audioEngine.playHapticBlip(isWireframe ? 700 : 1300, 0.03, 0.05);
                }}
                className={`px-3 py-1.5 rounded-lg border font-mono-tech text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                  isWireframe
                    ? 'border-electric-blue bg-electric-blue/20 text-electric-blue shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                    : 'border-white/10 bg-white/[0.04] text-neutral-300 hover:text-white hover:border-white/25'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isWireframe ? 'X-Ray ON' : 'X-Ray'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Floating Technical Labels */}
        <div
          className={`relative z-10 px-6 md:px-12 pointer-events-none transition-opacity duration-500 ${
            labelsVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Component Quick Selector / Spec HUD Bar */}
          <div className="max-w-7xl mx-auto flex flex-wrap gap-2 pointer-events-auto mb-3">
            {componentsList.map((comp) => {
              const isSelected = activeComponent === comp.id;
              return (
                <button
                  key={comp.id}
                  onMouseEnter={() => handleHoverComponent(comp.id)}
                  onMouseLeave={() => handleHoverComponent(null)}
                  onClick={() => {
                    handleHoverComponent(activeComponent === comp.id ? null : comp.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-left transition-colors duration-150 font-mono-tech text-[10px] sm:text-xs flex items-center gap-2 cursor-pointer select-none ${
                    isSelected
                      ? 'bg-electric-blue/25 border-electric-blue text-white shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                      : 'bg-[#0e0e12]/80 backdrop-blur-md border-white/10 text-neutral-400 hover:text-white hover:border-white/30'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isSelected ? 'bg-electric-blue' : 'bg-neutral-600'}`} />
                  <span>{comp.name}</span>
                  <span className="text-neutral-500 font-mono-tech text-[9px] hidden sm:inline">
                    {comp.maxDisplacement}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Detailed Component Callout Inspector Box (Zero Layout Shift) */}
          <div className="max-w-md w-full min-h-[110px] pointer-events-none">
            {activeComponent ? (
              (() => {
                const item = componentsList.find((c) => c.id === activeComponent);
                if (!item) return null;
                return (
                  <div className="pointer-events-auto glass-panel p-3.5 rounded-xl border border-electric-blue/40 shadow-[0_0_25px_rgba(0,240,255,0.2)] animate-fadeIn backdrop-blur-xl">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono-tech text-[10px] text-electric-blue uppercase tracking-widest font-bold">
                          {item.category} // {item.coord}
                        </span>
                        <span className="font-mono-tech text-[10px] text-neutral-400">
                          MAX: {item.maxDisplacement}
                        </span>
                      </div>
                      <h3 className="font-display font-bold text-sm text-white">{item.name}</h3>
                      <p className="text-[11px] text-neutral-300 leading-relaxed font-light">{item.detail}</p>
                      <div className="mt-1.5 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono-tech text-neutral-400">
                        <span>SPECIFICATION</span>
                        <span className="text-white font-medium">{item.spec}</span>
                      </div>
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Stable quiet placeholder to completely prevent layout reflow */
              <div className="h-[110px] pointer-events-none" />
            )}
          </div>
        </div>

        {/* Bottom Scroll Scrubber & Bi-Directional Indicator */}
        <div className="relative z-10 pb-6 px-6 md:px-12 pointer-events-none flex flex-col gap-2">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between text-[11px] font-mono-tech text-neutral-500">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-electric-blue" />
              SCROLL TRIGGER: ACTIVE (BIDIRECTIONAL SCRUB)
            </span>
            <span ref={displacementRef} className="text-neutral-400">
              DISPLACEMENT: 0.00 mm / 48.20 mm
            </span>
          </div>

          {/* Master Progress Bar */}
          <div className="max-w-7xl mx-auto w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-white/10 pointer-events-auto">
            <div
              ref={progressBarRef}
              className="h-full bg-gradient-to-r from-neutral-600 via-white to-electric-blue"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
