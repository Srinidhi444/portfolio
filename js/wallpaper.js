// ============================================================
//  WALLPAPER — matrix/grid style monochrome background
// ============================================================
export function initWallpaper(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, t = 0;
  let ripples = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function addRipple(x, y) {
    ripples.push({ x, y, r: 1, a: 0.16, speed: 2.6 });
    if (ripples.length > 18) ripples.shift();
  }

  document.addEventListener('mousemove', e => {
    if (Math.random() < 0.22) addRipple(e.clientX, e.clientY);
  });
  document.addEventListener('mousedown', e => addRipple(e.clientX, e.clientY));

  function drawBase() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#101010');
    g.addColorStop(0.45, '#141414');
    g.addColorStop(1, '#090909');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
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
      grad.addColorStop(0, 'rgba(255,255,255,0.075)');
      grad.addColorStop(0.45, 'rgba(255,255,255,0.025)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.045)';
    ctx.lineWidth = 0.5;
    const size = 42;
    for (let x = 0; x <= W; x += size) {
      const drift = Math.sin(t + x * 0.003) * 2;
      ctx.beginPath();
      ctx.moveTo(x + drift, 0);
      ctx.lineTo(x - drift, H);
      ctx.stroke();
    }
    for (let y = 0; y <= H; y += size) {
      const drift = Math.cos(t + y * 0.004) * 2;
      ctx.beginPath();
      ctx.moveTo(0, y + drift);
      ctx.lineTo(W, y - drift);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawVerticalBands() {
    ctx.save();
    for (let i = 0; i < 9; i++) {
      const x = (i / 8) * W + Math.sin(t * 0.5 + i) * 24;
      const grad = ctx.createLinearGradient(x - 70, 0, x + 70, 0);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.04)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - 80, 0, 160, H);
    }
    ctx.restore();
  }

  function drawRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.speed;
      rp.a *= 0.96;
      if (rp.a < 0.01) { ripples.splice(i, 1); continue; }

      const grad = ctx.createRadialGradient(rp.x, rp.y, rp.r * 0.2, rp.x, rp.y, rp.r);
      grad.addColorStop(0, `rgba(255,255,255,${rp.a * 0.20})`);
      grad.addColorStop(0.5, `rgba(255,255,255,${rp.a * 0.08})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = `rgba(255,255,255,${rp.a * 0.34})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(rp.x, rp.y, rp.r * 0.82, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function vignette() {
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(0,0,0,0.48)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function frame() {
    t += 0.01;
    drawBase();
    drawGlowBlobs();
    drawVerticalBands();
    drawGrid();
    drawRipples();
    vignette();
    requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  frame();
}
