/* ==========================================================================
   Brain Fog Recovery App (v1.1.1 - VG) — State Machine & Dynamic Action Engine
   ========================================================================== */

import { TruthVaultEngine } from './truth-vault.js';

export const RECOVERY_STAGES = {
  FOG_SWEEP: 0,      // Soft Fascination
  GAZE_REST: 1,      // Panoramic Gaze (45s)
  BREATHING: 2,      // Stanford Physiological Sigh (90s/3m)
  CHUNKING: 3,       // Forward Intentionality
  SPECIFICITY: 4,    // Dynamic Micro-Action
  FOCUS_BRIDGE: 5,   // 5-Minute Ambient Focus
  GATEWAY: 6,        // Positivity & Gratitude Gateway (PMA)
};

export const AWARENESS_OPTIONS = [
  { id: 'foggy', icon: '🌫️', label: 'Foggy', desc: 'Tunnel vision' },
  { id: 'scattered', icon: '⚡', label: 'Scattered', desc: 'Fragmented focus' },
  { id: 'drained', icon: '🔋', label: 'Drained', desc: 'Dopamine fatigue' },
  { id: 'overwhelmed', icon: '🌪️', label: 'Overloaded', desc: 'Sensory noise' },
];

export const CHUNKING_OPTIONS = [
  {
    id: 'work',
    icon: '✍️',
    title: 'Deep Work or Writing',
    subtitle: 'Email, document, code, or project task',
    actions: [
      {
        badge: 'Micro-Action',
        instruction: 'Open your document and type just 1 single clear sentence.',
        tip: 'Do not edit it. Just write one sentence to cross the threshold.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Jot down 3 quick bullet points on paper for what you will tackle next.',
        tip: 'Analog writing grounds the mind faster than digital typing.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Close all open browser tabs except the single one you need right now.',
        tip: 'Visual space instantly creates mental room.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Write the first 2 lines of your email or code without self-judgment.',
        tip: 'Action produces clarity, not the other way around.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Open the project file and spend 60 seconds reviewing only the headline/outline.',
        tip: 'A gentle look breaks the resistance of starting.',
      },
    ],
  },
  {
    id: 'study',
    icon: '📚',
    title: 'Learning or Study',
    subtitle: 'Reading, research, or course material',
    actions: [
      {
        badge: 'Micro-Action',
        instruction: 'Read just 1 paragraph and highlight 1 single keyword.',
        tip: 'Place your phone completely face down out of reach.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Write down 1 core question you want answered from this chapter.',
        tip: 'Curiosity pulls your attention forward naturally.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Look at the chapter diagram or summary table for 30 seconds.',
        tip: 'Absorb the spatial layout before reading sentences.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Summarize the last concept you read out loud in 1 single sentence.',
        tip: 'Vocalizing bridges short-term to long-term memory.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Write 1 key takeaway on a sticky note and place it by your monitor.',
        tip: 'Anchors your mind to the current topic.',
      },
    ],
  },
  {
    id: 'chore',
    icon: '🧹',
    title: 'A Physical Task or Chore',
    subtitle: 'Cleaning, cooking, moving, or organizing',
    actions: [
      {
        badge: 'Micro-Action',
        instruction: 'Stand up right now and clear just 1 square foot of your desk or counter.',
        tip: 'Physical momentum clears mental fog faster than mental effort.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Put away exactly 3 items in your room that are out of place.',
        tip: 'Micro-order creates immediate calm in your nervous system.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Drink a full glass of cold water and wash that one glass immediately.',
        tip: 'Cold hydration re-activates cellular alertness.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Do 5 slow neck rolls and 5 deep shoulder shrugs right now.',
        tip: 'Releases the posture tension built from looking down at your phone.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Take out the trash or wipe down your keyboard/screen.',
        tip: 'A clean physical tool resets your work ritual.',
      },
    ],
  },
  {
    id: 'project',
    icon: '💡',
    title: 'A Creative Project',
    subtitle: 'Designing, brainstorming, art, or tinkering',
    actions: [
      {
        badge: 'Micro-Action',
        instruction: 'Grab a physical pen and paper. Sketch 1 rough shape or write 1 messy thought.',
        tip: 'No screens for the first 2 minutes. Let your biological eyes relax.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Write the worst possible idea for your project to break the blank page.',
        tip: 'Lowering the quality bar dissolves perfectionist paralysis.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'List 2 reference inspirations you admire on paper.',
        tip: 'Ignites visual pattern recognition.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Name 1 specific feeling you want your project to evoke.',
        tip: 'Anchors your creative intention.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Draw a 3-box comic or flowchart of how the user experiences your idea.',
        tip: 'Simplifies complex visions into tangible steps.',
      },
    ],
  },
  {
    id: 'rest',
    icon: '🌿',
    title: 'A Restful Screen-Free Break',
    subtitle: 'Hydrating, stepping outside, stretching',
    actions: [
      {
        badge: 'Micro-Action',
        instruction: 'Step outside or open a window and feel the air on your face for 60 seconds.',
        tip: 'Natural daylight resets circadian alertness.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Make a warm tea or cold water and drink 3 sips in complete silence.',
        tip: 'Focus entirely on the physical temperature and taste.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Lie down on the floor or lean back with your eyes closed for 2 minutes.',
        tip: 'Allows sensory de-escalation across your nervous system.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Do a full-body stretch reaching as high as you can toward the ceiling.',
        tip: 'Opens your diaphragm for deeper oxygenation.',
      },
      {
        badge: 'Micro-Action',
        instruction: 'Look at a plant or tree nearby and observe the patterns on the leaves.',
        tip: 'Natural fractal patterns stimulate alpha-wave relaxation.',
      },
    ],
  },
];

