/* ==========================================================================
   Brain Fog Recovery App (v1.1.1 - VG) — Audio Synthesizer & Soundscapes
   Includes: Harmonic Bells, 528Hz Gratitude Resonance, Gaze Horizon Wave, 
   Brown Noise, Soft Rain, and 432Hz Theta Drone
   ========================================================================== */

export class AudioSynthEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambientSource = null;
    this.ambientGain = null;
    this.currentAmbientType = null;
    this.horizonSource = null;
    this.horizonGain = null;
    this.soundEnabled = true;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.soundEnabled = !muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.soundEnabled ? 0.7 : 0, this.ctx.currentTime, 0.1);
    }
  }

  // --- Harmonic Calming Bell ---
  playBell(freq = 432, duration = 2.5) {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Bell tone error:', e);
    }
  }

  // --- 528Hz Gratitude Resonance (Warm, Layered Harmonic Chime) ---
  play528Tone() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      
      // Dual harmonic oscillator for rich golden chime
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(528, now); // 528Hz Restoration Frequency
      
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1056, now); // 1st Harmonic overtone

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 3.5);
      osc2.stop(now + 3.5);
    } catch (e) {
      console.warn('528Hz Tone error:', e);
    }
  }

  // --- Horizon Acoustic Wave for Gaze Shift (Step 2) ---
  startHorizonTone() {
    if (!this.soundEnabled) return;
    this.init();
    if (!this.ctx) return;

    this.stopHorizonTone();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(136.1, now); // 136.1Hz Earth frequency

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      this.horizonSource = osc;
      this.horizonGain = gain;
    } catch (e) {
      console.warn('Horizon tone error:', e);
    }
  }

  stopHorizonTone() {
    if (this.horizonSource && this.ctx) {
      try {
        if (this.horizonGain) {
          this.horizonGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        }
        this.horizonSource.stop(this.ctx.currentTime);
        this.horizonSource.disconnect();
      } catch (e) {}
      this.horizonSource = null;
      this.horizonGain = null;
    }
  }

  // --- Atomic Stop for Ambient Audio (Prevents Overlap) ---
  stopAmbient() {
    if (this.ambientSource && this.ctx) {
      try {
        if (this.ambientGain) {
          this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        }
        if (typeof this.ambientSource.stop === 'function') {
          this.ambientSource.stop(this.ctx.currentTime);
        }
        if (typeof this.ambientSource.disconnect === 'function') {
          this.ambientSource.disconnect();
        }
      } catch (e) {
        console.warn('Error during ambient teardown:', e);
      }
      this.ambientSource = null;
      this.ambientGain = null;
    }
    this.currentAmbientType = null;
  }

  // --- Generative Ambient Focus Soundscapes ---
  startAmbient(type = 'brown_noise') {
    if (!this.soundEnabled || type === 'none') {
      this.stopAmbient();
      return;
    }
    this.init();
    if (!this.ctx) return;

    this.stopAmbient();
    this.currentAmbientType = type;

    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    if (type === 'brown_noise') {
      let lastOutL = 0.0;
      let lastOutR = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;
        lastOutL = (lastOutL + (0.02 * whiteL)) / 1.02;
        lastOutR = (lastOutR + (0.02 * whiteR)) / 1.02;
        left[i] = lastOutL * 3.0;
        right[i] = lastOutR * 3.0;
      }
    } else if (type === 'soft_rain') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        left[i] = pink * 0.09;
        right[i] = pink * 0.09 * (0.96 + Math.random() * 0.08);
      }
    } else if (type === 'theta_drone') {
      const now = this.ctx.currentTime;
      const oscL = this.ctx.createOscillator();
      const oscR = this.ctx.createOscillator();
      const merger = this.ctx.createChannelMerger(2);

      oscL.type = 'sine';
      oscL.frequency.setValueAtTime(216, now);
      oscR.type = 'sine';
      oscR.frequency.setValueAtTime(222, now);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.06, now + 1.5);

      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(this.ambientGain);
      this.ambientGain.connect(this.masterGain);

      oscL.start(now);
      oscR.start(now);
      this.ambientSource = {
        stop: () => {
          try {
            oscL.stop();
            oscR.stop();
            oscL.disconnect();
            oscR.disconnect();
          } catch (e) {}
        },
      };
      return;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(type === 'brown_noise' ? 420 : 800, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1.2);

    noiseSource.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    noiseSource.start();
    this.ambientSource = noiseSource;
  }
}
