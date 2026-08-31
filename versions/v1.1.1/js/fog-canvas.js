/* ==========================================================================
   Brain Fog Recovery App (v1.1.1) — Kinetic Fog Dissolver Canvas
   Sensory grounding & Soft Fascination (Attention Restoration Theory)
   Allows the user to physically sweep and dissolve digital clutter clouds
   ========================================================================== */

export class FogDissolverCanvas {
  constructor(canvasElement, onClearProgress, onCleared) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.onClearProgress = onClearProgress || (() => {});
    this.onCleared = onCleared || (() => {});

    this.particles = [];
    this.numParticles = 55;
    this.clearedCount = 0;
    this.isCompleted = false;
    this.isInteracting = false;
    this.animationFrameId = null;

    this.clutterLabels = [
      'Infinite Feed', 'Notifications', 'Comparison', 'Doomscroll',
      'Context Switch', 'Overstimulation', 'Fragmented Attention', 'Sensory Noise',
      'Cheap Dopamine', 'Information Overload'
    ];

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindTouchEvents();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = Math.min(360, window.innerHeight * 0.45);
  }

  createParticles() {
    this.particles = [];
    this.clearedCount = 0;
    this.isCompleted = false;

    const width = this.canvas.width || 340;
    const height = this.canvas.height || 260;

    for (let i = 0; i < this.numParticles; i++) {
      const hasLabel = i < this.clutterLabels.length;
      this.particles.push({
        x: Math.random() * (width - 40) + 20,
        y: Math.random() * (height - 40) + 20,
        radius: hasLabel ? Math.random() * 20 + 28 : Math.random() * 15 + 10,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.4 + 0.35,
        targetOpacity: Math.random() * 0.4 + 0.35,
        label: hasLabel ? this.clutterLabels[i] : null,
        dissolved: false,
        dissolveProgress: 0,
      });
    }
  }

  bindTouchEvents() {
    const sweep = (clientX, clientY) => {
      const rect = this.canvas.getBoundingClientRect();
      const touchX = clientX - rect.left;
      const touchY = clientY - rect.top;
      this.dissolveNear(touchX, touchY, 55);
    };

    this.canvas.addEventListener('mousemove', (e) => {
      if (e.buttons === 1 || this.isInteracting) {
        sweep(e.clientX, e.clientY);
      }
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.isInteracting = true;
      sweep(e.clientX, e.clientY);
    });

    window.addEventListener('mouseup', () => {
      this.isInteracting = false;
    });

    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        sweep(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: false });

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        sweep(e.touches[0].clientX, e.touches[0].clientY);
      }
    });
  }

  dissolveNear(x, y, radius = 50) {
    let newlyCleared = 0;
    this.particles.forEach((p) => {
      if (p.dissolved) return;
      const dx = p.x - x;
      const dy = p.y - y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius + p.radius) {
        p.dissolved = true;
        newlyCleared++;
      }
    });

    if (newlyCleared > 0) {
      this.clearedCount = this.particles.filter(p => p.dissolved).length;
      const progress = this.clearedCount / this.particles.length;
      this.onClearProgress(progress);

      if (progress >= 0.8 && !this.isCompleted) {
        this.isCompleted = true;
        this.onCleared();
      }
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const width = this.canvas.width;
    const height = this.canvas.height;

    this.particles.forEach((p) => {
      if (p.dissolved) {
        p.dissolveProgress += 0.05;
        p.opacity = Math.max(0, p.targetOpacity * (1 - p.dissolveProgress));
        p.radius *= 1.02;
      } else {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce gently inside canvas bounds
        if (p.x < p.radius || p.x > width - p.radius) p.vx *= -1;
        if (p.y < p.radius || p.y > height - p.radius) p.vy *= -1;
      }

      if (p.opacity > 0.01) {
        // Draw Soft Glowing Fog Orb
        const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        if (p.label) {
          grad.addColorStop(0, `rgba(140, 175, 195, ${p.opacity * 0.7})`);
          grad.addColorStop(0.7, `rgba(90, 120, 145, ${p.opacity * 0.4})`);
          grad.addColorStop(1, `rgba(30, 45, 65, 0)`);
        } else {
          grad.addColorStop(0, `rgba(136, 192, 168, ${p.opacity * 0.5})`);
          grad.addColorStop(1, `rgba(10, 18, 28, 0)`);
        }

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw Label if available
        if (p.label && p.opacity > 0.15) {
          this.ctx.fillStyle = `rgba(240, 245, 250, ${p.opacity * 0.9})`;
          this.ctx.font = '500 11px Plus Jakarta Sans, sans-serif';
          this.ctx.textAlign = 'center';
          this.ctx.textBaseline = 'middle';
          this.ctx.fillText(p.label, p.x, p.y);
        }
      }
    });

    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
}
