(() => {
  const d = document, root = d.documentElement;
  const mq = (q) => matchMedia(q).matches;
  const still = mq('(prefers-reduced-motion: reduce)');
  const lean = !!(navigator.connection && navigator.connection.saveData);

  // Theme: system by default, a choice is remembered.
  const dark = () => root.dataset.theme ? root.dataset.theme === 'dark' : mq('(prefers-color-scheme: dark)');
  const btn = d.querySelector('.theme');
  const label = () => btn.setAttribute('aria-label', dark() ? 'Switch to light theme' : 'Switch to dark theme');
  label();
  btn.addEventListener('click', () => {
    root.dataset.theme = dark() ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
    label(); d.dispatchEvent(new Event('themechange'));
  });

  // Frames develop as they come into view.
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  d.querySelectorAll('.dev').forEach((el) => io.observe(el));

  // Counts settle onto their values: a critically damped approach, no overshoot past the truth.
  const fmt = new Intl.NumberFormat('en-US');
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const el = e.target, to = +el.dataset.to, t0 = performance.now(), dur = 1400;
    el.style.minWidth = el.offsetWidth + 'px';
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
    const sync = () => { prev.disabled = rail.scrollLeft < 8; next.disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8; };
    const by = (dir) => rail.scrollBy({ left: dir * rail.clientWidth * .8, behavior: still ? 'auto' : 'smooth' });
    prev.addEventListener('click', () => by(-1)); next.addEventListener('click', () => by(1));
    rail.addEventListener('scroll', sync, { passive: true }); sync();
  }

  // Hero: a light leak burning in at the edge of the frame, plus film grain. WebGL, no library.
  const hero = d.querySelector('.hero'), cv = hero && hero.querySelector('canvas');
  if (!cv || still) return;
  const gl = cv.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'low-power' });
  if (!gl) return;
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `precision mediump float;uniform vec2 r;uniform float t,dk;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fb(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n(p);p*=2.03;a*=.5;}return s;}
void main(){vec2 uv=gl_FragCoord.xy/r;vec2 q=uv;q.x*=r.x/r.y;float T=t*.05;
float w=fb(q*1.6+vec2(T,-T*.7));
float l1=smoothstep(.95,0.,length((uv-vec2(.98,1.02))*vec2(1.1,1.5))+.25*w-.12);
float l2=smoothstep(.8,0.,length((uv-vec2(.78+.06*sin(T*3.),1.08))*vec2(1.6,1.9))+.3*fb(q*2.4-T));
float l3=smoothstep(.6,0.,length((uv-vec2(.02,-.06))*vec2(1.4,1.8))+.25*w)*.35;
vec3 a=vec3(.91,.55,.2),b=vec3(.84,.27,.16),c=mix(b,a,clamp(l2*1.4,0.,1.));
float al=clamp(l1*.75+l2*.65+l3,0.,1.)*mix(.5,.85,dk);
float g=(h(gl_FragCoord.xy+fract(t)*91.)-.5)*mix(.035,.06,dk);
gl_FragColor=vec4(c*al+g,al+abs(g));}`;
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const U = (k) => gl.getUniformLocation(pr, k), ur = U('r'), ut = U('t'), ud = U('dk');
  const setDark = () => gl.uniform1f(ud, dark() ? 1 : 0);
  setDark(); d.addEventListener('themechange', setDark);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setDark);
  const size = () => {
    const dpr = Math.min(devicePixelRatio || 1, 1.5), w = Math.round(cv.clientWidth * dpr * .5), h = Math.round(cv.clientHeight * dpr * .5);
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(ur, w, h); }
  };
  let on = true, raf = 0, last = 0, acc = 0;
  const frame = (now) => {
    raf = 0;
    if (!on || d.hidden) return;
    acc += Math.min(now - (last || now), 50); last = now;
    size(); gl.uniform1f(ut, acc / 1000); gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!hero.classList.contains('gl')) hero.classList.add('gl');
    raf = requestAnimationFrame(frame);
  };
  const go = () => { if (!raf && on && !d.hidden) { last = 0; raf = requestAnimationFrame(frame); } };
  new IntersectionObserver(([e]) => { on = e.isIntersecting; go(); }).observe(hero);
  d.addEventListener('visibilitychange', go);
  addEventListener('resize', go, { passive: true });
})();
