// ============================================================
//  APP BOOTSTRAP
// ============================================================
import { profile, skills, experiences, projects, blogs } from '../data/profile.js';
import { initWallpaper } from './wallpaper.js';
import { initCursor }    from './cursor.js';
import { initDesktop, openWindow, updateDockState } from './desktop.js';
import { initCarousel }  from './carousel.js';


// ── Theme ────────────────────────────────────────────────────
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  let current = mq.matches ? 'dark' : 'light';
  setTheme(current);

  toggle?.addEventListener('click', () => {
    current = current === 'dark' ? 'light' : 'dark';
    setTheme(current);
    renderContact();
  });

  // Keep in sync if OS theme changes
  mq.addEventListener('change', e => {
    current = e.matches ? 'dark' : 'light';
    setTheme(current);
    renderContact();
  });
}


// ── Clock ────────────────────────────────────────────────────
function initClock() {
  const el = document.getElementById('taskbar-clock');
  if (!el) return;
  const fmt = () => {
    const d = new Date();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    el.innerHTML = `${time}<span>${date}</span>`;
  };
  fmt();
  setInterval(fmt, 30_000);
}


// ── Desktop icon grid ────────────────────────────────────────
function renderDesktopIcons() {
  const grid = document.getElementById('icon-grid');
  if (!grid) return;

  const icons = [
    { icon: 'https://unpkg.com/lucide-static@latest/icons/user-round.svg', label: 'About Me', window: 'about-window', type: 'ui' },
    { icon: 'https://unpkg.com/lucide-static@latest/icons/folder-kanban.svg', label: 'Projects', window: 'projects-window', type: 'ui' },
    { icon: 'https://unpkg.com/lucide-static@latest/icons/zap.svg', label: 'Skills', window: 'skills-window', type: 'ui' },
    { icon: 'https://unpkg.com/lucide-static@latest/icons/briefcase-business.svg', label: 'Experience', window: 'experience-window', type: 'ui' },
    { icon: 'https://unpkg.com/lucide-static@latest/icons/file-pen-line.svg', label: 'Blogs', window: 'blogs-window', type: 'ui' },
    { icon: 'https://unpkg.com/lucide-static@latest/icons/link-2.svg', label: 'Quick Links', window: 'contact-window', type: 'ui' },
  ];

  grid.innerHTML = icons.map(icon => `
    <button class="desktop-icon" data-window="${icon.window}" aria-label="Open ${icon.label}">
      <span class="icon-img">
        <img
          class="desktop-app-icon ${icon.type === 'brand' ? 'brand-icon' : 'ui-app-icon'}"
          src="${icon.icon}"
          alt=""
          aria-hidden="true"
          loading="lazy"
          width="28"
          height="28"
        />
      </span>
      <span class="icon-label">${icon.label}</span>
    </button>
  `).join('');

  // Show on tablet / mobile only
  const show = () => { grid.hidden = window.innerWidth > 900; };
  show();
  window.addEventListener('resize', show);
}


