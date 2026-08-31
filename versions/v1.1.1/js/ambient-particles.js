/* ==========================================================================
   Brain Fog Recovery App (v1.1.1 - VG) — Meditative Bokeh Particles
   Visual Therapy: Harmonic floating motes with feathered bokeh glows,
   designed to induce deep relaxation and parasympathetic calm
   ========================================================================== */

export class AmbientParticleField {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.numParticles = 26; // Golden ratio for calm ambient depth
    this.animationFrame = null;
    this.time = 0;

    this.breathingPhase = 'idle';
    this.targetAuraBrightness = 1.0;
    this.currentAuraBrightness = 1.0;

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    const w = this.canvas.width || window.innerWidth;
    const h = this.canvas.height || window.innerHeight;

    for (let i = 0; i < this.numParticles; i++) {
      // Create depth layers: background (tiny, slow) and foreground (soft bokeh glow)
      const depth = Math.random(); // 0 (far) to 1 (near)
      
      this.particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        originX: Math.random() * w,
        depth: depth,
        radius: depth > 0.7 ? Math.random() * 3.5 + 2.5 : Math.random() * 1.8 + 0.8,
        
        // Harmonic sway parameters for organic floating
        driftSpeedY: (0.12 + depth * 0.15) * 0.4, // Slow gentle upward float
        swaySpeed: Math.random() * 0.006 + 0.003,
        swayAmplitude: Math.random() * 35 + 15,
        swayOffset: Math.random() * Math.PI * 2,

        // Individual soothing breathing brightness cycle (6-10s)
        breathSpeed: Math.random() * 0.008 + 0.004,
        breathPhase: Math.random() * Math.PI * 2,
        baseOpacity: depth > 0.7 ? 0.22 : 0.12,
        colorTone: Math.random() > 0.4 ? 'sage' : 'moonlight',
      });
    }
  }

  setBreathingPhase(phase) {
    this.breathingPhase = phase;
    if (phase === 'inhale' || phase === 'inhale-top') {
      this.targetAuraBrightness = 1.35;
    } else if (phase === 'exhale') {
      this.targetAuraBrightness = 0.75;
    } else {
      this.targetAuraBrightness = 1.0;
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const w = this.canvas.width;
    const h = this.canvas.height;
    this.time += 1;

    // Smooth global breathing brightness modulation
    this.currentAuraBrightness += (this.targetAuraBrightness - this.currentAuraBrightness) * 0.025;

    this.particles.forEach((p) => {
      // 1. Organic harmonic sway (smooth sinusoidal float, like dust in sunlight)
      p.y -= p.driftSpeedY;
      const sway = Math.sin(this.time * p.swaySpeed + p.swayOffset) * p.swayAmplitude;
      const currentX = p.originX + sway;

      // 2. Wrap around bounds gently
      if (p.y < -20) {
        p.y = h + 20;
        p.originX = Math.random() * w;
      }

      // 3. Gentle individual respiratory pulsation
      p.breathPhase += p.breathSpeed;
      const breathCycle = (Math.sin(p.breathPhase) + 1) * 0.5; // 0 to 1
      const opacity = p.baseOpacity * (0.6 + 0.4 * breathCycle) * this.currentAuraBrightness;

      // 4. Render soft feathered bokeh glow
      const glowRadius = p.radius * (depthGlowFactor(p.depth));
      const grad = this.ctx.createRadialGradient(currentX, p.y, 0, currentX, p.y, glowRadius);

      if (p.colorTone === 'sage') {
        grad.addColorStop(0, `rgba(168, 220, 198, ${opacity * 1.2})`);
        grad.addColorStop(0.4, `rgba(136, 192, 168, ${opacity * 0.6})`);
        grad.addColorStop(1, `rgba(136, 192, 168, 0)`);
      } else {
        grad.addColorStop(0, `rgba(220, 235, 245, ${opacity * 1.1})`);
        grad.addColorStop(0.4, `rgba(100, 181, 246, ${opacity * 0.5})`);
        grad.addColorStop(1, `rgba(100, 181, 246, 0)`);
      }

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(currentX, p.y, glowRadius, 0, Math.PI * 2);
      this.ctx.fill();

      // Soft luminous core
      if (p.depth > 0.6) {
        this.ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        this.ctx.beginPath();
        this.ctx.arc(currentX, p.y, p.radius * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

function depthGlowFactor(depth) {
  return depth > 0.7 ? 3.5 : 2.5;
}
