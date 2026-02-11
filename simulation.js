(function () {
  function qs(id) {
    return document.getElementById(id);
  }

  function clamp01(v) {
    if (v < 0) return 0;
    if (v > 1) return 1;
    return v;
  }

  const SimulationState = {
    Normal: 'normal',
    Exploded: 'exploded',
    Animating: 'animating',
  };

  let simState = SimulationState.Normal;
  let explodedNodeId = null;
  let paused = true; // start in true Normal mode (no motion)

  let authState = {
    spf: true,
    dkim: true,
  };

  function navToDive(key) {
    if (!window.AppNav || !window.AppNav.navigateTo) return;
    window.AppNav.navigateTo({ page: 'dive', key });
  }

  function getCompoundNodes() {
    return Array.from(document.querySelectorAll('.compound'));
  }

  function setExploded(nodeEl, isExploded) {
    if (!nodeEl) return;
    nodeEl.classList.toggle('is-exploded', isExploded);
    nodeEl.setAttribute('aria-expanded', isExploded ? 'true' : 'false');
  }

  function collapseAll() {
    getCompoundNodes().forEach((n) => setExploded(n, false));
    explodedNodeId = null;
    // do not force Animating here; keep current global state

    setScan(false);
    setBranch('pass', false);
    setBranch('spam', false);
    setBranch('bounce', false);
  }

  function toggleExplode(nodeEl) {
    if (!nodeEl) return;
    const id = nodeEl.id || null;
    const open = !nodeEl.classList.contains('is-exploded');

    collapseAll();
    if (open) {
      setExploded(nodeEl, true);
      explodedNodeId = id;
      paused = true;
      simState = SimulationState.Exploded;
    }
  }

  function setScan(on) {
    const ring = qs('scanRing');
    if (!ring) return;
    ring.classList.toggle('is-on', !!on);
  }

  function setBranch(which, on) {
    const map = {
      pass: document.querySelector('.pass-flux'),
      spam: document.querySelector('.fail-flux'),
      bounce: document.querySelector('.bounce-flux'),
    };
    const el = map[which];
    if (!el) return;
    el.classList.toggle('is-on', !!on);
  }

  function setupNodeClicks() {
    getCompoundNodes().forEach((node) => {
      const onClick = (e) => {
        const part = e.target && e.target.closest ? e.target.closest('.compound-part') : null;
        if (part) {
          const nodeType = node.getAttribute('data-node');
          const partKey = part.getAttribute('data-part');

          if (nodeType === 'dns') {
            if (partKey === 'spf') authState.spf = !authState.spf;
            if (partKey === 'dkim') authState.dkim = !authState.dkim;
            part.style.borderColor = authState[partKey] === false ? 'rgba(239,68,68,0.8)' : '';
            part.style.color = authState[partKey] === false ? 'rgba(239,68,68,0.95)' : '';
            return;
          }

          if (nodeType === 'mta-s') {
            const map = {
              queue: 'mta-input',
              engine: 'mta-engine',
              rotate: 'mta-rotate',
              out: 'mta-out',
            };
            const k = map[partKey];
            if (k) navToDive(k);
            return;
          }

          if (nodeType === 'filter') {
            navToDive('filter');
            return;
          }

          if (nodeType === 'mua-s' || nodeType === 'mua-r' || nodeType === 'mta-r') {
            navToDive('mta-engine');
            return;
          }
        }

        toggleExplode(node);
      };

      node.addEventListener('click', onClick);
      node.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e);
        }
      });
    });

    const inbox = qs('node-inbox');
    if (inbox) inbox.addEventListener('click', () => navToDive('inbox'));
    const spam = qs('node-spam');
    if (spam)
      spam.addEventListener('click', () => {
        navToDive('spam');
        triggerFeedbackPulse();
      });
    const bounce = qs('node-bounce');
    if (bounce) bounce.addEventListener('click', () => navToDive('dns'));

    document.addEventListener('click', (e) => {
      if (simState !== SimulationState.Exploded) return;

      const target = e.target;
      const active = explodedNodeId ? qs(explodedNodeId) : null;
      if (active && active.contains(target)) return;

      collapseAll();
    });

    window.addEventListener('hashchange', () => {
      if (window.location.hash && window.location.hash.startsWith('#/home')) {
        collapseAll();
      }
    });
  }

  let feedbackPulseActive = false;
  let feedbackPulseStart = 0;

  function triggerFeedbackPulse() {
    feedbackPulseActive = true;
    feedbackPulseStart = performance.now();
  }

  function getPathLength(pathEl) {
    try {
      return pathEl.getTotalLength();
    } catch {
      return 0;
    }
  }

  function animateJourney() {
    const env = qs('envelope');
    const smtp = qs('smtpPath');
    const imap = qs('imapPath');
    const branchPass = qs('branchPass');
    const branchSpam = qs('branchSpam');
    const branchBounce = qs('branchBounce');

    if (!env || !smtp || !imap) return;

    const smtpLen = getPathLength(smtp);
    const imapLen = getPathLength(imap);
    const passLen = branchPass ? getPathLength(branchPass) : 0;
    const spamLen = branchSpam ? getPathLength(branchSpam) : 0;
    const bounceLen = branchBounce ? getPathLength(branchBounce) : 0;

    const scanStart = 0.55;
    const scanEnd = 0.68;
    const settleDurMs = 900;

    let branchMode = null;
    let scanHoldStart = 0;
    let held = false;

    // playhead state so we can pause/resume
    let t = 0; // [0,1]
    let lastNow = null;

    function pickBranch() {
      const pass = authState.spf && authState.dkim;
      if (pass) return 'pass';
      return Math.random() < 0.55 ? 'spam' : 'bounce';
    }

    function posOn(pathEl, len, t) {
      const at = clamp01(t) * len;
      const p = pathEl.getPointAtLength(at);
      const p2 = pathEl.getPointAtLength(clamp01(t + 0.002) * len);
      const angle = Math.atan2(p2.y - p.y, p2.x - p.x) * (180 / Math.PI);
      return { p, angle };
    }

    function frame(now) {
      if (lastNow == null) lastNow = now;

      if (!paused) {
        const dt = now - lastNow;
        const speed = 0.00005; // same overall feel as before
        t += dt * speed;
        if (t > 1) t -= 1; // loop
      }
      lastNow = now;

      if (!branchMode && t >= scanStart) branchMode = pickBranch();

      if (t >= scanStart && t <= scanEnd) {
        if (!held) {
          held = true;
          scanHoldStart = now;
          setScan(true);
        }

        const holdK = clamp01((now - scanHoldStart) / settleDurMs);
        if (holdK < 1) {
          const mid = posOn(smtp, smtpLen, scanStart);
          env.setAttribute('transform', `translate(${mid.p.x} ${mid.p.y}) rotate(${mid.angle})`);
          requestAnimationFrame(frame);
          return;
        }

        setScan(false);
      }

      if (t < scanEnd) {
        const seg = posOn(smtp, smtpLen, t);
        env.setAttribute('transform', `translate(${seg.p.x} ${seg.p.y}) rotate(${seg.angle})`);
        requestAnimationFrame(frame);
        return;
      }

      if (t >= scanEnd && t < 0.8) {
        const bt = (t - scanEnd) / (0.8 - scanEnd);
        if (branchMode === 'pass') {
          setBranch('pass', true);
          const seg = posOn(branchPass, passLen, bt);
          env.setAttribute('transform', `translate(${seg.p.x} ${seg.p.y}) rotate(${seg.angle})`);
        } else if (branchMode === 'spam') {
          setBranch('spam', true);
          const seg = posOn(branchSpam, spamLen, bt);
          env.setAttribute('transform', `translate(${seg.p.x} ${seg.p.y}) rotate(${seg.angle})`);
        } else {
          setBranch('bounce', true);
          const seg = posOn(branchBounce, bounceLen, bt);
          env.setAttribute('transform', `translate(${seg.p.x} ${seg.p.y}) rotate(${seg.angle})`);
        }
        requestAnimationFrame(frame);
        return;
      }

      setBranch('pass', false);
      setBranch('spam', false);
      setBranch('bounce', false);

      const it = (t - 0.8) / 0.2;
      const seg = posOn(imap, imapLen, it);
      const bob = Math.sin(now * 0.006) * 1.8;
      env.setAttribute('transform', `translate(${seg.p.x} ${seg.p.y + bob}) rotate(${seg.angle})`);

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function animateFeedbackPulse(now) {
    const feedback = document.querySelector('.sim-feedback');
    if (!feedback) return;
    if (!feedbackPulseActive) return;

    const elapsed = now - feedbackPulseStart;
    const dur = 1200;
    const k = clamp01(elapsed / dur);
    const a = 0.35 + Math.sin(k * Math.PI) * 0.55;
    feedback.style.opacity = String(a);
    feedback.style.stroke = 'rgba(251,146,60,0.9)';
    feedback.style.strokeDasharray = '6 10';
    if (elapsed >= dur) {
      feedbackPulseActive = false;
      feedback.style.opacity = '';
      feedback.style.stroke = '';
      feedback.style.strokeDasharray = '';
    }
  }

  function startLoop() {
    function loop(now) {
      animateFeedbackPulse(now);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function init() {
    setupNodeClicks();
    startLoop();
    animateJourney();

    // Controls: Play/Pause/Reset
    const playPauseBtn = qs('simPlayPause');
    const resetBtn = qs('simReset');

    function updatePlayPauseLabel() {
      if (!playPauseBtn) return;
      if (simState === SimulationState.Animating && !paused) {
        playPauseBtn.textContent = '❚❚ Pause';
      } else {
        playPauseBtn.textContent = '▶ Start Journey';
      }
    }

    if (playPauseBtn) {
      playPauseBtn.addEventListener('click', () => {
        if (simState !== SimulationState.Animating) {
          // transition from Normal or Exploded into Animating
          simState = SimulationState.Animating;
          paused = false;
          collapseAll();
        } else {
          // toggle pause while animating
          paused = !paused;
        }
        updatePlayPauseLabel();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        // Hard reset: back to Normal, envelope at SMTP start, no branches/scan
        paused = true;
        simState = SimulationState.Normal;
        collapseAll();

        const env = qs('envelope');
        const smtp = qs('smtpPath');
        if (env && smtp) {
          const len = getPathLength(smtp);
          try {
            const p = smtp.getPointAtLength(0);
            const p2 = smtp.getPointAtLength(1);
            const angle = Math.atan2(p2.y - p.y, p2.x - p.x) * (180 / Math.PI);
            env.setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${angle})`);
          } catch {
            // ignore
          }
        }

        // refresh button label
        if (playPauseBtn) playPauseBtn.textContent = '▶ Start Journey';
      });
    }

    const backMap = qs('backToMap');
    if (backMap)
      backMap.addEventListener('click', () => {
        collapseAll();
        paused = true;
        simState = SimulationState.Normal;
        if (playPauseBtn) playPauseBtn.textContent = '▶ Start Journey';
      });
    const backLesson = qs('backToHome');
    if (backLesson)
      backLesson.addEventListener('click', () => {
        collapseAll();
        paused = true;
        simState = SimulationState.Normal;
        if (playPauseBtn) playPauseBtn.textContent = '▶ Start Journey';
      });
    const closeLegal = qs('closeLegal');
    if (closeLegal)
      closeLegal.addEventListener('click', () => {
        collapseAll();
        paused = true;
        simState = SimulationState.Normal;
        if (playPauseBtn) playPauseBtn.textContent = '▶ Start Journey';
      });
    const closeDive = qs('closeDive');
    if (closeDive)
      closeDive.addEventListener('click', () => {
        collapseAll();
        paused = true;
        simState = SimulationState.Normal;
        if (playPauseBtn) playPauseBtn.textContent = '▶ Start Journey';
      });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
