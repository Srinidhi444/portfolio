// ============================================================
//  APP BOOTSTRAP
// ============================================================
import { profile, skills, experiences, projects, blogs } from '../data/profile.js';
import { initWallpaper } from './wallpaper.js';
import { initCursor } from './cursor.js';
import { initDesktop, openWindow, updateDockState } from './desktop.js';
import { initCarousel } from './carousel.js';

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
}

function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  let current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(current);
  toggle?.addEventListener('click', () => {
    current = current === 'dark' ? 'light' : 'dark';
    setTheme(current);
  });
}

function initClock() {
  const el = document.getElementById('taskbar-clock');
  const fmt = () => {
    const d = new Date();
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    el.innerHTML = `${time}<span>${date}</span>`;
  };
  fmt();
  setInterval(fmt, 1000 * 30);
}

function renderDesktopIcons() {
  const grid = document.getElementById('icon-grid');
  const icons = [
    { emoji: '👤', label: 'About Me', window: 'about-window' },
    { emoji: '🗂️', label: 'Projects', window: 'projects-window' },
    { emoji: '⚡', label: 'Skills', window: 'skills-window' },
    { emoji: '💼', label: 'Experience', window: 'experience-window' },
    { emoji: '✍️', label: 'Blogs', window: 'blogs-window' },
    { emoji: '🔗', label: 'Quick Links', window: 'contact-window' },
  ];
  grid.innerHTML = icons.map(icon => `
    <button class="desktop-icon" data-window="${icon.window}" aria-label="Open ${icon.label}">
      <span class="icon-img">${icon.emoji}</span>
      <span class="icon-label">${icon.label}</span>
    </button>
  `).join('');
}

function renderAbout() {
  const el = document.getElementById('about-content');
  el.innerHTML = `
    <div class="about-content">
      <img class="about-avatar" src="${profile.avatar}" alt="${profile.name}" width="90" height="90" />
      <div class="about-info">
        <h2>${profile.name}</h2>
        <div class="role">${profile.title}</div>
        <p>${profile.tagline} I enjoy thinking about system design, backend architecture, real-time systems, and building polished full-stack products from idea to deployment.</p>
      </div>
    </div>
  `;
}

function renderSkills() {
  const el = document.getElementById('skills-content');
  el.innerHTML = `<div class="skills-grid">${skills.map(group => `
    <section class="skill-category">
      <h3>${group.category}</h3>
      <div class="skill-tags">
        ${group.items.map(item => `<span class="skill-tag">${item}</span>`).join('')}
      </div>
    </section>
  `).join('')}</div>`;
}

function renderExperience() {
  const el = document.getElementById('experience-content');
  el.innerHTML = `<div class="exp-list scrollable">${experiences.map(exp => `
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
  `).join('')}</div>`;
}

function renderBlogs() {
  const el = document.getElementById('blogs-content');
  el.innerHTML = `<div class="blog-list scrollable">${blogs.map(blog => `
    <a class="blog-card" href="${blog.url}" target="_blank" rel="noopener noreferrer">
      <div class="blog-card-left">
        <h3>${blog.title}</h3>
        <p>${blog.desc}</p>
      </div>
      <div class="blog-date">${blog.date}</div>
    </a>
  `).join('')}</div>`;
}

function renderContact() {
  const el = document.getElementById('contact-content');
  el.innerHTML = `
    <div class="contact-content">
      <div class="contact-row">
        <div class="contact-icon">🐙</div>
        <div class="contact-info"><label>GitHub</label><a href="${profile.links.github}" target="_blank" rel="noopener noreferrer">${profile.links.github}</a></div>
      </div>
      <div class="contact-row">
        <div class="contact-icon">💼</div>
        <div class="contact-info"><label>LinkedIn</label><a href="${profile.links.linkedin}" target="_blank" rel="noopener noreferrer">${profile.links.linkedin}</a></div>
      </div>
      <div class="contact-row">
        <div class="contact-icon">✍️</div>
        <div class="contact-info"><label>Medium</label><a href="${profile.links.medium}" target="_blank" rel="noopener noreferrer">${profile.links.medium}</a></div>
      </div>
      <div class="contact-row">
        <div class="contact-icon">𝕏</div>
        <div class="contact-info"><label>Twitter / X</label><a href="${profile.links.twitter}" target="_blank" rel="noopener noreferrer">${profile.links.twitter}</a></div>
      </div>
      <div class="contact-row">
        <div class="contact-icon">📧</div>
        <div class="contact-info"><label>Email</label><a href="mailto:${profile.links.email}">${profile.links.email}</a></div>
      </div>
    </div>
  `;
}


function initHeroTyping() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  const full = 'Welcome to my portfolio';
  let i = 0, dir = 1;
  title.textContent = '';
  setInterval(() => {
    i += dir;
    if (i >= full.length) { i = full.length; dir = -1; }
    if (i <= 4) { dir = 1; }
    title.textContent = full.slice(0, i);
  }, 110);
}

function initQuickActions() {
}

window.addEventListener('DOMContentLoaded', async () => {
  initThemeToggle();
  initClock();
  renderAbout();
  renderSkills();
  renderExperience();
  renderBlogs();
  renderContact();
  initWallpaper('wallpaper-canvas');
  initCursor();
  initDesktop();
  initQuickActions();
  initHeroTyping();
  updateDockState();
  await initCarousel('carousel-canvas', projects);
});
