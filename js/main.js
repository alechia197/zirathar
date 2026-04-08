/* ═══════════════════════════════════════════
   ZIRATHAR — Scripts compartidos
   ═══════════════════════════════════════════ */

// ═══ CANVAS FUEGO ═══
class FireParticles {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.count = 120;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.init();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  init() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedY: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.8,
      life: 1,
      decay: Math.random() * 0.008 + 0.003,
      color: Math.random() > 0.5 ? '#ff6b35' : '#ff8c42',
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.03 + 0.01,
    };
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.y -= p.speedY;
      p.wobble += p.wobbleSpeed;
      p.x += p.speedX + Math.sin(p.wobble) * 0.3;
      p.life -= p.decay;
      p.size *= 0.999;

      if (p.life <= 0 || p.y < -10) {
        this.particles[i] = this.createParticle();
        continue;
      }

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life * 0.6;
      this.ctx.fill();

      // Glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      const grad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
      grad.addColorStop(0, p.color);
      grad.addColorStop(1, 'transparent');
      this.ctx.fillStyle = grad;
      this.ctx.globalAlpha = p.life * 0.15;
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
    requestAnimationFrame(() => this.animate());
  }
}

// ═══ SCROLL REVEAL ═══
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reino-card, .reveal').forEach(el => {
    observer.observe(el);
  });
}

// ═══ TOGGLE IDIOMA ═══
function initLangToggle() {
  const btnEs = document.getElementById('lang-es');
  const btnEn = document.getElementById('lang-en');
  if (!btnEs || !btnEn) return;

  let currentLang = 'es';

  function setLang(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-es]').forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });
    btnEs.classList.toggle('active', lang === 'es');
    btnEn.classList.toggle('active', lang === 'en');
  }

  btnEs.addEventListener('click', () => setLang('es'));
  btnEn.addEventListener('click', () => setLang('en'));
}

// ═══ INIT ═══
document.addEventListener('DOMContentLoaded', () => {
  const heroCanvas = document.getElementById('hero-fire');
  if (heroCanvas) {
    new FireParticles(heroCanvas);
  }
  initScrollReveal();
  initLangToggle();
});
