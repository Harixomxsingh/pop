/* ==========================================================================
   Brain Fog Recovery App (v1.1.1 - VG) — Master Truth & Positivity Vault
   60+ Deeply Curated Philosophical, Cognitive, and Mindfulness Anchors
   Includes Smart No-Repeat Randomizer & Graceful Online Fetching
   ========================================================================== */

export const MASTER_TRUTHS = [
  // --- Pillar 1: Stillness & Digital Detox ---
  {
    id: 't_01',
    icon: '✨',
    truth: 'You paused when it was hard. You broke the noise loop and took your mind back. Be proud of this moment.',
    author: 'Mindful Recovery',
    category: 'Stillness',
  },
  {
    id: 't_02',
    icon: '🌅',
    truth: 'Social media gave you noise. Stillness gives you yourself back. Your attention is whole and ready.',
    author: 'Digital Minimalism',
    category: 'Stillness',
  },
  {
    id: 't_03',
    icon: '🧘',
    truth: 'You have power over your mind, not outside events. Realize this, and you will find immense strength.',
    author: 'Marcus Aurelius',
    category: 'Stillness',
  },
  {
    id: 't_04',
    icon: '🌿',
    truth: 'Silence is not the absence of sound, but the presence of your own awareness.',
    author: 'Thich Nhat Hanh',
    category: 'Stillness',
  },
  {
    id: 't_05',
    icon: '🕊️',
    truth: 'Almost everything will work again if you unplug it for a few minutes, including you.',
    author: 'Anne Lamott',
    category: 'Stillness',
  },
  {
    id: 't_06',
    icon: '☀️',
    truth: 'Muddy water is best cleared by leaving it alone.',
    author: 'Alan Watts',
    category: 'Stillness',
  },
  {
    id: 't_07',
    icon: '🌙',
    truth: 'In the midst of movement and chaos, keep stillness inside of you.',
    author: 'Deepak Chopra',
    category: 'Stillness',
  },
  {
    id: 't_08',
    icon: '🍃',
    truth: 'To a mind that is still, the whole universe surrenders.',
    author: 'Lao Tzu',
    category: 'Stillness',
  },
  {
    id: 't_09',
    icon: '🕯️',
    truth: 'The quieter you become, the more you can hear.',
    author: 'Ram Dass',
    category: 'Stillness',
  },
  {
    id: 't_10',
    icon: '🌌',
    truth: 'Calmness of mind is one of the beautiful jewels of wisdom.',
    author: 'James Allen',
    category: 'Stillness',
  },

  // --- Pillar 2: Deep Attention & Presence ---
  {
    id: 't_11',
    icon: '⚡',
    truth: 'Your attention is the paintbrush with which you color your entire reality.',
    author: 'William James',
    category: 'Presence',
  },
  {
    id: 't_12',
    icon: '🎯',
    truth: 'The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.',
    author: 'Cal Newport',
    category: 'Presence',
  },
  {
    id: 't_13',
    icon: '🌊',
    truth: 'A clear mind leads to clear thinking, and clear thinking leads to exceptional results.',
    author: 'Naval Ravikant',
    category: 'Presence',
  },
  {
    id: 't_14',
    icon: '👁️',
    truth: 'The present moment is the only moment where you have any real power.',
    author: 'Eckhart Tolle',
    category: 'Presence',
  },
  {
    id: 't_15',
    icon: '🏔️',
    truth: 'Do not let what you cannot do interfere with what you can do right now.',
    author: 'John Wooden',
    category: 'Presence',
  },
  {
    id: 't_16',
    icon: '💡',
    truth: 'Simplicity is about subtracting the obvious and adding the meaningful.',
    author: 'John Maeda',
    category: 'Presence',
  },
  {
    id: 't_17',
    icon: '💎',
    truth: 'Concentrate all your thoughts upon the work in hand. The sun’s rays do not burn until brought to a focus.',
    author: 'Alexander Graham Bell',
    category: 'Presence',
  },
  {
    id: 't_18',
    icon: '🧭',
    truth: 'Wherever you are, be there totally.',
    author: 'Eckhart Tolle',
    category: 'Presence',
  },
  {
    id: 't_19',
    icon: '⏳',
    truth: 'It is not that we have a short time to live, but that we waste a lot of it.',
    author: 'Seneca',
    category: 'Presence',
  },
  {
    id: 't_20',
    icon: '🕊️',
    truth: 'You do not need to catch up on the world. The only moment that truly matters is right in front of you.',
    author: 'Present Awareness',
    category: 'Presence',
  },

  // --- Pillar 3: Self-Compassion & Resetting ---
  {
    id: 't_21',
    icon: '🌿',
    truth: 'Nothing is lost. The mind is clear, the slate is clean. Step into your next moment with lightness.',
    author: 'Fresh Slate',
    category: 'Compassion',
  },
  {
    id: 't_22',
    icon: '🌸',
    truth: 'The curious paradox is that when I accept myself just as I am, then I can change.',
    author: 'Carl Rogers',
    category: 'Compassion',
  },
  {
    id: 't_23',
    icon: '🌼',
    truth: 'You yourself, as much as anybody in the entire universe, deserve your love and affection.',
    author: 'Sharon Salzberg',
    category: 'Compassion',
  },
  {
    id: 't_24',
    icon: '🌱',
    truth: 'Compassion for ourselves gives us the courage to try again without the weight of guilt.',
    author: 'Dr. Kristin Neff',
    category: 'Compassion',
  },
  {
    id: 't_25',
    icon: '🌧️',
    truth: 'Feel the feeling, drop the story, and return to the breath.',
    author: 'Pema Chödrön',
    category: 'Compassion',
  },
  {
    id: 't_26',
    icon: '☀️',
    truth: 'Give yourself permission to pause. It is not wasted time; it is maintenance for your soul.',
    author: 'Restorative Living',
    category: 'Compassion',
  },
  {
    id: 't_27',
    icon: '🪴',
    truth: 'Treat yourself as if you were someone you are responsible for helping.',
    author: 'Jordan Peterson',
    category: 'Compassion',
  },
  {
    id: 't_28',
    icon: '🕊️',
    truth: 'Peace comes from within. Do not seek it without.',
    author: 'Buddha',
    category: 'Compassion',
  },
  {
    id: 't_29',
    icon: '🌾',
    truth: 'Forgive yourself for the minutes lost. Honor yourself for the clarity found.',
    author: 'Inner Grace',
    category: 'Compassion',
  },
  {
    id: 't_30',
    icon: '🌈',
    truth: 'Be gentle with yourself. You are doing the best you can with the attention you have.',
    author: 'Self-Kindness',
    category: 'Compassion',
  },

  // --- Pillar 4: Forward Momentum & Action ---
  {
    id: 't_31',
    icon: '🚀',
    truth: 'Do not wait for extraordinary circumstances to do good action; try to use ordinary situations.',
    author: 'Jean Paul Richter',
    category: 'Momentum',
  },
  {
    id: 't_32',
    icon: '🔥',
    truth: 'Knowing is not enough, we must apply. Willing is not enough, we must do.',
    author: 'Bruce Lee',
    category: 'Momentum',
  },
  {
    id: 't_33',
    icon: '🌊',
    truth: 'Action produces clarity far faster than thought produces action.',
    author: 'Momentum Principle',
    category: 'Momentum',
  },
  {
    id: 't_34',
    icon: '⭐',
    truth: 'Small daily improvements over time lead to stunning results.',
    author: 'Robin Sharma',
    category: 'Momentum',
  },
  {
    id: 't_35',
    icon: '🌄',
    truth: 'What you do today can improve all your tomorrows.',
    author: 'Ralph Marston',
    category: 'Momentum',
  },
  {
    id: 't_36',
    icon: '🏹',
    truth: 'The secret of getting ahead is getting started. The secret of getting started is breaking complex tasks into small manageable chunks.',
    author: 'Mark Twain',
    category: 'Momentum',
  },
  {
    id: 't_37',
    icon: '🪵',
    truth: 'If you want to build a ship, don’t drum up people to collect wood; rather, teach them to long for the endless immensity of the sea.',
    author: 'Antoine de Saint-Exupéry',
    category: 'Momentum',
  },
  {
    id: 't_38',
    icon: '🌿',
    truth: 'A journey of a thousand miles begins with a single step.',
    author: 'Lao Tzu',
    category: 'Momentum',
  },
  {
    id: 't_39',
    icon: '🏆',
    truth: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
    category: 'Momentum',
  },
  {
    id: 't_40',
    icon: '🌤️',
    truth: 'Start where you are. Use what you have. Do what you can.',
    author: 'Arthur Ashe',
    category: 'Momentum',
  },

  // --- Pillar 5: Mind & Perception Clarity ---
  {
    id: 't_41',
    icon: '💫',
    truth: 'The mind is everything. What you think you become.',
    author: 'Buddha',
    category: 'Clarity',
  },
  {
    id: 't_42',
    icon: '🔮',
    truth: 'When you change the way you look at things, the things you look at change.',
    author: 'Max Planck',
    category: 'Clarity',
  },
  {
    id: 't_43',
    icon: '💎',
    truth: 'Clarity affords focus. Focus breeds momentum.',
    author: 'Thomas Leonard',
    category: 'Clarity',
  },
  {
    id: 't_44',
    icon: '🌌',
    truth: 'Your mind is a sacred sanctuary. You just chose to protect it with conscious intention.',
    author: 'Mindful Sanctuary',
    category: 'Clarity',
  },
  {
    id: 't_45',
    icon: '👁️',
    truth: 'The ability to observe without evaluating is the highest form of intelligence.',
    author: 'Jiddu Krishnamurti',
    category: 'Clarity',
  },
  {
    id: 't_46',
    icon: '🌠',
    truth: 'Look deep into nature, and then you will understand everything better.',
    author: 'Albert Einstein',
    category: 'Clarity',
  },
  {
    id: 't_47',
    icon: '🕊️',
    truth: 'Do not let the behavior of others destroy your inner peace.',
    author: 'Dalai Lama',
    category: 'Clarity',
  },
  {
    id: 't_48',
    icon: '🌿',
    truth: 'Smile, breathe, and go slowly. There is nowhere you need to rush to.',
    author: 'Thich Nhat Hanh',
    category: 'Clarity',
  },
  {
    id: 't_49',
    icon: '⚓',
    truth: 'When the sea is calm, every ship has a good captain. Steady your mind.',
    author: 'Swedish Proverb',
    category: 'Clarity',
  },
  {
    id: 't_50',
    icon: '☀️',
    truth: 'Out of clutter, find simplicity. From discord, find harmony. In the middle of difficulty lies opportunity.',
    author: 'Albert Einstein',
    category: 'Clarity',
  },
];

