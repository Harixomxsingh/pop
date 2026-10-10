
// MindFog Seamless Navigation Controller
(function() {
  const currentPath = window.location.pathname.split('/').pop() || 'home_sanctuary.html';
  
  const screensList = [
    { file: 'home_sanctuary.html', name: 'Home Sanctuary', badge: 'Home' },
    { file: 'step_1_fog_sweep.html', name: 'Step 1: Fog Sweep', badge: '1/7' },
    { file: 'step_2_horizon_gaze.html', name: 'Step 2: Horizon Gaze', badge: '2/7' },
    { file: 'step_3_somatic_breath.html', name: 'Step 3: Somatic Breath', badge: '3/7' },
    { file: 'step_4_forward_direction.html', name: 'Step 4: Forward Direction', badge: '4/7' },
    { file: 'step_5_micro_action_engine.html', name: 'Step 5: Micro-Action Engine', badge: '5/7' },
    { file: 'step_6_focus_bridge.html', name: 'Step 6: Focus Bridge', badge: '6/7' },
    { file: 'step_7_positivity_gateway.html', name: 'Step 7: Positivity Gateway', badge: '7/7' },
    { file: 'clarity_streaks_rewards.html', name: 'Clarity & Streaks', badge: 'Stats' }
  ];

  window.navigateTo = function(target) {
    if (window.AndroidBridge && window.AndroidBridge.navigate) {
      window.AndroidBridge.navigate(target);
    } else {
      window.location.href = target;
    }
  };

  // Wire bottom nav bar
  document.querySelectorAll('nav a[data-path]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const path = this.getAttribute('data-path');
      if (path === 'sanctuary') window.navigateTo('home_sanctuary.html');
      else if (path === 'protocols') window.navigateTo('step_1_fog_sweep.html');
      else if (path === 'clarity') window.navigateTo('clarity_streaks_rewards.html');
    });
  });

  // Wire specific screen buttons
  if (currentPath === 'home_sanctuary.html') {
    const beginBtn = document.getElementById('begin-trigger');
    if (beginBtn) {
      beginBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        window.navigateTo('step_1_fog_sweep.html');
      });
    }
    const quickPills = document.querySelectorAll('.quick-pill');
    if (quickPills[0]) quickPills[0].onclick = () => window.navigateTo('step_2_horizon_gaze.html');
    if (quickPills[1]) quickPills[1].onclick = () => window.navigateTo('step_1_fog_sweep.html');
    if (quickPills[2]) quickPills[2].onclick = () => window.navigateTo('step_3_somatic_breath.html');
  }

  if (currentPath === 'step_1_fog_sweep.html') {
    const contBtn = document.getElementById('continue-trigger');
    if (contBtn) contBtn.onclick = () => window.navigateTo('step_2_horizon_gaze.html');
  }

  if (currentPath === 'step_2_horizon_gaze.html') {
    const advanceBtn = document.getElementById('advance-btn');
    if (advanceBtn) advanceBtn.onclick = () => window.navigateTo('step_3_somatic_breath.html');
  }

  if (currentPath === 'step_3_somatic_breath.html') {
    const contBtn = document.querySelector('button.bg-primary-container');
    if (contBtn) contBtn.onclick = () => window.navigateTo('step_4_forward_direction.html');
  }

  if (currentPath === 'step_4_forward_direction.html') {
    const contBtn = document.getElementById('continueBtn');
    if (contBtn) {
      contBtn.addEventListener('click', () => {
        if (!contBtn.disabled) window.navigateTo('step_5_micro_action_engine.html');
      });
    }
  }

  if (currentPath === 'step_5_micro_action_engine.html') {
    const actionBtn = document.querySelector('button.bg-primary');
    if (actionBtn) actionBtn.onclick = () => window.navigateTo('step_6_focus_bridge.html');
  }

  if (currentPath === 'step_6_focus_bridge.html') {
    window.finishBridge = function() {
      window.navigateTo('step_7_positivity_gateway.html');
    };
  }

  if (currentPath === 'step_7_positivity_gateway.html') {
    const clarityBtn = document.querySelector('button.bg-primary');
    if (clarityBtn) clarityBtn.onclick = () => window.navigateTo('clarity_streaks_rewards.html');
    const returnBtn = document.querySelector('button.bg-transparent');
    if (returnBtn) returnBtn.onclick = () => window.navigateTo('home_sanctuary.html');
  }

  if (currentPath === 'clarity_streaks_rewards.html') {
    const returnBtn = document.getElementById('returnBtn');
    if (returnBtn) returnBtn.onclick = () => window.navigateTo('home_sanctuary.html');
  }

  // Create Quick Switcher Floating Modal for Tester / Evaluator
  function createQuickSwitcher() {
    const container = document.createElement('div');
    container.id = 'mindfog-switcher-container';
    container.innerHTML = `
      <style>
        #mindfog-quick-fab {
          position: fixed;
          top: 12px;
          right: 12px;
          z-index: 99999;
          background: rgba(24, 32, 42, 0.92);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(153, 212, 247, 0.35);
          color: #99d4f7;
          border-radius: 9999px;
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.4);
          cursor: pointer;
        }
        #mindfog-modal-backdrop {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 99998;
          background: rgba(7, 15, 24, 0.85);
          backdrop-filter: blur(8px);
          overflow-y: auto;
          padding: 24px 16px 80px 16px;
        }
        #mindfog-modal-content {
          max-width: 400px;
          margin: 40px auto 0 auto;
          background: #141c26;
          border: 1px solid rgba(153, 212, 247, 0.2);
          border-radius: 24px;
          padding: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }
        .mindfog-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-radius: 14px;
          margin-bottom: 8px;
          background: #18202a;
          color: #dbe3f1;
          font-size: 13px;
          text-decoration: none;
          transition: all 0.2s;
          border: 1px solid transparent;
        }
        .mindfog-item:hover, .mindfog-item.active {
          background: rgba(153, 212, 247, 0.15);
          border-color: #99d4f7;
          color: #ffffff;
        }
      </style>
      <button id="mindfog-quick-fab" type="button">
        <span style="font-size: 14px;">✦</span>
        <span>Screens (9)</span>
      </button>
      <div id="mindfog-modal-backdrop">
        <div id="mindfog-modal-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
            <div>
              <h3 style="margin:0; font-size:16px; font-weight:600; color:#dbe3f1;">MindFog Screen Navigator</h3>
              <p style="margin:2px 0 0 0; font-size:11px; color:#8a9298;">9 Stitch ritual screens available</p>
            </div>
            <button id="mindfog-close-modal" style="background:#232b35; border:none; color:#dbe3f1; width:28px; height:28px; border-radius:14px; cursor:pointer;">✕</button>
          </div>
          <div id="mindfog-screens-list"></div>
        </div>
      </div>
    `;
    document.body.appendChild(container);

    const listEl = document.getElementById('mindfog-screens-list');
    screensList.forEach(item => {
      const isCur = currentPath === item.file;
      const el = document.createElement('a');
      el.className = 'mindfog-item' + (isCur ? ' active' : '');
      el.href = '#';
      el.innerHTML = `
        <span style="font-weight:${isCur ? '600' : '400'};">${item.name}</span>
        <span style="font-size:11px; padding:2px 8px; border-radius:9999px; background:${isCur ? '#99d4f7' : '#232b35'}; color:${isCur ? '#003549' : '#8a9298'}; font-weight:600;">${item.badge}</span>
      `;
      el.onclick = (e) => {
        e.preventDefault();
        window.navigateTo(item.file);
      };
      listEl.appendChild(el);
    });

    const fab = document.getElementById('mindfog-quick-fab');
    const modal = document.getElementById('mindfog-modal-backdrop');
    const closeBtn = document.getElementById('mindfog-close-modal');

    fab.onclick = () => { modal.style.display = 'block'; };
    closeBtn.onclick = () => { modal.style.display = 'none'; };
    modal.onclick = (e) => {
      if (e.target === modal) modal.style.display = 'none';
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createQuickSwitcher);
  } else {
    createQuickSwitcher();
  }
})();
