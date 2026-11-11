(() => {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = $('.hero');
  let motionPaused = reduced.matches;
  let heroVisible = true;
  let toastTimer;
  function toast(message) {
    const node = $('#toast');
    node.textContent = message;
    node.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => node.classList.remove('visible'), 3000);
  }

  // Theme preferences are browser-local; the hero keeps its night-sky palette.
  function setTheme(theme) {
    root.dataset.theme = theme;
    $('#theme-toggle').setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    $('#theme-toggle').setAttribute('title', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    $('meta[name="theme-color"]').content = theme === 'dark' ? '#081719' : '#f0f1ea';
    try { localStorage.setItem('faisal-observatory-theme', theme); } catch { /* Storage is optional. */ }
  }
  let savedTheme;
  try { savedTheme = localStorage.getItem('faisal-observatory-theme'); } catch { /* Keep the default. */ }
  setTheme(savedTheme === 'light' ? 'light' : 'dark');
  $('#theme-toggle').addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  const menu = $('#navigation'), menuButton = $('#menu-toggle');
  const ongoingButton = $('#ongoing-toggle'), ongoingDropdown = $('#ongoing-dropdown'), ongoingDialog = $('#ongoing-dialog');
  const setOngoing = open => {
    ongoingDropdown.hidden = !open;
    ongoingButton.setAttribute('aria-expanded', String(open));
  };
  const setMenu = open => {
    menu.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open) setOngoing(false);
  };
  menuButton.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!ongoingDropdown.hidden) { setOngoing(false); ongoingButton.focus(); }
      else setMenu(false);
    }
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-projects')) setOngoing(false);
    if (!e.target.closest('.site-header')) setMenu(false);
  });
  matchMedia('(min-width: 951px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  ongoingButton.addEventListener('click', () => setOngoing(ongoingDropdown.hidden));
  ongoingButton.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setOngoing(true); $('button', ongoingDropdown).focus(); }
  });
  let ongoingOrigin = ongoingButton;
  $$('[data-ongoing]').forEach(button => button.addEventListener('click', () => {
    $('#ongoing-dialog-title').textContent = `Project ${button.dataset.ongoing}`;
    ongoingOrigin = menu.classList.contains('open') ? menuButton : ongoingButton; setMenu(false);
    if (typeof ongoingDialog.showModal === 'function') ongoingDialog.showModal();
    else { ongoingDialog.setAttribute('open', ''); $('#ongoing-close').focus(); }
  }));
  const closeOngoing = () => {
    if (typeof ongoingDialog.close === 'function') ongoingDialog.close();
    else ongoingDialog.removeAttribute('open');
    ongoingOrigin.focus();
  };
  $('#ongoing-close').addEventListener('click', closeOngoing);
  ongoingDialog.addEventListener('click', e => { if (e.target === ongoingDialog) closeOngoing(); });
  ongoingDialog.addEventListener('close', () => ongoingOrigin.focus());

  function updateClocks() {
    const now = new Date();
    const options = { timeZone: 'America/Chicago', hour: 'numeric', minute: '2-digit' };
    $('#central-time').textContent = `${new Intl.DateTimeFormat('en-US', options).format(now)} CT`;
    // Bangladesh Standard Time (UTC+6), not British Summer Time.
    const elapsed = Math.max(0, Math.floor((now.getTime() - Date.parse('2025-12-12T14:25:00+06:00')) / 1000));
    const values = { days: Math.floor(elapsed / 86400), hours: Math.floor(elapsed / 3600) % 24,
      minutes: Math.floor(elapsed / 60) % 60, seconds: elapsed % 60 };
    for (const [key, value] of Object.entries(values)) $(`[data-clock="${key}"]`).textContent = key === 'days' ? value : String(value).padStart(2, '0');
    $('#injustice-clock').setAttribute('aria-label', `${values.days} days, ${values.hours} hours, ${values.minutes} minutes and ${values.seconds} seconds of injustice`);
    $$('[data-year]').forEach(node => { node.textContent = now.getFullYear(); });
  }
  updateClocks();
  setInterval(() => { if (!document.hidden) updateClocks(); }, 1000);

  $('#copy-email').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('fchowdhury5@lamar.edu');
      toast('Email copied. Let’s connect.');
    } catch { toast('Email: fchowdhury5@lamar.edu'); }
  });

  $$('.publication-filters button').forEach(button => button.addEventListener('click', () => {
    $$('.publication-filters button').forEach(b => {
      b.classList.toggle('active', b === button);
      b.setAttribute('aria-pressed', String(b === button));
    });
    let count = 0;
    $$('.publication').forEach(publication => {
      publication.hidden = button.dataset.filter !== 'all' && publication.dataset.category !== button.dataset.filter;
      if (!publication.hidden) count++;
    });
    $('#filter-status').textContent = `Showing ${count} ${button.dataset.filter === 'all' ? '' : button.dataset.filter + ' '}publications.`;
  }));

  if ('IntersectionObserver' in window) {
    const navLinks = $$('[data-nav]');
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('active', link.dataset.nav === entry.target.id));
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    $$('main section[id]:not(#profile)').forEach(section => sectionObserver.observe(section));
    new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; }, { threshold: 0 }).observe(hero);
    const heading = $('.reveal-heading');
    const headingObserver = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const words = heading.textContent.split(/\s+/);
      heading.textContent = '';
      words.forEach((word, index) => {
        const span = document.createElement('span');
        span.className = 'word'; span.style.setProperty('--word', index); span.textContent = word;
        heading.append(span, document.createTextNode(' '));
      });
      headingObserver.disconnect();
    }, { threshold: .3 });
    headingObserver.observe(heading);
  }

  // A real, deliberately small model; visuals are schematic, not hardware data.
  const model = window.QECModel;
  const NS = 'http://www.w3.org/2000/svg';
  function svgNode(tag, attrs, parent) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, String(value)));
    parent.appendChild(node);
    return node;
  }
  const point = q => ({ x: 204 + (q % 3) * 94, y: 126 + Math.floor(q / 3) * 94 });
  const faceNodes = [], ancillaNodes = [], qubitNodes = [];
  const faces = $('#code-faces'), ancillas = $('#syndrome-nodes'), edges = $('#code-edges'), routes = $('#correction-lines');
  function faceGeometry(check) {
    const x = 204 + check.col * 94, y = 126 + check.row * 94;
    if (check.row === -1) return { x, y: y + 47, width: 94, height: 47 };
    if (check.row === 2) return { x, y, width: 94, height: 47 };
    if (check.col === -1) return { x: x + 47, y, width: 47, height: 94 };
    if (check.col === 2) return { x, y, width: 47, height: 94 };
    return { x, y, width: 94, height: 94 };
  }
  model.xChecks.forEach(check => {
    const rect = faceGeometry(check);
    svgNode('rect', { ...rect, rx: 3, class: 'code-face x-face' }, faces);
    svgNode('circle', { cx: rect.x + rect.width / 2, cy: rect.y + rect.height / 2, r: 3.5, class: 'ancilla-dot' }, ancillas);
  });
  model.zChecks.forEach((check, index) => {
    const rect = faceGeometry(check);
    faceNodes.push(svgNode('rect', { ...rect, rx: 3, class: 'code-face' }, faces));
    const cx = rect.x + rect.width / 2, cy = rect.y + rect.height / 2;
    const group = svgNode('g', { class: 'ancilla' }, ancillas);
    svgNode('circle', { cx, cy, r: 5, class: 'ancilla-dot' }, group);
    const label = svgNode('text', { x: cx + 9, y: cy + 3, class: 'ancilla-label' }, group);
    label.textContent = check.label;
    ancillaNodes.push({ group, cx, cy, index });
  });
  for (let q = 0; q < 9; q++) {
    const p = point(q);
    if (q % 3 < 2) { const next = point(q + 1); svgNode('path', { d: `M${p.x} ${p.y}L${next.x} ${next.y}`, class: 'code-edge' }, edges); }
    if (q < 6) { const next = point(q + 3); svgNode('path', { d: `M${p.x} ${p.y}L${next.x} ${next.y}`, class: 'code-edge' }, edges); }
    const group = svgNode('g', { class: 'data-qubit', role: 'button', tabindex: 0, 'aria-label': `Inject X error on data qubit ${q + 1}, row ${Math.floor(q / 3) + 1}, column ${q % 3 + 1}`, 'aria-pressed': false }, $('#data-qubits'));
    svgNode('circle', { cx: p.x, cy: p.y, r: 23, class: 'qubit-hit' }, group);
    svgNode('circle', { cx: p.x, cy: p.y, r: 19, class: 'qubit-glow' }, group);
    svgNode('circle', { cx: p.x, cy: p.y, r: 17, class: 'qubit-halo' }, group);
    svgNode('circle', { cx: p.x, cy: p.y, r: 8.5, class: 'qubit-dot' }, group);
    const label = svgNode('text', { x: p.x - 5, y: p.y + 32, class: 'qubit-id' }, group); label.textContent = `q${q + 1}`;
    const inject = () => injectError(q);
    group.addEventListener('click', inject);
    group.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inject(); } });
    qubitNodes.push(group);
  }

  const stages = [
    { tag: '01 / ENCODE', title: 'Spread the information.\nNot the risk.', text: 'Encode one logical qubit across several physical qubits. The information lives in their shared state, rather than in one fragile qubit.', label: 'STATE PREPARATION', value: '|ψ⟩ → |ψL⟩', detail: 'One logical qubit. Nine physical qubits.' },
    { tag: '02 / NOISE', title: 'The hardware is noisy.\nThe information need not be.', text: 'An X error flips a physical qubit. Error correction introduces redundancy so local faults can be diagnosed without reading the encoded logical state.', label: 'PHYSICAL ERROR', value: 'X error detected', detail: 'Amber marks the simulator’s injected errors.' },
    { tag: '03 / SYNDROME', title: 'Measure the checks.\nNot the quantum information.', text: 'Ancilla-mediated Z checks detect X errors. Their outcomes form a syndrome: clues about errors, without directly measuring the logical quantum information.', label: 'SYNDROME EXTRACTION', value: '0000', detail: 'Ideal Z-check outcomes, ordered Z₁ to Z₄.' },
    { tag: '04 / DECODE', title: 'From a pattern of clues\nto a correction hypothesis.', text: 'The decoder sees only the syndrome. This small model chooses a minimum-weight X correction consistent with those checks. Different error patterns may share a syndrome.', label: 'CORRECTION HYPOTHESIS', value: 'Minimum-weight X', detail: 'Mint rings mark the candidate correction.' },
    { tag: '05 / CORRECT', title: 'Correct the errors.\nCheck the logical outcome.', text: 'Apply the inferred correction, or track it in a Pauli frame. The simulator then checks whether the logical information was preserved.', label: 'LOGICAL VERIFICATION', value: 'Logical preserved', detail: 'Simulation ground truth — not decoder certainty.' }
  ];
  let stage = 0, errors = 1 << 4, customErrors = false;
  let playing = !motionPaused;
  let tourElapsed = 0, lastTourTime = performance.now();
  let resumeAfterMotion = false;
  const tabs = $$('.stage-tab');
  function updateTourButton() {
    $('#tour-toggle').textContent = playing ? 'Ⅱ Pause tour' : '▷ Play tour';
    $('#tour-toggle').setAttribute('aria-pressed', String(playing));
  }
  function setPlaying(value) { playing = value && !motionPaused; tourElapsed = 0; lastTourTime = performance.now(); updateTourButton(); }
  function setReadout(label, value, detail) {
    $('#readout-label').textContent = label;
    $('#readout-value').textContent = value;
    $('#readout-detail').textContent = detail;
  }
  function announce(message) { $('#demo-announcement').textContent = message; }
  function showStage(index, manual = false) {
    stage = index; tourElapsed = 0;
    if (manual) setPlaying(false);
    hero.dataset.stage = stage;
    tabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === stage);
      tab.setAttribute('aria-selected', String(i === stage));
      tab.tabIndex = i === stage ? 0 : -1;
    });
    $('#stage-panel').setAttribute('aria-labelledby', `step-${stage}`);
    const info = stages[stage], result = model.evaluate(errors);
    $('#stage-tag').textContent = info.tag;
    const heading = $('#stage-title'); heading.textContent = '';
    info.title.split('\n').forEach((line, i) => { if (i) heading.appendChild(document.createElement('br')); heading.appendChild(document.createTextNode(line)); });
    $('#stage-description').textContent = info.text;
    setReadout(info.label, info.value, info.detail);
    const visibleErrors = stage === 0 ? 0 : stage === 4 ? result.residual : errors;
    qubitNodes.forEach((group, q) => {
      group.classList.toggle('error', !!(visibleErrors & (1 << q)));
      group.classList.toggle('candidate', stage === 3 && !!(result.correction & (1 << q)));
      group.classList.toggle('corrected', stage === 4 && !!(result.correction & (1 << q)) && !(result.residual & (1 << q)));
      group.setAttribute('aria-pressed', String(!!(errors & (1 << q))));
    });
    faceNodes.forEach((node, i) => node.classList.toggle('hot', (stage === 2 || stage === 3) && !!(result.syndrome & (1 << i))));
    ancillaNodes.forEach(({ group, index: i }) => group.classList.toggle('active', (stage === 2 || stage === 3) && !!(result.syndrome & (1 << i))));
    routes.replaceChildren();
    if (stage === 3) {
      const activeChecks = ancillaNodes.filter(a => result.syndrome & (1 << a.index));
      activeChecks.forEach(a => svgNode('path', { d: `M${a.cx} ${a.cy}Q450 ${a.cy} 530 300`, class: 'correction-route' }, routes));
      qubitNodes.forEach((_, q) => { if (result.correction & (1 << q)) { const p = point(q); svgNode('path', { d: `M530 300Q460 370 ${p.x} ${p.y}`, class: 'correction-route' }, routes); } });
    }
    $('#logical-symbol').textContent = stage === 4 && result.logicalFlip ? '|ψ′⟩' : '|ψ⟩';
    if (stage === 1) setReadout(info.label, `${result.errorCount} X error${result.errorCount === 1 ? '' : 's'}`, info.detail);
    if (stage === 2) {
      const bits = model.zChecks.map((_, i) => (result.syndrome >> i) & 1).join(' ');
      setReadout(info.label, bits, `${result.defectCount} triggered Z check${result.defectCount === 1 ? '' : 's'} · ideal measurements`);
    }
    if (stage === 3) setReadout(info.label, `${result.correctionCount} qubit${result.correctionCount === 1 ? '' : 's'} to flip`, 'Minimum-weight candidate — not guaranteed success.');
    if (stage === 4) {
      const label = result.logicalFlip ? 'LOGICAL ERROR' : 'LOGICAL VERIFICATION';
      setReadout(label, result.logicalFlip ? 'Logical flip remains' : 'Logical preserved', 'Simulation ground truth — not decoder certainty.');
      $('#stage-description').textContent = result.logicalFlip
        ? 'The correction cleared the syndrome, but a logical flip remains. This is why zero syndrome does not guarantee success. The simulator can see this using the injected error as ground truth; the decoder cannot.'
        : 'The inferred correction clears the syndrome and preserves the logical state in this example. Correction can be applied physically or tracked in a Pauli frame. Try adding more errors to explore the limits.';
    }
    if (manual) announce(`${info.tag}. ${$('#stage-description').textContent}`);
  }
  function injectError(q) {
    if (!customErrors) { errors = 0; customErrors = true; }
    errors ^= 1 << q;
    showStage(1, true);
    announce(`Qubit ${q + 1} ${errors & (1 << q) ? 'flipped' : 'restored'}. ${model.bitCount(errors)} injected X errors. Select Syndrome, Decode, then Correct to inspect the result.`);
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => showStage(i, true));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = (i + 1) % 5;
      if (e.key === 'ArrowLeft') next = (i + 4) % 5;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = 4;
      if (next !== undefined) { e.preventDefault(); showStage(next, true); tabs[next].focus(); }
    });
  });
  $('#inject-error').addEventListener('click', () => {
    let available = Array.from({ length: 9 }, (_, q) => q).filter(q => !customErrors || !(errors & (1 << q)));
    if (!available.length) { errors = 0; available = Array.from({ length: 9 }, (_, q) => q); }
    injectError(available[Math.floor(Math.random() * available.length)]);
  });
  $('#reset-demo').addEventListener('click', () => {
    errors = 1 << 4; customErrors = false; showStage(0, true);
    announce('Demo reset. The guided example uses a single X error. Play the tour or choose any of the five stages.');
  });
  $('#tour-toggle').addEventListener('click', () => {
    if (motionPaused) { setMotion(false); setPlaying(true); }
    else setPlaying(!playing);
  });
  showStage(0); updateTourButton();
  setInterval(() => {
    const now = performance.now(), delta = Math.min(now - lastTourTime, 1000); lastTourTime = now;
    if (!playing || motionPaused || document.hidden || !heroVisible) return;
    tourElapsed += delta;
    if (tourElapsed >= 5800) {
      const next = (stage + 1) % 5;
      if (next === 0 && !customErrors) errors = 1 << [1, 3, 4, 5, 7][Math.floor(Math.random() * 5)];
      showStage(next);
    }
  }, 200);

  function setMotion(paused) {
    motionPaused = paused;
    root.dataset.motion = paused ? 'paused' : 'running';
    $('#motion-toggle').setAttribute('aria-pressed', String(paused));
    $('.motion-label').textContent = paused ? 'Resume motion' : 'Pause motion';
    $('.motion-symbol').textContent = paused ? '▷' : 'Ⅱ';
    if (paused) { resumeAfterMotion = playing; setPlaying(false); }
    else if (resumeAfterMotion) setPlaying(true);
  }
  setMotion(motionPaused);
  $('#motion-toggle').addEventListener('click', () => setMotion(!motionPaused));
  reduced.addEventListener('change', e => { setMotion(e.matches); });

  // Low-contrast, frame-rate-limited motion. Keep the name area quiet.
  const canvas = $('#quantum-canvas'), ctx = canvas.getContext('2d');
  if (!ctx) return;
  let width = 0, height = 0, stars = [], particles = [], visualTime = 0, lastFrame = 0;
  function resizeCanvas() {
    const box = hero.getBoundingClientRect(), ratio = Math.min(devicePixelRatio || 1, 1.75);
    width = box.width; height = box.height;
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    stars = Array.from({ length: Math.min(100, Math.round(width / 13)) }, () => ({ x: Math.random() * width, y: Math.random() * height, radius: .35 + Math.random() * .8, phase: Math.random() * Math.PI * 2 }));
    particles = Array.from({ length: 22 }, () => ({ x: width * (.5 + Math.random() * .45), y: height * (.12 + Math.random() * .44), vx: (Math.random() - .5) * .007, vy: (Math.random() - .5) * .007 }));
    drawCanvas();
  }
  function drawCanvas() {
    ctx.clearRect(0, 0, width, height);
    ctx.shadowBlur = 0;
    stars.forEach(star => {
      ctx.fillStyle = '#d7edd9'; ctx.globalAlpha = .06 + .14 * (.5 + .5 * Math.sin(visualTime * .0004 + star.phase));
      ctx.beginPath(); ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2); ctx.fill();
    });
    ctx.lineWidth = .7;
    particles.forEach((particle, i) => {
      for (let j = i + 1; j < particles.length; j++) {
        const other = particles[j], distance = Math.hypot(particle.x - other.x, particle.y - other.y);
        if (distance < 140) {
          ctx.globalAlpha = (1 - distance / 140) * .13; ctx.strokeStyle = '#8ccc9e';
          ctx.beginPath(); ctx.moveTo(particle.x, particle.y); ctx.lineTo(other.x, other.y); ctx.stroke();
        }
      }
      ctx.fillStyle = '#baf2d7'; ctx.globalAlpha = .32;
      ctx.beginPath(); ctx.arc(particle.x, particle.y, 1.2, 0, Math.PI * 2); ctx.fill();
    });
    const cx = width * .74, cy = height * .33, rx = Math.min(width * .19, 270), ry = Math.min(height * .14, 140);
    for (let i = 0; i < 36; i++) {
      const angle = visualTime * .00018 - i * .012;
      const x = cx + Math.cos(angle) * rx, y = cy + Math.sin(angle * 2) * ry;
      ctx.globalAlpha = (1 - i / 36) * .35; ctx.fillStyle = '#f3d3a1';
      ctx.beginPath(); ctx.arc(x, y, 1.2 + (1 - i / 36), 0, Math.PI * 2); ctx.fill();
    }
    // A pair of tiny rockets crosses the lower open space, well behind content.
    [0, 8300].forEach((offset, i) => {
      const progress = ((visualTime + offset) % 26000) / 26000;
      if (progress > .4) return;
      const x = -40 + (width + 80) * progress / .4, y = height * (.63 + i * .06);
      ctx.save(); ctx.translate(x, y); ctx.rotate(-.1); ctx.globalAlpha = .25;
      ctx.fillStyle = '#c9d9c8'; ctx.beginPath(); ctx.moveTo(11, 0); ctx.quadraticCurveTo(1, -5, -7, -3); ctx.lineTo(-7, 3); ctx.quadraticCurveTo(1, 5, 11, 0); ctx.fill();
      ctx.fillStyle = '#dfb879'; ctx.beginPath(); ctx.moveTo(-7, -2); ctx.lineTo(-21, 0); ctx.lineTo(-7, 2); ctx.fill(); ctx.restore();
    });
    ctx.globalAlpha = 1;
  }
  function frame(time) {
    requestAnimationFrame(frame);
    const delta = time - lastFrame;
    if (delta < 32) return;
    lastFrame = time;
    if (motionPaused || document.hidden || !heroVisible) return;
    const dt = Math.min(delta, 64); visualTime += dt;
    particles.forEach(particle => {
      particle.x += particle.vx * dt; particle.y += particle.vy * dt;
      if (particle.x < width * .5 || particle.x > width * .98) particle.vx *= -1;
      if (particle.y < height * .1 || particle.y > height * .62) particle.vy *= -1;
    });
    drawCanvas();
  }
  resizeCanvas();
  if ('ResizeObserver' in window) new ResizeObserver(resizeCanvas).observe(hero);
  else addEventListener('resize', resizeCanvas);
  requestAnimationFrame(frame);
})();
