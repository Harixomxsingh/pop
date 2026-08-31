/* ==========================================================================
   Brain Fog Recovery App (v1.1.1 - VG) — Master Application Orchestrator
   ========================================================================== */

import {
  RECOVERY_STAGES,
  AWARENESS_OPTIONS,
  CHUNKING_OPTIONS,
  DeepRecoveryStateMachine,
} from './state-machine.js';
import { AudioSynthEngine } from './audio-synth.js';
import { FogDissolverCanvas } from './fog-canvas.js';
import { AmbientParticleField } from './ambient-particles.js';
import { AdaptiveBreathingEngine } from './breathing-engine.js';
import { FocusBridgeTimer } from './focus-bridge.js';
import { LocalStore } from './storage.js';

class DeepRecoveryApp {
  constructor() {
    this.fsm = new DeepRecoveryStateMachine();
    this.audioSynth = new AudioSynthEngine();
    this.ambientParticles = null;
    this.fogCanvas = null;
    this.breathingEngine = null;
    this.focusTimer = null;
    this.gazeInterval = null;
    this.gazeSeconds = 45;

    this.dom = {};
    this.init();
  }

  init() {
    this.cacheDom();
    this.setupAudio();
    this.setupAmbientParticles();
    this.setupFogCanvas();
    this.setupBreathingEngine();
    this.setupFocusBridge();
    this.renderFeelingChips();
    this.renderChunkingOptions();
    this.bindEvents();
    this.registerServiceWorker();
    this.startNewSession();
  }

  cacheDom() {
    this.dom = {
      stepPips: document.querySelectorAll('.step-pip'),
      stageCards: document.querySelectorAll('.stage-card'),
      ambientCanvasElem: document.getElementById('ambient-canvas'),

      // Header
      btnSoundToggle: document.getElementById('btn-sound-toggle'),
      btnHistoryToggle: document.getElementById('btn-history-toggle'),
      btnResetApp: document.getElementById('btn-reset-app'),

      // Stage 1: Fog
      fogCanvasElem: document.getElementById('fog-canvas'),
      feelingChipsContainer: document.getElementById('feeling-chips'),
      canvasCue: document.getElementById('canvas-cue'),
      btnProceedFromFog: document.getElementById('btn-proceed-from-fog'),

      // Stage 2: Gaze
      gazeTimerText: document.getElementById('gaze-timer-text'),
      btnSkipGaze: document.getElementById('btn-skip-gaze'),

      // Stage 3: Breathing
      modePills: document.querySelectorAll('.mode-pill'),
      durationPills: document.querySelectorAll('.duration-pill'),
      breathingOrb: document.getElementById('breathing-orb'),
      breathingAura: document.getElementById('breathing-aura'),
      breathingPhaseText: document.getElementById('breathing-phase-text'),
      breathingPhaseTimer: document.getElementById('breathing-phase-timer'),
      breathingProgressFill: document.getElementById('breathing-progress-fill'),
      btnSkipBreathing: document.getElementById('btn-skip-breathing'),

      // Stage 4: Chunking
      chunkingList: document.getElementById('chunking-options'),

      // Stage 5: Specificity
      actionBadge: document.getElementById('action-badge'),
      btnShuffleAction: document.getElementById('btn-shuffle-action'),
      actionTitle: document.getElementById('action-title'),
      actionTip: document.getElementById('action-tip'),
      btnStartFocusBridge: document.getElementById('btn-start-focus-bridge'),

      // Stage 6: Focus Bridge
      focusTimeDisplay: document.getElementById('focus-time-display'),
      focusTaskInstruction: document.getElementById('focus-task-instruction'),
      soundBtns: document.querySelectorAll('.sound-btn'),
      btnPauseFocus: document.getElementById('btn-pause-focus'),
      btnCompleteFocus: document.getElementById('btn-complete-focus'),

      // Stage 7: Positivity Gateway
      truthIcon: document.getElementById('truth-icon'),
      btnShuffleTruth: document.getElementById('btn-shuffle-truth'),
      positiveTruthText: document.getElementById('positive-truth-text'),
      positiveMantraTag: document.getElementById('positive-mantra-tag'),
      btnGratitudeBreath: document.getElementById('btn-gratitude-breath'),
      gratitudeBtnText: document.getElementById('gratitude-btn-text'),
      sessionSummaryPill: document.getElementById('session-summary-pill'),
      btnFinalFinish: document.getElementById('btn-final-finish'),

      // History Modal
      historyModal: document.getElementById('history-modal'),
      btnCloseHistory: document.getElementById('btn-close-history'),
      statTotalResets: document.getElementById('stat-total-resets'),
      statDayStreak: document.getElementById('stat-day-streak'),
      historyList: document.getElementById('history-list'),
    };
  }

