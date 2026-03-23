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

  /* ── PARALLAXE PORTRAIT ── */
  const portraitImg   = document.querySelector('.portrait-frame img');
  const portraitFrame = document.querySelector('.portrait-frame');

  if (portraitImg && portraitFrame) {
    const handlePortraitParallax = () => {
      const rect = portraitFrame.getBoundingClientRect();
      const winH = window.innerHeight;
      if (rect.bottom < 0 || rect.top > winH) return;
      const progress = 1 - (rect.bottom / (winH + rect.height));
      const offset   = (progress - 0.5) * rect.height * 0.15;
      portraitImg.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener('scroll', handlePortraitParallax, { passive: true });
    handlePortraitParallax();
  }

  /* ── LIGHTBOX + CAROUSEL ── */
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lb-img');
  const lbPh     = document.getElementById('lb-placeholder');
  const lbTitle  = document.getElementById('lb-title');
  const lbCat    = document.getElementById('lb-cat');
  const lbLink   = document.getElementById('lb-link');
  const lbClose  = document.getElementById('lb-close');
  const lbPrev   = document.getElementById('lb-prev');
  const lbNext   = document.getElementById('lb-next');
  const track    = document.getElementById('carousel');

  const cards = Array.from(document.querySelectorAll('.proj-card'));
  let current = 0;

  function openLb(index) {
    current = ((index % cards.length) + cards.length) % cards.length;
    const card  = cards[current];
    const img   = card.dataset.img   || '';
    const title = card.dataset.title || '';
    const cat   = card.dataset.cat   || '';
    const link  = card.dataset.link  || '';
    const label = card.dataset.label || 'En savoir plus';

    if (img) {
      lbImg.src = img;
      lbImg.alt = title;
      lbImg.style.display = 'block';
      lbPh.style.display  = 'none';
    } else {
      lbImg.style.display = 'none';
      lbPh.style.display  = 'flex';
    }

    lbTitle.textContent = title;
    lbCat.textContent   = cat;

    if (link) {
      lbLink.href = link;
      lbLink.innerHTML = `<i class="fas fa-arrow-up-right-from-square"></i> ${label}`;
      lbLink.classList.remove('hidden');
    } else {
      lbLink.classList.add('hidden');
    }

    lbPrev.style.opacity = '1';
    lbNext.style.opacity = '1';

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLb() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  cards.forEach((card, i) => card.addEventListener('click', () => openLb(i)));
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', () => openLb(current - 1));
  lbNext.addEventListener('click', () => openLb(current + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')     closeLb();
    if (e.key === 'ArrowLeft')  openLb(current - 1);
    if (e.key === 'ArrowRight') openLb(current + 1);
  });

  /* ── CAROUSEL SCROLL ── */
  if (track) {
    const getCardWidth = () => {
      const card = track.querySelector('.proj-card');
      return card ? card.offsetWidth + 20 : 320;
    };

    const isAtEnd   = () => track.scrollLeft + track.offsetWidth >= track.scrollWidth - 2;
    const isAtStart = () => track.scrollLeft <= 2;

    document.getElementById('next-btn').addEventListener('click', () => {
      if (isAtEnd()) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
      }
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
      if (isAtStart()) {
        track.scrollTo({ left: track.scrollWidth, behavior: 'smooth' });
      } else {
        track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
      }
    });
  }

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