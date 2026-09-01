/* ==========================================================================
   Brain Fog Recovery App (v1.1.1) — Storage & Deep Analytics
   ========================================================================== */

const STORAGE_KEY = 'brainfog_recovery_v1_1_1_data';

export const LocalStore = {
  getData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {
          sessions: [],
          soundEnabled: true,
          defaultBreathingMode: 'sigh',
          defaultBreathingDuration: 90,
          ambientSound: 'brown_noise',
        };
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return { sessions: [], soundEnabled: true, defaultBreathingMode: 'sigh', defaultBreathingDuration: 90, ambientSound: 'brown_noise' };
    }
  },

  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage write error:', e);
    }
  },

  recordSession(session) {
    const data = this.getData();
    const entry = {
      id: 'session_' + Date.now(),
      timestamp: Date.now(),
      feeling: session.feeling,
      context: session.context,
      breathingMode: session.breathingMode,
      breathingDuration: session.breathingDuration,
      focusBridgeCompleted: session.focusBridgeCompleted,
      clarityCheckout: session.clarityCheckout,
      dateFormatted: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    data.sessions.unshift(entry);
    if (data.sessions.length > 60) data.sessions = data.sessions.slice(0, 60);

    this.saveData(data);
    return entry;
  },

  getStats() {
    const data = this.getData();
    const sessions = data.sessions || [];

    const totalSessions = sessions.length;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = sessions.filter(s => s.timestamp >= todayStart.getTime()).length;

    let streak = 0;
    if (sessions.length > 0) {
      const dates = [...new Set(sessions.map(s => new Date(s.timestamp).toDateString()))];
      const todayStr = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      if (dates[0] === todayStr || dates[0] === yesterdayStr) {
        streak = 1;
        for (let i = 1; i < dates.length; i++) {
          const prevDate = new Date(dates[i - 1]);
          const currDate = new Date(dates[i]);
          const diffDays = Math.round((prevDate - currDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) streak++;
          else break;
        }
      }
    }

    return {
      totalSessions,
      todayCount,
      streak,
      recentSessions: sessions.slice(0, 10),
      soundEnabled: data.soundEnabled !== false,
      defaultBreathingMode: data.defaultBreathingMode || 'sigh',
      defaultBreathingDuration: data.defaultBreathingDuration || 90,
      ambientSound: data.ambientSound || 'brown_noise',
    };
  },

  updateSetting(key, val) {
    const data = this.getData();
    data[key] = val;
    this.saveData(data);
  },
};
