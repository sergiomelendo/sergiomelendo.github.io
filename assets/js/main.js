/* =====================================================
   SERGIO MELENDO PORTFOLIO — MAIN.JS
   "The Ivory IDE"  —  Jupyter × KNIME × Git × Python
===================================================== */

/* ============================
   BOOT SEQUENCE / PRELOADER
============================ */
(function bootSequence() {
  const lines = [
    { text: 'BIOS v2026.11 — Sergio Melendo Portfolio',       cls: 'info' },
    { text: 'Initializing Python 3.11.0 kernel...',            cls: 'ok'   },
    { text: 'Loading numpy, pandas, sklearn...',               cls: 'ok'   },
    { text: 'Loading tensorflow, transformers...',             cls: 'ok'   },
    { text: 'Connecting to data sources [MySQL · PostgreSQL · MongoDB]...', cls: 'ok' },
    { text: 'Loading KNIME analytics platform...',             cls: 'ok'   },
    { text: 'Initializing Power BI connector...',              cls: 'ok'   },
    { text: 'Building portfolio pipeline...',                  cls: 'ok'   },
    { text: '',                                                cls: ''     },
    { text: 'SERGIO MELENDO v2026.1 — READY ✓',              cls: 'success' },
  ];

  const output = document.getElementById('bootOutput');
  let i = 0;

  function addLine() {
    if (i >= lines.length) {
      setTimeout(finishBoot, 500);
      return;
    }
    const { text, cls } = lines[i++];
    const span = document.createElement('span');
    span.className = 'boot-line ' + cls;
    span.textContent = text;
    output.appendChild(span);
    setTimeout(addLine, 70 + Math.random() * 55);
  }

  function finishBoot() {
    const preloader = document.getElementById('preloader');
    preloader.style.transition = 'opacity .6s ease';
    preloader.style.opacity   = '0';
    setTimeout(() => {
      preloader.style.display = 'none';
      initPortfolio();
    }, 650);
  }

  setTimeout(addLine, 350);
})();

/* ============================
   INIT
============================ */
function initPortfolio() {
  initCursor();
  initStatusBar();
  initRoleTypewriter();
  initNavHighlight();
  initHeroCells();
  buildNodeGraph();
  initRevealObserver();
  initSpotlightCards();
  initContactForm();
  initEasterEgg();
  initMobileMenu();
}

/* ============================
   CUSTOM CURSOR
============================ */
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  const hoverEls = 'a, button, .sps-pills span, .metric-box, .edu-mini-card, .ci-card, .nb-action-btn';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hovering'); ring.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
  });
}