  setupAudio() {
    const stats = LocalStore.getStats();
    this.audioSynth.setMuted(!stats.soundEnabled);
    this.updateSoundIcon(stats.soundEnabled);
  }

  setupAmbientParticles() {
    if (this.dom.ambientCanvasElem) {
      this.ambientParticles = new AmbientParticleField(this.dom.ambientCanvasElem);
    }
  }

  setupFogCanvas() {
    if (!this.dom.fogCanvasElem) return;
    this.fogCanvas = new FogDissolverCanvas(
      this.dom.fogCanvasElem,
      (progress) => {
        if (this.dom.canvasCue) {
          const percent = Math.round(progress * 100);
          this.dom.canvasCue.textContent = `Clearing noise: ${percent}%`;
        }
      },
      () => {
        if (this.dom.canvasCue) {
          this.dom.canvasCue.textContent = '✨ Attention cleared!';
        }
        this.audioSynth.playBell(432, 2.0);
        if (this.dom.btnProceedFromFog) {
          this.dom.btnProceedFromFog.style.display = 'flex';
        }
      }
    );
  }

  setupBreathingEngine() {
    const stats = LocalStore.getStats();
    this.breathingEngine = new AdaptiveBreathingEngine({
      duration: stats.defaultBreathingDuration || 90,
      audioSynth: this.audioSynth,
      onTick: (rem, total, prog) => {
        if (this.dom.breathingPhaseTimer) {
          const m = Math.floor(rem / 60);
          const s = rem % 60;
          this.dom.breathingPhaseTimer.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        }
        if (this.dom.breathingProgressFill) {
          this.dom.breathingProgressFill.style.width = `${(prog * 100).toFixed(1)}%`;
        }
      },
      onPhaseChange: (phaseClass, phaseText) => {
        if (this.dom.breathingPhaseText) this.dom.breathingPhaseText.textContent = phaseText;
        if (this.dom.breathingOrb) this.dom.breathingOrb.className = `breathing-orb ${phaseClass}`;
        if (this.dom.breathingAura) this.dom.breathingAura.className = `breathing-aura ${phaseClass}`;

        if (this.ambientParticles) {
          this.ambientParticles.setBreathingPhase(phaseClass);
        }
      },
      onComplete: () => {
        if (this.ambientParticles) {
          this.ambientParticles.setBreathingPhase('idle');
        }
        this.fsm.completeBreathing();
        this.transitionToStage(RECOVERY_STAGES.CHUNKING);
      },
    });

    this.breathingEngine.setMode(stats.defaultBreathingMode || 'sigh');
  }

