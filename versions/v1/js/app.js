/* ==========================================================================
   Brain Fog Recovery App (v1) — Main Application Controller
   ========================================================================== */

import {
  RECOVERY_STAGES,
  AWARENESS_OPTIONS,
  CHUNKING_OPTIONS,
  RecoveryStateMachine,
} from './state-machine.js';
import { BreathingEngine } from './breathing-engine.js';
import { LocalStore } from './storage.js';

class BrainFogApp {
  constructor() {
    this.fsm = new RecoveryStateMachine();
    this.breathingEngine = null;
    this.dom = {};
    this.soundEnabled = true;

    this.init();
  }

  init() {
    this.cacheDom();
    this.loadSettings();
    this.setupBreathingEngine();
    this.renderAwarenessOptions();
    this.renderChunkingOptions();
    this.bindEvents();
    this.registerServiceWorker();
    this.startNewSession();
  }

  cacheDom() {
    this.dom = {
      appShell: document.querySelector('.app-shell'),
      stageNodes: document.querySelectorAll('.step-node'),
      stageCards: document.querySelectorAll('.stage-card'),

      // Awareness
      awarenessGrid: document.getElementById('awareness-options'),

      // Breathing
      breathingStage: document.getElementById('stage-calm'),
      breathingOrb: document.getElementById('breathing-orb'),
      breathingAura: document.getElementById('breathing-aura'),
      phaseText: document.getElementById('breathing-phase-text'),
      phaseTimer: document.getElementById('breathing-phase-timer'),
      breathingProgressFill: document.getElementById('breathing-progress-fill'),
      btnSkipBreathing: document.getElementById('btn-skip-breathing'),
      btnExtendBreathing: document.getElementById('btn-extend-breathing'),

      // Chunking
      chunkingList: document.getElementById('chunking-options'),

      // Specificity
      specificityStage: document.getElementById('stage-specificity'),
      actionBadge: document.getElementById('action-badge'),
      actionInstruction: document.getElementById('action-instruction'),
      actionTip: document.getElementById('action-tip'),
      btnConfirmAction: document.getElementById('btn-confirm-action'),

      // Closure
      closureAffirmation: document.getElementById('closure-affirmation'),
      sessionStatPill: document.getElementById('session-stat-pill'),
      btnFinishSession: document.getElementById('btn-finish-session'),

      // Header & Navigation
      btnSoundToggle: document.getElementById('btn-sound-toggle'),
      btnHistoryToggle: document.getElementById('btn-history-toggle'),
      btnResetApp: document.getElementById('btn-reset-app'),

      // History Modal
      historyModal: document.getElementById('history-modal'),
      btnCloseHistory: document.getElementById('btn-close-history'),
      statTotalResets: document.getElementById('stat-total-resets'),
      statDayStreak: document.getElementById('stat-day-streak'),
      historyList: document.getElementById('history-list'),
    };
  }

  loadSettings() {
    const stats = LocalStore.getStats();
    this.soundEnabled = stats.soundEnabled;
    this.updateSoundIcon();
  }

