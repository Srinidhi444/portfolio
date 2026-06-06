// ============================================================
//  CUSTOM CURSOR + WATER RIPPLE EFFECT
// ============================================================

export function initCursor() {
  const pointer = document.getElementById('cursor-pointer');
  const rippleCanvas = document.getElementById('ripple-canvas');
  const rctx  = rippleCanvas.getContext('2d');

  let mx = -100, my = -100;
  let ringX = -100, ringY = -100;
  const ripples = [];

  // Resize ripple canvas
  function resizeRipple() {
    rippleCanvas.width  = window.innerWidth;
    rippleCanvas.height = window.innerHeight;
  }
  resizeRipple();
  window.addEventListener('resize', resizeRipple);

  // Smooth cursor tracking
  function lerp(a, b, n) { return a + (b - a) * n; }

  // Move
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    // Spawn tiny ripple on move (throttled)
    if (Math.random() < 0.08) spawnRipple(mx, my, 6, 0.12);
  });

  // Click  → big ripple
  document.addEventListener('mousedown', e => {
    document.body.classList.add('cursor-click');
    spawnRipple(e.clientX, e.clientY, 60, 0.6);
    spawnRipple(e.clientX, e.clientY, 30, 0.4);
  });
  document.addEventListener('mouseup', () => document.body.classList.remove('cursor-click'));
  document.addEventListener('mouseleave', () => { if (pointer) pointer.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { if (pointer) pointer.style.opacity = '1'; });

  // Hover detection
  document.addEventListener('mouseover', e => {
    const el = e.target.closest('button, a, .desktop-icon, .taskbar-btn, .window-titlebar, .carousel-arrow, [data-hover]');
    if (el) document.body.classList.add('cursor-hover');
    else document.body.classList.remove('cursor-hover');
  });

  // ---- Ripple system ----
  function spawnRipple(x, y, maxR, alpha) {
    ripples.push({ x, y, r: 1, maxR, alpha, speed: maxR / 28 });
  }

  function drawRipples() {
    rctx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.speed;
      rp.alpha *= 0.93;
      if (rp.alpha < 0.01 || rp.r > rp.maxR) { ripples.splice(i, 1); continue; }

      // Accent color from CSS var
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#6c63ff';
      rctx.save();
      rctx.globalAlpha = rp.alpha;
      rctx.strokeStyle = accent;
      rctx.lineWidth = 1.5;
      rctx.beginPath();
      rctx.arc(rp.r > 8 ? rp.x : rp.x, rp.y, rp.r, 0, Math.PI * 2);
      rctx.stroke();

      // Second inner ring offset
      if (rp.maxR > 20) {
        rctx.globalAlpha = rp.alpha * 0.4;
        rctx.beginPath();
        rctx.arc(rp.x, rp.y, rp.r * 0.6, 0, Math.PI * 2);
        rctx.stroke();
      }
      rctx.restore();
    }
  }

  // Animate ring (lagging behind cursor)
  function animateRing() {
    ringX = lerp(ringX, mx, 0.14);
    ringY = lerp(ringY, my, 0.14);
    pointer.style.transform = `translate(${ringX}px, ${ringY}px)`;
    drawRipples();
    requestAnimationFrame(animateRing);
  }
  animateRing();
}