// ── About window ─────────────────────────────────────────────
function renderAbout() {
  const el = document.getElementById('about-content');
  if (!el) return;

  const statsHtml = (profile.stats || []).map(s => `
    <div class="about-stat">
      <span class="about-stat-value">${s.value}</span>
      <span class="about-stat-label">${s.label}</span>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="about-content">
      <div class="about-avatar-col">
        <img class="about-avatar" src="${profile.avatar}" alt="${profile.name}" width="90" height="90" />
        ${statsHtml ? `<div class="about-stats">${statsHtml}</div>` : ''}
      </div>
      <div class="about-info">
        <h2>${profile.name}</h2>
        <div class="role">${profile.title}</div>
        <p>${profile.tagline} I enjoy thinking about system design, backend architecture, real-time systems, and building polished full-stack products from idea to deployment.</p>
        <div class="about-links">
          <a class="about-link" href="${profile.links.github}" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a class="about-link" href="${profile.links.linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
          <a class="about-link" href="mailto:${profile.links.email}">Email ↗</a>
        </div>
      </div>
    </div>
  `;
}


// ── Skills window ─────────────────────────────────────────────
const SKILL_ICONS = {
  "C++":          "cplusplus",
  "Python":       "python",
  "JavaScript":   "javascript",
  "Solidity":     "solidity",
  "React.js":     "react",
  "Node.js":      "nodedotjs",
  "Express.js":   "express",
  "Next.js":      "nextdotjs",
  "Redis":        "redis",
  "Tailwind CSS": "tailwindcss",
  "Prisma":       "prisma",
  "PostgreSQL":   "postgresql",
  "MongoDB":      "mongodb",
  "Git":          "git",
  "GitHub":       "github",
  "Postman":      "postman",
  "VS Code":      "visualstudiocode",
  "Docker":       "docker",
  "Foundry":      "ethereum",
  "Streamlit":    "streamlit",
};

function renderSkillTag(item) {
  const slug = SKILL_ICONS[item];
  if (!slug) return `<span class="skill-tag">${item}</span>`;
  return `
    <span class="skill-tag">
      <img class="skill-logo" src="https://cdn.simpleicons.org/${slug}" alt="" aria-hidden="true" loading="lazy" width="14" height="14" />
      <span>${item}</span>
    </span>
  `;
}

function renderSkills() {
  const el = document.getElementById('skills-content');
  if (!el) return;
  el.innerHTML = `
    <div class="skills-grid">
      ${skills.map(group => `
        <section class="skill-category">
          <h3>${group.category}</h3>
          <div class="skill-tags">
            ${group.items.map(renderSkillTag).join('')}
          </div>
        </section>
      `).join('')}
    </div>
  `;
}


// ── Experience window ─────────────────────────────────────────
function renderExperience() {
  const el = document.getElementById('experience-content');
  if (!el) return;
  el.innerHTML = `
    <div class="exp-list scrollable">
      ${experiences.map(exp => `
        <article class="exp-card">
          <div class="exp-header">
            <div>
              <div class="exp-role">${exp.role}</div>
              <div class="exp-company">${exp.company}</div>
            </div>
            <div class="exp-period">${exp.period}</div>
          </div>
          <div class="exp-desc">${exp.desc}</div>
          <div class="exp-tags">${exp.tags.map(t => `<span class="exp-tag">${t}</span>`).join('')}</div>
        </article>
      `).join('')}
      <p class="exp-open-to">
        <span class="exp-open-dot"></span>
        Open to new opportunities
      </p>
    </div>
  `;
}


// ── Blogs window ──────────────────────────────────────────────
function renderBlogs() {
  const el = document.getElementById('blogs-content');
  if (!el) return;
  el.innerHTML = `
    <div class="blog-list scrollable">
      ${blogs.map(blog => `
        <a class="blog-card" href="${blog.url}" target="_blank" rel="noopener noreferrer">
          <div class="blog-card-left">
            <h3>${blog.title}</h3>
            <p>${blog.desc}</p>
          </div>
          <div class="blog-date">${blog.date}</div>
        </a>
      `).join('')}
      ${blogs.length === 0 ? '<p class="blog-empty">More posts coming soon.</p>' : ''}
    </div>
  `;
}


// ── Contact / Quick Links window ──────────────────────────────
function renderContact() {
  const el = document.getElementById('contact-content');
  if (!el) return;

  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

  const rows = [
    {
      icon: isDark
        ? 'https://cdn.simpleicons.org/github/ffffff'
        : 'https://cdn.simpleicons.org/github/181717',
      label: 'GitHub',
      href: profile.links.github,
      text: '@Srinidhi444',
      type: 'brand'
    },
    {
      icon: isDark
        ? 'https://icons.getbootstrap.com/assets/icons/linkedin.svg'
        : 'https://icons.getbootstrap.com/assets/icons/linkedin.svg',
      label: 'LinkedIn',
      href: profile.links.linkedin,
      text: 'srinidhi-kulkarni',
      type: 'brand linkedin-brand'
    },
   {
  icon: isDark
    ? 'https://cdn.simpleicons.org/medium/ffffff'
    : 'https://cdn.simpleicons.org/medium/000000',
  label: 'Medium',
  href: profile.links.medium,
  text: '@kulkarnisrinidhi85',
  type: 'brand'
},
    {
      icon: isDark
        ? 'https://cdn.simpleicons.org/x/ffffff'
        : 'https://cdn.simpleicons.org/x/000000',
      label: 'Twitter / X',
      href: profile.links.twitter,
      text: '@Srinidhi_kul',
      type: 'brand'
    },
    {
      icon: 'https://unpkg.com/lucide-static@latest/icons/mail.svg',
      label: 'Email',
      href: `mailto:${profile.links.email}`,
      text: profile.links.email,
      type: 'ui-contact-icon'
    },
  ];

  el.innerHTML = `
    <div class="contact-content">
      ${rows.map(r => `
        <div class="contact-row">
          <div class="contact-icon">
            <img
              class="contact-logo ${r.type}"
              src="${r.icon}"
              alt=""
              aria-hidden="true"
              loading="lazy"
              width="20"
              height="20"
            />
          </div>
          <div class="contact-info">
            <label>${r.label}</label>
            <a href="${r.href}" target="_blank" rel="noopener noreferrer">${r.text}</a>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}


// ── Hero typing animation ─────────────────────────────────────
function initHeroTyping() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    title.textContent = 'Welcome to my portfolio';
    return;
  }

  const phrases = [
    'Welcome to my portfolio',
    'I build full-stack apps',
    'Exploring Web3 & Solidity',
    'Let\'s create something great',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let deleting   = false;
  const PAUSE_FULL  = 2200;
  const PAUSE_EMPTY = 400;
  const TYPE_SPEED  = 68;
  const DEL_SPEED   = 32;

  function tick() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      charIdx++;
      title.textContent = phrase.slice(0, charIdx);
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE_FULL);
        return;
      }
    } else {
      charIdx--;
      title.textContent = phrase.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, PAUSE_EMPTY);
        return;
      }
    }

    setTimeout(tick, deleting ? DEL_SPEED : TYPE_SPEED);
  }

  title.textContent = '';
  setTimeout(tick, 600);
}


// ── Hero subtitle scroll-reveal ───────────────────────────────
function initHeroReveal() {
  const items = document.querySelectorAll('.hero-kicker, .hero-subtitle');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  items.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = `opacity 0.6s ease ${i * 0.15 + 0.2}s, transform 0.6s ease ${i * 0.15 + 0.2}s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '';
      el.style.transform = '';
    }));
  });
}


// ── Taskbar tooltip accessibility ────────────────────────────
function initTaskbarA11y() {
  document.querySelectorAll('.taskbar-btn[data-window]').forEach(btn => {
    btn.setAttribute('role', 'button');
  });
}


// ── Boot ─────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', async () => {
  initThemeToggle();
  initClock();
  renderDesktopIcons();
  renderAbout();
  renderSkills();
  renderExperience();
  renderBlogs();
  renderContact();
  initWallpaper('wallpaper-canvas');
  initCursor();
  initDesktop();
  initTaskbarA11y();
  initHeroTyping();
  initHeroReveal();
  updateDockState();
  await initCarousel('carousel-canvas', projects);
});