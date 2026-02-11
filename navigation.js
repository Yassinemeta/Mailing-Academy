(function () {
  const DEFAULT_LANG = 'en';

  let state = {
    lang: DEFAULT_LANG,
  };

  function qs(id) {
    return document.getElementById(id);
  }

  function getContent() {
    const pack = window.APP_CONTENT;
    if (!pack) return null;
    return pack[state.lang] || pack[DEFAULT_LANG];
  }

  function setDir() {
    const dir = state.lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', state.lang);
  }

  function setText(id, value) {
    const el = qs(id);
    if (!el) return;
    el.textContent = value;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function scrollToTop() {
    const main = qs('mainContent');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setPageVisibility(activePageKey) {
    const pages = ['home', 'lesson', 'legal', 'dive'];
    pages.forEach((key) => {
      const el = qs('page-' + key);
      if (!el) return;
      if (key === activePageKey) el.classList.remove('hidden');
      else el.classList.add('hidden');
    });

    const backMap = qs('backToMap');
    if (backMap) {
      if (activePageKey === 'home') backMap.classList.add('hidden');
      else backMap.classList.remove('hidden');
    }
  }

  function parseRoute() {
    const raw = window.location.hash || '#/home';
    const cleaned = raw.startsWith('#') ? raw.slice(1) : raw;
    const parts = cleaned.split('/').filter(Boolean);

    if (parts.length === 0) return { page: 'home' };
    if (parts[0] !== 'home' && parts[0] !== 'lesson' && parts[0] !== 'legal' && parts[0] !== 'dive') {
      return { page: 'home' };
    }

    const page = parts[0];
    let key = parts[1] || null;
    if (key) {
      try {
        key = decodeURIComponent(key);
      } catch {
        key = null;
      }
    }
    return { page, key };
  }

  function navigateTo(route) {
    if (!route || !route.page) {
      window.location.hash = '#/home';
      return;
    }
    if (route.page === 'home') {
      window.location.hash = '#/home';
      return;
    }
    if (!route.key) {
      window.location.hash = '#/home';
      return;
    }
    window.location.hash = '#/' + route.page + '/' + encodeURIComponent(route.key);
  }

  function renderStaticText() {
    const c = getContent();
    if (!c) return;

    setText('appTitle', c.meta.title);
    setText('appSubtitle', c.meta.subtitle);

    setText('homeHeadline', c.home.headline);
    setText('homeIntro', c.home.intro);

    setText('simTitle', c.home.simTitle);
    setText('simSubtitle', c.home.simSubtitle);

    setText('modulesTitle', c.home.modulesTitle);
    setText('modulesSubtitle', c.home.modulesSubtitle);

    setText('footerTagline', c.footer.tagline);
    setText('footerQuick', c.footer.quick);
    setText('footerContact', c.footer.contact);
    setText('footerContactText', c.footer.contactText);

    setText('backText', c.ui.back);
    setText('closeLegalText', c.ui.close);
    setText('closeDiveText', c.ui.back);
    setText('backToMapText', c.ui.backToMap);

    setText('label-mta', c.labels.mta);
    setText('label-dns', c.labels.dns);
    setText('label-filter', c.labels.filter);
    setText('label-inbox', c.labels.inbox);
    setText('label-spam', c.labels.spam);

    const langToggle = qs('langToggle');
    if (langToggle) langToggle.textContent = state.lang === 'ar' ? 'AR' : 'EN';

    const yearEl = qs('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function renderModules() {
    const c = getContent();
    const grid = qs('modulesGrid');
    if (!c || !grid) return;

    const lessonEntries = Object.entries(c.lessons);

    grid.innerHTML = lessonEntries
      .map(([key, l]) => {
        const safeTitle = escapeHtml(l.title);
        const safeDesc = escapeHtml(l.description);
        const safeLevel = escapeHtml(l.level);
        return (
          '<button class="module-card" type="button" data-lesson="' +
          key +
          '">' +
          '<div class="module-top"><div class="module-level">' +
          safeLevel +
          '</div></div>' +
          '<div class="module-title">' +
          safeTitle +
          '</div>' +
          '<div class="module-desc">' +
          safeDesc +
          '</div>' +
          '</button>'
        );
      })
      .join('');

    grid.querySelectorAll('[data-lesson]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-lesson');
        navigateTo({ page: 'lesson', key });
      });
    });
  }

  function renderLesson(key) {
    const c = getContent();
    if (!c) return;
    const lesson = key ? c.lessons[key] : null;
    if (!lesson) {
      navigateTo({ page: 'home' });
      return;
    }

    setText('lessonLevel', lesson.level);
    setText('lessonTitle', lesson.title);
    const body = qs('lessonBody');
    if (body) body.innerHTML = lesson.bodyHtml;

    setPageVisibility('lesson');
    scrollToTop();
  }

  function renderLegal(key) {
    const c = getContent();
    if (!c) return;
    const doc = key ? c.legal[key] : null;
    if (!doc) {
      navigateTo({ page: 'home' });
      return;
    }

    setText('legalTitle', doc.title);
    const body = qs('legalBody');
    if (body) body.innerHTML = doc.bodyHtml;

    setPageVisibility('legal');
    scrollToTop();
  }

  function renderDive(key) {
    const c = getContent();
    if (!c) return;
    const dd = key ? c.deepDives[key] : null;
    if (!dd) {
      navigateTo({ page: 'home' });
      return;
    }

    setText('diveLevel', dd.level || c.ui.deepDive);
    setText('diveTitle', dd.title);
    const body = qs('diveBody');
    if (body) body.innerHTML = dd.bodyHtml;

    setPageVisibility('dive');
    scrollToTop();
  }

  function renderHome() {
    setPageVisibility('home');
  }

  function renderRoute() {
    const route = parseRoute();
    if (route.page === 'home') {
      renderHome();
      return;
    }
    if (route.page === 'lesson') {
      renderLesson(route.key);
      return;
    }
    if (route.page === 'legal') {
      renderLegal(route.key);
      return;
    }
    if (route.page === 'dive') {
      renderDive(route.key);
      return;
    }
    renderHome();
  }

  function toggleLanguage() {
    state.lang = state.lang === 'en' ? 'ar' : 'en';
    setDir();
    renderStaticText();
    renderModules();
    renderRoute();
  }

  function wireEvents() {
    const langToggle = qs('langToggle');
    if (langToggle) langToggle.addEventListener('click', toggleLanguage);

    const back = qs('backToHome');
    if (back) back.addEventListener('click', () => window.history.back());

    const closeLegal = qs('closeLegal');
    if (closeLegal) closeLegal.addEventListener('click', () => window.history.back());

    const closeDive = qs('closeDive');
    if (closeDive) closeDive.addEventListener('click', () => window.history.back());

    const backMap = qs('backToMap');
    if (backMap) backMap.addEventListener('click', () => navigateTo({ page: 'home' }));

    document.querySelectorAll('[data-legal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-legal');
        navigateTo({ page: 'legal', key });
      });
    });

    window.addEventListener('hashchange', renderRoute);
  }

  function init() {
    setDir();
    renderStaticText();
    renderModules();
    wireEvents();

    if (!window.location.hash) window.location.hash = '#/home';
    renderRoute();
  }

  window.AppNav = {
    init,
    navigateTo,
    renderRoute,
    toggleLanguage,
  };

  document.addEventListener('DOMContentLoaded', () => {
    init();
  });
})();
