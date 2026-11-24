import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, CheckCircle2, ArrowDown } from 'lucide-react';
import ReassemblyCanvas from '../canvas/ReassemblyCanvas';
import { audioEngine } from '../../utils/audio';
import { useInView } from '../../hooks/useInView';

gsap.registerPlugin(ScrollTrigger);

export default function ReassemblySection() {
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const progressRef = useRef(0.2);

  // Direct DOM refs for zero-re-render telemetry
  const sealRef = useRef(null);
  const rotRef = useRef(null);

  // Viewport tracking: pause canvas rendering when off-screen
  const [inViewRef, isInView] = useInView({ threshold: 0.01, rootMargin: '200px 0px' });

  useEffect(() => {
    const triggerEl = triggerRef.current;
    if (!triggerEl) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 0.35,
        onUpdate: (self) => {
          progressRef.current = self.progress;

          // Zero-re-render DOM updates
          if (sealRef.current) {
            sealRef.current.textContent = `ACOUSTIC SEAL: ${
              self.progress > 0.8 ? '100% COMPLETE' : `${Math.round(self.progress * 100)}% ENGAGED`
            }`;
          }
          if (rotRef.current) {
            rotRef.current.textContent = `ROTATION: ${Math.round((1 - self.progress) * 360)}°`;
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="reassembly"
      ref={(el) => {
        containerRef.current = el;
        inViewRef.current = el;
      }}
      className="relative w-full bg-[#080808] text-white"
    >
      <div
        ref={triggerRef}
        className="relative w-full h-screen overflow-hidden flex flex-col justify-between items-center"
      >
        {/* Background Atmospheric Glow */}
        <div className="absolute inset-0 bg-radial-radial from-[#151922]/50 via-[#080808]/90 to-[#080808] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-electric-blue/10 rounded-full blur-[140px] pointer-events-none" />

        {/* 3D Reassembly Canvas */}
        <ReassemblyCanvas progressRef={progressRef} fallbackProgress={0.2} isInView={isInView} />

        {/* Top Header Badge */}
        <div className="relative z-10 pt-24 px-6 text-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-panel-subtle mb-4">
            <Sparkles className="w-3.5 h-3.5 text-electric-blue" />
            <span className="font-mono-tech text-[10px] tracking-[0.3em] uppercase text-neutral-300">
              RECONVERGENCE & REVELATION
            </span>
          </div>

          <h2 className="font-display font-extrabold text-4xl sm:text-6xl md:text-8xl tracking-tight text-gradient-silver">
            EVERY DETAIL MATTERS.
          </h2>

          <p className="max-w-xl mx-auto mt-4 text-sm sm:text-base md:text-lg text-neutral-400 font-light leading-relaxed">
            As the acoustic pathways unite, microscopic tolerances snap into place. Resonance is harnessed. Purity is born.
          </p>
        </div>

        {/* Bottom Status Telemetry & Callout */}
        <div className="relative z-10 pb-12 px-6 flex flex-col items-center gap-4 pointer-events-auto">
          <div className="glass-panel px-6 py-3 rounded-full border border-white/10 flex items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-electric-blue" />
              <span ref={sealRef} className="font-mono-tech text-xs text-white uppercase tracking-wider">
                ACOUSTIC SEAL: 20% ENGAGED
              </span>
            </div>
            <div className="h-4 w-[1px] bg-white/20" />
            <span ref={rotRef} className="font-mono-tech text-xs text-neutral-400">
              ROTATION: 288°
            </span>
          </div>

          <a
            href="#product-showcase"
            onClick={() => audioEngine.playFrequencyTone(1400, 0.4)}
            className="flex items-center gap-2 font-mono-tech text-[11px] text-neutral-500 hover:text-electric-blue uppercase tracking-widest transition-colors mt-2"
          >
            <span>Proceed to Product Showcase</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
