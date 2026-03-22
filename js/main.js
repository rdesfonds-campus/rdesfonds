/* ═══════════════════════════════════════════
   ROMAIN DESFONDS — main.js
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── MOBILE MENU ── */
  const burger     = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');

  burger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  document.querySelectorAll('#mobile-menu a, .nav-links a').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href.startsWith('#')) return;
      e.preventDefault();
      mobileMenu.classList.remove('open');
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ── PARALLAXE PORTRAIT ──
     L'image se déplace verticalement à un rythme différent du scroll,
     créant un effet de profondeur dans le cadre.
  ── */
  const portraitImg = document.querySelector('.portrait-frame img');
  const portraitFrame = document.querySelector('.portrait-frame');

  if (portraitImg && portraitFrame) {
    const handlePortraitParallax = () => {
      const rect   = portraitFrame.getBoundingClientRect();
      const winH   = window.innerHeight;

      // Ne calcule que si le frame est visible
      if (rect.bottom < 0 || rect.top > winH) return;

      // Progression de 0 (frame en bas d'écran) à 1 (frame en haut d'écran)
      const progress = 1 - (rect.bottom / (winH + rect.height));
      // Amplitude max : 15% de la hauteur du frame (correspond aux 115% de height CSS)
      const offset   = (progress - 0.5) * rect.height * 0.15;

      portraitImg.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener('scroll', handlePortraitParallax, { passive: true });
    handlePortraitParallax(); // init au chargement
  }

  /* ── CARROUSEL ── */
  const track = document.getElementById('carousel');

  if (track) {
    const cardWidth = () => {
      const card = track.querySelector('.proj-card');
      return card ? card.offsetWidth + 20 : 300;
    };

    document.getElementById('prev-btn')
      .addEventListener('click', () => track.scrollBy({ left: -cardWidth(), behavior: 'smooth' }));
    document.getElementById('next-btn')
      .addEventListener('click', () => track.scrollBy({ left: cardWidth(), behavior: 'smooth' }));
  }

  /* ── LIGHTBOX ── */
  const lbData = [
    { title: 'Branding Siroco SAS', desc: 'Identité visuelle & Packaging', img: 'branding-_packaging_siroco.jpg' },
    { title: 'E-shop Nature.cos',   desc: 'Marketing Digital & UI',        img: 'https://picsum.photos/seed/eshop99/1200/800' },
    { title: 'Projet #1',           desc: 'Développement Web',             img: '' },
    { title: 'Projet #2',           desc: 'Développement Web',             img: '' },
    { title: 'Projet #3',           desc: 'Développement Web',             img: '' },
  ];

  let lbIdx = 0;
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lb-img');
  const lbTitle = document.getElementById('lb-title');
  const lbDesc  = document.getElementById('lb-desc');

  function openLb(idx) {
    lbIdx = idx;
    updateLb();
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function lbNav(d) {
    lbIdx = (lbIdx + d + lbData.length) % lbData.length;
    updateLb();
  }

  function updateLb() {
    const d = lbData[lbIdx];
    lbImg.src         = d.img || 'https://placehold.co/900x600/0c4a6e/7dd3fc?text=À+venir';
    lbImg.alt         = d.title;
    lbTitle.textContent = d.title;
    lbDesc.textContent  = d.desc;
  }

  // Exposer closeLb et lbNav globalement (utilisés dans le HTML via onclick)
  window.closeLb = closeLb;
  window.lbNav   = lbNav;

  if (track) {
    track.addEventListener('click', e => {
      const card = e.target.closest('.proj-card');
      if (card) openLb(parseInt(card.dataset.index));
    });
  }

  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowRight') lbNav(1);
    if (e.key === 'ArrowLeft')  lbNav(-1);
  });

  /* ── FORMSPREE ── */
  const form = document.getElementById('contact-form');

  if (form) {
    form.addEventListener('submit', async e => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }

      const btn = form.querySelector('.form-submit');
      btn.textContent = 'Envoi…';
      btn.disabled    = true;

      try {
        const r = await fetch(form.action, {
          method:  'POST',
          body:    new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (r.ok) {
          btn.textContent = 'Message envoyé ✓';
          form.reset();
        } else {
          throw new Error();
        }
      } catch {
        btn.textContent = 'Erreur — réessayez';
        btn.disabled    = false;
      }
    });
  }

});
