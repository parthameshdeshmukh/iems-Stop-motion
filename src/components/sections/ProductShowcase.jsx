import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  RotateCcw,
  Volume2,
  Check,
  Package,
  Award,
  Boxes,
  SlidersHorizontal,
  Activity,
  Radio,
  Zap,
  Play,
  Waves
} from 'lucide-react';
import InteractiveViewer from '../canvas/InteractiveViewer';
import { audioEngine } from '../../utils/audio';
import { useInView } from '../../hooks/useInView';

// Lightweight GPU-accelerated SVG Harmonic Oscilloscope
function HarmonicOscilloscope({ activeProbe, isProbing }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      const speed = isProbing ? 8.0 : 3.5;
      setPhase((p) => (p + delta * speed) % (Math.PI * 2));
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [isProbing]);

  const width = 160;
  const height = 36;
  const segments = 32;
  const points = [];

  for (let i = 0; i <= segments; i++) {
    const x = (i / segments) * width;
    const normX = i / segments;
    let y = height / 2;
    const amp = isProbing ? 14 : 7;

    if (activeProbe.waveType === 'sine_deep') {
      y += Math.sin(normX * Math.PI * 3 + phase) * amp;
    } else if (activeProbe.waveType === 'harmonic_rich') {
      y += (Math.sin(normX * Math.PI * 6 + phase * 1.5) * 0.7 +
            Math.sin(normX * Math.PI * 12 + phase * 3) * 0.3) * amp;
    } else if (activeProbe.waveType === 'high_freq') {
      y += Math.sin(normX * Math.PI * 18 + phase * 2.2) * (amp * 0.85);
    } else {
      // Phase sweep wave
      y += Math.sin(normX * normX * Math.PI * 14 + phase * 2) * amp;
    }

    points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  const d = `M ${points.join(' L ')}`;

  return (
    <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-black/70 border border-white/10 backdrop-blur-md">
      <div className="flex flex-col">
        <span className="font-mono-tech text-[8px] text-neutral-400 uppercase tracking-widest flex items-center gap-1">
          <Activity className="w-2.5 h-2.5" style={{ color: activeProbe.color }} />
          <span>HARMONIC WAVE</span>
        </span>
        <span className="font-mono-tech text-[10px] font-bold text-white leading-tight">
          {activeProbe.freq}
        </span>
      </div>
      <svg width={width} height={height} className="w-24 sm:w-36 h-7 overflow-visible">
        <path
          d={d}
          fill="none"
          stroke={activeProbe.color}
          strokeWidth="2"
          strokeLinecap="round"
          className="transition-colors duration-300 drop-shadow-[0_0_6px_currentColor]"
        />
      </svg>
    </div>
  );
}

