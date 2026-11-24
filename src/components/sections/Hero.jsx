import React, { useState, useRef } from 'react';
import {
  ArrowDown,
  Sparkles,
  Volume2,
  Eye,
  Compass,
  Layers,
  Disc,
  ShieldCheck,
  Check,
  Activity,
  Radio,
  Sliders
} from 'lucide-react';
import HeroCanvas from '../canvas/HeroCanvas';
import { audioEngine } from '../../utils/audio';
import { useInView } from '../../hooks/useInView';

export default function Hero({ onExploreClick }) {
  const [inViewRef, isInView] = useInView({ threshold: 0.01, rootMargin: '150px 0px' });
  const [activeAngle, setActiveAngle] = useState('default');
  const [isPlayingAudition, setIsPlayingAudition] = useState(false);

  const angles = [
    { id: 'default', label: '360° Orbit', icon: Compass },
    { id: 'faceplate', label: 'CNC Faceplate', icon: Disc },
    { id: 'nozzle', label: '42° Sound Bore', icon: Eye },
    { id: 'shell', label: 'Acoustic Resin', icon: Layers },
  ];

  const handleAuditionClick = () => {
    setIsPlayingAudition(true);
    audioEngine.playFrequencySweep(2.8);
    setTimeout(() => setIsPlayingAudition(false), 2900);
  };

  return (
    <section
      id="hero"
      ref={inViewRef}
      className="relative w-full min-h-screen pt-28 pb-20 flex flex-col justify-between overflow-hidden bg-[#FAF8F5] text-[#111111] transition-colors"
    >
      {/* Subtle Studio Radial Background & Warm Tone Grading */}
      <div className="absolute inset-0 bg-radial-radial from-[#FFFFFF] via-[#FAF8F5] to-[#F3EFE8] pointer-events-none z-0" />

      {/* Dynamic Sound-Wave Vector Graphics that pulse with audio */}
      <div className="absolute right-[-10%] sm:right-[5%] top-1/2 -translate-y-1/2 w-[550px] sm:w-[750px] lg:w-[920px] h-[550px] sm:h-[750px] lg:h-[920px] pointer-events-none z-0">
        <svg
          className={`w-full h-full transition-all duration-700 ${
            isPlayingAudition ? 'scale-105 opacity-80' : 'animate-acoustic-pulse opacity-40'
          }`}
          viewBox="0 0 800 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle concentric acoustic wave lines */}
          <circle cx="400" cy="400" r="140" stroke="#E2DDD5" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
          <circle cx="400" cy="400" r="210" stroke="#D8D2C6" strokeWidth="1" opacity="0.7" />
          <circle cx="400" cy="400" r="280" stroke="#E5E0D6" strokeWidth="1" strokeDasharray="3 5" opacity="0.5" />
          <circle cx="400" cy="400" r="350" stroke="#ECE8DF" strokeWidth="1" opacity="0.4" />
          <circle cx="400" cy="400" r="395" stroke="#EFECE5" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.3" />

          {/* Warm acoustic dispersion arcs */}
          <path
            d="M 260 400 A 140 140 0 0 1 540 400"
            stroke="#C2410C"
            strokeWidth="1.5"
            strokeOpacity={isPlayingAudition ? '0.7' : '0.22'}
            strokeLinecap="round"
          />
          <path
            d="M 190 400 A 210 210 0 0 1 610 400"
            stroke="#C2410C"
            strokeWidth="1.2"
            strokeOpacity={isPlayingAudition ? '0.5' : '0.14'}
            strokeLinecap="round"
          />
          <path
            d="M 120 400 A 280 280 0 0 1 680 400"
            stroke="#C2410C"
            strokeWidth="1"
            strokeOpacity={isPlayingAudition ? '0.35' : '0.08'}
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Fine Audiophile Watermark Coordinates */}
      <div className="absolute top-28 left-6 md:left-12 z-10 pointer-events-none hidden lg:flex flex-col gap-1 text-[10px] font-mono-tech text-[#888888] tracking-widest uppercase">
        <span className="flex items-center gap-2 text-[#444444] font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C] animate-ping" />
          AUDIOPHILE REFERENCE GRADE
        </span>
        <span>AETHERIS X-1 // MONARCH EDITION</span>
        <span>ACOUSTIC LABS: GENEVA • CH</span>
      </div>

      <div className="absolute top-28 right-6 md:right-12 z-10 pointer-events-none hidden lg:flex flex-col items-end gap-1 text-[10px] font-mono-tech text-[#888888] tracking-widest uppercase">
        <span className="text-[#444444] font-medium">FREQUENCY RESPONSE</span>
        <span className="text-[#111111] font-bold text-xs">5Hz – 45,000Hz (Hi-Res)</span>
        <span>THD: &lt;0.08% @ 1kHz, 94dB</span>
      </div>

      {/* 3D Floating IEM Canvas (Suspended with Real-time Lighting & Contact Shadows) */}
      <HeroCanvas isInView={isInView} activeAngle={activeAngle} />

      {/* Main Editorial Content Grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pointer-events-none">
        {/* Left Column: Bold Editorial Typography & Product Campaign Actions */}
        <div className="lg:col-span-7 flex flex-col items-start text-left pointer-events-auto">
          {/* Headphone Zone Inspired Curator Badge */}
          <div
            data-cursor="CURATED"
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#EFECE6] border border-[#E2DDD5] mb-6 shadow-sm hover:border-[#C2410C]/40 transition-colors cursor-default"
          >
            <span className="w-2 h-2 rounded-full bg-[#C2410C]" />
            <span className="font-mono-tech text-[10px] sm:text-[11px] tracking-[0.2em] uppercase font-bold text-[#111111]">
              HEADPHONE ZONE INSPIRED // AUDIOPHILE SERIES
            </span>
          </div>

          {/* Main Headline: Bold, Oversized, Editorial Typography */}
          <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-[5.4rem] xl:text-[6.2rem] tracking-[-0.035em] leading-[0.92] text-[#0D0D0D] mb-6 select-none">
            HEAR EVERY <br />
            <span className="relative inline-block text-[#111111]">
              DETAIL.
              {/* Subtle warm copper accent line */}
              <span className="absolute -bottom-2.5 left-0 right-0 h-[3px] bg-gradient-to-r from-[#C2410C] via-[#EA580C] to-transparent rounded-full opacity-80" />
            </span>
          </h1>

          {/* Supporting Campaign Text */}
          <p className="max-w-xl text-base sm:text-lg lg:text-xl font-normal text-[#52525B] tracking-normal leading-relaxed mb-8">
            Discover sound beyond what you've heard before. Experience music the way it was meant to be heard.
          </p>

          {/* Dual Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-10 w-full sm:w-auto">
            {/* Primary CTA: Explore IEMs */}
            <button
              data-cursor="EXPLORE"
              onClick={() => {
                audioEngine.playFrequencyTone(1000, 0.4);
                onExploreClick();
              }}
              className="group relative px-8 py-4 rounded-full bg-[#111111] hover:bg-[#222226] text-white font-semibold text-xs sm:text-sm tracking-[0.16em] uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.14)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.24)] hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Explore IEMs</span>
              <ArrowDown className="w-4 h-4 text-white group-hover:translate-y-1 transition-transform duration-300" />
            </button>

            {/* Secondary CTA: Discover Your Sound (Interactive Sound Sweep) */}
            <button
              data-cursor="AUDITION"
              onClick={handleAuditionClick}
              className={`px-7 py-4 rounded-full border transition-all duration-300 flex items-center justify-center gap-2.5 uppercase text-xs sm:text-sm font-semibold tracking-[0.12em] ${
                isPlayingAudition
                  ? 'border-[#C2410C] bg-[#C2410C] text-white shadow-[0_10px_25px_rgba(194,65,12,0.3)] animate-pulse'
                  : 'border-[#D6D0C5] bg-white/80 hover:bg-white text-[#18181B] hover:border-[#111111] hover:shadow-[0_6px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5'
              }`}
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudition ? 'text-white animate-bounce' : 'text-[#C2410C]'}`} />
              <span>{isPlayingAudition ? 'Auditioning 5Hz-45kHz...' : 'Discover Your Sound'}</span>
            </button>
          </div>

          {/* Headphone Zone Curated Audiophile Trust / Feature Row */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8E4DC] w-full max-w-lg">
            <div className="flex flex-col">
              <span className="font-mono-tech text-[10px] uppercase text-[#71717A] tracking-wider">
                Transducer Tech
              </span>
              <span className="font-display font-bold text-sm text-[#111111] mt-0.5">
                7-Driver Hybrid
              </span>
              <span className="text-[11px] text-[#71717A] mt-0.5">
                1 DD + 4 BA + 2 EST
              </span>
            </div>

            <div className="flex flex-col border-l border-[#E8E4DC] pl-4">
              <span className="font-mono-tech text-[10px] uppercase text-[#71717A] tracking-wider">
                Acoustic Tolerance
              </span>
              <span className="font-display font-bold text-sm text-[#111111] mt-0.5">
                ±0.25 dB Matched
              </span>
              <span className="text-[11px] text-[#71717A] mt-0.5">
                Binaural Reference
              </span>
            </div>

            <div className="flex flex-col border-l border-[#E8E4DC] pl-4">
              <span className="font-mono-tech text-[10px] uppercase text-[#71717A] tracking-wider">
                Ownership
              </span>
              <span className="font-display font-bold text-sm text-[#111111] mt-0.5">
                3-Year Warranty
              </span>
              <span className="text-[11px] text-[#71717A] mt-0.5">
                Free Express Delivery
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Creative Telemetry Chips around 3D Canvas */}
        <div className="lg:col-span-5 h-[340px] sm:h-[420px] lg:h-[580px] relative pointer-events-none flex flex-col justify-between items-end p-4">
          {/* Top Floating Glass Chip: Live Acoustic Chamber Telemetry */}
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/80 border border-[#E2DDD5] shadow-sm backdrop-blur-md pointer-events-auto hover:border-[#111111] transition-colors">
            <Activity className="w-3.5 h-3.5 text-[#C2410C]" />
            <div className="flex flex-col text-left">
              <span className="font-mono-tech text-[9px] uppercase tracking-wider text-[#777777]">
                Acoustic Chamber
              </span>
              <span className="font-mono-tech text-[11px] font-bold text-[#111111]">
                CNC Grade 5 Ti // DLP Resin
              </span>
            </div>
          </div>

          {/* Bottom Floating Glass Chip: Impedance & Sensitivity */}
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white/80 border border-[#E2DDD5] shadow-sm backdrop-blur-md pointer-events-auto hover:border-[#111111] transition-colors">
            <Radio className="w-3.5 h-3.5 text-[#C2410C]" />
            <div className="flex flex-col text-left">
              <span className="font-mono-tech text-[9px] uppercase tracking-wider text-[#777777]">
                Sensitivity & Load
              </span>
              <span className="font-mono-tech text-[11px] font-bold text-[#111111]">
                112dB SPL/mW @ 16Ω
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3D Inspection Perspective Selector (Bottom-Left Pills) */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 pointer-events-auto">
        <div className="flex items-center gap-2">
          <span className="font-mono-tech text-[10px] uppercase tracking-widest text-[#71717A] hidden sm:inline">
            Studio Inspection Angle:
          </span>
          <div className="p-1 rounded-full bg-white/80 border border-[#E2DDD5] shadow-sm flex items-center gap-1 backdrop-blur-md">
            {angles.map((ang) => {
              const Icon = ang.icon;
              const isSelected = activeAngle === ang.id;
              return (
                <button
                  key={ang.id}
                  onClick={() => {
                    setActiveAngle(ang.id);
                    audioEngine.playHapticBlip(1100, 0.03, 0.04);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-mono-tech transition-all ${
                    isSelected
                      ? 'bg-[#111111] text-white font-bold shadow-sm'
                      : 'text-[#52525B] hover:text-black hover:bg-black/[0.04]'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{ang.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Clean Center-Bottom Scroll Indicator to Deconstruction Lab */}
        <div
          data-cursor="DISMANTLE"
          onClick={onExploreClick}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <span className="font-mono-tech text-[10px] tracking-[0.25em] uppercase text-[#71717A] group-hover:text-[#111111] transition-colors">
            Scroll to Deconstruct // Enter Acoustic Lab
          </span>
          <div className="w-5 h-8 rounded-full border border-[#D6D0C5] flex justify-center p-1 group-hover:border-[#111111] transition-colors bg-white/60">
            <div className="w-1 h-2 rounded-full bg-[#111111] animate-bounce" />
          </div>
        </div>
      </div>

      {/* Seamless Gradient Fade Transition from Warm Cream into Deep Dark (#080808) Deconstruction Chamber */}
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent via-[#080808]/70 to-[#080808] pointer-events-none z-10" />
    </section>
  );
}