/* ============================
   STATUS BAR — CLOCK + ACTIVE FILE
============================ */
function initStatusBar() {
  const sbTime     = document.getElementById('sbTime');
  const sbFilename = document.getElementById('sbFilename');
  const fileMap    = {
    hero:       'intro.ipynb',
    skills:     'skills.knwf',
    experience: 'experience.log',
    education:  'education.md',
    contact:    'contact.sh',
  };

  // Clock
  function tick() {
    const now = new Date();
    const hh  = String(now.getHours()).padStart(2, '0');
    const mm  = String(now.getMinutes()).padStart(2, '0');
    const ss  = String(now.getSeconds()).padStart(2, '0');
    if (sbTime) sbTime.textContent = `${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);

  // Active file name from scroll
  const rc       = document.getElementById('rightContent');
  const sections = document.querySelectorAll('section[id]');
  const sbObs    = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && fileMap[e.target.id] && sbFilename) {
        sbFilename.textContent = fileMap[e.target.id];
      }
    });
  }, { root: rc, threshold: 0.35 });
  sections.forEach(s => sbObs.observe(s));
}

/* ============================
   LEFT PANEL — ROLE TYPEWRITER
============================ */
function initRoleTypewriter() {
  const roles = ['Data Scientist', 'BI Engineer', 'ML Developer', 'Python Developer', 'Ing. Informático'];
  const el    = document.getElementById('roleText');
  if (!el) return;

  let ri = 0, ci = 0, deleting = false;

  function type() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.substring(0, ci + 1);
      ci++;
      if (ci === current.length) { deleting = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = current.substring(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? 55 : 85);
  }
  type();
}

/* ============================
   NAV HIGHLIGHT (LEFT PANEL)
============================ */
function initNavHighlight() {
  const files   = document.querySelectorAll('.tree-file');
  const rc      = document.getElementById('rightContent');
  const sections = document.querySelectorAll('section[id]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        files.forEach(f => f.classList.remove('active'));
        const target = document.querySelector(`.tree-file[data-section="${e.target.id}"]`);
        if (target) target.classList.add('active');
      }
    });
  }, { root: rc, threshold: 0.4 });

  sections.forEach(s => obs.observe(s));

  files.forEach(f => {
    f.addEventListener('click', () => {
      document.getElementById('leftPanel')?.classList.remove('open');
      document.getElementById('mobileMenuBtn')?.classList.remove('open');
    });
  });
}

/* ============================
   HERO — JUPYTER CELLS ANIMATION
============================ */
function initHeroCells() {
  const kernelEl = document.getElementById('kernelIndicator');

  function setCellNum(id, num) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = `In&nbsp;[${num}]:`;
  }
  function setKernel(state) {
    if (kernelEl) kernelEl.className = 'kernel-indicator ' + state;
  }
  function showOutput(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('hidden'); el.style.animation = 'fadeInUp .4s ease'; }
  }

  function runAllCells() {
    // Reset
    ['cnum1','cnum2','cnum3'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = 'In&nbsp;[&nbsp;]:';
    });
    document.getElementById('profileOut')?.classList.add('hidden');
    document.getElementById('metricsOut')?.classList.add('hidden');
    setKernel('busy');

    setTimeout(() => setCellNum('cnum1', 1), 450);
    setTimeout(() => { setCellNum('cnum2', 2); showOutput('profileOut'); }, 950);
    setTimeout(() => { setCellNum('cnum3', 3); showOutput('metricsOut'); animateMetrics(); }, 1550);
    setTimeout(() => setKernel('idle'), 2100);
  }

  function animateMetrics() {
    document.querySelectorAll('.metric-val[data-target]').forEach(el => {
      const target  = parseFloat(el.dataset.target);
      const suffix  = el.dataset.suffix || '';
      let   current = 0;
      const step    = target / 28;
      const timer   = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 40);
    });
  }

  document.getElementById('runAllBtn')?.addEventListener('click', runAllCells);
  // Auto-run after preloader fades
  setTimeout(runAllCells, 300);
}

/* ============================
   KNIME-STYLE PIPELINE GRAPH
============================ */
function buildNodeGraph() {
  const svg = document.getElementById('pipelineGraph');
  if (!svg) return;

  const NS  = 'http://www.w3.org/2000/svg';
  const NW  = 128, NH = 44; // node width / height

  const cats = {
    source: { color: '#1D6FA5', label: 'DB'  },
    lang:   { color: '#5B4EDF', label: 'PY'  },
    ml:     { color: '#2D7A3E', label: 'ML'  },
    bi:     { color: '#A05A00', label: 'BI'  },
    output: { color: '#B5451B', label: 'OUT' },
  };

  const nodes = [
    { id: 'mysql',    label: 'MySQL',        cat: 'source', x: 18,  y: 70  },
    { id: 'postgres', label: 'PostgreSQL',   cat: 'source', x: 18,  y: 180 },
    { id: 'mongo',    label: 'MongoDB',      cat: 'source', x: 18,  y: 290 },
    { id: 'python',   label: 'Python',       cat: 'lang',   x: 215, y: 125 },
    { id: 'sql',      label: 'SQL',          cat: 'lang',   x: 215, y: 255 },
    { id: 'tf',       label: 'TensorFlow',   cat: 'ml',     x: 420, y: 70  },
    { id: 'sklearn',  label: 'Scikit-learn', cat: 'ml',     x: 420, y: 180 },
    { id: 'nlp',      label: 'NLP / CV',     cat: 'ml',     x: 420, y: 290 },
    { id: 'knime',    label: 'KNIME',        cat: 'bi',     x: 625, y: 115 },
    { id: 'powerbi',  label: 'Power BI',     cat: 'bi',     x: 625, y: 230 },
    { id: 'pentaho',  label: 'Pentaho',      cat: 'bi',     x: 625, y: 345 },
    { id: 'output',   label: 'Dashboards',   cat: 'output', x: 790, y: 200 },
  ];

  const edges = [
    ['mysql',   'python' ], ['postgres','python' ], ['postgres','sql'    ], ['mongo',  'python' ],
    ['python',  'tf'     ], ['python',  'sklearn' ], ['python',  'nlp'    ],
    ['sql',     'knime'  ], ['sql',     'powerbi' ],
    ['tf',      'knime'  ], ['sklearn', 'knime'   ], ['sklearn', 'powerbi'], ['nlp',    'powerbi'],
    ['knime',   'output' ], ['powerbi', 'output'  ], ['pentaho', 'output' ],
  ];

  const nodeMap = {};
  nodes.forEach(n => nodeMap[n.id] = n);

  function portOut(n) { return { x: n.x + NW,  y: n.y + NH / 2 }; }
  function portIn(n)  { return { x: n.x,        y: n.y + NH / 2 }; }

  function mkEl(tag, attrs) {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  /* ---- EDGES ---- */
  const edgeG = mkEl('g', { id: 'edgeLayer' });

  edges.forEach(([fromId, toId], idx) => {
    const from = nodeMap[fromId], to = nodeMap[toId];
    const p1   = portOut(from), p2 = portIn(to);
    const cp   = Math.max(55, (p2.x - p1.x) * 0.42);
    const d    = `M ${p1.x},${p1.y} C ${p1.x+cp},${p1.y} ${p2.x-cp},${p2.y} ${p2.x},${p2.y}`;

    const path = mkEl('path', {
      id:            `ep-${idx}`,
      d,
      fill:          'none',
      stroke:        '#D4D0C8',
      'stroke-width':'1.5',
      'class':       'edge-path',
    });
    path.dataset.fromCat = from.cat;
    path.dataset.toId    = toId;

    // Animated particle dot
    const dot = mkEl('circle', { r: '5', fill: cats[from.cat].color, opacity: '0', class: 'particle' });
    dot.dataset.edgeIdx = idx;

    edgeG.appendChild(path);
    edgeG.appendChild(dot);
  });

  svg.appendChild(edgeG);

  /* ---- NODES ---- */
  const nodeG = mkEl('g', { id: 'nodeLayer' });

  nodes.forEach(node => {
    const cat = cats[node.cat];
    const g   = mkEl('g', { class: 'svg-node', 'data-id': node.id });

    // Drop shadow
    const shd = mkEl('rect', { x: node.x+2, y: node.y+2, width: NW, height: NH, rx: 5, fill: 'rgba(0,0,0,0.07)' });

    // Body
    const body = mkEl('rect', {
      x: node.x, y: node.y, width: NW, height: NH, rx: 5,
      fill: '#FFFFFF', stroke: '#E6E4DD', 'stroke-width': '1', class: 'node-body',
    });

    // Color strip (left band)
    const strip = mkEl('rect', { x: node.x, y: node.y, width: 26, height: NH, rx: 5, fill: cat.color });
    // Cover right edge of strip (make it flat on the right)
    const stripR = mkEl('rect', { x: node.x+18, y: node.y, width: 8, height: NH, fill: cat.color });

    // Strip label
    const slbl = mkEl('text', {
      x: node.x+13, y: node.y+NH/2+1,
      'text-anchor': 'middle', 'dominant-baseline': 'middle',
      fill: 'white', 'font-size': '7',
      'font-family': 'JetBrains Mono, monospace', 'font-weight': '600',
    });
    slbl.textContent = cat.label;

    // Node label
    const lbl = mkEl('text', {
      x: node.x+34, y: node.y+NH/2+1,
      'dominant-baseline': 'middle',
      fill: '#2C2B29', 'font-size': '11',
      'font-family': 'JetBrains Mono, monospace', 'font-weight': '500',
    });
    lbl.textContent = node.label;

    // Ports
    const inPort  = mkEl('circle', { cx: node.x,    cy: node.y+NH/2, r: '4', fill: '#F0EDE8', stroke: cat.color, 'stroke-width': '1.5' });
    const outPort = mkEl('circle', { cx: node.x+NW, cy: node.y+NH/2, r: '4', fill: '#F0EDE8', stroke: cat.color, 'stroke-width': '1.5' });

    g.appendChild(shd);
    g.appendChild(body);
    g.appendChild(strip);
    g.appendChild(stripR);
    if (node.cat !== 'source') g.appendChild(inPort);
    if (node.cat !== 'output') g.appendChild(outPort);
    g.appendChild(slbl);
    g.appendChild(lbl);

    // Hover
    g.addEventListener('mouseenter', () => {
      body.setAttribute('stroke', cat.color);
      body.setAttribute('stroke-width', '2');
      g.setAttribute('filter', 'url(#glow)');
    });
    g.addEventListener('mouseleave', () => {
      body.setAttribute('stroke', '#E6E4DD');
      body.setAttribute('stroke-width', '1');
      g.removeAttribute('filter');
    });

    // Click → detail panel
    g.addEventListener('click', () => showNodeDetail(node, cat));
    g.style.cursor = 'pointer';

    nodeG.appendChild(g);
  });

  svg.appendChild(nodeG);

  /* ---- RUN PIPELINE ---- */
  document.getElementById('runPipeline')?.addEventListener('click', () => {
    const paths     = svg.querySelectorAll('.edge-path');
    const particles = svg.querySelectorAll('.particle');

    paths.forEach((path, idx) => {
      const fromCat = path.dataset.fromCat;
      const color   = cats[fromCat]?.color || '#1D6FA5';
      const len     = path.getTotalLength ? path.getTotalLength() : 120;

      // Draw the edge with animation
      path.setAttribute('stroke-dasharray',  len);
      path.setAttribute('stroke-dashoffset', len);
      path.setAttribute('stroke', color);
      path.setAttribute('stroke-opacity', '0.75');

      setTimeout(() => {
        path.style.transition = `stroke-dashoffset ${0.55 + Math.random()*0.3}s ease`;
        path.setAttribute('stroke-dashoffset', '0');

        // Animate particle along path
        const particle = particles[idx];
        if (!particle) return;
        particle.setAttribute('fill', color);
        particle.setAttribute('opacity', '1');

        let t = 0;
        function animParticle() {
          if (t > 1.05) { particle.setAttribute('opacity', '0'); return; }
          if (path.getTotalLength) {
            const pt = path.getPointAtLength(Math.min(t, 1) * len);
            particle.setAttribute('cx', pt.x);
            particle.setAttribute('cy', pt.y);
          }
          t += 0.022;
          requestAnimationFrame(animParticle);
        }
        setTimeout(animParticle, 180);

      }, idx * 110);
    });

    // Reset after 6s
    setTimeout(() => {
      paths.forEach(p => {
        p.setAttribute('stroke', '#D4D0C8');
        p.setAttribute('stroke-opacity', '1');
        p.removeAttribute('stroke-dasharray');
        p.removeAttribute('stroke-dashoffset');
        p.style.transition = '';
      });
    }, 6000);
  });

  /* ---- NODE DETAIL PANEL ---- */
  const detailContent = {
    mysql:   { title: 'MySQL',        desc: 'Base de datos relacional. Usada en proyectos web y BI para almacenar y consultar datos estructurados con SQL y CTEs avanzadas.', projects: ['Proyectos BBDD', 'ETL pipelines'] },
    postgres:{ title: 'PostgreSQL',   desc: 'SGBD avanzado con soporte para JSON, arrays y extensiones. Usado en análisis de datos y proyectos de data warehouse.', projects: ['Data Warehouse', 'Análisis estadístico'] },
    mongo:   { title: 'MongoDB',      desc: 'Base de datos NoSQL orientada a documentos. Ideal para datos no estructurados y pipelines de NLP y scraping.', projects: ['NLP pipelines', 'Scraping & storage'] },
    python:  { title: 'Python',       desc: 'Lenguaje principal. Uso en análisis de datos (pandas, numpy), ML (sklearn, TF), scripting y backend. TFG desarrollado íntegramente en Python.', projects: ['TFG ML', 'Automatización BI'] },
    sql:     { title: 'SQL',          desc: 'Consultas complejas, CTEs, funciones de ventana y optimización de queries en MySQL y PostgreSQL. Fuertes conocimientos de modelado relacional.', projects: ['Reporting BI', 'Data pipelines'] },
    tf:      { title: 'TensorFlow',   desc: 'Framework de deep learning. Modelos de clasificación de imágenes (CNN) y procesamiento de lenguaje natural (transformers, fine-tuning).', projects: ['Computer Vision', 'NLP classifier'] },
    sklearn: { title: 'Scikit-learn', desc: 'ML clásico: regresión, clasificación, clustering, PCA, pipelines y validación cruzada. Base del TFG de Minería de Datos.', projects: ['TFG Mining', 'Análisis predictivo'] },
    nlp:     { title: 'NLP / CV',     desc: 'Procesamiento de lenguaje natural (NLTK, spaCy, Transformers) y visión por computador (OpenCV). Proyectos de clasificación de texto e imagen.', projects: ['Text classification', 'Image detection'] },
    knime:   { title: 'KNIME',        desc: 'Plataforma de data analytics. Workflows de ETL, modelado y reporting. Usado activamente en prácticas en Balinot Tech Consulting.', projects: ['ETL pipelines', 'BI reporting'] },
    powerbi: { title: 'Power BI',     desc: 'Creación de dashboards interactivos y reportes ejecutivos. DAX, Power Query, publicación web y conexión a múltiples fuentes de datos.', projects: ['Dashboards ejecutivos', 'KPI tracking'] },
    pentaho: { title: 'Pentaho',      desc: 'Suite de BI: transformaciones ETL con Kettle (PDI), data integration y reporting en entornos enterprise con múltiples fuentes.', projects: ['ETL enterprise', 'Data Integration'] },
    output:  { title: 'Dashboards',   desc: 'Resultado final del pipeline: insights accionables, visualizaciones interactivas y reportes ejecutivos presentados a stakeholders.', projects: ['Power BI dashboards', 'KNIME reports'] },
  };

  function showNodeDetail(node, cat) {
    const panel   = document.getElementById('nodePanel');
    const content = document.getElementById('nodePanelContent');
    if (!panel || !content) return;

    const info = detailContent[node.id];
    if (!info) return;

    content.innerHTML = `
      <div style="display:flex;align-items:center;gap:.7rem;margin-bottom:.7rem;">
        <span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${cat.color};flex-shrink:0;"></span>
        <h3 style="font-size:1.05rem;font-weight:700;">${info.title}</h3>
        <span style="font-family:var(--mono);font-size:.68rem;background:rgba(0,0,0,0.05);padding:.2rem .5rem;border-radius:4px;color:var(--muted);">${cat.label}</span>
      </div>
      <p style="font-size:.86rem;color:var(--muted);line-height:1.65;margin-bottom:.85rem;">${info.desc}</p>
      <div style="font-family:var(--mono);font-size:.72rem;color:var(--muted);margin-bottom:.4rem;"># Proyectos relacionados</div>
      <div style="display:flex;gap:.45rem;flex-wrap:wrap;">
        ${info.projects.map(p => `<span style="font-family:var(--mono);font-size:.7rem;padding:.2rem .6rem;background:rgba(0,0,0,0.05);border:1px solid var(--border);border-radius:4px;">${p}</span>`).join('')}
      </div>
    `;

    panel.classList.remove('hidden');
    panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  document.getElementById('nodePanelClose')?.addEventListener('click', () => {
    document.getElementById('nodePanel')?.classList.add('hidden');
  });
}

/* ============================
   SCROLL REVEAL (IntersectionObserver)
============================ */
function initRevealObserver() {
  const rc      = document.getElementById('rightContent');
  const reveals = document.querySelectorAll('.reveal');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { root: rc, threshold: 0.1 });

  reveals.forEach(el => obs.observe(el));
}

/* ============================
   SPOTLIGHT ON EXPERIENCE CARDS
============================ */
function initSpotlightCards() {
  document.querySelectorAll('.git-commit-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width  * 100) + '%');
      card.style.setProperty('--my', ((e.clientY - rect.top)  / rect.height * 100) + '%');
    });
  });
}

/* ============================
   CONTACT FORM (mailto)
============================ */
function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg   = document.getElementById('message').value.trim();
    const sub   = encodeURIComponent(`Portfolio — Mensaje de ${name}`);
    const body  = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${msg}`);

    window.location.href = `mailto:sergiomelendoroldan@gmail.com?subject=${sub}&body=${body}`;

    if (success) {
      success.classList.remove('hidden');
      setTimeout(() => success.classList.add('hidden'), 6000);
    }
  });
}

