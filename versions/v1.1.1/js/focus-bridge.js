/* ==========================================================================
   Brain Fog Recovery App (v1.1.1) — 5-Minute Focus Bridge
   Prevents immediate relapse by providing a gentle, audio-grounded
   momentum container for the delivered micro-action
   ========================================================================== */

export class FocusBridgeTimer {
  constructor(options = {}) {
    this.totalDuration = options.duration || 300; // 5 minutes (300s)
    this.remaining = this.totalDuration;
    this.audioSynth = options.audioSynth;
    this.onTick = options.onTick || (() => {});
    this.onComplete = options.onComplete || (() => {});

    this.timer = null;
    this.isRunning = false;
    this.currentSound = 'brown_noise';
  }

  setSound(soundType) {
    this.currentSound = soundType;
    if (this.isRunning && this.audioSynth) {
      this.audioSynth.startAmbient(soundType);
    }
  }

  start() {
    this.stop();
    this.isRunning = true;
    if (this.audioSynth && this.currentSound !== 'none') {
      this.audioSynth.startAmbient(this.currentSound);
    }

    this.onTick(this.remaining, this.totalDuration);

    this.timer = setInterval(() => {
      this.remaining -= 1;
      this.onTick(this.remaining, this.totalDuration);

      if (this.remaining <= 0) {
        this.complete();
      }
    }, 1000);
  }

  pause() {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.audioSynth) {
      this.audioSynth.stopAmbient();
    }
  }

  stop() {
    this.pause();
    this.remaining = this.totalDuration;
  }

  complete() {
    this.stop();
    if (this.audioSynth) {
      this.audioSynth.playBell(523.25, 3.0);
    }
    this.onComplete();
  }
}
