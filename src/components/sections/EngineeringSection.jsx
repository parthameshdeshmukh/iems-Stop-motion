import React, { useState, useRef } from 'react';
import {
  Activity,
  Zap,
  Sliders,
  Wind,
  Layers,
  Sparkles,
  Shield,
  Volume2,
  ChevronRight,
  TrendingUp,
  Play,
  RotateCcw,
} from 'lucide-react';
import { audioEngine } from '../../utils/audio';

export default function EngineeringSection() {
  const [selectedDriver, setSelectedDriver] = useState('dd');
  const [activeCurve, setActiveCurve] = useState('aetheris');
  const [hoveredBand, setHoveredBand] = useState(null);
  const [isSweeping, setIsSweeping] = useState(false);
  const [interactiveFreq, setInteractiveFreq] = useState(null);
  const graphSvgRef = useRef(null);

  // Driver architectures data
  const drivers = {
    dd: {
      name: '10mm Beryllium Dynamic Sub-Woofer',
      tagline: 'Visceral, tactile sub-bass with zero transient overhang',
      role: 'Dedicated Sub-Bass & Bass (5Hz – 250Hz)',
      activeZone: [0, 250],
      specs: [
        { label: 'Diaphragm', value: 'Pure Beryllium Vapor Deposition' },
        { label: 'Magnet', value: 'N52 Neodymium (>1.4 Tesla flux)' },
        { label: 'THD @ 94dB', value: '< 0.05% @ 100Hz' },
        { label: 'Acoustic Load', value: 'Rear Vented Acoustic Chamber' },
      ],
      description:
        'Unlike traditional polymer or bio-cellulose diaphragms, pure beryllium offers the highest stiffness-to-density ratio known in metallurgy. This prevents cone breakup, delivering bass notes with seismic authority, lightning-fast attack, and zero acoustic bloat.',
    },
    mid_ba: {
      name: 'Dual Custom Balanced Armatures',
      tagline: 'Micro-detailed vocal articulation and lifelike timbre',
      role: 'Midrange & Lower Treble (250Hz – 4kHz)',
      activeZone: [250, 650],
      specs: [
        { label: 'Architecture', value: 'Twin Reed-Armature Motor' },
        { label: 'Enclosure', value: 'Nickel-Plated Laser Welded' },
        { label: 'Vocal Isolation', value: '+4.5dB Pinna-Aligned Boost' },
        { label: 'Impedance Match', value: 'Dual L-Pad Dampened' },
      ],
      description:
        'Two specialized balanced armatures operate in parallel to halve distortion and double dynamic headroom across the critical midrange. Vocals emerge with astonishing breath textures, acoustic guitars ring with organic resonance, and instrument separation feels holographic.',
    },
    est_ba: {
      name: 'Dual Ultra-High Tweeter Array',
      tagline: 'Effortless extension beyond the audible boundary to 45kHz',
      role: 'Upper Treble & Ultra-Air (4kHz – 45kHz)',
      activeZone: [650, 1000],
      specs: [
        { label: 'Transducer', value: 'Micro-Armature Super Tweeter' },
        { label: 'Frequency Span', value: 'Up to 45,000 Hz' },
        { label: 'Dispersion Angle', value: 'Direct Bore Nozzle Coupled' },
        { label: 'Damping', value: 'Helical Waveguide Acoustic Damper' },
      ],
      description:
        'Captures microscopic acoustic transients, cymbal decay, and hall reverberation that define genuine high-resolution mastering. Tuning avoids harsh resonant spikes, offering silky smooth micro-detail without listener fatigue.',
    },
    crossover: {
      name: '4-Way Linear-Phase Passive Crossover',
      tagline: 'Zero phase-cancellation across all acoustic handover points',
      role: 'Master Electronic Distribution',
      activeZone: [0, 1000],
      specs: [
        { label: 'Topology', value: '4th Order Linkwitz-Riley' },
        { label: 'Components', value: 'High-Purity Film Capacitors' },
        { label: 'Trace Metallization', value: '24K Gold-Plated Copper' },
        { label: 'Phase Deviation', value: '< 3° across handover zones' },
      ],
      description:
        'Every multi-driver monitor succeeds or fails at the crossover. Our proprietary circuit ensures that each transducer receives its optimal frequency slice with matched group delay, creating the impression of a single, flawless point-source driver.',
    },
  };

  // Frequency bands for interactive curve
  const frequencyBands = [
    { name: 'Sub-Bass', range: '20Hz - 60Hz', freq: 40, desc: 'Visceral rumble & physical foundation' },
    { name: 'Mid-Bass', range: '60Hz - 250Hz', freq: 120, desc: 'Warmth, kick drum punch, bass guitar body' },
    { name: 'Midrange', range: '250Hz - 2kHz', freq: 1000, desc: 'Core vocal fundamentals, pianos, strings' },
    { name: 'Upper Mids / Ear Gain', range: '2kHz - 6kHz', freq: 3000, desc: 'Clarity, speech intelligibility, presence' },
    { name: 'Treble & Air', range: '6kHz - 45kHz', freq: 12000, desc: 'Harmonic overtones, sparkle, open soundstage' },
  ];

  const handleRunSweep = () => {
    setIsSweeping(true);
    audioEngine.playFrequencySweep(3.5);
    setTimeout(() => setIsSweeping(false), 3600);
  };

  const handleGraphMouseMove = (e) => {
    if (!graphSvgRef.current) return;
    const rect = graphSvgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const ratio = x / rect.width;
    // Logarithmic frequency calculation: 20Hz to 20,000Hz
    const freq = Math.round(20 * Math.pow(1000, ratio));
    setInteractiveFreq({ freq, xRatio: ratio, svgX: ratio * 1000 });
  };

  const handleGraphClick = () => {
    if (interactiveFreq) {
      audioEngine.playFrequencyTone(interactiveFreq.freq, 0.6);
    }
  };

  return (
    <section id="engineering" className="relative w-full py-32 bg-[#080808] text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-electric-blue/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg-pattern opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle mb-4">
              <Activity className="w-3.5 h-3.5 text-electric-blue" />
              <span className="font-mono-tech text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
                // ACOUSTIC PHYSICS & MEASUREMENT
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl tracking-tight text-gradient-silver">
              SURGICAL PRECISION. <br />
              <span className="text-white">UNCOMPROMISED HARMONICS.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-neutral-400 leading-relaxed font-light">
            Designed inside Geneva acoustic test facilities. Five independent transducers work in acoustic symmetry, measured within ±0.25dB channel-matching tolerances.
          </p>
        </div>

        {/* ========================================================
            PART 1: INTERACTIVE DRIVER ARCHITECTURE MATRIX
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-24">
          {/* Driver navigation tabs (Left Column) */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <span className="font-mono-tech text-xs text-neutral-500 uppercase tracking-widest mb-1">
              Select Transducer:
            </span>
            {Object.keys(drivers).map((key) => {
              const d = drivers[key];
              const isSelected = selectedDriver === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedDriver(key);
                    audioEngine.playComponentSound(key);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all duration-300 flex flex-col gap-1 relative overflow-hidden group ${
                    isSelected
                      ? 'bg-white/[0.06] border-electric-blue/70 shadow-[0_0_25px_rgba(0,240,255,0.15)]'
                      : 'bg-surface-200/50 border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono-tech text-[10px] text-electric-blue uppercase tracking-wider">
                      {d.role}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isSelected ? 'translate-x-1 text-electric-blue' : 'text-neutral-600 group-hover:text-neutral-400'
                      }`}
                    />
                  </div>
                  <span className="font-display font-bold text-base text-white group-hover:text-white">
                    {d.name}
                  </span>
                  <span className="text-xs text-neutral-400 line-clamp-1">{d.tagline}</span>
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-electric-blue" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Detailed Driver Spec Card (Right Column) */}
          <div className="lg:col-span-8 glass-panel p-8 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-72 h-72 bg-electric-blue/5 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div>
                  <span className="font-mono-tech text-xs text-electric-blue uppercase tracking-widest">
                    Transducer Analysis // {drivers[selectedDriver].role}
                  </span>
                  <h3 className="font-display font-extrabold text-2xl md:text-3xl text-white mt-1">
                    {drivers[selectedDriver].name}
                  </h3>
                </div>
                <div className="px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 font-mono-tech text-xs text-neutral-300">
                  ACOUSTIC ISOLATION: 26dB
                </div>
              </div>

              <p className="mt-6 text-sm md:text-base text-neutral-300 leading-relaxed font-light">
                {drivers[selectedDriver].description}
              </p>
            </div>

            {/* Micro specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
              {drivers[selectedDriver].specs.map((s, idx) => (
                <div key={idx} className="flex flex-col">
                  <span className="font-mono-tech text-[10px] text-neutral-500 uppercase tracking-wider">
                    {s.label}
                  </span>
                  <span className="font-display font-bold text-sm text-white mt-1">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            PART 2: INTERACTIVE FREQUENCY RESPONSE VISUALIZER
            ======================================================== */}
        <div className="glass-panel p-6 md:p-10 rounded-2xl border border-white/10 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-electric-blue" />
                <span className="font-mono-tech text-xs text-electric-blue uppercase tracking-widest">
                  PRECISION ACOUSTIC LAB MEASUREMENT
                </span>
              </div>
              <h3 className="font-display font-extrabold text-2xl text-white mt-1">
                Frequency Response Curve (20Hz – 45,000Hz)
              </h3>
            </div>

            {/* Action buttons: Sweep player & curve target selector */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Audio Sweep Play button */}
              <button
                onClick={handleRunSweep}
                disabled={isSweeping}
                className={`px-4 py-2 rounded-xl text-xs font-mono-tech uppercase tracking-wider flex items-center gap-2 transition-all ${
                  isSweeping
                    ? 'bg-electric-blue/20 border border-electric-blue text-electric-blue shadow-[0_0_20px_rgba(0,240,255,0.4)]'
                    : 'bg-white text-black font-semibold hover:bg-neutral-200'
                }`}
              >
                <Play className={`w-3.5 h-3.5 ${isSweeping ? 'animate-spin' : 'fill-current'}`} />
                <span>{isSweeping ? 'Sweeping 20Hz - 16kHz...' : 'Play Frequency Sweep'}</span>
              </button>

              {/* Target Curve Selector */}
              <div className="flex items-center gap-1.5 bg-[#0a0a0d] p-1.5 rounded-xl border border-white/10">
                <button
                  onClick={() => {
                    setActiveCurve('aetheris');
                    audioEngine.playHapticBlip(1000, 0.03, 0.05);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-colors ${
                    activeCurve === 'aetheris'
                      ? 'bg-electric-blue text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Aetheris Signature
                </button>
                <button
                  onClick={() => {
                    setActiveCurve('harman');
                    audioEngine.playHapticBlip(900, 0.03, 0.05);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-tech transition-colors ${
                    activeCurve === 'harman'
                      ? 'bg-white/20 text-white font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Harman Target
                </button>
              </div>
            </div>
          </div>

          {/* Interactive SVG Frequency Graph with Real-Time Hover Tone Inspection */}
          <div
            ref={graphSvgRef}
            onMouseMove={handleGraphMouseMove}
            onMouseLeave={() => setInteractiveFreq(null)}
            onClick={handleGraphClick}
            data-cursor="PLAY FREQ"
            className="relative w-full h-64 md:h-80 my-6 bg-[#060608] rounded-xl border border-white/5 p-4 flex flex-col justify-between overflow-hidden cursor-crosshair group"
          >
            {/* Active Driver Acoustic Zone Highlight Band */}
            {drivers[selectedDriver]?.activeZone && (
              <div
                className="absolute top-0 bottom-0 bg-electric-blue/[0.04] border-x border-electric-blue/20 pointer-events-none transition-all duration-500"
                style={{
                  left: `${(drivers[selectedDriver].activeZone[0] / 1000) * 100}%`,
                  width: `${((drivers[selectedDriver].activeZone[1] - drivers[selectedDriver].activeZone[0]) / 1000) * 100}%`,
                }}
              />
            )}

            {/* Sweep laser line animation */}
            {isSweeping && (
              <div className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-electric-blue to-transparent shadow-[0_0_20px_#00f0ff] animate-[sweep_3.5s_linear_infinite]" />
            )}

            {/* Interactive Vertical Frequency Crosshair Reticle */}
            {interactiveFreq && (
              <>
                <div
                  className="absolute top-0 bottom-0 w-[1px] bg-electric-blue/80 pointer-events-none"
                  style={{ left: `${interactiveFreq.xRatio * 100}%` }}
                />
                <div
                  className="absolute top-4 glass-panel px-3 py-1.5 rounded-lg border border-electric-blue/40 font-mono-tech text-[10px] text-white flex items-center gap-3 pointer-events-none shadow-[0_0_15px_rgba(0,240,255,0.3)] backdrop-blur-md"
                  style={{
                    left: `${Math.min(80, Math.max(5, interactiveFreq.xRatio * 100 - 10))}%`,
                  }}
                >
                  <span className="text-electric-blue font-bold">{interactiveFreq.freq} Hz</span>
                  <span className="text-neutral-400">Click to Audition</span>
                </div>
              </>
            )}

            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-6 px-10 pointer-events-none opacity-20">
              <div className="w-full h-[1px] bg-white border-t border-dashed" />
              <div className="w-full h-[1px] bg-white border-t border-dashed" />
              <div className="w-full h-[1px] bg-white border-t border-dashed" />
              <div className="w-full h-[1px] bg-white border-t border-dashed" />
            </div>

            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 1000 300"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Reference Neutral Line */}
              <line
                x1="0"
                y1="150"
                x2="1000"
                y2="150"
                stroke="rgba(255,255,255,0.15)"
                strokeDasharray="4 4"
                strokeWidth="1"
              />

              {/* Harman Target comparison curve */}
              {activeCurve !== 'diffuse' && (
                <path
                  d="M 0 135 C 100 130, 200 170, 350 175 C 500 175, 650 110, 750 115 C 850 120, 950 170, 1000 185"
                  fill="none"
                  stroke="rgba(255,255,255,0.25)"
                  strokeWidth="2"
                  strokeDasharray={activeCurve === 'harman' ? 'none' : '4 4'}
                />
              )}

              {/* Aetheris Signature curve */}
              <path
                d={
                  activeCurve === 'aetheris'
                    ? 'M 0 120 C 80 110, 180 155, 320 160 C 450 162, 600 105, 720 100 C 800 100, 880 135, 1000 145'
                    : 'M 0 135 C 100 130, 200 170, 350 175 C 500 175, 650 110, 750 115 C 850 120, 950 170, 1000 185'
                }
                fill="none"
                stroke="#00f0ff"
                strokeWidth="3.5"
                className="transition-all duration-700 ease-out"
              />

              {/* Area under curve */}
              <path
                d={
                  activeCurve === 'aetheris'
                    ? 'M 0 120 C 80 110, 180 155, 320 160 C 450 162, 600 105, 720 100 C 800 100, 880 135, 1000 145 L 1000 300 L 0 300 Z'
                    : 'M 0 135 C 100 130, 200 170, 350 175 C 500 175, 650 110, 750 115 C 850 120, 950 170, 1000 185 L 1000 300 L 0 300 Z'
                }
                fill="url(#curveGradient)"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Frequency Axis Markings */}
            <div className="flex justify-between items-center text-[10px] font-mono-tech text-neutral-500 pt-2 border-t border-white/5">
              <span>20 Hz (Sub-Bass)</span>
              <span>100 Hz</span>
              <span>1 kHz (Mids)</span>
              <span>3 kHz (Ear Gain)</span>
              <span>10 kHz (Presence)</span>
              <span>45 kHz (Air)</span>
            </div>
          </div>

          {/* Interactive Acoustic Bands Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {frequencyBands.map((band, idx) => (
              <button
                key={idx}
                onMouseEnter={() => setHoveredBand(band.name)}
                onMouseLeave={() => setHoveredBand(null)}
                onClick={() => {
                  audioEngine.playFrequencyTone(band.freq, 0.8);
                }}
                className={`p-3 rounded-xl border text-left transition-all duration-300 flex flex-col gap-1 ${
                  hoveredBand === band.name
                    ? 'bg-electric-blue/15 border-electric-blue text-white shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs text-white">{band.name}</span>
                  <Volume2 className="w-3 h-3 text-neutral-500 hover:text-electric-blue" />
                </div>
                <span className="font-mono-tech text-[10px] text-electric-blue">{band.range}</span>
                <span className="text-[10px] text-neutral-400 line-clamp-1">{band.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
