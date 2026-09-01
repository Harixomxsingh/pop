/* ==========================================================================
   Brain Fog Recovery App (v1.1.1 - VG) — Tiered Breathing Engine
   Default: Stanford Cyclic Physiological Sigh (Cell Reports Medicine, 2023)
   ========================================================================== */

export const BREATHING_MODES = {
  PHYSIOLOGICAL_SIGH: {
    id: 'sigh',
    title: 'Physiological Sigh',
    tag: '★ Scientifically Proven #1 Reset',
    citation: 'Stanford Medicine • Cell Reports (2023)',
    desc: 'Double-inhale through nose + long exhale to rapidly deflate autonomic arousal',
    pattern: [
      { name: 'inhale', text: '1. Inhale Deeply (Nose)', duration: 3, bellFreq: 330 },
      { name: 'inhale-top', text: '2. Sharp Top-Up Inhale', duration: 1.2, bellFreq: 392 },
      { name: 'exhale', text: '3. Long Exhale (Mouth)', duration: 6, bellFreq: 261 },
    ],
  },
  BOX_BREATHING: {
    id: 'box',
    title: 'Box Breathing',
    tag: 'Steadiness & Focus',
    citation: 'Autonomic Equalization Protocol',
    desc: 'Equal 4-4-4-4 pacing for mental steadiness and sustained focus',
    pattern: [
      { name: 'inhale', text: 'Inhale Slowly', duration: 4, bellFreq: 330 },
      { name: 'hold', text: 'Hold Full', duration: 4, bellFreq: 392 },
      { name: 'exhale', text: 'Exhale Smoothly', duration: 4, bellFreq: 261 },
      { name: 'hold-empty', text: 'Hold Empty', duration: 4, bellFreq: 220 },
    ],
  },
  RESTORE_478: {
    id: 'restore',
    title: '4-7-8 Restore',
    tag: 'Deep Grounding',
    citation: 'Parasympathetic Descent',
    desc: 'Slow descent for heavy sensory overstimulation',
    pattern: [
      { name: 'inhale', text: 'Inhale Deeply', duration: 4, bellFreq: 330 },
      { name: 'hold', text: 'Hold in Stillness', duration: 7, bellFreq: 392 },
      { name: 'exhale', text: 'Long Gentle Exhale', duration: 8, bellFreq: 261 },
    ],
  },
};

export class AdaptiveBreathingEngine {
  constructor(options = {}) {
    this.totalDuration = options.duration || 90; // Default: 90s
    this.remainingSeconds = this.totalDuration;
    this.audioSynth = options.audioSynth;
    this.onTick = options.onTick || (() => {});
    this.onPhaseChange = options.onPhaseChange || (() => {});
    this.onComplete = options.onComplete || (() => {});

    this.currentMode = BREATHING_MODES.PHYSIOLOGICAL_SIGH;
    this.timerInterval = null;
    this.phaseTimeout = null;
    this.isRunning = false;
  }

  setMode(modeKey) {
    if (BREATHING_MODES[modeKey]) {
      this.currentMode = BREATHING_MODES[modeKey];
    }
  }

  setDuration(seconds) {
    this.totalDuration = seconds;
    this.remainingSeconds = seconds;
  }

  start() {
    this.stop();
    this.remainingSeconds = this.totalDuration;
    this.isRunning = true;

    this.onTick(this.remainingSeconds, this.totalDuration, 0);
    this.runPhase(0);

    this.timerInterval = setInterval(() => {
      this.remainingSeconds -= 1;
      const progress = 1 - (this.remainingSeconds / this.totalDuration);
      this.onTick(this.remainingSeconds, this.totalDuration, Math.min(1, Math.max(0, progress)));

      if (this.remainingSeconds <= 0) {
        this.complete();
      }
    }, 1000);
  }

  runPhase(patternIndex = 0) {
    if (!this.isRunning) return;

    const pattern = this.currentMode.pattern;
    const phase = pattern[patternIndex];

    if (this.audioSynth) {
      this.audioSynth.playBell(phase.bellFreq || 330, phase.duration > 4 ? 2.5 : 1.2);
    }

    this.onPhaseChange(phase.name, phase.text, phase.duration);

    this.phaseTimeout = setTimeout(() => {
      if (!this.isRunning) return;
      const nextIndex = (patternIndex + 1) % pattern.length;
      this.runPhase(nextIndex);
    }, phase.duration * 1000);
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
    if (this.audioSynth) {
      this.audioSynth.playBell(523.25, 3.0); // Harmonic completion chime
    }
    this.onComplete();
  }
}
