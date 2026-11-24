import React from 'react';
import { ArrowUp, Mail, Shield, Sparkles } from 'lucide-react';
import { audioEngine } from '../../utils/audio';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    audioEngine.playHapticBlip(1200, 0.05, 0.05);
  };

  return (
    <footer className="relative w-full bg-[#050507] text-white pt-24 pb-12 border-t border-white/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/20 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rotate-45 border-2 border-[#C2410C]" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display font-bold text-lg tracking-[0.25em] text-white">
                    HEADPHONE ZONE
                  </span>
                  <span className="font-mono-tech text-[9px] tracking-[0.28em] text-[#C2410C] uppercase">
                    AETHERIS ACOUSTIC LABS
                  </span>
                </div>
              </div>
              <p className="text-xs md:text-sm text-neutral-400 max-w-sm leading-relaxed font-light">
                Reference electrostatic and hybrid in-ear monitors curated by Headphone Zone. Handcrafted in Switzerland, tuned for passionate audiophiles across the world.
              </p>
            </div>

            <div className="mt-8 font-mono-tech text-[10px] text-neutral-500 uppercase tracking-widest">
              ACOUSTIQUE LABS // GENÈVE • CH // MUMBAI HQ
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="font-mono-tech text-xs text-[#C2410C] uppercase tracking-widest mb-2">
              Exploration
            </span>
            <a href="#hero" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Aetheris X-1 Monarch
            </a>
            <a href="#deconstruction" className="text-xs text-neutral-400 hover:text-white transition-colors">
              3D Deconstruction
            </a>
            <a href="#engineering" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Acoustic Physics
            </a>
            <a href="#reassembly" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Reassembly
            </a>
            <a href="#product-showcase" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Product Showcase
            </a>
            <a href="#philosophy" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Artisan Philosophy
            </a>
            <a href="#careers" className="text-xs text-[#EA580C] hover:text-white transition-colors font-semibold flex items-center gap-1">
              <span>Careers (We're Hiring!)</span>
            </a>
          </div>

          {/* Technical Specs */}
          <div className="md:col-span-2 flex flex-col gap-3">
            <span className="font-mono-tech text-xs text-electric-blue uppercase tracking-widest mb-2">
              Technology
            </span>
            <span className="text-xs text-neutral-400">Pure Beryllium Vapor</span>
            <span className="text-xs text-neutral-400">Quad Balanced Armatures</span>
            <span className="text-xs text-neutral-400">Electrostatic Tweeters</span>
            <span className="text-xs text-neutral-400">4-Way Linear Crossover</span>
            <span className="text-xs text-neutral-400">Grade 5 Titanium CNC</span>
          </div>

          {/* Newsletter / Bespoke Auditions */}
          <div className="md:col-span-3 flex flex-col gap-3">
            <span className="font-mono-tech text-xs text-electric-blue uppercase tracking-widest mb-2">
              Acoustic Dispatch
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Receive limited production release notices and private audition invitations.
            </p>
            <div className="flex gap-2 mt-2">
              <input
                type="email"
                placeholder="audiophile@domain.com"
                className="w-full px-3 py-2 text-xs rounded-lg bg-white/[0.04] border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-electric-blue font-mono-tech"
              />
              <button
                onClick={() => audioEngine.playHapticBlip(1200, 0.04, 0.05)}
                className="px-3.5 py-2 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono-tech text-neutral-500 gap-4">
          <div className="flex items-center gap-6">
            <span>© 2026 AETHERIS ACOUSTIC LABS. ALL RIGHTS RESERVED.</span>
            <span>CINEMATIC AWWWARDS EXPERIENCE</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 hover:text-white transition-colors group cursor-pointer"
          >
            <span>BACK TO TOP</span>
            <div className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center group-hover:border-electric-blue transition-colors">
              <ArrowUp className="w-3.5 h-3.5 text-neutral-400 group-hover:text-electric-blue transition-colors" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
