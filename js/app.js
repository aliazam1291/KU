/* KU — animations, scroll, loader, carousel */
(function () {

  /* ─────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────── */
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  /* split element text into .char spans */
  function splitChars(el) {
    const raw = el.textContent;
    el.textContent = '';
    raw.split('').forEach(ch => {
      const s = document.createElement('span');
      s.className = ch === ' ' ? 'space-char' : 'char';
      s.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(s);
    });
    return el.querySelectorAll('.char');
  }

  /* stagger-animate chars in */
  function animChars(chars, delay0, staggerMs) {
    chars.forEach((c, i) => {
      setTimeout(() => {
        c.style.transition = 'opacity .6s ease, transform .7s cubic-bezier(.16,1,.3,1)';
        c.style.opacity = '1';
        c.style.transform = 'translateY(0)';
      }, delay0 + i * staggerMs);
    });
  }

  /* fade + slide element in */
  function fadeIn(el, delay, dur = 700) {
    if (!el) return;
    setTimeout(() => {
      el.style.transition = `opacity ${dur}ms ease, transform ${dur}ms cubic-bezier(.16,1,.3,1)`;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, delay);
  }

  /* ─────────────────────────────────────────
     LENIS SMOOTH SCROLL
  ───────────────────────────────────────── */
  let lenis;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });

    function rafLoop(t) {
      lenis.raf(t);
      requestAnimationFrame(rafLoop);
    }
    requestAnimationFrame(rafLoop);

    /* sync GSAP ScrollTrigger if available */
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }
  }

  /* ─────────────────────────────────────────
     SCROLL PROGRESS → Three.js
  ───────────────────────────────────────── */
  function getScrollProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? window.scrollY / max : 0;
  }

  window.addEventListener('scroll', () => {
    if (window.KUBg) window.KUBg.setScroll(getScrollProgress());
    /* nav scroll class */
    document.querySelector('nav').classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ─────────────────────────────────────────
     LOADER
  ───────────────────────────────────────── */
  const loader = document.getElementById('loader');
  const loaderLogo = loader && loader.querySelector('.loader-logo');
  const loaderFill = loader && loader.querySelector('.loader-fill');

  function runLoader() {
    if (!loader) { revealPage(); return; }

    /* logo appears */
    setTimeout(() => {
      if (loaderLogo) {
        loaderLogo.style.transition = 'opacity .8s ease, transform .9s cubic-bezier(.16,1,.3,1)';
        loaderLogo.style.opacity = '1';
        loaderLogo.style.transform = 'translateY(0)';
      }
    }, 200);

    /* bar fills */
    setTimeout(() => {
      if (loaderFill) {
        loaderFill.style.transition = 'transform 1.4s cubic-bezier(.16,1,.3,1)';
        loaderFill.style.transform = 'scaleX(1)';
      }
    }, 400);

    /* curtain wipe out */
    setTimeout(() => {
      loader.style.transition = 'clip-path 1s cubic-bezier(.77,0,.18,1), opacity .6s ease';
      loader.style.clipPath = 'inset(0 0 100% 0)';
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
        revealPage();
      }, 1000);
    }, 2000);
  }

  /* ─────────────────────────────────────────
     PAGE REVEAL (hero cascade)
  ───────────────────────────────────────── */
  function revealPage() {
    /* hero title lines */
    document.querySelectorAll('.hero-title-inner').forEach((el, i) => {
      setTimeout(() => el.classList.add('revealed'), 100 + i * 120);
    });

    /* other hero elements */
    const heroEls = [
      ['.hero-rating', 550],
      ['.hero-genres', 700],
      ['.hero-meta', 850],
      ['.hero-desc', 1000],
      ['.hero-actions', 1150],
      ['.hero-center', 1000],
      ['.hero-right', 1100],
      ['.also-liked', 1300],
    ];

    heroEls.forEach(([sel, delay]) => {
      fadeIn(document.querySelector(sel), delay);
    });

    /* section animations (scroll-based) */
    initScrollAnimations();
  }

  /* ─────────────────────────────────────────
     SCROLL ANIMATIONS
  ───────────────────────────────────────── */
  function initScrollAnimations() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const type = el.dataset.anim;

        if (type === 'chars') {
          const chars = el.querySelectorAll('.char');
          animChars(chars, 0, 28);
          io.unobserve(el);
        }

        if (type === 'fade') {
          el.style.transition = 'opacity .9s ease, transform .9s cubic-bezier(.16,1,.3,1)';
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          io.unobserve(el);
        }

        if (type === 'cards') {
          const cards = el.querySelectorAll('.show-card');
          cards.forEach((c, i) => {
            setTimeout(() => {
              c.style.transition = 'clip-path .9s cubic-bezier(.77,0,.18,1)';
              c.style.clipPath = 'inset(0% 0 0 0)';
            }, i * 120);
          });
          io.unobserve(el);
        }

        if (type === 'bento') {
          const cards = el.querySelectorAll('.bento-card');
          cards.forEach((c, i) => {
            c.style.opacity = '0';
            c.style.transform = 'translateY(24px)';
            setTimeout(() => {
              c.style.transition = 'opacity .8s ease, transform .8s cubic-bezier(.16,1,.3,1)';
              c.style.opacity = '1';
              c.style.transform = 'translateY(0)';
            }, i * 100);
          });
          io.unobserve(el);
        }

        if (type === 'episodes') {
          const items = el.querySelectorAll('.ep-item');
          items.forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-16px)';
            setTimeout(() => {
              item.style.transition = 'opacity .7s ease, transform .7s cubic-bezier(.16,1,.3,1)';
              item.style.opacity = '1';
              item.style.transform = 'translateX(0)';
            }, i * 80);
          });
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12 });

    /* register elements */
    document.querySelectorAll('[data-anim]').forEach(el => io.observe(el));

    /* split section headings */
    document.querySelectorAll('.section-h').forEach(el => {
      splitChars(el);
    });
  }

  /* ─────────────────────────────────────────
     3D CARD TILT ON MOUSEMOVE
  ───────────────────────────────────────── */
  document.querySelectorAll('.show-card,.bento-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const nx = (cx / rect.width  - 0.5) * 2;   /* -1 to 1 */
      const ny = (cy / rect.height - 0.5) * 2;
      const rx = ny * -8;
      const ry = nx *  8;
      card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────
     HORIZONTAL DRAG CAROUSEL
  ───────────────────────────────────────── */
  const viewport = document.querySelector('.cards-viewport');
  const track    = document.querySelector('.cards-track');
  const btnPrev  = document.querySelector('.arr-btn.prev');
  const btnNext  = document.querySelector('.arr-btn.next');

  if (viewport && track) {
    let isDown = false, startX = 0, scrollLeft = 0;
    let velX = 0, lastX = 0, lastT = 0;

    viewport.addEventListener('pointerdown', e => {
      isDown = true;
      startX = e.pageX - viewport.offsetLeft;
      scrollLeft = viewport.scrollLeft;
      lastX = e.pageX;
      lastT = Date.now();
      viewport.setPointerCapture(e.pointerId);
    });

    viewport.addEventListener('pointermove', e => {
      if (!isDown) return;
      const x = e.pageX - viewport.offsetLeft;
      const walk = (x - startX) * 1.2;
      viewport.scrollLeft = scrollLeft - walk;
      const now = Date.now();
      velX = (e.pageX - lastX) / (now - lastT + 1);
      lastX = e.pageX;
      lastT = now;
    });

    ['pointerup','pointercancel'].forEach(ev => {
      viewport.addEventListener(ev, () => {
        isDown = false;
        /* momentum */
        let v = -velX * 10;
        (function momentum() {
          if (Math.abs(v) < 0.5) return;
          viewport.scrollLeft += v;
          v *= 0.92;
          requestAnimationFrame(momentum);
        })();
      });
    });

    /* arrow buttons */
    const STEP = 160;
    if (btnPrev) btnPrev.addEventListener('click', () => {
      viewport.scrollBy({ left: -STEP, behavior: 'smooth' });
    });
    if (btnNext) btnNext.addEventListener('click', () => {
      viewport.scrollBy({ left: STEP, behavior: 'smooth' });
    });
  }

  /* ─────────────────────────────────────────
     START
  ───────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runLoader);
  } else {
    runLoader();
  }

})();
