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
  });
  // Keep in sync if OS theme changes
  mq.addEventListener('change', e => {
    current = e.matches ? 'dark' : 'light';
    setTheme(current);
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
    { emoji: '👤', label: 'About Me',    window: 'about-window' },
    { emoji: '🗂️', label: 'Projects',   window: 'projects-window' },
    { emoji: '⚡',  label: 'Skills',     window: 'skills-window' },
    { emoji: '💼',  label: 'Experience', window: 'experience-window' },
    { emoji: '✍️', label: 'Blogs',      window: 'blogs-window' },
    { emoji: '🔗',  label: 'Quick Links',window: 'contact-window' },
  ];
  grid.innerHTML = icons.map(icon => `
    <button class="desktop-icon" data-window="${icon.window}" aria-label="Open ${icon.label}">
      <span class="icon-img">${icon.emoji}</span>
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
          <a class="about-link" href="${profile.links.github}"   target="_blank" rel="noopener noreferrer">GitHub ↗</a>
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
  "VS Code":      "",
  "Docker":       "docker",
  "Foundry":      "ethereum",   // no Foundry icon on simpleicons — use ethereum
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
  const rows = [
    { icon: '🐙', label: 'GitHub',      href: profile.links.github,            text: '@Srinidhi444' },
    { icon: '💼', label: 'LinkedIn',    href: profile.links.linkedin,           text: 'srinidhi-kulkarni' },
    { icon: '✍️', label: 'Medium',      href: profile.links.medium,             text: '@kulkarnisrinidhi85' },
    { icon: '𝕏',  label: 'Twitter / X', href: profile.links.twitter,            text: '@Srinidhi_kul' },
    { icon: '📧', label: 'Email',       href: `mailto:${profile.links.email}`,  text: profile.links.email },
  ];
  el.innerHTML = `
    <div class="contact-content">
      ${rows.map(r => `
        <div class="contact-row">
          <div class="contact-icon">${r.icon}</div>
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
// Cycles through multiple phrases instead of just erasing one
function initHeroTyping() {
  const title = document.querySelector('.hero-title');
  if (!title) return;

  // Respect reduced motion — just show the first phrase
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

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;
  const PAUSE_FULL  = 2200; // ms to pause at full phrase
  const PAUSE_EMPTY = 400;  // ms to pause at empty before next phrase
  const TYPE_SPEED  = 68;   // ms per char while typing
  const DEL_SPEED   = 32;   // ms per char while deleting

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
        deleting  = false;
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
    // Trigger after a tiny delay so transition actually fires
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity = '';
      el.style.transform = '';
    }));
  });
}

// ── Taskbar tooltip accessibility ────────────────────────────
// Already handled by CSS .tooltip, but ensure they're announced
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