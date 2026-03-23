// ============================
// PRELOADER
// ============================
(function () {
  const fill = document.querySelector('.pre-bar-fill');
  const count = document.querySelector('.pre-count');
  const preloader = document.getElementById('preloader');
  let pct = 0;
  if (fill) fill.style.width = '100%';
  const timer = setInterval(() => {
    pct = Math.min(pct + Math.floor(Math.random() * 14 + 4), 100);
    if (count) count.textContent = pct + '%';
    if (pct >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        gsap.to(preloader, { opacity: 0, duration: 0.6, ease: 'power2.inOut', onComplete: () => { preloader.style.display = 'none'; initAnimations(); } });
      }, 300);
    }
  }, 70);
})();

// ============================
// CURSOR
// ============================
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; if(cursor){cursor.style.left=mx+'px';cursor.style.top=my+'px';} });
(function animCursor() {
  rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16;
  if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}
  requestAnimationFrame(animCursor);
})();
document.querySelectorAll('a,button,.skill-pills span,.contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor?.classList.add('grow'); ring?.classList.add('grow'); });
  el.addEventListener('mouseleave', () => { cursor?.classList.remove('grow'); ring?.classList.remove('grow'); });
});

// ============================
// TYPED TEXT
// ============================
const phrases = ['Ingeniero Informático', 'Data Analyst', 'ML Enthusiast', 'Business Intelligence'];
let phraseIdx = 0, charIdx = 0, deleting = false;
function typeEffect() {
  const el = document.getElementById('typed');
  if (!el) return;
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    el.textContent = phrase.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === phrase.length) { deleting = true; setTimeout(typeEffect, 1800); return; }
  } else {
    el.textContent = phrase.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
  }
  setTimeout(typeEffect, deleting ? 60 : 90);
}

// ============================
// MOBILE MENU
// ============================
const menuBtn = document.getElementById('menuBtn');
const mobileNav = document.getElementById('mobileNav');
menuBtn.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuBtn.classList.toggle('open', open);
  document.body.classList.toggle('no-scroll', open);
});
document.querySelectorAll('.mobile-nav a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    menuBtn.classList.remove('open');
    document.body.classList.remove('no-scroll');
  });
});

// ============================
// HEADER SCROLL
// ============================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
}, { passive: true });

// ============================
// ACTIVE NAV LINKS
// ============================
function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  links.forEach(l => { l.style.color = l.getAttribute('href') === '#' + current ? 'var(--text)' : ''; });
}

// ============================
// SCROLL REVEAL (IntersectionObserver)
// ============================
function initReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ============================
// COUNTER ANIMATION
// ============================
function animateCounter(el, target, decimals = 0, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isNum = !isNaN(target);
  if (!isNum) { el.textContent = target; return; }
  function update(now) {
    const t = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    const val = (target * ease).toFixed(decimals);
    el.textContent = val + suffix;
    if (t < 1) requestAnimationFrame(update);
    else el.textContent = target.toFixed(decimals) + suffix;
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const t = el.dataset.target;
        const d = parseInt(el.dataset.dec || 0);
        const s = el.dataset.suffix || '';
        animateCounter(el, parseFloat(t), d, s);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
}

// ============================
// GSAP HERO ANIMATION
// ============================
function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.to('.hero-badge', { opacity: 1, y: 0, duration: 0.7 })
    .to('.hero-title .line-inner', { y: '0%', opacity: 1, duration: 0.9, stagger: 0.12 }, '-=0.3')
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-btns', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
    .to('.hero-stats', { opacity: 1, y: 0, duration: 0.7 }, '-=0.5');

  typeEffect();
  initReveal();
  initCounters();

  // Skill cards stagger on scroll
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.fromTo(card, { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, delay: i * 0.08,
      scrollTrigger: { trigger: card, start: 'top 88%', once: true }
    });
  });
}

// ============================
// CONTACT FORM (mailto)
// ============================
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const msg = document.getElementById('message').value;
    const subject = encodeURIComponent(`Portfolio - Mensaje de ${name}`);
    const body = encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\n${msg}`);
    window.location.href = `mailto:sergiomelendoroldan@gmail.com?subject=${subject}&body=${body}`;
    document.getElementById('formSuccess').style.display = 'block';
  });
}