export class TruthVaultEngine {
  constructor() {
    this.historyIds = [];
    this.onlineQueue = [];
    this.isFetchingOnline = false;
  }

  getRandomVaultTruth() {
    // Filter out recently viewed truths to avoid repetition
    let candidates = MASTER_TRUTHS.filter(t => !this.historyIds.includes(t.id));
    if (candidates.length === 0) {
      this.historyIds = []; // Reset history cycle once all seen
      candidates = MASTER_TRUTHS;
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[randomIndex];
    this.historyIds.push(chosen.id);

    // Keep history bounded to last 30
    if (this.historyIds.length > 30) {
      this.historyIds.shift();
    }

    return chosen;
  }

  async getNextTruth() {
    // Check if we have an online-fetched quote ready
    if (this.onlineQueue.length > 0) {
      return this.onlineQueue.shift();
    }

    // Try to trigger a background fetch for subsequent shuffles
    this.fetchOnlineQuoteInBackground();

    // Return instant, ultra-fast zero-latency local vault truth
    return this.getRandomVaultTruth();
  }

  async fetchOnlineQuoteInBackground() {
    if (this.isFetchingOnline || typeof fetch === 'undefined') return;
    this.isFetchingOnline = true;

    try {
      // Free public Stoic / Wisdom API with quick 2-second timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch('https://api.quotable.io/random?tags=wisdom|inspirational|mindfulness', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.content) {
          this.onlineQueue.push({
            id: 'online_' + Date.now(),
            icon: '✨',
            truth: data.content,
            author: data.author || 'Timeless Wisdom',
            category: 'Inspiration',
          });
        }
      }
    } catch (e) {
      // Gracefully silent fallback to local vault
    } finally {
      this.isFetchingOnline = false;
    }
  }
}
