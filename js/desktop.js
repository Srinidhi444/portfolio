// ============================================================
//  DESKTOP WINDOW MANAGER
// ============================================================

let zTop = 200;

export function updateDockState() {
  document.querySelectorAll('.taskbar-btn[data-window]').forEach(btn => {
    const id = btn.dataset.window;
    const win = document.getElementById(id);
    const open = !!win && win.classList.contains('open') && !win.classList.contains('minimized');
    btn.classList.toggle('is-open', open);
  });
}


export function closeWindow(id) {
  const win = typeof id === 'string' ? document.getElementById(id) : id;
  if (!win) return;
  win.classList.remove('open', 'focused', 'minimized');
  updateDockState();
}

export function toggleWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  if (win.classList.contains('open') && !win.classList.contains('minimized')) {
    closeWindow(win);
    updateDockState();
  } else {
    openWindow(id);
    updateDockState();
  }
}

export function initDesktop() {
  // Open/close windows on single click like desktop apps
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const target = icon.dataset.window;
      if (target) toggleWindow(target);
    });
  });

  // Taskbar icon clicks toggle too
  document.querySelectorAll('.taskbar-btn[data-window]').forEach(btn => {
    btn.addEventListener('click', () => toggleWindow(btn.dataset.window));
  });

  // Init all windows
  document.querySelectorAll('.window').forEach(win => {
    makeWindow(win);
  });
}

export function openWindow(id) {
  const win = document.getElementById(id);
  if (!win) return;
  if (win.classList.contains('open') && !win.classList.contains('minimized')) {
    focusWindow(win);
    return;
  }
  win.classList.remove('minimized');
  win.classList.add('open');
  focusWindow(win);
  updateDockState();

  // Center if first open
  if (!win.dataset.positioned) {
    const W = window.innerWidth, H = window.innerHeight;
    const w = win.offsetWidth  || parseInt(win.style.width)  || 720;
    const h = win.offsetHeight || parseInt(win.style.height) || 500;
    win.style.left = Math.max(60, (W - w) / 2 + (Math.random() - 0.5) * 80) + 'px';
    win.style.top  = Math.max(40, (H - h) / 2 + (Math.random() - 0.5) * 60) + 'px';
    win.dataset.positioned = '1';
  }
}

function focusWindow(win) {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('focused'));
  win.classList.add('focused');
  win.style.zIndex = ++zTop;
}

function makeWindow(win) {
  const titlebar = win.querySelector('.window-titlebar');
  const closeBtn = win.querySelector('.wc-close');
  const minBtn   = win.querySelector('.wc-min');
  const maxBtn   = win.querySelector('.wc-max');
  const rightMin = win.querySelector('.wa-min');
  const rightMax = win.querySelector('.wa-max');

  // Focus on click
  win.addEventListener('mousedown', () => focusWindow(win), true);
  closeBtn?.addEventListener('mousedown', e => e.stopPropagation());
  minBtn?.addEventListener('mousedown', e => e.stopPropagation());
  maxBtn?.addEventListener('mousedown', e => e.stopPropagation());
  rightMin?.addEventListener('mousedown', e => e.stopPropagation());
  rightMax?.addEventListener('mousedown', e => e.stopPropagation());

  // Close
  closeBtn?.addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
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
      win.style.left = savedGeom.left;
      win.style.top  = savedGeom.top;
      win.style.width  = savedGeom.width;
      win.style.height = savedGeom.height;
      savedGeom = null;
    } else {
      savedGeom = { left: win.style.left, top: win.style.top, width: win.style.width, height: win.style.height };
      const dock = document.getElementById('taskbar');
      const dockH = dock ? dock.offsetHeight + 20 : 80;
      win.style.left = '12px'; win.style.top = '12px';
      win.style.width  = (window.innerWidth - 24) + 'px';
      win.style.height = (window.innerHeight - dockH - 20) + 'px';
    }
  }
  maxBtn?.addEventListener('click', doMaximize);
  rightMax?.addEventListener('click', doMaximize);

  // Drag
  let dragging = false, ox = 0, oy = 0;
  titlebar?.addEventListener('mousedown', e => {
    if (e.target.classList.contains('wc-btn')) return;
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
  document.addEventListener('mouseup', () => { dragging = false; document.body.style.userSelect = ''; });

  // Resize via handle
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
    document.addEventListener('mouseup', () => { resizing = false; document.body.style.userSelect = ''; });
  }
}
