// ============================================================
//  WALLPAPER — adaptive dark/light animated background
// ============================================================
export function initWallpaper(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx    = canvas.getContext('2d');
  let W = 0, H = 0, t = 0;
  let ripples = [];
  let stars   = [];

  // ── Resize ────────────────────────────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  // ── Star field (used in dark mode) ────────────────────────
  function buildStars() {
    const count = Math.floor((W * H) / 5500);
    stars = Array.from({ length: count }, () => ({
      x:    Math.random() * W,
      y:    Math.random() * H,
      r:    Math.random() * 0.9 + 0.2,
      a:    Math.random() * 0.5 + 0.1,
      freq: Math.random() * 0.8 + 0.3,
      phase: Math.random() * Math.PI * 2,
    }));
  }

  // ── Ripples ───────────────────────────────────────────────
  function addRipple(x, y) {
    ripples.push({ x, y, r: 1, a: 0.16, speed: 2.6 });
    if (ripples.length > 18) ripples.shift();
  }

  document.addEventListener('mousemove', e => {
    if (Math.random() < 0.22) addRipple(e.clientX, e.clientY);
  });
  document.addEventListener('mousedown', e => addRipple(e.clientX, e.clientY));

  // ── Theme detection ───────────────────────────────────────
  function isDark() {
    return document.documentElement.getAttribute('data-theme') !== 'light';
  }

  // ── Dark mode layers ──────────────────────────────────────
  function drawDarkBase() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0,    '#101010');
    g.addColorStop(0.45, '#141414');
    g.addColorStop(1,    '#090909');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawStars() {
    stars.forEach(s => {
      const alpha = s.a * (0.7 + 0.3 * Math.sin(t * s.freq + s.phase));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle   = '#ffffff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawGlowBlobs() {
    const blobs = [
      [W * 0.18, H * 0.18, 220],
      [W * 0.76, H * 0.24, 180],
      [W * 0.50, H * 0.52, 230],
      [W * 0.80, H * 0.72, 220],
      [W * 0.18, H * 0.76, 170],
    ];
    blobs.forEach((b, i) => {
      const [x, y, r] = b;
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r + Math.sin(t + i) * 16);
      grad.addColorStop(0,    'rgba(255,255,255,0.075)');
      grad.addColorStop(0.45, 'rgba(255,255,255,0.025)');
      grad.addColorStop(1,    'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawGrid(dark = true) {
    ctx.save();
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.045)' : 'rgba(0,0,0,0.055)';
    ctx.lineWidth = 0.5;
    const size = 42;
    for (let x = 0; x <= W; x += size) {
      const drift = Math.sin(t + x * 0.003) * 2;
      ctx.beginPath(); ctx.moveTo(x + drift, 0); ctx.lineTo(x - drift, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += size) {
      const drift = Math.cos(t + y * 0.004) * 2;
      ctx.beginPath(); ctx.moveTo(0, y + drift); ctx.lineTo(W, y - drift); ctx.stroke();
    }
    ctx.restore();
  }

  function drawVerticalBands(dark = true) {
    ctx.save();
    for (let i = 0; i < 9; i++) {
      const x = (i / 8) * W + Math.sin(t * 0.5 + i) * 24;
      const g = ctx.createLinearGradient(x - 70, 0, x + 70, 0);
      const mid = dark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.025)';
      g.addColorStop(0, dark ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)');
      g.addColorStop(0.5, mid);
      g.addColorStop(1, dark ? 'rgba(255,255,255,0)' : 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 80, 0, 160, H);
    }
    ctx.restore();
  }

  function drawRipples(dark = true) {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.speed;
      rp.a *= 0.96;
      if (rp.a < 0.01) { ripples.splice(i, 1); continue; }

      const c = dark ? '255,255,255' : '0,0,0';
      const grad = ctx.createRadialGradient(rp.x, rp.y, rp.r * 0.2, rp.x, rp.y, rp.r);
      grad.addColorStop(0,   `rgba(${c},${rp.a * 0.20})`);
      grad.addColorStop(0.5, `rgba(${c},${rp.a * 0.08})`);
      grad.addColorStop(1,   `rgba(${c},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2); ctx.fill();

      ctx.strokeStyle = `rgba(${c},${rp.a * 0.34})`;
      ctx.lineWidth   = 0.8;
      ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r * 0.82, 0, Math.PI * 2); ctx.stroke();
    }
  }

  function vignette(dark = true) {
    const col = dark ? 'rgba(0,0,0,0.48)' : 'rgba(0,0,0,0.12)';
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, col);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  // ── Light mode layers ─────────────────────────────────────
  function drawLightBase() {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0,    '#f5f4f0');
    g.addColorStop(0.5,  '#eeecea');
    g.addColorStop(1,    '#f0eeec');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawLightNoisePattern() {
    // Subtle paper texture via tiny randomised dots
    ctx.save();
    ctx.globalAlpha = 0.018;
    ctx.fillStyle = '#000000';
    // Use a seeded-like approach with sin for cheap deterministic noise
    const step = 3;
    for (let x = 0; x < W; x += step) {
      for (let y = 0; y < H; y += step) {
        const v = Math.sin(x * 127.1 + y * 311.7) * 0.5 + 0.5;
        if (v > 0.68) {
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    ctx.restore();
  }

  function drawLightBlobs() {
    const blobs = [
      [W * 0.15, H * 0.15, 260, 'rgba(200,210,255,0.18)'],
      [W * 0.80, H * 0.20, 200, 'rgba(210,240,220,0.14)'],
      [W * 0.50, H * 0.55, 280, 'rgba(240,225,210,0.14)'],
      [W * 0.85, H * 0.75, 220, 'rgba(230,215,245,0.12)'],
      [W * 0.12, H * 0.80, 190, 'rgba(215,240,235,0.12)'],
    ];
    blobs.forEach(([x, y, r, col], i) => {
      const rx = x + Math.sin(t * 0.4 + i) * 18;
      const ry = y + Math.cos(t * 0.3 + i) * 14;
      const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, r);
      grad.addColorStop(0, col);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(rx, ry, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // ── Noise layer performance guard ─────────────────────────
  // Only re-draw the noise once per N frames since it's expensive
  let lastNoiseDraw = -999;
  const NOISE_INTERVAL = 90; // frames

  // ── Main loop ─────────────────────────────────────────────
  let frameCount = 0;
  function frame() {
    t += 0.01;
    frameCount++;

    if (isDark()) {
      drawDarkBase();
      drawGlowBlobs();
      drawVerticalBands(true);
      drawGrid(true);
      drawStars();
      drawRipples(true);
      vignette(true);
    } else {
      drawLightBase();
      // Noise is static-ish — only repaint occasionally
      if (frameCount - lastNoiseDraw >= NOISE_INTERVAL) {
        drawLightNoisePattern();
        lastNoiseDraw = frameCount;
      }
      drawLightBlobs();
      drawGrid(false);
      drawVerticalBands(false);
      drawRipples(false);
      vignette(false);
    }

    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  frame();
}