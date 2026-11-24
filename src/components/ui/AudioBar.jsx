import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Radio, Sparkles, Activity, Music } from 'lucide-react';
import { audioEngine } from '../../utils/audio';

export default function AudioBar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeMode, setActiveMode] = useState('harmonic'); // 'harmonic' | 'subbass' | 'sweep'

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe((active) => {
      setIsPlaying(active);
    });

    const handleKeyDown = (e) => {
      // Toggle sound on 'M' key
      if (e.key === 'm' || e.key === 'M') {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          handleToggleAudio();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      unsubscribe();
    };
  }, []);

  const handleToggleAudio = () => {
    audioEngine.toggleMute();
  };

  const handlePlaySweep = () => {
    audioEngine.playFrequencySweep(3.5);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3">
      {/* Main Glassmorphism Audio Pill */}
      <div className="glass-panel px-4 py-2.5 rounded-full border border-white/15 flex items-center gap-3 shadow-[0_10px_35px_rgba(0,0,0,0.7)] backdrop-blur-xl">
        <button
          onClick={handleToggleAudio}
          className="flex items-center gap-2 text-xs font-mono-tech uppercase tracking-wider transition-colors hover:text-electric-blue"
          title="Press 'M' to mute / unmute audio"
        >
          {isPlaying ? (
            <>
              <Volume2 className="w-4 h-4 text-electric-blue animate-pulse" />
              <div className="flex gap-0.5 items-end h-3.5">
                <span className="w-0.5 h-3 bg-electric-blue animate-[bounce_0.8s_infinite_100ms]" />
                <span className="w-0.5 h-4 bg-electric-blue animate-[bounce_0.8s_infinite_250ms]" />
                <span className="w-0.5 h-2 bg-electric-blue animate-[bounce_0.8s_infinite_150ms]" />
                <span className="w-0.5 h-3.5 bg-electric-blue animate-[bounce_0.8s_infinite_300ms]" />
              </div>
              <span className="text-[11px] text-white font-semibold hidden sm:inline">Acoustic Engine</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-neutral-500" />
              <span className="text-[11px] text-neutral-400 font-normal">Sound Off</span>
            </>
          )}
        </button>

        <div className="h-3 w-[1px] bg-white/10 hidden sm:block" />

        {/* Quick frequency sweep test trigger */}
        <button
          onClick={handlePlaySweep}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[10px] font-mono-tech text-neutral-300 hover:text-white transition-all hover:border-electric-blue/40"
          title="Synthesize 20Hz - 14kHz audio frequency sweep"
        >
          <Activity className="w-3 h-3 text-electric-blue" />
          <span>Sweep Test</span>
        </button>

        {/* Keyboard shortcut hint */}
        <span className="text-[9px] font-mono-tech text-neutral-500 hidden md:inline border border-white/10 px-1.5 py-0.5 rounded">
          KEY [M]
        </span>
      </div>
    </div>
  );
}
