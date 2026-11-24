import React from 'react';
import { ShieldAlert, Sparkles } from 'lucide-react';

export default function WebGLFallback({ title = "AETHERIS X-1 MONARCH" }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#08080a] rounded-3xl border border-white/10 relative overflow-hidden">
      <div className="w-48 h-48 rounded-full bg-radial-radial from-electric-blue/10 to-transparent blur-2xl absolute pointer-events-none" />
      
      {/* Fallback Graphic */}
      <div className="relative z-10 w-36 h-36 rounded-2xl bg-white/[0.03] border border-white/15 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        <div className="w-20 h-20 rounded-full border-2 border-dashed border-electric-blue/40 flex items-center justify-center animate-spin-slow">
          <div className="w-12 h-12 rotate-45 border-2 border-white" />
        </div>
      </div>

      <span className="font-mono-tech text-[10px] text-electric-blue uppercase tracking-widest mb-1">
        HIGH-PRECISION HARDWARE VIEW
      </span>
      <h3 className="font-display font-bold text-xl text-white mb-2">{title}</h3>
      <p className="text-xs text-neutral-400 max-w-xs font-light">
        Hardware-accelerated WebGL unavailable in current render pipeline. Standard acoustic telemetry active.
      </p>
    </div>
  );
}
