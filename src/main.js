(() => {
  const d = document, root = d.documentElement;
  const mq = (q) => matchMedia(q).matches;
  const still = mq('(prefers-reduced-motion: reduce)');
  const lean = !!(navigator.connection && navigator.connection.saveData);

  // Theme: light by default, a switch to dark is remembered.
  const dark = () => root.dataset.theme === 'dark';
  const btn = d.querySelector('.theme');
  const meta = d.querySelector('meta[name="theme-color"]');
  const sync = () => {
    btn.setAttribute('aria-label', dark() ? 'Switch to light theme' : 'Switch to dark theme');
    meta.setAttribute('content', dark() ? '#0f1318' : '#f7f7f4');
  };
  sync();
  btn.addEventListener('click', () => {
    if (dark()) delete root.dataset.theme; else root.dataset.theme = 'dark';
    try { localStorage.setItem('theme', dark() ? 'dark' : 'light'); } catch (e) {}
    sync(); d.dispatchEvent(new Event('themechange'));
  });

  // The bar gets a hairline once the page moves under it.
  const bar = d.querySelector('.bar');
  const edge = () => bar.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', edge, { passive: true }); edge();

  // Cards ease in as they arrive.
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -6% 0px' });
  d.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // Counts settle onto their values: a critically damped approach, no overshoot past the truth.
  const fmt = new Intl.NumberFormat('en-US');
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.to, t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / dur), x = 1 - (1 + 7 * k) * Math.exp(-7 * k);
      el.textContent = fmt.format(Math.round(to * (k < 1 ? x : 1)));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  if (!still) d.querySelectorAll('[data-to]').forEach((el) => cio.observe(el));

  // Preview loops: wide screens with a mouse only, never on save-data or reduced motion.
  if (!still && !lean && mq('(min-width: 900px) and (hover: hover)')) {
    const vio = new IntersectionObserver((es) => es.forEach((e) => {
      const pic = e.target; let v = pic.querySelector('video');
      if (e.isIntersecting) {
        if (!v) {
          v = d.createElement('video');
          Object.assign(v, { muted: true, loop: true, playsInline: true, preload: 'none', src: pic.dataset.loop });
          v.setAttribute('aria-hidden', 'true');
          v.addEventListener('playing', () => v.classList.add('on'), { once: true });
          pic.appendChild(v);
        }
        v.play().catch(() => {});
      } else if (v) v.pause();
    }), { threshold: .35 });
    d.querySelectorAll('[data-loop]').forEach((el) => vio.observe(el));
  }

  // Strip nudge buttons.
  const rail = d.querySelector('.rail'), [prev, next] = d.querySelectorAll('.nudge button');
  if (rail && prev) {
    const ends = () => { prev.disabled = rail.scrollLeft < 8; next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8; };
    const by = (dir) => rail.scrollBy({ left: dir * rail.clientWidth * .8, behavior: still ? 'auto' : 'smooth' });
    prev.addEventListener('click', () => by(-1)); next.addEventListener('click', () => by(1));
    rail.addEventListener('scroll', ends, { passive: true }); ends();
  }
})();
