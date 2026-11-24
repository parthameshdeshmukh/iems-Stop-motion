// Web Audio API synthesizer for interactive luxury audio feedback
// No external assets required - pure mathematical acoustic synthesis

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.ambientGain = null;
    this.oscillator = null;
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    listener(!this.isMuted);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    const active = !this.isMuted;
    this.listeners.forEach(l => {
      try { l(active); } catch (e) {}
    });
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.init();
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playHapticBlip(880, 0.05, 0.1);
      this.startSubtleAtmosphere();
    } else {
      this.stopSubtleAtmosphere();
    }
    this.notify();
    return !this.isMuted;
  }

  startSubtleAtmosphere() {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.oscillator) {
        this.stopSubtleAtmosphere();
      }
      // Low drone for atmospheric depth (55Hz sub-bass A1 + filtered harmonic)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, this.ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      this.oscillator = osc;
      this.ambientGain = gain;
    } catch (e) {
      console.warn('Atmosphere audio error', e);
    }
  }

  stopSubtleAtmosphere() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          if (this.oscillator) {
            this.oscillator.stop();
            this.oscillator.disconnect();
            this.oscillator = null;
          }
        }, 900);
      } catch (e) {}
    }
  }

  playHapticBlip(freq = 600, duration = 0.04, vol = 0.08) {
    if (this.isMuted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  playExplosionWhoosh() {
    if (this.isMuted || !this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.3);
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch (e) {}
  }

  playFrequencyTone(freq = 1000, duration = 1.2) {
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  // Smooth acoustic frequency sweep across 20Hz - 16,000Hz
  playFrequencySweep(duration = 3.0) {
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(25, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(14000, this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime + duration - 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  // Specialized rich acoustic synthesizer for the Soundstage Stethoscope
  playStethoscopeProbe(type) {
    this.init();
    try {
      if (!this.ctx) return;
      if (type === 'sub_bass') {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(45, this.ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(90, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(this.ctx.currentTime + 1.2);
        osc2.stop(this.ctx.currentTime + 1.2);
      } else if (type === 'midrange') {
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(1000, this.ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(2000, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.0);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(this.ctx.currentTime + 1.0);
        osc2.stop(this.ctx.currentTime + 1.0);
      } else if (type === 'air' || type === 'treble') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(11500, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(12500, this.ctx.currentTime + 0.8);

        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.9);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.9);
      } else if (type === 'crossover') {
        this.playFrequencySweep(2.2);
      }
    } catch (e) {}
  }

  // Specialized acoustic tones for each driver component
  playComponentSound(type) {
    this.init();
    if (this.isMuted || !this.ctx) return;
    try {
      if (type === 'dynamic_driver') {
        // Deep sub-bass 45Hz thud
        this.playHapticBlip(55, 0.18, 0.12);
      } else if (type === 'mid_ba') {
        // Lush vocal midrange 880Hz tone
        this.playHapticBlip(880, 0.08, 0.07);
      } else if (type === 'high_ba') {
        // Crystalline 4500Hz harmonic chime
        this.playHapticBlip(4200, 0.06, 0.05);
      } else if (type === 'crossover') {
        // Electronic high-frequency dual blip
        this.playHapticBlip(1800, 0.03, 0.06);
        setTimeout(() => this.playHapticBlip(2400, 0.03, 0.06), 40);
      } else {
        this.playHapticBlip(1100, 0.03, 0.05);
      }
    } catch (e) {}
  }
}

export const audioEngine = new AudioEngine();
