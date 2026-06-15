/* Custom magnetic cursor */
(function () {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mx = -100, my = -100;  /* mouse position */
  let rx = -100, ry = -100;  /* ring position (lerped) */

  /* move dot instantly, ring follows with lag */
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  /* hover states */
  const interactives = 'a,button,.btn-play,.btn-watchlist,.play-btn,.hero-wl,.card-sm,.show-card,.bento-card,.ep-item,.nav-burger,.nav-grid,.arr-btn,.social-link,.footer-link,.section-link,.marquee-text';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(interactives)) {
      document.body.classList.add('cur-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(interactives)) {
      document.body.classList.remove('cur-hover');
    }
  });

  /* click effect */
  document.addEventListener('mousedown', () => {
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(0.85)`;
  });

  document.addEventListener('mouseup', () => {
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%) scale(1)`;
  });

  /* animation loop for ring */
  function lerp(a, b, t) { return a + (b - a) * t; }

  (function loop() {
    rx = lerp(rx, mx, 0.12);
    ry = lerp(ry, my, 0.12);
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
})();
