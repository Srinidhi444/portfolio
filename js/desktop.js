// ============================================================
//  DESKTOP WINDOW MANAGER
// ============================================================

let zTop = 200;

// ── Dock state ────────────────────────────────────────────────
export function updateDockState() {
  document.querySelectorAll('.taskbar-btn[data-window]').forEach(btn => {
    const win  = document.getElementById(btn.dataset.window);
    const open = !!win && win.classList.contains('open') && !win.classList.contains('minimized');
    btn.classList.toggle('is-open', open);
  });
}

// ── Close ─────────────────────────────────────────────────────
export function closeWindow(id) {
  const win = typeof id === 'string' ? document.getElementById(id) : id;
  if (!win) return;
  win.classList.remove('open', 'focused', 'minimized');
  updateDockState();
}

// ── Toggle ────────────────────────────────────────────────────
export function toggleWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  if (win.classList.contains('open') && !win.classList.contains('minimized')) {
    // If already focused → minimize; otherwise bring to front
    if (win.classList.contains('focused')) {
      win.classList.add('minimized');
    } else {
      focusWindow(win);
    }
    updateDockState();
  } else {
    openWindow(id);
  }
}

// ── Open ──────────────────────────────────────────────────────
export function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;

  // Already open & visible → just focus
  if (win.classList.contains('open') && !win.classList.contains('minimized')) {
    focusWindow(win);
    return;
  }

  win.classList.remove('minimized');
  win.classList.add('open');
  focusWindow(win);
  updateDockState();

  // Position: restore from sessionStorage, else center with slight randomness
  if (!win.dataset.positioned) {
    const saved = sessionStorage.getItem('win-pos-' + id);
    if (saved) {
      try {
        const { left, top, width, height } = JSON.parse(saved);
        win.style.left   = left;
        win.style.top    = top;
        if (width)  win.style.width  = width;
        if (height) win.style.height = height;
      } catch { /* ignore */ }
    } else {
      const vW = window.innerWidth, vH = window.innerHeight;
      const w  = win.offsetWidth  || parseInt(win.style.width)  || 720;
      const h  = win.offsetHeight || parseInt(win.style.height) || 500;
      const jitterX = (Math.random() - 0.5) * 80;
      const jitterY = (Math.random() - 0.5) * 60;
      win.style.left = Math.max(60, (vW - w) / 2 + jitterX) + 'px';
      win.style.top  = Math.max(40, (vH - h) / 2 + jitterY) + 'px';
    }
    win.dataset.positioned = '1';
  }
}

// ── Focus ─────────────────────────────────────────────────────
function focusWindow(win) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
  win.classList.add('focused');
  win.style.zIndex = ++zTop;
}

// ── Save position to sessionStorage ──────────────────────────
function savePosition(win) {
  try {
    sessionStorage.setItem('win-pos-' + win.id, JSON.stringify({
      left:   win.style.left,
      top:    win.style.top,
      width:  win.style.width,
      height: win.style.height,
    }));
  } catch { /* ignore quota errors */ }
}

// ── Init all windows ──────────────────────────────────────────
export function initDesktop() {
  // Desktop icon clicks
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const target = icon.dataset.window;
      if (target) toggleWindow(target);
    });
  });

  // Taskbar icon clicks
  document.querySelectorAll('.taskbar-btn[data-window]').forEach(btn => {
    btn.addEventListener('click', () => toggleWindow(btn.dataset.window));
  });

  // Init each window's behaviour
  document.querySelectorAll('.window').forEach(makeWindow);

  // Close all windows with Escape (focuses-last approach)
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const focused = document.querySelector('.window.open.focused');
    if (focused) closeWindow(focused);
  });
}

