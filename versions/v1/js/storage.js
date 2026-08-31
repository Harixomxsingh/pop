/* ==========================================================================
   Brain Fog Recovery App (v1) — Local-First Storage & Session Analytics
   100% On-Device, Zero Trackers, Zero Latency
   ========================================================================== */

const STORAGE_KEY = 'brainfog_recovery_v1_data';

export const LocalStore = {
  getData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return {
          sessions: [],
          soundEnabled: true,
          breathingDuration: 60,
        };
      }
      return JSON.parse(raw);
    } catch (e) {
      console.warn('LocalStorage read error:', e);
      return { sessions: [], soundEnabled: true, breathingDuration: 60 };
    }
  },

  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage write error:', e);
    }
  },

  recordSession(sessionData) {
    const data = this.getData();
    const newEntry = {
      id: 'session_' + Date.now(),
      timestamp: Date.now(),
      feeling: sessionData.feeling || 'unknown',
      context: sessionData.context || 'general',
      breathingCompleted: Boolean(sessionData.breathingCompleted),
      dateString: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    data.sessions.unshift(newEntry);
    // Keep maximum last 50 sessions to conserve device storage
    if (data.sessions.length > 50) {
      data.sessions = data.sessions.slice(0, 50);
    }

    this.saveData(data);
    return newEntry;
  },

  getStats() {
    const data = this.getData();
    const sessions = data.sessions || [];

    const totalResets = sessions.length;

    // Calculate Resets Completed Today
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayCount = sessions.filter(s => s.timestamp >= todayStart.getTime()).length;

    // Calculate Streak (Consecutive days with at least 1 reset)
    let streak = 0;
    if (sessions.length > 0) {
      const dates = [...new Set(sessions.map(s => new Date(s.timestamp).toDateString()))];
      const todayStr = new Date().toDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toDateString();

      // Check if user has logged today or yesterday to maintain active streak
      if (dates[0] === todayStr || dates[0] === yesterdayStr) {
        streak = 1;
        for (let i = 1; i < dates.length; i++) {
          const prevDate = new Date(dates[i - 1]);
          const currDate = new Date(dates[i]);
          const diffDays = Math.round((prevDate - currDate) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    return {
      totalResets,
      todayCount,
      streak,
      recentSessions: sessions.slice(0, 10),
      soundEnabled: data.soundEnabled !== false,
      breathingDuration: data.breathingDuration || 60,
    };
  },

  updateSetting(key, value) {
    const data = this.getData();
    data[key] = value;
    this.saveData(data);
  },
};
