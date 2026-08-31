/* ==========================================================================
   Brain Fog Recovery App (v1) — Guided Breathing Engine
   Physiological Reset: 4s Inhale, 2s Hold, 6s Exhale (Parasympathetic activation)
   Zero external audio dependencies (uses Web Audio API synthesizer)
   ========================================================================== */

export class BreathingEngine {
  constructor(options = {}) {
    this.totalDuration = options.duration || 60; // seconds
    this.remainingSeconds = this.totalDuration;
    this.onTick = options.onTick || (() => {});
    this.onPhaseChange = options.onPhaseChange || (() => {});
    this.onComplete = options.onComplete || (() => {});

    // 4-2-6 Pacing Pattern (Seconds)
    this.pattern = [
      { name: 'inhale', text: 'Inhale Deeply', duration: 4 },
      { name: 'hold', text: 'Hold Gently', duration: 2 },
      { name: 'exhale', text: 'Exhale Slowly', duration: 6 },
    ];
    this.cycleDuration = this.pattern.reduce((acc, p) => acc + p.duration, 0); // 12s

    this.timerInterval = null;
    this.phaseTimeout = null;
    this.isRunning = false;
    this.soundEnabled = true;
    this.audioCtx = null;
  }

  initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playSoftTone(frequency = 392, type = 'sine', duration = 1.2) {
    if (!this.soundEnabled) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      // Gentle attack and exponential decay for soothing resonance
      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, this.audioCtx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio feedback unavailable', e);
    }
  }

  setSoundEnabled(enabled) {
    this.soundEnabled = enabled;
  }

  setDuration(duration) {
    this.totalDuration = duration;
    this.remainingSeconds = duration;
  }

  start() {
    this.stop();
    this.initAudio();
    this.remainingSeconds = this.totalDuration;
    this.isRunning = true;

    this.onTick(this.remainingSeconds, this.totalDuration, 0);
    this.runPhaseSequence(0);

    this.timerInterval = setInterval(() => {
      this.remainingSeconds -= 1;
      const progress = 1 - (this.remainingSeconds / this.totalDuration);
      this.onTick(this.remainingSeconds, this.totalDuration, Math.min(1, Math.max(0, progress)));

      if (this.remainingSeconds <= 0) {
        this.complete();
      }
    }, 1000);
  }

  runPhaseSequence(patternIndex = 0) {
    if (!this.isRunning) return;

    const currentPhase = this.pattern[patternIndex];
    
    // Play subtle auditory cue per phase
    if (currentPhase.name === 'inhale') {
      this.playSoftTone(329.63, 'sine', 1.5); // E4 tone
    } else if (currentPhase.name === 'hold') {
      this.playSoftTone(392.00, 'sine', 0.8); // G4 tone
    } else if (currentPhase.name === 'exhale') {
      this.playSoftTone(261.63, 'sine', 2.0); // C4 grounding tone
    }

    this.onPhaseChange(currentPhase.name, currentPhase.text, currentPhase.duration);

    this.phaseTimeout = setTimeout(() => {
      if (!this.isRunning) return;
      const nextIndex = (patternIndex + 1) % this.pattern.length;
      this.runPhaseSequence(nextIndex);
    }, currentPhase.duration * 1000);
  }

  stop() {
    this.isRunning = false;
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.phaseTimeout) {
      clearTimeout(this.phaseTimeout);
      this.phaseTimeout = null;
    }
  }

  complete() {
    this.stop();
    // Play warm closing chime
    this.playSoftTone(523.25, 'sine', 2.5); // C5 harmonic
    this.onComplete();
  }
}
