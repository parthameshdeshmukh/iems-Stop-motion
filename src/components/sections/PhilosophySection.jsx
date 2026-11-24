import React, { useState } from 'react';
import { Shield, Sparkles, SlidersHorizontal, Award, Camera, ZoomIn, X, Eye } from 'lucide-react';
import { audioEngine } from '../../utils/audio';

export default function PhilosophySection() {
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const pillars = [
    {
      index: '01',
      title: 'Acoustic Phase Alignment',
      subtitle: 'Zero Time-Domain Smearing',
      desc: 'In multi-driver earphones, phase incoherence is the primary culprit behind muddy transients. Our 4-way Linkwitz-Riley network ensures all wave emissions arrive at the eardrum within 0.01ms of each other.',
    },
    {
      index: '02',
      title: 'Monolithic Titanium Milling',
      subtitle: 'Zero Harmonic Resonance',
      desc: 'Each shell starts as a solid 2.4kg billet of Grade 5 aerospace titanium, subjected to 18 hours of 5-axis CNC micro-machining to create a resonance-free acoustic chamber.',
    },
    {
      index: '03',
      title: 'Surgical Channel Matching',
      subtitle: '±0.25dB Binaural Symmetry',
      desc: 'Every single transducer is individually hand-tested on calibrated B&K 5128 Type 4620 artificial head test rigs. Only matched pairs with under 0.25dB deviation across 20Hz-40kHz are approved.',
    },
  ];

  const galleryShots = [
    {
      id: 'assembled',
      title: 'Aetheris X-1 Assembled Reference',
      category: 'Haute Horlogerie Finishing',
      src: '/images/hero_iem.jpg',
      tag: 'Macro 01 // Completed IEM',
      specs: 'Grade 5 Titanium • Medical Resin • 0.78mm 2-Pin',
    },
    {
      id: 'exploded',
      title: '7-Driver Tri-Brid Architecture',
      category: 'Internal Transducer System',
      src: '/images/exploded_iem.jpg',
      tag: 'Macro 02 // Exploded Array',
      specs: '1 Beryllium DD + 4 BA + 2 EST Tweeters',
    },
    {
      id: 'driver',
      title: 'Vapor Beryllium & Sound Bore',
      category: 'Acoustic Transducer Core',
      src: '/images/driver_closeup.jpg',
      tag: 'Macro 03 // Beryllium Core',
      specs: '42° Angled Bore • Laser Micro-Perforated Mesh',
    },
    {
      id: 'vault',
      title: 'Solid Aluminum Presentation Vault',
      category: 'Serialized Artisan Packaging',
      src: '/images/showcase_vault.jpg',
      tag: 'Macro 04 // CNC Billet Vault',
      specs: '2.4kg Milled Billet • Numbered Plaque • OCC Cable',
    },
  ];

  return (
    <section id="philosophy" className="relative w-full py-32 bg-[#080808] text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#C2410C]" />
              <span className="font-mono-tech text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
                // ARTISAN HOROLOGY MEETS ACOUSTICS
              </span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-5xl md:text-6xl text-gradient-silver tracking-tight">
              THE OBSESSION WITH <br />
              <span className="text-white">TRANSIENT SPEED.</span>
            </h2>
          </div>
          <p className="max-w-md text-sm md:text-base text-neutral-400 leading-relaxed font-light">
            We do not manufacture audio equipment for mass-market shelves. We build precision instruments for those whose ears demand total transparency.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {pillars.map((pillar) => (
            <div
              key={pillar.index}
              className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-[#C2410C]/50 transition-all duration-500 flex flex-col justify-between group hover:-translate-y-1.5"
            >
              <div>
                <span className="font-mono-tech text-xs text-[#C2410C] tracking-widest block mb-6">
                  ARCHITECTURAL PRINCIPLE // {pillar.index}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-white group-hover:text-[#C2410C] transition-colors">
                  {pillar.title}
                </h3>
                <h4 className="font-mono-tech text-xs text-neutral-400 mt-1 uppercase">
                  {pillar.subtitle}
                </h4>
                <p className="mt-4 text-sm text-neutral-400 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-mono-tech text-neutral-500 uppercase">
                  HEADPHONE ZONE LAB VERIFIED
                </span>
                <span className="w-2 h-2 rounded-full bg-neutral-700 group-hover:bg-[#C2410C] transition-colors" />
              </div>
            </div>
          ))}
        </div>

        {/* ========================================================
            REALISTIC STUDIO MACRO PHOTOGRAPHY ARCHIVES
            ======================================================== */}
        <div className="pt-16 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle mb-3">
                <Camera className="w-3.5 h-3.5 text-[#C2410C]" />
                <span className="font-mono-tech text-[10px] tracking-[0.25em] text-neutral-400 uppercase">
                  STUDIO ARCHIVE // 4K HIGH-RESOLUTION PHOTOGRAPHY
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
                CRAFTSMANSHIP THROUGH THE MACRO LENS
              </h3>
            </div>
            <span className="font-mono-tech text-xs text-neutral-400">
              Click any image to inspect in full resolution
            </span>
          </div>

          {/* 4-Column Photo Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryShots.map((shot, idx) => (
              <div
                key={shot.id}
                onClick={() => {
                  setSelectedPhoto(shot);
                  audioEngine.playHapticBlip(1100, 0.04, 0.05);
                }}
                className="group relative rounded-2xl glass-panel border border-white/10 hover:border-[#C2410C]/60 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8)] flex flex-col justify-between"
              >
                {/* Photo Viewport */}
                <div className="relative aspect-square w-full overflow-hidden bg-black/40 flex items-center justify-center p-4">
                  <img
                    src={shot.src}
                    alt={shot.title}
                    className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle Zoom Badge on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-white font-mono-tech text-xs flex items-center gap-2">
                      <ZoomIn className="w-3.5 h-3.5 text-[#C2410C]" />
                      <span>Inspect 4K</span>
                    </div>
                  </div>
                </div>

                {/* Card Caption */}
                <div className="p-4 border-t border-white/10 bg-[#080808]">
                  <span className="font-mono-tech text-[10px] text-[#C2410C] font-bold block mb-1">
                    {shot.tag}
                  </span>
                  <h4 className="font-display font-bold text-sm text-white group-hover:text-[#C2410C] transition-colors truncate">
                    {shot.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-mono-tech mt-1 truncate">
                    {shot.specs}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full-Screen 4K Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6 animate-fadeIn cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl w-full max-h-[90vh] glass-panel rounded-3xl border border-white/20 p-6 flex flex-col items-center justify-center overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] cursor-default"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* High-Res Image */}
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.title}
              className="max-h-[68vh] w-auto object-contain rounded-xl drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] mb-4"
            />

            {/* Caption & Specs */}
            <div className="w-full text-center pt-4 border-t border-white/10">
              <span className="font-mono-tech text-xs text-[#C2410C] uppercase tracking-wider block mb-1">
                {selectedPhoto.tag} // {selectedPhoto.category}
              </span>
              <h4 className="font-display font-bold text-xl text-white">
                {selectedPhoto.title}
              </h4>
              <p className="font-mono-tech text-xs text-neutral-400 mt-1">
                {selectedPhoto.specs}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