// ── Per-window setup ──────────────────────────────────────────
function makeWindow(win) {
  const titlebar = win.querySelector('.window-titlebar');
  const closeBtn = win.querySelector('.wc-close');
  const minBtn   = win.querySelector('.wc-min');
  const maxBtn   = win.querySelector('.wc-max');
  const rightMin = win.querySelector('.wa-min');
  const rightMax = win.querySelector('.wa-max');

  // Focus on click — stop propagation from control buttons
  win.addEventListener('mousedown', () => focusWindow(win), true);
  [closeBtn, minBtn, maxBtn, rightMin, rightMax].forEach(b => {
    b?.addEventListener('mousedown', e => e.stopPropagation());
  });

  // Close
  closeBtn?.addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    closeWindow(win);
    updateDockState();
  });

  // Minimize
  function doMinimize(e) {
    e?.stopPropagation?.();
    win.classList.add('minimized');
    updateDockState();
  }
  minBtn?.addEventListener('click', doMinimize);
  rightMin?.addEventListener('click', doMinimize);

  // Maximize / restore
  let savedGeom = null;
  function doMaximize(e) {
    e?.stopPropagation?.();
    if (savedGeom) {
      Object.assign(win.style, savedGeom);
      savedGeom = null;
    } else {
      savedGeom = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height };
      const dock = document.getElementById('taskbar');
      const dockH = dock ? dock.offsetHeight + 20 : 80;
      win.style.left   = '12px';
      win.style.top    = '12px';
      win.style.width  = (window.innerWidth - 24) + 'px';
      win.style.height = (window.innerHeight - dockH - 20) + 'px';
    }
    savePosition(win);
  }
  maxBtn?.addEventListener('click', doMaximize);
  rightMax?.addEventListener('click', doMaximize);
  // Double-click titlebar to maximise (desktop convention)
  titlebar?.addEventListener('dblclick', e => {
    if (e.target.classList.contains('wc-btn')) return;
    doMaximize(e);
  });

  // ── Drag (mouse) ───────────────────────────────────────────
  let dragging = false, ox = 0, oy = 0;
  titlebar?.addEventListener('mousedown', e => {
    if (e.target.classList.contains('wc-btn') || e.target.classList.contains('wa-btn')) return;
    if (e.button !== 0) return;
    dragging = true;
    ox = e.clientX - win.offsetLeft;
    oy = e.clientY - win.offsetTop;
    document.body.style.userSelect = 'none';
  });
  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const nx = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - ox));
    const ny = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - oy));
    win.style.left = nx + 'px';
    win.style.top  = ny + 'px';
  });
  document.addEventListener('mouseup', () => {
    if (dragging) { dragging = false; savePosition(win); }
    document.body.style.userSelect = '';
  });

  // ── Drag (touch — for tablet / stylus) ─────────────────────
  let touchDragging = false, tx0 = 0, ty0 = 0, twLeft = 0, twTop = 0;
  titlebar?.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchDragging = true;
    tx0    = touch.clientX;
    ty0    = touch.clientY;
    twLeft = win.offsetLeft;
    twTop  = win.offsetTop;
  }, { passive: true });
  titlebar?.addEventListener('touchmove', e => {
    if (!touchDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    const nx = Math.max(0, Math.min(window.innerWidth - 100, twLeft + touch.clientX - tx0));
    const ny = Math.max(0, Math.min(window.innerHeight - 60, twTop  + touch.clientY - ty0));
    win.style.left = nx + 'px';
    win.style.top  = ny + 'px';
  }, { passive: false });
  titlebar?.addEventListener('touchend', () => {
    touchDragging = false;
    savePosition(win);
  });

  // ── Resize handle ──────────────────────────────────────────
  const resizeHandle = win.querySelector('.window-resize');
  if (resizeHandle) {
    let resizing = false, startX, startY, startW, startH;
    resizeHandle.addEventListener('mousedown', e => {
      e.stopPropagation();
      resizing = true;
      startX = e.clientX; startY = e.clientY;
      startW = win.offsetWidth; startH = win.offsetHeight;
      document.body.style.userSelect = 'none';
    });
    document.addEventListener('mousemove', e => {
      if (!resizing) return;
      const w = Math.max(340, startW + e.clientX - startX);
      const h = Math.max(240, startH + e.clientY - startY);
      win.style.width  = w + 'px';
      win.style.height = h + 'px';
    });
    document.addEventListener('mouseup', () => {
      if (resizing) { resizing = false; savePosition(win); }
      document.body.style.userSelect = '';
    });
  }
}