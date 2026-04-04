/* ============================================
   Blake Zhang — Portfolio Scripts
   Lightweight: Orb animation + scroll reveals
   ============================================ */

(function () {
  'use strict';

  // --- Gradient Orb Canvas ---
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  const orbs = [];
  const ORB_COUNT = 5;

  const orbPalette = [
    { r: 52, g: 211, b: 153 },   // emerald
    { r: 129, g: 140, b: 248 },  // indigo
    { r: 56, g: 189, b: 248 },   // sky
    { r: 251, g: 191, b: 36 },   // amber
    { r: 167, g: 139, b: 250 },  // violet
  ];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createOrb(i) {
    const color = orbPalette[i % orbPalette.length];
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 200 + Math.random() * 250,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: color,
      opacity: 0.08 + Math.random() * 0.06,
      phase: Math.random() * Math.PI * 2,
    };
  }

  function init() {
    resize();
    orbs.length = 0;
    for (let i = 0; i < ORB_COUNT; i++) {
      orbs.push(createOrb(i));
    }
  }

  function drawOrb(orb, time) {
    const pulse = Math.sin(time * 0.0005 + orb.phase) * 0.02;
    const currentOpacity = orb.opacity + pulse;
    const gradient = ctx.createRadialGradient(
      orb.x, orb.y, 0,
      orb.x, orb.y, orb.radius
    );
    gradient.addColorStop(0, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${currentOpacity})`);
    gradient.addColorStop(1, `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, 0)`);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    for (const orb of orbs) {
      orb.x += orb.vx;
      orb.y += orb.vy;

      // Soft bounce off edges
      if (orb.x < -orb.radius) orb.x = width + orb.radius;
      if (orb.x > width + orb.radius) orb.x = -orb.radius;
      if (orb.y < -orb.radius) orb.y = height + orb.radius;
      if (orb.y > height + orb.radius) orb.y = -orb.radius;

      drawOrb(orb, time);
    }

    requestAnimationFrame(animate);
  }

  init();
  requestAnimationFrame(animate);
  window.addEventListener('resize', () => {
    resize();
  });

  // --- Nav Scroll Effect ---
  const nav = document.querySelector('.nav');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Scroll Reveal ---
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger children if they have data-delay
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach((el) => observer.observe(el));
})();