export default function ProductShowcase({ onOpenOrderModal }) {
  // View mode: 'stethoscope' (Acoustic Stethoscope), 'xray' (split reveal), or '3d' (360° CAD)
  const [viewMode, setViewMode] = useState('stethoscope');
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100 for X-Ray split reveal
  const [isDragging, setIsDragging] = useState(false);
  const [selectedColor, setSelectedColor] = useState('silver');
  const [activeProbeId, setActiveProbeId] = useState('sub_bass');
  const [isProbing, setIsProbing] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [inViewRef, isInView] = useInView({ threshold: 0.01, rootMargin: '150px 0px' });

  const containerRef = useRef(null);

  // Audiophile Acoustic Stethoscope Transducer Targets
  const stethoscopeTargets = [
    {
      id: 'sub_bass',
      name: '10mm Beryllium Dynamic Sub-Woofer',
      shortName: '10mm Beryllium Sub-Woofer',
      badge: 'SUB-BASS MOTOR',
      freq: '45 Hz',
      range: '5 Hz – 250 Hz',
      color: '#EA580C',
      pin: { x: 33, y: 55 },
      thd: '< 0.04% THD',
      spec: '0.85mm Excursion • N52 Neodymium Flux',
      summary: 'Pure vapor-deposited beryllium diaphragm. Yields subterranean bass extension down to 5 Hz with explosive dynamic slam and zero cone breakup.',
      waveType: 'sine_deep',
    },
    {
      id: 'midrange',
      name: 'Quad Knowles Balanced Armature Array',
      shortName: 'Quad BA Midrange',
      badge: 'VOCAL PRESENCE CLUSTER',
      freq: '1,000 Hz',
      range: '250 Hz – 4,000 Hz',
      color: '#F59E0B',
      pin: { x: 53, y: 39 },
      thd: '< 0.02% THD',
      spec: '0.02ms Transient Rise • Acoustic Felt Dampers',
      summary: 'Custom-vented dual-chamber balanced armatures. Produces holographic vocal intimacy, realistic chest resonance, and textured instrumental timbre.',
      waveType: 'harmonic_rich',
    },
    {
      id: 'treble',
      name: 'Dual Sonion Electrostatic Super-Tweeters',
      shortName: 'Dual Sonion EST',
      badge: 'ELECTROSTATIC AIR EMITTER',
      freq: '12,000 Hz',
      range: '4,000 Hz – 45,000 Hz',
      color: '#00F0FF',
      pin: { x: 71, y: 30 },
      thd: '< 0.01% THD',
      spec: '1:100 Micro-Transformers • 45kHz Extension',
      summary: 'Ultralight gold-plated electrostatic membrane charged by miniature step-up transformers. Delivers effortless micro-detail resolution and immense air.',
      waveType: 'high_freq',
    },
    {
      id: 'crossover',
      name: '4-Way Linear-Phase Crossover Network',
      shortName: '4-Way Crossover',
      badge: 'ACOUSTIC PHASE DIRECTOR',
      freq: 'Linear Phase Sweep',
      range: '5 Hz – 45,000 Hz (Full Spectrum)',
      color: '#A855F7',
      pin: { x: 48, y: 72 },
      thd: '< 0.015% Phase Smear',
      spec: '24dB/Oct Linkwitz-Riley • Audiophile Film Caps',
      summary: 'Precision-tuned SMD audio PCB. Synchronizes acoustic delay across all 7 drivers with zero comb filtering or notch distortion.',
      waveType: 'phase_sweep',
    },
  ];

  const activeProbe = stethoscopeTargets.find((t) => t.id === activeProbeId) || stethoscopeTargets[0];

  const colors = [
    {
      id: 'silver',
      name: 'Titanium Raw',
      subtitle: 'Natural Brushed Grade 5 Titanium',
      hex: '#cbd5e1',
    },
    {
      id: 'obsidian',
      name: 'Obsidian Matte',
      subtitle: 'DLC Diamond-Like Carbon Coating',
      hex: '#18181b',
    },
    {
      id: 'cobalt',
      name: 'Cobalt Chrome',
      subtitle: 'Deep PVD Midnight Navy Electroplate',
      hex: '#0284c7',
    },
  ];

  const handleTriggerProbe = (targetId) => {
    setActiveProbeId(targetId);
    setIsProbing(true);
    audioEngine.playStethoscopeProbe(targetId);
    audioEngine.playHapticBlip(950, 0.03, 0.05);
    setTimeout(() => {
      setIsProbing(false);
    }, 1200);
  };

  // Drag interaction for the interactive split reveal slider
  const handleSliderMove = useCallback((clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPos(percent);
  }, []);

  const handlePointerDown = (e) => {
    setIsDragging(true);
    handleSliderMove(e.clientX);
    audioEngine.playHapticBlip(950, 0.02, 0.04);
  };

  const handlePointerMove = (e) => {
    if (isDragging) {
      handleSliderMove(e.clientX);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleAuditionClick = () => {
    setIsPlayingDemo(true);
    audioEngine.playFrequencySweep(3.2);
    setTimeout(() => setIsPlayingDemo(false), 3300);
  };

  return (
    <section
      ref={inViewRef}
      id="product-showcase"
      className="relative w-full py-32 bg-[#080808] text-white overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[700px] bg-[#C2410C]/[0.03] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg-pattern opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle mb-4">
            <Award className="w-3.5 h-3.5 text-[#C2410C]" />
            <span className="font-mono-tech text-[10px] tracking-[0.3em] uppercase text-neutral-400">
              CREATIVE ACOUSTIC LAB // SHOWCASE
            </span>
          </div>
          <h2 className="font-display font-extrabold text-4xl sm:text-6xl text-gradient-silver tracking-tight">
            AETHERIS X-1 MONARCH
          </h2>
          <p className="text-neutral-400 max-w-lg mt-3 text-sm md:text-base font-light">
            Audit transducer frequency bands with the Acoustic Stethoscope or peel back the titanium shell in real-time.
          </p>
        </div>

        {/* Editorial Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Left Column: Creative Interactive Inspection Showcase */}
          <div className="lg:col-span-7 relative min-h-[580px] sm:min-h-[640px] rounded-3xl glass-panel border border-white/10 overflow-hidden flex flex-col justify-between p-6 shadow-2xl">
            {/* Top View Mode Switcher Header */}
            <div className="flex items-center justify-between z-20 flex-wrap gap-2 pb-2">
              <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/60 border border-white/10 backdrop-blur-md">
                <button
                  onClick={() => {
                    setViewMode('stethoscope');
                    audioEngine.playHapticBlip(950, 0.03, 0.04);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono-tech transition-all cursor-pointer ${
                    viewMode === 'stethoscope'
                      ? 'bg-[#C2410C] text-white font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Acoustic Stethoscope</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('xray');
                    audioEngine.playHapticBlip(1050, 0.03, 0.04);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono-tech transition-all cursor-pointer ${
                    viewMode === 'xray'
                      ? 'bg-[#C2410C] text-white font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>X-Ray Anatomy</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('3d');
                    audioEngine.playHapticBlip(1150, 0.03, 0.04);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono-tech transition-all cursor-pointer ${
                    viewMode === '3d'
                      ? 'bg-white text-black font-bold shadow-md'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Boxes className="w-3.5 h-3.5" />
                  <span>360° 3D Orbit</span>
                </button>
              </div>

              {/* Status indicator badge */}
              <div className="flex items-center gap-2 font-mono-tech text-[10px] text-neutral-400">
                <span className="w-2 h-2 rounded-full bg-[#C2410C] animate-pulse" />
                <span className="hidden sm:inline">
                  {viewMode === 'stethoscope'
                    ? 'ACOUSTIC SOUNDSTAGE STETHOSCOPE'
                    : viewMode === 'xray'
                    ? 'INTERACTIVE ARCHITECTURE SLIDER'
                    : 'INTERACTIVE 3D CAD'}
                </span>
              </div>
            </div>

            {/* Central Viewport */}
            <div className="relative flex-1 w-full my-4 flex items-center justify-center overflow-hidden rounded-2xl bg-black/40 border border-white/5 min-h-[380px]">
              {viewMode === 'stethoscope' ? (
                /* ========================================================
                   ACOUSTIC SOUNDSTAGE STETHOSCOPE VIEWPORT
                   ======================================================== */
                <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-fadeIn group">
                  {/* Top HUD: Real-time Oscilloscope & Active Transducer Badge */}
                  <div className="w-full flex items-center justify-between z-20 gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeProbe.color }} />
                      <span className="font-mono-tech text-[10px] text-neutral-300 uppercase tracking-wider font-semibold">
                        PROBE: {activeProbe.badge}
                      </span>
                    </div>

                    <HarmonicOscilloscope activeProbe={activeProbe} isProbing={isProbing} />
                  </div>

                  {/* Central Exploded Architecture Image with Interactive Transducer Pins */}
                  <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
                    <img
                      src="/images/exploded_iem.jpg"
                      alt="Aetheris X-1 7-Driver Tri-Brid Architecture"
                      className="max-h-[290px] sm:max-h-[330px] w-auto max-w-[92%] object-contain rounded-xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] transition-all duration-300"
                    />

                    {/* Interactive Transducer Probe Pins */}
                    {stethoscopeTargets.map((target) => {
                      const isActive = activeProbeId === target.id;
                      return (
                        <div
                          key={target.id}
                          style={{
                            left: `${target.pin.x}%`,
                            top: `${target.pin.y}%`,
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-30"
                        >
                          {/* Pulsing Sonar Ring when Active */}
                          {isActive && (
                            <>
                              <div
                                className="absolute -inset-2.5 rounded-full animate-ping opacity-75 pointer-events-none"
                                style={{ backgroundColor: target.color }}
                              />
                              <div
                                className="absolute -inset-5 rounded-full border border-dashed opacity-50 animate-spin pointer-events-none"
                                style={{ borderColor: target.color, animationDuration: '6s' }}
                              />
                            </>
                          )}

                          {/* Pin Button */}
                          <button
                            onClick={() => handleTriggerProbe(target.id)}
                            className="relative z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-125 shadow-lg cursor-pointer"
                            style={{
                              borderColor: target.color,
                              backgroundColor: isActive ? target.color : '#0a0a0a',
                              boxShadow: `0 0 16px ${target.color}80`,
                            }}
                            title={`Probe ${target.shortName} (${target.freq})`}
                          >
                            <Radio
                              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                              style={{ color: isActive ? '#000000' : target.color }}
                            />
                          </button>

                          {/* Pin Floating Label */}
                          <div
                            onClick={() => handleTriggerProbe(target.id)}
                            className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md text-[9px] font-mono-tech whitespace-nowrap cursor-pointer transition-all ${
                              isActive
                                ? 'bg-black/90 text-white border border-white/20 shadow-md font-bold'
                                : 'bg-black/60 text-neutral-400 hover:text-white border border-white/10 hidden sm:block'
                            }`}
                          >
                            {target.shortName}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Telemetry Detail & Audit Action Card */}
                  <div className="w-full pt-3 border-t border-white/10 text-left glass-panel-subtle px-4 py-3 rounded-xl mt-2">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="font-mono-tech text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: `${activeProbe.color}20`,
                              color: activeProbe.color,
                              border: `1px solid ${activeProbe.color}40`,
                            }}
                          >
                            {activeProbe.freq} • {activeProbe.range}
                          </span>
                          <span className="font-mono-tech text-[10px] text-neutral-400">
                            {activeProbe.thd}
                          </span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-white">
                          {activeProbe.name}
                        </h4>
                        <p className="text-[11px] text-neutral-400 mt-1 max-w-xl font-light leading-relaxed">
                          {activeProbe.summary}
                        </p>
                      </div>

                      <button
                        onClick={() => handleTriggerProbe(activeProbe.id)}
                        className="self-stretch sm:self-center px-4 py-2.5 rounded-xl text-xs font-mono-tech font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:scale-105 shrink-0"
                        style={{
                          backgroundColor: activeProbe.color,
                          color: '#ffffff',
                          boxShadow: `0 0 15px ${activeProbe.color}60`,
                        }}
                      >
                        <Volume2 className={`w-3.5 h-3.5 ${isProbing ? 'animate-bounce' : ''}`} />
                        <span>{isProbing ? 'Auditing Tone...' : 'Audit Driver'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : viewMode === 'xray' ? (
                /* ========================================================
                   CREATIVE INTERACTIVE X-RAY ARCHITECTURE REVEAL SLIDER
                   ======================================================== */
                <div
                  ref={containerRef}
                  onPointerDown={handlePointerDown}
                  className="relative w-full h-full cursor-ew-resize select-none overflow-hidden flex items-center justify-center p-6 min-h-[360px]"
                >
                  {/* Subtle Acoustic Radial Soundstage Aura in Background */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                    <div className="w-[450px] h-[450px] rounded-full border border-white/10" />
                    <div className="w-[320px] h-[320px] rounded-full border border-dashed border-white/10 absolute" />
                    <div className="w-[180px] h-[180px] rounded-full border border-white/5 absolute" />
                  </div>

                  {/* Layer 1 (Full): Exploded Internal Architecture (Underneath) */}
                  <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none">
                    <img
                      src="/images/exploded_iem.jpg"
                      alt="7-Driver Internal Tri-Brid Architecture"
                      className="max-h-[85%] max-w-[90%] object-contain rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 font-mono-tech text-[10px] text-[#00F0FF] uppercase tracking-wider hidden sm:flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-ping" />
                      <span>Internal 7-Driver Array</span>
                    </div>
                  </div>

                  {/* Layer 2 (Clipped): Exterior Assembled IEM Shell */}
                  <div
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                    className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none"
                  >
                    <img
                      src="/images/hero_iem.jpg"
                      alt="Monarch X-1 Assembled Shell"
                      className="max-h-[85%] max-w-[90%] object-contain rounded-2xl drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-black/80 border border-white/10 font-mono-tech text-[10px] text-[#C2410C] uppercase tracking-wider hidden sm:flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]" />
                      <span>CNC Titanium Exterior</span>
                    </div>
                  </div>

                  {/* Interactive Slider Divider Line & Thumb */}
                  <div
                    style={{ left: `${sliderPos}%` }}
                    className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#C2410C] to-transparent z-30 pointer-events-none"
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#111111] border-2 border-[#C2410C] shadow-[0_0_20px_rgba(194,65,12,0.8)] flex items-center justify-center text-white cursor-ew-resize">
                      <SlidersHorizontal className="w-4 h-4 text-[#C2410C]" />
                    </div>
                  </div>

                  {/* Floating Action Pill instruction at bottom of viewport */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-black/80 border border-white/10 backdrop-blur-md text-[10px] font-mono-tech uppercase tracking-widest text-neutral-400 pointer-events-none shadow-lg whitespace-nowrap">
                    ← Drag or slide to peel back shell →
                  </div>
                </div>
              ) : (
                /* ========================================================
                   360° INTERACTIVE 3D ORBIT VIEWPORT
                   ======================================================== */
                <InteractiveViewer colorway={selectedColor} isInView={isInView} />
              )}
            </div>

            {/* Bottom Bar: Contextual Controls based on active mode */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10 glass-panel-subtle px-4 py-2.5 rounded-2xl">
              {viewMode === 'stethoscope' ? (
                /* Stethoscope Frequency Band Quick-Audit Buttons */
                <div className="flex items-center justify-between w-full flex-wrap gap-2">
                  <div className="flex items-center gap-2 overflow-x-auto py-1">
                    {stethoscopeTargets.map((target) => {
                      const isCurrent = activeProbeId === target.id;
                      return (
                        <button
                          key={target.id}
                          onClick={() => handleTriggerProbe(target.id)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono-tech transition-all whitespace-nowrap cursor-pointer ${
                            isCurrent
                              ? 'border-white/30 text-white font-bold shadow-md'
                              : 'border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white hover:border-white/25'
                          }`}
                          style={{
                            backgroundColor: isCurrent ? `${target.color}25` : undefined,
                            borderColor: isCurrent ? target.color : undefined,
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: target.color }}
                          />
                          <span>{target.shortName}</span>
                          <span className="text-[10px] opacity-75 font-mono">({target.freq})</span>
                        </button>
                      );
                    })}
                  </div>

                  <span className="font-mono-tech text-[10px] text-neutral-500 hidden md:inline">
                    Interactive Frequency Audition
                  </span>
                </div>
              ) : viewMode === 'xray' ? (
                /* X-Ray Slider Status */
                <div className="flex items-center justify-between w-full flex-wrap gap-2 font-mono-tech text-xs">
                  <span className="text-neutral-400 text-[11px]">
                    Revealed: <span className="text-white font-bold">{sliderPos}%</span> Internal Transducer Architecture
                  </span>
                  <span className="text-neutral-500 text-[10px] hidden sm:inline">
                    7 Drivers • 4-Way Crossover Network
                  </span>
                </div>
              ) : (
                /* 3D Colorway Finishes Switcher */
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-tech text-xs text-neutral-400 uppercase tracking-wider">
                      Available Finishes:
                    </span>
                    <div className="flex items-center gap-2">
                      {colors.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedColor(c.id);
                            audioEngine.playHapticBlip(1200, 0.03, 0.05);
                          }}
                          title={c.name}
                          className={`w-7 h-7 rounded-full transition-all duration-300 relative flex items-center justify-center border-2 cursor-pointer ${
                            selectedColor === c.id
                              ? 'border-[#C2410C] scale-110 shadow-[0_0_12px_rgba(194,65,12,0.5)]'
                              : 'border-white/20 hover:border-white/50'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {selectedColor === c.id && (
                            <Check className="w-3.5 h-3.5 text-white mix-blend-difference" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="font-mono-tech text-[10px] text-neutral-500 uppercase flex items-center gap-1.5">
                    <RotateCcw className="w-3 h-3 text-[#C2410C]" />
                    <span>360° Drag Enabled</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Editorial Details & Specifications */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono-tech text-xs text-[#C2410C] tracking-widest uppercase font-semibold">
                  REFERENCE SIGNATURE SERIES // CH & IN
                </span>
              </div>
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                Aetheris X-1 Flagship
              </h3>
              <p className="mt-4 text-sm md:text-base text-neutral-300 font-light leading-relaxed">
                Featuring a 7-driver tri-brid acoustic system combining a pure vapor-deposited beryllium dynamic driver with quadruple balanced armatures and dual electrostatic super-tweeters. Designed for mastering engineers and discerning audiophiles.
              </p>
            </div>

            {/* Acoustic Specifications Table */}
            <div className="space-y-3 py-6 border-y border-white/10 font-mono-tech text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-500 uppercase">Driver Configuration</span>
                <span className="text-white font-medium">1 DD + 4 BA + 2 EST (7 Drivers / Ear)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-500 uppercase">Frequency Response</span>
                <span className="text-white font-medium">5 Hz – 45,000 Hz</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-500 uppercase">Impedance</span>
                <span className="text-white font-medium">16 Ω @ 1 kHz</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-500 uppercase">Sensitivity</span>
                <span className="text-white font-medium">112 dB SPL / mW</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-500 uppercase">Total Harmonic Distortion</span>
                <span className="text-white font-medium">&lt; 0.08% (1 kHz, 94 dB)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-neutral-500 uppercase">Included Cable</span>
                <span className="text-white font-medium">8-Core Pure OCC Monocrystalline Silver</span>
              </div>
            </div>

            {/* Price & Purchase Actions */}
            <div className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-mono-tech text-[10px] text-neutral-500 uppercase tracking-widest block">
                    PRICE (BESPOKE AUDIOPHILE ALLOCATION)
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-extrabold text-3xl sm:text-4xl text-white">
                      $1,499
                    </span>
                    <span className="font-mono-tech text-xs text-neutral-400">USD</span>
                  </div>
                </div>
                <span className="text-xs font-mono-tech text-[#C2410C] border border-[#C2410C]/40 px-2.5 py-1 rounded-full bg-[#C2410C]/10 font-semibold">
                  Hand-Built Artisan Batch
                </span>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    audioEngine.playFrequencyTone(1100, 0.4);
                    onOpenOrderModal();
                  }}
                  className="flex-1 py-4 px-6 rounded-full bg-[#C2410C] hover:bg-[#EA580C] text-white font-semibold text-xs md:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(194,65,12,0.35)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-white" />
                  <span>Reserve Pre-Order</span>
                </button>

                <button
                  onClick={handleAuditionClick}
                  className={`py-4 px-6 rounded-full border text-xs md:text-sm uppercase tracking-wider font-mono-tech flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer ${
                    isPlayingDemo
                      ? 'border-[#C2410C] bg-[#C2410C]/20 text-[#EA580C]'
                      : 'border-white/15 bg-white/[0.03] text-neutral-300 hover:text-white hover:border-white/30'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingDemo ? 'animate-bounce text-[#C2410C]' : ''}`} />
                  <span>{isPlayingDemo ? 'Synthesizing...' : 'Test Soundstage'}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-[11px] font-mono-tech text-neutral-500 pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C2410C]" />
                  3-Year Global Warranty
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-neutral-400" />
                  CNC Aluminum Vault Case
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
