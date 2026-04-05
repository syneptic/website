/* ═══════════════════════════════════════════════════════════
   SYNEPTIC — main.js
   Particles, Scroll Animations, Nav, Counter, Form
═══════════════════════════════════════════════════════════ */

'use strict';

// ── Wait for DOM ──
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initScrollReveal();
  initCounters();
  initContactForm();
  initHamburger();
  initSmoothScroll();
});

/* ══════════════════════════════════════
   1. PARTICLE CANVAS (hero background)
══════════════════════════════════════ */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles, mouse;
  mouse = { x: null, y: null };

  const GOLD = 'rgba(201,168,76,';
  const CONFIG = {
    count: 80,
    maxRadius: 3,
    minRadius: 0.5,
    speed: 0.4,
    connectionDist: 140,
    mouseRepelDist: 100,
    mouseRepelForce: 1.5,
  };

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : (Math.random() > 0.5 ? -10 : H + 10);
      this.vx = (Math.random() - 0.5) * CONFIG.speed;
      this.vy = (Math.random() - 0.5) * CONFIG.speed;
      this.r = CONFIG.minRadius + Math.random() * (CONFIG.maxRadius - CONFIG.minRadius);
      this.alpha = 0.3 + Math.random() * 0.5;
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.02;
    }
    update() {
      this.pulse += this.pulseSpeed;
      const currentAlpha = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));

      // Mouse repel
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.mouseRepelDist) {
          const force = (CONFIG.mouseRepelDist - dist) / CONFIG.mouseRepelDist;
          this.vx += (dx / dist) * force * CONFIG.mouseRepelForce * 0.1;
          this.vy += (dy / dist) * force * CONFIG.mouseRepelForce * 0.1;
        }
      }

      // Drag
      this.vx *= 0.99;
      this.vy *= 0.99;

      this.x += this.vx;
      this.y += this.vy;

      // Wrap edges
      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;

      this._alpha = currentAlpha;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this._alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = GOLD + '1)';
      ctx.fill();
      // Glow
      ctx.shadowBlur = 8;
      ctx.shadowColor = GOLD + '0.6)';
      ctx.fill();
      ctx.restore();
    }
  }

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    if (!particles || particles.length !== CONFIG.count) {
      particles = Array.from({ length: CONFIG.count }, () => new Particle());
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.connectionDist) {
          const alpha = (1 - dist / CONFIG.connectionDist) * 0.35;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = GOLD + '1)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }

  resize();
  animate();

  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
}

/* ══════════════════════════════════════
   2. NAVBAR — scroll-toggle
══════════════════════════════════════ */
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ══════════════════════════════════════
   3. HAMBURGER MENU
══════════════════════════════════════ */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
    // Animate spans
    const spans = btn.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

/* ══════════════════════════════════════
   4. SMOOTH SCROLL
══════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════
   5. SCROLL REVEAL (Intersection Observer)
══════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('visible'), delay);
      observer.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   6. COUNTER ANIMATION
══════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const DURATION = 1800;

  const animateCounter = (el, target) => {
    const start = performance.now();
    const tick = now => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      animateCounter(el, target);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════
   7. CONTACT FORM
══════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Loading state
    btn.disabled = true;
    btn.querySelector('.btn-text').textContent = 'Sending...';
    btn.querySelector('.btn-icon').textContent = '⏳';

    try {
      const formData = new FormData(form);
      
      // We use formsubmit.co AJAX API for backend-less email sending
      const response = await fetch('https://formsubmit.co/ajax/syneptic.it@gmail.com', {
        method: 'POST',
        headers: { 
            'Accept': 'application/json'
        },
        body: formData
      });
      
      if (!response.ok) {
        // If the email is not yet activated, FormSubmit blocks AJAX.
        // We fallback to a standard form submission so the browser navigates
        // successfully to the FormSubmit Captcha/Activation page.
        form.action = 'https://formsubmit.co/syneptic.it@gmail.com';
        form.method = 'POST';
        form.submit();
        return;
      }

      // Success visual feedback
      btn.querySelector('.btn-text').textContent = 'Message Sent!';
      btn.querySelector('.btn-icon').textContent = '✅';
      success.classList.add('show');
      form.reset();

    } catch (err) {
      console.error(err);
      alert('There was a problem sending your message. Please reach out to syneptic.it@gmail.com directly.');
    } finally {
      setTimeout(() => {
        btn.disabled = false;
        btn.querySelector('.btn-text').textContent = 'Send Message';
        btn.querySelector('.btn-icon').textContent = '→';
        success.classList.remove('show');
      }, 5000);
    }
  });
}