export class DeepRecoveryStateMachine {
  constructor() {
    this.truthVault = new TruthVaultEngine();
    this.currentStage = RECOVERY_STAGES.FOG_SWEEP;
    this.session = {
      feeling: 'foggy',
      fogClearedFraction: 0,
      gazeRestCompleted: false,
      breathingMode: 'sigh',
      breathingDuration: 90,
      context: 'work',
      action: null,
      actionIndex: 0,
      focusBridgeDuration: 300,
      focusBridgeCompleted: false,
      currentTruth: null,
      startedAt: Date.now(),
      completedAt: null,
    };
  }

  startSession() {
    this.currentStage = RECOVERY_STAGES.FOG_SWEEP;
    this.session = {
      feeling: 'foggy',
      fogClearedFraction: 0,
      gazeRestCompleted: false,
      breathingMode: 'sigh',
      breathingDuration: 90,
      context: 'work',
      action: null,
      actionIndex: 0,
      focusBridgeDuration: 300,
      focusBridgeCompleted: false,
      currentTruth: this.truthVault.getRandomVaultTruth(),
      startedAt: Date.now(),
      completedAt: null,
    };
  }

  setFeeling(feelingId) {
    this.session.feeling = feelingId;
  }

  setFogCleared(fraction) {
    this.session.fogClearedFraction = fraction;
  }

  completeGazeRest() {
    this.session.gazeRestCompleted = true;
    this.currentStage = RECOVERY_STAGES.BREATHING;
  }

  setBreathingConfig(mode, duration) {
    this.session.breathingMode = mode;
    this.session.breathingDuration = duration;
  }

  completeBreathing() {
    this.currentStage = RECOVERY_STAGES.CHUNKING;
  }

  setContext(contextId) {
    const opt = CHUNKING_OPTIONS.find(c => c.id === contextId) || CHUNKING_OPTIONS[0];
    this.session.context = opt.id;
    this.session.actionIndex = Math.floor(Math.random() * opt.actions.length);
    this.session.action = opt.actions[this.session.actionIndex];
    this.currentStage = RECOVERY_STAGES.SPECIFICITY;
  }

  shuffleAction() {
    const opt = CHUNKING_OPTIONS.find(c => c.id === this.session.context) || CHUNKING_OPTIONS[0];
    const newIndex = (this.session.actionIndex + 1) % opt.actions.length;
    this.session.actionIndex = newIndex;
    this.session.action = opt.actions[newIndex];
    return this.session.action;
  }

  startFocusBridge() {
    this.currentStage = RECOVERY_STAGES.FOCUS_BRIDGE;
  }

  completeFocusBridge(completed = true) {
    this.session.focusBridgeCompleted = completed;
    this.currentStage = RECOVERY_STAGES.GATEWAY;
    this.session.completedAt = Date.now();
  }

  async getFreshTruth() {
    const truth = await this.truthVault.getNextTruth();
    this.session.currentTruth = truth;
    return truth;
  }
}