/* ============================
   EASTER EGG — 'python' keyboard trigger
============================ */
function initEasterEgg() {
  const egg      = document.getElementById('easterEgg');
  const eeOutput = document.getElementById('eeOutput');
  const eeClose  = document.getElementById('eeClose');
  if (!egg) return;

  let buffer = '';
  const keyword = 'python';

  document.addEventListener('keydown', e => {
    if (egg.classList.contains('hidden')) {
      buffer += e.key.toLowerCase();
      if (buffer.includes(keyword)) { buffer = ''; openEgg(); }
      if (buffer.length > 24) buffer = buffer.slice(-12);
    }
  });

  function openEgg() {
    egg.classList.remove('hidden');
    if (eeOutput) {
      eeOutput.innerHTML = '';
      addLine('Python 3.11.0 (portfolio mode) — Hola, me has encontrado! 🐍', '');
      addLine('Type: about() | skills() | contact() | exit()', 'inf');
      addLine('>>> ', '');
    }
  }

  function addLine(text, cls) {
    if (!eeOutput) return;
    const span = document.createElement('span');
    span.className = 'ee-line ' + cls;
    span.textContent = text;
    eeOutput.appendChild(span);
    eeOutput.scrollTop = eeOutput.scrollHeight;
  }

  // Fake interactive responses
  const responses = {
    'about()':    ['res', 'DataScientist(name="Sergio Melendo", loc="Granada, ES", status="open_to_work ✅")'],
    'skills()':   ['res', '["Python","SQL","KNIME","TensorFlow","Power BI","PostgreSQL","NLP","CV"]'],
    'contact()':  ['res', 'Opening mailto:sergiomelendoroldan@gmail.com ...'],
    'exit()':     ['inf', 'Cerrando terminal...'],
    'exit':       ['inf', 'Cerrando terminal...'],
    'help()':     ['inf', 'Available: about() | skills() | contact() | exit()'],
    'print("hello world")': ['res', 'hello world'],
    'import antigravity':   ['res', '🚀 Wheeeee! — antigravity imported (portfolio edition)'],
    '1+1':                  ['res', '2'],
  };

  // Keyboard input inside easter egg
  let currentInput = '';
  document.addEventListener('keydown', e => {
    if (egg.classList.contains('hidden')) return;
    if (e.key === 'Enter') {
      const cmd = currentInput.trim().toLowerCase();
      addLine('>>> ' + currentInput, '');
      currentInput = '';
      const resp = responses[cmd];
      if (resp) {
        addLine(resp[1], resp[0]);
        if (cmd === 'exit()' || cmd === 'exit') {
          setTimeout(() => egg.classList.add('hidden'), 900);
        }
        if (cmd === 'contact()') {
          setTimeout(() => { window.location.href = 'mailto:sergiomelendoroldan@gmail.com'; }, 500);
        }
      } else if (cmd) {
        addLine(`NameError: name '${cmd.split('(')[0]}' is not defined`, 'err');
      }
      addLine('>>> ', '');
    } else if (e.key === 'Backspace') {
      currentInput = currentInput.slice(0, -1);
    } else if (e.key.length === 1) {
      currentInput += e.key;
    }
  });

  eeClose?.addEventListener('click', () => egg.classList.add('hidden'));
}

/* ============================
   MOBILE MENU
============================ */
function initMobileMenu() {
  const btn   = document.getElementById('mobileMenuBtn');
  const panel = document.getElementById('leftPanel');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    panel.classList.toggle('open');
    btn.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (panel.classList.contains('open') && !panel.contains(e.target) && !btn.contains(e.target)) {
      panel.classList.remove('open');
      btn.classList.remove('open');
    }
  });
}