  setupBreathingEngine() {
    const stats = LocalStore.getStats();
    this.breathingEngine = new BreathingEngine({
      duration: stats.breathingDuration || 60,
      onTick: (remaining, total, progress) => {
        if (this.dom.phaseTimer) {
          const mins = Math.floor(remaining / 60);
          const secs = remaining % 60;
          this.dom.phaseTimer.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
        if (this.dom.breathingProgressFill) {
          this.dom.breathingProgressFill.style.width = `${(progress * 100).toFixed(1)}%`;
        }
      },
      onPhaseChange: (phaseName, phaseText) => {
        if (this.dom.phaseText) {
          this.dom.phaseText.textContent = phaseText;
        }
        if (this.dom.breathingOrb) {
          this.dom.breathingOrb.className = `breathing-orb ${phaseName}`;
        }
        if (this.dom.breathingAura) {
          this.dom.breathingAura.className = `breathing-aura ${phaseName}`;
        }
      },
      onComplete: () => {
        this.fsm.completeBreathing(false);
        this.transitionToStage(RECOVERY_STAGES.CHUNKING);
      },
    });

    this.breathingEngine.setSoundEnabled(this.soundEnabled);
  }

  renderAwarenessOptions() {
    if (!this.dom.awarenessGrid) return;
    this.dom.awarenessGrid.innerHTML = '';

    AWARENESS_OPTIONS.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn';
      btn.setAttribute('aria-label', `I feel ${opt.label}`);
      btn.innerHTML = `
        <span class="option-icon" aria-hidden="true">${opt.icon}</span>
        <span class="option-label">${opt.label}</span>
        <span class="option-desc">${opt.desc}</span>
      `;

      btn.addEventListener('click', () => {
        this.selectFeeling(opt.id, btn);
      });

      this.dom.awarenessGrid.appendChild(btn);
    });
  }

  renderChunkingOptions() {
    if (!this.dom.chunkingList) return;
    this.dom.chunkingList.innerHTML = '';

    CHUNKING_OPTIONS.forEach(opt => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn-row';
      btn.setAttribute('aria-label', `I was doing ${opt.title}`);
      btn.innerHTML = `
        <div class="row-text">
          <span class="row-title">${opt.title}</span>
          <span class="row-subtitle">${opt.subtitle}</span>
        </div>
        <span class="row-chevron" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </span>
      `;

      btn.addEventListener('click', () => {
        this.selectContext(opt.id);
      });

      this.dom.chunkingList.appendChild(btn);
    });
  }

  bindEvents() {
    // Breathing controls
    if (this.dom.btnSkipBreathing) {
      this.dom.btnSkipBreathing.addEventListener('click', () => {
        this.breathingEngine.stop();
        this.fsm.completeBreathing(true);
        this.transitionToStage(RECOVERY_STAGES.CHUNKING);
      });
    }

    if (this.dom.btnExtendBreathing) {
      this.dom.btnExtendBreathing.addEventListener('click', () => {
        const newDuration = this.breathingEngine.remainingSeconds + 30;
        this.breathingEngine.setDuration(newDuration);
        this.breathingEngine.start();
      });
    }

    // Specificity confirmation
    if (this.dom.btnConfirmAction) {
      this.dom.btnConfirmAction.addEventListener('click', () => {
        this.fsm.confirmAction();
        this.handleSessionCompletion();
      });
    }

    // Final finish and return
    if (this.dom.btnFinishSession) {
      this.dom.btnFinishSession.addEventListener('click', () => {
        this.startNewSession();
      });
    }

    // Reset app
    if (this.dom.btnResetApp) {
      this.dom.btnResetApp.addEventListener('click', () => {
        if (confirm('Start a fresh recovery reset?')) {
          this.breathingEngine.stop();
          this.startNewSession();
        }
      });
    }

    // Sound toggle
    if (this.dom.btnSoundToggle) {
      this.dom.btnSoundToggle.addEventListener('click', () => {
        this.soundEnabled = !this.soundEnabled;
        this.breathingEngine.setSoundEnabled(this.soundEnabled);
        LocalStore.updateSetting('soundEnabled', this.soundEnabled);
        this.updateSoundIcon();
      });
    }

    // History Modal
    if (this.dom.btnHistoryToggle) {
      this.dom.btnHistoryToggle.addEventListener('click', () => {
        this.openHistoryModal();
      });
    }

    if (this.dom.btnCloseHistory) {
      this.dom.btnCloseHistory.addEventListener('click', () => {
        this.closeHistoryModal();
      });
    }

    if (this.dom.historyModal) {
      this.dom.historyModal.addEventListener('click', (e) => {
        if (e.target === this.dom.historyModal) {
          this.closeHistoryModal();
        }
      });
    }
  }

  updateSoundIcon() {
    if (!this.dom.btnSoundToggle) return;
    this.dom.btnSoundToggle.innerHTML = this.soundEnabled
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg><span class="sr-only">Mute Audio</span>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg><span class="sr-only">Unmute Audio</span>`;
    
    this.dom.btnSoundToggle.classList.toggle('active', this.soundEnabled);
  }

  startNewSession() {
    this.breathingEngine.stop();
    this.fsm.startSession();
    this.transitionToStage(RECOVERY_STAGES.AWARENESS);
  }

  selectFeeling(feelingId, buttonElement) {
    // Quick micro-highlight
    buttonElement.classList.add('selected');
    setTimeout(() => {
      buttonElement.classList.remove('selected');
      this.fsm.setFeeling(feelingId);
      this.transitionToStage(RECOVERY_STAGES.CALM);
      // Start the breathing cycle
      this.breathingEngine.start();
    }, 250);
  }

  selectContext(contextId) {
    this.fsm.setContext(contextId);
    this.renderSpecificityStage();
    this.transitionToStage(RECOVERY_STAGES.SPECIFICITY);
  }

  renderSpecificityStage() {
    const action = this.fsm.session.action;
    if (!action) return;

    if (this.dom.actionBadge) this.dom.actionBadge.textContent = action.badge;
    if (this.dom.actionInstruction) this.dom.actionInstruction.textContent = action.instruction;
    if (this.dom.actionTip) this.dom.actionTip.textContent = action.tip;
  }

  handleSessionCompletion() {
    const session = this.fsm.session;
    LocalStore.recordSession(session);

    // Populate Affirmation and Stats
    if (this.dom.closureAffirmation) {
      this.dom.closureAffirmation.textContent = `"${this.fsm.getRandomAffirmation()}"`;
    }

    const stats = LocalStore.getStats();
    if (this.dom.sessionStatPill) {
      this.dom.sessionStatPill.textContent = `${stats.todayCount} reset${stats.todayCount === 1 ? '' : 's'} completed today • ${stats.streak} day streak`;
    }

    this.transitionToStage(RECOVERY_STAGES.CLOSURE);
  }

  transitionToStage(stageIndex) {
    // Update step indicator nodes
    this.dom.stageNodes.forEach((node, idx) => {
      node.classList.remove('active', 'completed');
      if (idx === stageIndex) {
        node.classList.add('active');
      } else if (idx < stageIndex) {
        node.classList.add('completed');
      }
    });

    // Update Stage Cards
    this.dom.stageCards.forEach((card, idx) => {
      if (idx === stageIndex) {
        card.classList.add('current');
      } else {
        card.classList.remove('current');
      }
    });

    // Window scroll to top for clean viewport
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openHistoryModal() {
    const stats = LocalStore.getStats();
    if (this.dom.statTotalResets) this.dom.statTotalResets.textContent = stats.totalResets;
    if (this.dom.statDayStreak) this.dom.statDayStreak.textContent = `${stats.streak}d`;

    if (this.dom.historyList) {
      this.dom.historyList.innerHTML = '';
      if (stats.recentSessions.length === 0) {
        this.dom.historyList.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-size: var(--font-size-sm); padding: var(--space-md) 0;">No past resets yet. Complete your first session to begin your streak.</p>`;
      } else {
        stats.recentSessions.forEach(s => {
          const item = document.createElement('div');
          item.className = 'history-item';
          const feelingName = s.feeling ? s.feeling.charAt(0).toUpperCase() + s.feeling.slice(1) : 'Reset';
          item.innerHTML = `
            <span class="history-state">${feelingName} Cleared</span>
            <span class="history-time">${s.dateString}</span>
          `;
          this.dom.historyList.appendChild(item);
        });
      }
    }

    if (this.dom.historyModal) {
      this.dom.historyModal.classList.add('open');
    }
  }

  closeHistoryModal() {
    if (this.dom.historyModal) {
      this.dom.historyModal.classList.remove('open');
    }
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.log('Service Worker registration skipped or error:', err);
      });
    }
  }
}

// Bootstrap once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new BrainFogApp();
});
