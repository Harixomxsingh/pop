/* ==========================================================================
   Brain Fog Recovery App (v1) — State Machine & Content Engine
   Philosophy: Tap-to-Recognize, Deliver Don't Ask, Zero Decision Fatigue
   ========================================================================== */

export const RECOVERY_STAGES = {
  AWARENESS: 0,
  CALM: 1,
  CHUNKING: 2,
  SPECIFICITY: 3,
  CLOSURE: 4,
};

export const AWARENESS_OPTIONS = [
  {
    id: 'foggy',
    icon: '🌫️',
    label: 'Foggy',
    desc: 'Hazy & unable to think straight',
  },
  {
    id: 'scattered',
    icon: '⚡',
    label: 'Scattered',
    desc: 'Jumping between too many thoughts',
  },
  {
    id: 'drained',
    icon: '🔋',
    label: 'Drained',
    desc: 'Mentally tired from overstimulation',
  },
  {
    id: 'overwhelmed',
    icon: '🌪️',
    label: 'Overwhelmed',
    desc: 'Too much digital noise at once',
  },
];

export const CHUNKING_OPTIONS = [
  {
    id: 'work',
    title: 'Working or Writing',
    subtitle: 'An article, report, email, or job task',
    action: {
      badge: 'Micro-Action',
      instruction: 'Open your document and write just 1 single clear sentence.',
      tip: 'Do not edit it. Just write one sentence to re-enter momentum.',
    },
  },
  {
    id: 'study',
    title: 'Studying or Learning',
    subtitle: 'Reading, course materials, or research',
    action: {
      badge: 'Micro-Action',
      instruction: 'Read just 1 paragraph and note down 1 keyword.',
      tip: 'Put your phone face down across the desk before reading.',
    },
  },
  {
    id: 'chore',
    title: 'A Daily Task or Chore',
    subtitle: 'Organizing, cleaning, cooking, or errands',
    action: {
      badge: 'Micro-Action',
      instruction: 'Stand up and perform the very first 60 seconds of that physical task.',
      tip: 'Physical motion clears mental fog faster than mental effort.',
    },
  },
  {
    id: 'project',
    title: 'A Creative Project',
    subtitle: 'Coding, designing, building, or brainstorming',
    action: {
      badge: 'Micro-Action',
      instruction: 'Grab a physical pen and paper. Sketch or write 1 rough idea.',
      tip: 'No screens for the first 2 minutes. Let your eyes relax.',
    },
  },
  {
    id: 'wandering',
    title: 'Nothing Specific / Scrolling',
    subtitle: 'Caught in an infinite feed with no plan',
    action: {
      badge: 'Micro-Action',
      instruction: 'Stand up, drink a full glass of cold water, and look 20 feet away.',
      tip: 'Widen your visual field to signal safety to your nervous system.',
    },
  },
];

export const CLOSURE_AFFIRMATIONS = [
  'You noticed the fog, took a breath, and reclaimed your mind. That is real strength.',
  'Your perception has widened. Step back into your day with calm, grounded focus.',
  'You broke the distraction loop. One conscious choice at a time clears the path.',
  'Attention is your most sacred asset. You just protected it.',
];

export class RecoveryStateMachine {
  constructor() {
    this.currentStage = RECOVERY_STAGES.AWARENESS;
    this.session = {
      feeling: null,
      breathingDuration: 60, // seconds
      breathingCompleted: false,
      context: null,
      action: null,
      startTime: null,
      completedAt: null,
    };
  }

  startSession() {
    this.currentStage = RECOVERY_STAGES.AWARENESS;
    this.session = {
      feeling: null,
      breathingDuration: 60,
      breathingCompleted: false,
      context: null,
      action: null,
      startTime: Date.now(),
      completedAt: null,
    };
  }

  setFeeling(feelingId) {
    this.session.feeling = feelingId;
    this.currentStage = RECOVERY_STAGES.CALM;
  }

  completeBreathing(skipped = false) {
    this.session.breathingCompleted = !skipped;
    this.currentStage = RECOVERY_STAGES.CHUNKING;
  }

  setContext(contextId) {
    const option = CHUNKING_OPTIONS.find(o => o.id === contextId) || CHUNKING_OPTIONS[0];
    this.session.context = option.id;
    this.session.action = option.action;
    this.currentStage = RECOVERY_STAGES.SPECIFICITY;
  }

  confirmAction() {
    this.currentStage = RECOVERY_STAGES.CLOSURE;
    this.session.completedAt = Date.now();
  }

  getRandomAffirmation() {
    const index = Math.floor(Math.random() * CLOSURE_AFFIRMATIONS.length);
    return CLOSURE_AFFIRMATIONS[index];
  }

  reset() {
    this.startSession();
  }
}