  setupFocusBridge() {
    const stats = LocalStore.getStats();
    this.focusTimer = new FocusBridgeTimer({
      duration: 300,
      audioSynth: this.audioSynth,
      onTick: (rem) => {
        if (this.dom.focusTimeDisplay) {
          const m = Math.floor(rem / 60);
          const s = rem % 60;
          this.dom.focusTimeDisplay.textContent = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
      },
      onComplete: () => {
        if (this.ambientParticles) {
          this.ambientParticles.setBreathingPhase('idle');
        }
        this.fsm.completeFocusBridge(true);
        this.renderGatewayStage();
        this.transitionToStage(RECOVERY_STAGES.GATEWAY);
      },
    });

    this.focusTimer.currentSound = stats.ambientSound || 'brown_noise';
  }

  renderFeelingChips() {
    if (!this.dom.feelingChipsContainer) return;
    this.dom.feelingChipsContainer.innerHTML = '';

    AWARENESS_OPTIONS.forEach((opt, idx) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = `feeling-chip ${idx === 0 ? 'selected' : ''}`;
      chip.innerHTML = `
        <span class="chip-icon">${opt.icon}</span>
        <span class="chip-label">${opt.label}</span>
      `;
      chip.addEventListener('click', () => {
        document.querySelectorAll('.feeling-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        this.fsm.setFeeling(opt.id);
        this.audioSynth.playBell(330, 0.8);
      });
      this.dom.feelingChipsContainer.appendChild(chip);
    });
  }

  renderChunkingOptions() {
    if (!this.dom.chunkingList) return;
    this.dom.chunkingList.innerHTML = '';

    CHUNKING_OPTIONS.forEach((opt) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn-row';
      btn.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
          <span style="font-size: 1.4rem; line-height: 1;">${opt.icon}</span>
          <div class="row-text">
            <div class="row-title">${opt.title}</div>
            <div class="row-subtitle">${opt.subtitle}</div>
          </div>
        </div>
        <span style="color: var(--accent-sage); font-weight: bold;">→</span>
      `;
      btn.addEventListener('click', () => {
        this.fsm.setContext(opt.id);
        this.renderSpecificityCard();
        this.transitionToStage(RECOVERY_STAGES.SPECIFICITY);
      });
      this.dom.chunkingList.appendChild(btn);
    });
  }

  renderSpecificityCard() {
    const action = this.fsm.session.action;
    if (!action) return;
    if (this.dom.actionBadge) this.dom.actionBadge.textContent = action.badge;
    if (this.dom.actionTitle) this.dom.actionTitle.textContent = action.instruction;
    if (this.dom.actionTip) this.dom.actionTip.textContent = action.tip;

    if (this.dom.focusTaskInstruction) {
      this.dom.focusTaskInstruction.textContent = action.instruction;
    }
  }

  async renderGatewayStage() {
    const session = this.fsm.session;
    LocalStore.recordSession(session);

    await this.updateTruthDisplay();

    // Reset gratitude button state
    if (this.dom.btnGratitudeBreath) {
      this.dom.btnGratitudeBreath.classList.remove('activated');
      if (this.dom.gratitudeBtnText) {
        this.dom.gratitudeBtnText.textContent = 'Take 1 Breath of Gratitude';
      }
    }

    const stats = LocalStore.getStats();
    if (this.dom.sessionSummaryPill) {
      this.dom.sessionSummaryPill.textContent = `✨ ${stats.todayCount} reset${stats.todayCount === 1 ? '' : 's'} today • ${stats.streak} day streak`;
    }
  }

  async updateTruthDisplay() {
    const truth = await this.fsm.getFreshTruth();
    if (!truth) return;
    if (this.dom.truthIcon) this.dom.truthIcon.textContent = truth.icon || '✨';
    if (this.dom.positiveTruthText) this.dom.positiveTruthText.textContent = `"${truth.truth}"`;
    if (this.dom.positiveMantraTag) {
      this.dom.positiveMantraTag.textContent = truth.author ? `${truth.author} • ${truth.category || 'Wisdom'}` : (truth.category || 'Wisdom');
    }
  }

  bindEvents() {
    // Stage 1 Proceed button
    if (this.dom.btnProceedFromFog) {
      this.dom.btnProceedFromFog.addEventListener('click', () => {
        this.transitionToStage(RECOVERY_STAGES.GAZE_REST);
        this.startGazeRest();
      });
    }

    // Stage 2 Gaze Skip
    if (this.dom.btnSkipGaze) {
      this.dom.btnSkipGaze.addEventListener('click', () => {
        this.stopGazeRest();
        this.fsm.completeGazeRest();
        this.transitionToStage(RECOVERY_STAGES.BREATHING);
        this.breathingEngine.start();
      });
    }

    // Stage 3 Breathing Modes & Controls
    this.dom.modePills.forEach((pill) => {
      pill.addEventListener('click', () => {
        this.dom.modePills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const mode = pill.dataset.mode;
        this.breathingEngine.setMode(mode);
        this.fsm.setBreathingConfig(mode, this.breathingEngine.totalDuration);
        LocalStore.updateSetting('defaultBreathingMode', mode);
        this.breathingEngine.start();
      });
    });

    this.dom.durationPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        this.dom.durationPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        const dur = parseInt(pill.dataset.duration, 10);
        this.breathingEngine.setDuration(dur);
        this.fsm.setBreathingConfig(this.breathingEngine.currentMode.id, dur);
        LocalStore.updateSetting('defaultBreathingDuration', dur);
        this.breathingEngine.start();
      });
    });

    if (this.dom.btnSkipBreathing) {
      this.dom.btnSkipBreathing.addEventListener('click', () => {
        this.breathingEngine.stop();
        if (this.ambientParticles) {
          this.ambientParticles.setBreathingPhase('idle');
        }
        this.fsm.completeBreathing();
        this.transitionToStage(RECOVERY_STAGES.CHUNKING);
      });
    }

    // Stage 5 Specificity -> Shuffle Action
    if (this.dom.btnShuffleAction) {
      this.dom.btnShuffleAction.addEventListener('click', () => {
        this.fsm.shuffleAction();
        this.renderSpecificityCard();
        this.audioSynth.playBell(392, 0.6);
      });
    }

    // Stage 5 Specificity -> Start Focus Bridge
    if (this.dom.btnStartFocusBridge) {
      this.dom.btnStartFocusBridge.addEventListener('click', () => {
        this.fsm.startFocusBridge();
        if (this.ambientParticles) {
          this.ambientParticles.setBreathingPhase('focus');
        }
        this.transitionToStage(RECOVERY_STAGES.FOCUS_BRIDGE);
        this.focusTimer.start();
      });
    }

    // Stage 6 Focus Bridge Controls
    this.dom.soundBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        this.dom.soundBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const sound = btn.dataset.sound;
        this.focusTimer.setSound(sound);
        LocalStore.updateSetting('ambientSound', sound);
      });
    });

    if (this.dom.btnPauseFocus) {
      this.dom.btnPauseFocus.addEventListener('click', () => {
        if (this.focusTimer.isRunning) {
          this.focusTimer.pause();
          this.dom.btnPauseFocus.textContent = 'Resume';
        } else {
          this.focusTimer.start();
          this.dom.btnPauseFocus.textContent = 'Pause';
        }
      });
    }

    if (this.dom.btnCompleteFocus) {
      this.dom.btnCompleteFocus.addEventListener('click', () => {
        if (this.ambientParticles) {
          this.ambientParticles.setBreathingPhase('idle');
        }
        this.focusTimer.complete();
      });
    }

    // Stage 7 Positivity Gateway: 1-Tap Gratitude & Shuffle Truth
    if (this.dom.btnShuffleTruth) {
      this.dom.btnShuffleTruth.addEventListener('click', async () => {
        await this.updateTruthDisplay();
        this.audioSynth.playBell(432, 0.8);
      });
    }

    if (this.dom.btnGratitudeBreath) {
      this.dom.btnGratitudeBreath.addEventListener('click', () => {
        this.audioSynth.play528Tone();
        this.dom.btnGratitudeBreath.classList.add('activated');
        if (this.dom.gratitudeBtnText) {
          this.dom.gratitudeBtnText.textContent = '✨ Gratitude Anchored';
        }
      });
    }

    // Stage 7 Final Finish & Launch
    if (this.dom.btnFinalFinish) {
      this.dom.btnFinalFinish.addEventListener('click', () => {
        this.startNewSession();
      });
    }

    // Global Header controls
    if (this.dom.btnSoundToggle) {
      this.dom.btnSoundToggle.addEventListener('click', () => {
        const stats = LocalStore.getStats();
        const newState = !stats.soundEnabled;
        this.audioSynth.setMuted(!newState);
        LocalStore.updateSetting('soundEnabled', newState);
        this.updateSoundIcon(newState);
      });
    }

    if (this.dom.btnResetApp) {
      this.dom.btnResetApp.addEventListener('click', () => {
        if (confirm('Start a fresh recovery chamber session?')) {
          this.stopGazeRest();
          this.breathingEngine.stop();
          this.focusTimer.stop();
          if (this.ambientParticles) {
            this.ambientParticles.setBreathingPhase('idle');
          }
          this.startNewSession();
        }
      });
    }

    if (this.dom.btnHistoryToggle) {
      this.dom.btnHistoryToggle.addEventListener('click', () => this.openHistory());
    }

    if (this.dom.btnCloseHistory) {
      this.dom.btnCloseHistory.addEventListener('click', () => this.closeHistory());
    }

    if (this.dom.historyModal) {
      this.dom.historyModal.addEventListener('click', (e) => {
        if (e.target === this.dom.historyModal) this.closeHistory();
      });
    }
  }

  startGazeRest() {
    this.stopGazeRest();
    this.gazeSeconds = 45;
    if (this.dom.gazeTimerText) this.dom.gazeTimerText.textContent = `${this.gazeSeconds}s`;

    this.audioSynth.playBell(261.63, 2.5);
    this.audioSynth.startHorizonTone();

    this.gazeInterval = setInterval(() => {
      this.gazeSeconds -= 1;
      if (this.dom.gazeTimerText) this.dom.gazeTimerText.textContent = `${this.gazeSeconds}s`;
      if (this.gazeSeconds <= 0) {
        this.stopGazeRest();
        this.audioSynth.playBell(523.25, 2.5);
        this.fsm.completeGazeRest();
        this.transitionToStage(RECOVERY_STAGES.BREATHING);
        this.breathingEngine.start();
      }
    }, 1000);
  }

  stopGazeRest() {
    if (this.gazeInterval) {
      clearInterval(this.gazeInterval);
      this.gazeInterval = null;
    }
    this.audioSynth.stopHorizonTone();
  }

  updateSoundIcon(enabled) {
    if (!this.dom.btnSoundToggle) return;
    this.dom.btnSoundToggle.innerHTML = enabled
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
    this.dom.btnSoundToggle.classList.toggle('active', enabled);
  }

  startNewSession() {
    this.stopGazeRest();
    this.breathingEngine.stop();
    this.focusTimer.stop();
    if (this.ambientParticles) {
      this.ambientParticles.setBreathingPhase('idle');
    }
    this.fsm.startSession();

    if (this.fogCanvas) {
      this.fogCanvas.createParticles();
      if (this.dom.canvasCue) this.dom.canvasCue.textContent = '👆 Drag finger across screen to sweep away noise';
      if (this.dom.btnProceedFromFog) this.dom.btnProceedFromFog.style.display = 'none';
    }

    this.transitionToStage(RECOVERY_STAGES.FOG_SWEEP);
  }

  transitionToStage(stageIndex) {
    this.dom.stepPips.forEach((pip, idx) => {
      pip.classList.remove('active', 'completed');
      if (idx === stageIndex) pip.classList.add('active');
      else if (idx < stageIndex) pip.classList.add('completed');
    });

    this.dom.stageCards.forEach((card, idx) => {
      if (idx === stageIndex) card.classList.add('current');
      else card.classList.remove('current');
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openHistory() {
    const stats = LocalStore.getStats();
    if (this.dom.statTotalResets) this.dom.statTotalResets.textContent = stats.totalSessions;
    if (this.dom.statDayStreak) this.dom.statDayStreak.textContent = `${stats.streak}d`;

    if (this.dom.historyList) {
      this.dom.historyList.innerHTML = '';
      if (stats.recentSessions.length === 0) {
        this.dom.historyList.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: var(--font-size-sm); padding: var(--space-md) 0;">No sessions logged yet.</p>`;
      } else {
        stats.recentSessions.forEach(s => {
          const row = document.createElement('div');
          row.className = 'history-item';
          const feelingStr = s.feeling ? s.feeling.toUpperCase() : 'RESET';
          row.innerHTML = `
            <div>
              <div style="font-weight: 600; color: var(--text-primary);">${feelingStr} Dissolved</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${s.context} • ${s.breathingMode || 'sigh'}</div>
            </div>
            <div style="font-size: 0.75rem; color: var(--accent-sage-light);">${s.dateFormatted}</div>
          `;
          this.dom.historyList.appendChild(row);
        });
      }
    }

    if (this.dom.historyModal) this.dom.historyModal.classList.add('open');
  }

  closeHistory() {
    if (this.dom.historyModal) this.dom.historyModal.classList.remove('open');
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(console.warn);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new DeepRecoveryApp();
});
