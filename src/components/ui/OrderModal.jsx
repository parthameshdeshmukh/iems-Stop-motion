import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { audioEngine } from '../../utils/audio';

export default function OrderModal({ isOpen, onClose }) {
  const [step, setStep] = useState('config'); // 'config' | 'confirmed'
  const [finish, setFinish] = useState('silver');
  const [cablePlug, setCablePlug] = useState('4.4mm');
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleConfirm = (e) => {
    e.preventDefault();
    audioEngine.playFrequencyTone(1400, 0.5);
    setStep('confirmed');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-electric-blue/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => {
            audioEngine.playHapticBlip(700, 0.03, 0.04);
            onClose();
          }}
          className="absolute top-6 right-6 p-2 rounded-full border border-white/10 text-neutral-400 hover:text-white hover:border-white/30 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {step === 'config' ? (
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel-subtle mb-3">
              <Sparkles className="w-3.5 h-3.5 text-electric-blue" />
              <span className="font-mono-tech text-[10px] tracking-widest uppercase text-neutral-300">
                LIMITED ARTISAN BATCH // 500 UNITS
              </span>
            </div>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Reserve Aetheris X-1
            </h3>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 leading-relaxed">
              Configure your bespoke in-ear monitor. Each order includes a serialized solid aluminum presentation vault.
            </p>

            <form onSubmit={handleConfirm} className="mt-6 flex flex-col gap-5">
              {/* Finish Selection */}
              <div>
                <label className="font-mono-tech text-xs text-neutral-400 uppercase tracking-wider block mb-2">
                  Select Titanium Finish:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'silver', label: 'Raw Titanium' },
                    { id: 'obsidian', label: 'Obsidian DLC' },
                    { id: 'cobalt', label: 'Cobalt Chrome' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFinish(f.id);
                        audioEngine.playHapticBlip(1000, 0.03, 0.04);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono-tech transition-all ${
                        finish === f.id
                          ? 'border-electric-blue bg-electric-blue/15 text-white font-bold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                          : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cable Termination */}
              <div>
                <label className="font-mono-tech text-xs text-neutral-400 uppercase tracking-wider block mb-2">
                  Modular Cable Jack:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '4.4mm', label: '4.4mm Balanced Pentaconn' },
                    { id: '3.5mm', label: '3.5mm Single-Ended Reference' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setCablePlug(c.id);
                        audioEngine.playHapticBlip(950, 0.03, 0.04);
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-mono-tech transition-all ${
                        cablePlug === c.id
                          ? 'border-electric-blue bg-electric-blue/15 text-white font-bold'
                          : 'border-white/10 bg-white/[0.02] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Email */}
              <div>
                <label className="font-mono-tech text-xs text-neutral-400 uppercase tracking-wider block mb-2">
                  Contact Email for Order Allocation:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="soundmaster@domain.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-white placeholder-neutral-600 focus:outline-none focus:border-electric-blue font-mono-tech text-xs"
                />
              </div>

              {/* Summary Bar */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-mono-tech text-[10px] text-neutral-500 uppercase block">
                    TOTAL ALLOCATION
                  </span>
                  <span className="font-display font-bold text-xl text-white">$1,499 USD</span>
                </div>
                <button
                  type="submit"
                  className="py-3 px-6 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                  <span>Confirm Allocation</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="py-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-electric-blue/10 border border-electric-blue flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,240,255,0.4)]">
              <CheckCircle className="w-8 h-8 text-electric-blue animate-pulse" />
            </div>
            <h3 className="font-display font-bold text-3xl text-white">
              Reservation Confirmed
            </h3>
            <p className="font-mono-tech text-xs text-electric-blue mt-2">
              ALLOCATION NUMBER: #AETH-2026-X1-084
            </p>
            <p className="text-sm text-neutral-300 max-w-sm mt-4 leading-relaxed font-light">
              Your pair has been assigned to the Geneva Master Acoustic bench. A concierge email has been dispatched to <span className="text-white font-medium">{email || 'your email'}</span>.
            </p>
            <button
              onClick={() => {
                setStep('config');
                onClose();
              }}
              className="mt-8 py-3 px-8 rounded-full border border-white/20 text-xs font-mono-tech uppercase tracking-widest hover:border-white transition-colors"
            >
              Return to Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
