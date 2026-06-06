// ============================================================
//  3D CURVED PROJECT CAROUSEL — wheel + swipe + mobile arrows
// ============================================================
export async function initCarousel(canvasId, projects) {
  const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js');
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const container = canvas.parentElement;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.set(0, 0.35, 8.8);

  scene.add(new THREE.AmbientLight(0xffffff, 0.65));
  const dl = new THREE.DirectionalLight(0xffffff, 1.1);
  dl.position.set(2, 3, 4);
  scene.add(dl);

  const room = new THREE.Group();
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(34, 18, 32, 20), wireMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, -2.2, -6.5);
  room.add(floor);

  const back = new THREE.Mesh(new THREE.PlaneGeometry(34, 18, 32, 20), wireMat);
  back.position.set(0, 3.8, -13);
  room.add(back);

  const left = new THREE.Mesh(new THREE.PlaneGeometry(18, 16, 18, 20), wireMat);
  left.position.set(-12, 3.5, -6.5);
  left.rotation.y = Math.PI / 2.15;
  room.add(left);

  const right = new THREE.Mesh(new THREE.PlaneGeometry(18, 16, 18, 20), wireMat);
  right.position.set(12, 3.5, -6.5);
  right.rotation.y = -Math.PI / 2.15;
  room.add(right);

  scene.add(room);

  const loader = new THREE.TextureLoader();
  const textures = await Promise.all(
    projects.map(p => new Promise(r => loader.load(p.image, r, undefined, () => r(null))))
  );

  const cards = [];
  let currentIdx = 0;
  let targetOffset = 0;
  let currentOffset = 0;
  const R = 6.9;
  const spacing = 0.86;

  function isMobile() {
    return window.innerWidth <= 768;
  }

  function goTo(index) {
    currentIdx = (index + projects.length) % projects.length;
    targetOffset = currentIdx;
    updateHUD(currentIdx);
  }

  function nextProject() {
    goTo(currentIdx + 1);
  }

  function prevProject() {
    goTo(currentIdx - 1);
  }

  function createRoundedTexture(tex) {
    if (!tex || !tex.image) return tex;
    const w = 1024, h = 640, radius = 42;
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');

    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(w - radius, 0);
    ctx.quadraticCurveTo(w, 0, w, radius);
    ctx.lineTo(w, h - radius);
    ctx.quadraticCurveTo(w, h, w - radius, h);
    ctx.lineTo(radius, h);
    ctx.quadraticCurveTo(0, h, 0, h - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(tex.image, 0, 0, w, h);

    const out = new THREE.CanvasTexture(c);
    out.colorSpace = THREE.SRGBColorSpace;
    return out;
  }

  projects.forEach((proj, i) => {
    const geo = new THREE.PlaneGeometry(7.8, 4.8, 64, 22);
    const pos = geo.attributes.position;

    for (let v = 0; v < pos.count; v++) {
      const x = pos.getX(v);
      const nx = x / 3.9;
      const z = Math.abs(nx) * 0.82 - 0.30;
      pos.setZ(v, z);
    }

    pos.needsUpdate = true;
    geo.computeVertexNormals();

    const map = createRoundedTexture(textures[i]);
    const mat = new THREE.MeshPhysicalMaterial({
      map: map || null,
      color: map ? 0xffffff : 0xbdbdbd,
      roughness: 0.5,
      transmission: 0.02,
      clearcoat: 0.22,
      transparent: true,
      opacity: 1,
      side: THREE.DoubleSide
    });

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);
    cards.push(mesh);
  });

  function updateHUD(active) {
    const p = projects[active];
    document.getElementById('carousel-date').textContent = p.date;
    document.getElementById('carousel-title').textContent = p.title;
    document.getElementById('carousel-subtitle').textContent = p.subtitle;
    document.getElementById('carousel-desc').textContent = p.desc;
    document.getElementById('carousel-github').href = p.github;

    const demoBtn = document.getElementById('carousel-demo');
    if (demoBtn) {
      if (p.demo && p.demo.enabled) {
        demoBtn.href = p.demo.url;
        demoBtn.style.display = 'inline-flex';
      } else {
        demoBtn.style.display = 'none';
      }
    }

    document.getElementById('carousel-tags').innerHTML =
      p.tags.map(t => `<span class="ctag">${t}</span>`).join('');

    document.querySelectorAll('.cdot').forEach((d, i) => {
      d.classList.toggle('active', i === active);
    });
  }

  const dotsEl = document.getElementById('carousel-dots');
  dotsEl.innerHTML = '';
  projects.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'cdot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(d);
  });

  const navEl = document.getElementById('carousel-nav');
  if (navEl) {
    navEl.innerHTML = `
      <button class="carousel-arrow carousel-arrow-left" type="button" aria-label="Previous project">‹</button>
      <button class="carousel-arrow carousel-arrow-right" type="button" aria-label="Next project">›</button>
    `;

    const prevBtn = navEl.querySelector('.carousel-arrow-left');
    const nextBtn = navEl.querySelector('.carousel-arrow-right');

    prevBtn?.addEventListener('click', prevProject);
    nextBtn?.addEventListener('click', nextProject);

    const updateNavVisibility = () => {
      navEl.style.display = isMobile() ? 'flex' : 'none';
    };

    updateNavVisibility();
    window.addEventListener('resize', updateNavVisibility);
  }

  let wheelCooldown = false;
  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    if (wheelCooldown || isMobile()) return;

    wheelCooldown = true;
    setTimeout(() => {
      wheelCooldown = false;
    }, 850);

    if (e.deltaY > 0) nextProject();
    else prevProject();
  }, { passive: false });

  let mx = 0;
  let my = 0;
  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  });

  let touchStartX = 0;
  let touchDeltaX = 0;

  canvas.addEventListener('touchstart', e => {
    if (!isMobile()) return;
    touchStartX = e.touches[0].clientX;
    touchDeltaX = 0;
  }, { passive: true });

  canvas.addEventListener('touchmove', e => {
    if (!isMobile()) return;
    touchDeltaX = e.touches[0].clientX - touchStartX;
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    if (!isMobile()) return;

    if (touchDeltaX <= -40) nextProject();
    else if (touchDeltaX >= 40) prevProject();

    touchDeltaX = 0;
  });

  function animate() {
    requestAnimationFrame(animate);

    currentOffset += (targetOffset - currentOffset) * 0.014;

    const targetCamX = isMobile() ? 0 : mx * 0.35;
    const targetCamY = isMobile() ? 0.34 : (-my * 0.18 + 0.42);

    camera.position.x += (targetCamX - camera.position.x) * 0.035;
    camera.position.y += (targetCamY - camera.position.y) * 0.04;
    camera.lookAt(0, 0.2, -6.9);
    room.rotation.y += isMobile() ? 0.00035 : 0.0007;

    cards.forEach((card, i) => {
      const rel = i - currentOffset;
      const a = rel * (isMobile() ? 0.72 : spacing);
      const radius = isMobile() ? 5.9 : R;

      card.position.x = Math.sin(a) * radius;
      card.position.z = Math.cos(a) * radius - (radius + (isMobile() ? 1.8 : 3.0));
      card.position.y = Math.sin(performance.now() * 0.001 + i * 0.65) * 0.04 + (isMobile() ? 0.12 : 0.15);
      card.rotation.y = -a * 0.98;

      const active = Math.abs(i - currentIdx) < 0.001;
      const targetScale = active ? (isMobile() ? 1.14 : 1.18) : (isMobile() ? 0.52 : 0.68);

      card.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.06);
      card.material.opacity += ((active ? 1 : (isMobile() ? 0.18 : 0.24)) - card.material.opacity) * 0.08;
    });

    renderer.render(scene, camera);
  }

  const ro = new ResizeObserver(() => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  ro.observe(container);
  updateHUD(0);
  animate();
}