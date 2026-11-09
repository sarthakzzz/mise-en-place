/* Catch the fruit: the first time a visitor scrolls down (then at most once a week), one fruit rolls across
   the page now and then. It dodges the cursor (or hops away from near-miss taps) but tires, so it can be caught.
   Catching it asks our Apps Script for one single-use Moonbase code with a random reward; the basket applies it.
   Settings: CONFIG.catchFruit. Preview: ?catch=test (always shows, gives a fake code, never calls the server). */
(() => {
  const C = (window.CONFIG || {}).catchFruit || {}, qs = new URLSearchParams(location.search), test = qs.get('catch') === 'test';
  if (!C.on && !test) return;
  const KEY = 'pfb-fruit', DAY = 864e5, get = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } },
    put = o => { try { localStorage.setItem(KEY, JSON.stringify(Object.assign(get(), o))); } catch (e) {} };
  const REWARDS = C.rewards || {
    plugin50: {line: '50% off any one plugin', fits: id => !/^(fridge|club)$/.test(id)},
    fridge50: {line: '50% off the Full Fridge Bundle', fits: id => id === 'fridge'},
    club30: {line: '30% off the Breakfast Club', fits: id => id === 'club'},
    month50: {line: '50% off your first month of the Breakfast Club', fits: id => id === 'club'}
  };
  for (const k in REWARDS) if (C.rewards && typeof REWARDS[k].fits === 'string') { const ids = REWARDS[k].fits.split(','); REWARDS[k].fits = id => ids.includes(id); }

  /* ---- the basket side: works on every visit while a caught code is saved ---- */
  const held = () => { const s = get(); return s.code && REWARDS[s.reward] && !s.used ? s : null; };
  window.pfbCatch = {
    held,
    // index of the basket item that takes the caught code, or -1
    pick(cart){ const h = held(); return h ? cart.findIndex(REWARDS[h.reward].fits) : -1; },
    get code(){ const h = held(); return h ? h.code : ''; },
    used(){ put({used: Date.now()}); },
    note(cart){ const h = held(); if (!h) return ''; const r = REWARDS[h.reward], on = cart.findIndex(r.fits) >= 0;
      return `<div class="catch-note">🍊 Your caught code <b>${h.code}</b>: ${r.line}. ${on ? 'It is applied at checkout.' : 'Add it to your basket to use it.'}</div>`; }
  };
  if (!test && held() && Date.now() - (get().caught || 0) < (C.everyDays || 7) * DAY) return;   // already caught this week

  /* ---- when to show the fruit ---- */
  const s0 = get(), first = !s0.seen, due = test || first || Date.now() - s0.seen >= (C.everyDays || 7) * DAY;
  if (!due) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  let armed = false;
  const onScroll = () => { if (armed || scrollY < innerHeight * .6) return; armed = true; removeEventListener('scroll', onScroll); put({seen: Date.now()}); setTimeout(pass, 1200); };
  addEventListener('scroll', onScroll, {passive: true});

  /* ---- styles (only injected when the fruit is due) ---- */
  const css = document.createElement('style');
  css.textContent = `.cf{position:fixed;left:0;top:0;z-index:44;width:84px;height:84px;margin:-42px 0 0 -42px;touch-action:none;cursor:pointer;will-change:transform;-webkit-tap-highlight-color:transparent}
.cf .cf-ball{position:absolute;inset:10px;filter:drop-shadow(0 8px 6px rgba(70,20,0,.35))}.cf .cf-ball svg{width:100%;height:100%}
.cf-tag{position:fixed;left:0;top:0;z-index:44;transform:translate(-50%,-100%);pointer-events:auto;white-space:nowrap;font:800 13px/1 Manrope,system-ui,sans-serif;background:#2b1d16;color:#ffe08a;padding:8px 10px 8px 12px;border-radius:999px;box-shadow:0 6px 16px -6px rgba(0,0,0,.45);display:flex;gap:8px;align-items:center;will-change:transform}
.cf-tag:after{content:"";position:absolute;left:50%;bottom:-5px;margin-left:-5px;border:5px solid transparent;border-bottom:0;border-top-color:#2b1d16}
.cf-tag button{all:unset;cursor:pointer;color:#f6ead4;opacity:.7;font-size:15px;line-height:1;padding:0 2px}.cf-tag button:focus-visible{outline:2px solid #ffe08a}
.cf-win{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 18px);z-index:72;transform:translateX(-50%);width:min(380px,calc(100% - 32px));background:#f6ead4;color:#2b1d16;border-radius:22px;padding:20px 20px 18px;box-shadow:0 24px 60px -20px rgba(0,0,0,.6);text-align:center;font:500 15px/1.45 Manrope,system-ui,sans-serif;animation:cfup .5s cubic-bezier(.3,1.4,.5,1)}
.cf-win h3{font:800 24px/1.1 Fraunces,Georgia,serif;margin:0 0 6px}.cf-win p{margin:0 0 12px}.cf-code{display:inline-block;font:800 20px/1 ui-monospace,Menlo,monospace;letter-spacing:.06em;background:#fff;border:2px dashed #c4532f;border-radius:12px;padding:10px 14px;margin:0 0 12px;user-select:all}
.cf-win .cf-row{display:flex;gap:8px;justify-content:center;flex-wrap:wrap}.cf-win button{font:800 14px/1 Manrope,system-ui,sans-serif;border:0;border-radius:999px;padding:11px 16px;cursor:pointer;background:#2b1d16;color:#ffe08a}.cf-win button.cf-ghost{background:transparent;color:#2b1d16;box-shadow:inset 0 0 0 2px #2b1d16}
.cf-win .cf-x{position:absolute;right:10px;top:8px;background:none;color:#2b1d16;padding:6px;font-size:20px;opacity:.6}
.catch-note{margin:10px 0 0;padding:10px 12px;border-radius:14px;background:#fff6dc;font-size:14px;line-height:1.4}
@keyframes cfup{from{transform:translate(-50%,40px);opacity:0}}`;

  const KINDS = ['orange', 'strawberry', 'cherry', 'tomato'];
  let passes = 0, el, tag, raf = 0, done = false;
  const G = n => (window.PFB || {})[n] || null;

  function pass(){
    if (done || passes >= (C.passes || 3) || document.hidden) return;
    passes++; if (!css.isConnected) document.head.appendChild(css);
    const kind = KINDS[Math.floor(Math.random() * KINDS.length)], food = G('FOOD');
    el = document.createElement('div'); el.className = 'cf'; el.setAttribute('role', 'button'); el.tabIndex = 0;
    el.setAttribute('aria-label', 'A rolling fruit. Catch it for 50% off');
    el.innerHTML = `<div class="cf-ball">${food && food[kind] ? food[kind]() : ''}</div>`;
    tag = document.createElement('div'); tag.className = 'cf-tag'; tag.innerHTML = `<span>${C.label || 'Catch me for 50% off!'}</span><button type="button" aria-label="Not now">×</button>`;
    document.body.append(el, tag);

    const W = () => innerWidth, H = () => innerHeight, dir = Math.random() < .5 ? 1 : -1, mob = !fine;
    const base = (reduce ? 70 : mob ? 120 : 190) * (0.9 + Math.random() * .3);
    const f = {x: dir > 0 ? -50 : W() + 50, y: H() * (.45 + Math.random() * .3), vx: base * dir, vy: 0, a: 0, home: 0, stam: 1, hops: 0, jukes: 4, lastJuke: 0, t0: performance.now()};
    f.home = f.y;
    let px = -1e4, py = -1e4, last = performance.now(), chased = false;
    const move = e => { px = e.clientX; py = e.clientY; };
    const tap = e => { // touch: a near miss makes it hop away (twice at most), a direct hit catches it
      if (e.target.closest('.cf,.cf-tag,.cf-win')) return; const d = Math.hypot(e.clientX - f.x, e.clientY - f.y);
      if (d < 130 && f.hops < 2 && !reduce) hop(e.clientX, e.clientY); };
    const hop = (x, y) => { f.hops++; f.scared = performance.now(); const ang = Math.atan2(f.y - y, f.x - x); f.vx += Math.cos(ang) * 650; f.vy += Math.sin(ang) * 650 - 320; const sx = G('sfx'); if (sx) sx.pop(900, .06, .06); };
    if (fine) addEventListener('pointermove', move, {passive: true}); else addEventListener('pointerdown', tap, {passive: true});

    function step(now){
      const dt = Math.min(.033, (now - last) / 1000); last = now; const w = W(), h = H();
      // roll: drift back to cruising speed and height, with a little bounce
      const want = base * dir;
      f.vx += (want - f.vx) * Math.min(1, dt * (chased ? .6 : 1.4));
      f.vy += ((f.home + Math.sin(now / 260) * 6) - f.y) * dt * 6 - f.vy * dt * 3;
      if (fine && !reduce) { // dodge the cursor, but tire while chased
        const dx = f.x - px, dy = f.y - py, d = Math.hypot(dx, dy), R = 150;
        chased = d < R;
        // close call: a quick side-step (it has a few, and earns one back every few seconds)
        if (d < 78 && f.jukes >= 1 && now - f.lastJuke > 260) { f.jukes--; f.lastJuke = now; const ang = Math.atan2(dy, dx) + (Math.random() < .5 ? 1 : -1) * (.9 + Math.random() * .6);
          f.vx = Math.cos(ang) * 1100; f.vy = Math.sin(ang) * 1100; const sx = G('sfx'); if (sx) sx.pop(1000, .05, .05); }
        f.jukes = Math.min(4, f.jukes + dt * .3);
        if (chased) { const push = (1 - d / R) * 1900 * f.stam * dt / Math.max(.3, d / R); f.vx += dx / (d || 1) * push; f.vy += dy / (d || 1) * push;
          f.stam = Math.max(.18, f.stam - dt * .22); }
        else f.stam = Math.min(1, f.stam + dt * .08);
        const sp = Math.hypot(f.vx, f.vy), max = (now - f.lastJuke < 220 ? 1100 : 260 + 520 * f.stam); if (sp > max) { f.vx *= max / sp; f.vy *= max / sp; }
      }
      f.x += f.vx * dt; f.y += f.vy * dt;
      // while it is being chased it keeps inside the screen; otherwise it rolls on and out
      const m = 46, top = 90, bot = h - m;
      if (f.y < top) { f.y = top; f.vy = Math.abs(f.vy) * .5; } if (f.y > bot) { f.y = bot; f.vy = -Math.abs(f.vy) * .5; }
      f.home = Math.min(bot - 10, Math.max(top + 10, f.home + (f.y - f.home) * dt * .8));
      // it may only leave by the far side; the near side (and the far side while chased) bounces it back
      if (f.x > m && f.x < w - m) f.in = true; const inside = f.in;
      if (inside && dir > 0 && f.x < m) { f.x = m; f.vx = Math.abs(f.vx) * .7; } if (inside && dir < 0 && f.x > w - m) { f.x = w - m; f.vx = -Math.abs(f.vx) * .7; }
      const held = chased || now - (f.scared || -9e9) < 3500;
      if (held && dir > 0 && f.x > w - m && f.vx > 0) { f.x = w - m; f.vx = -Math.abs(f.vx) * .7; } if (held && dir < 0 && f.x < m && f.vx < 0) { f.x = m; f.vx = Math.abs(f.vx) * .7; }
      f.a += f.vx * dt / 32 * 57.3;
      el.style.transform = `translate(${f.x}px,${f.y}px) rotate(${f.a}deg)`;
      tag.style.transform = `translate(calc(${f.x}px - 50%),calc(${f.y - 44}px - 100%))`;
      if (dir > 0 ? f.x > w + 120 : f.x < -120) return end(false);
      raf = requestAnimationFrame(step);
    }
    function end(caught){
      cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('pointerdown', tap);
      el.remove(); tag.remove();
      if (!caught && !done) setTimeout(pass, (C.gapSeconds || 30) * 1000 * (0.8 + Math.random() * .6));
    }
    const grab = e => { e.preventDefault(); e.stopPropagation(); if (!fine && !reduce && f.hops < 2) { hop(e.clientX - 30 + Math.random() * 60, e.clientY + 20); return; } const r = el.getBoundingClientRect(); const bu = G('burst'), sx = G('sfx'); if (bu) bu(r.left + r.width / 2, r.top + r.height / 2, ['#f39a1e', '#d8344a', '#7fb342', '#ffe08a'], 26, 1, {speed: 520}); if (sx) sx.ding(); done = true; end(true); claim(Math.round(performance.now() - f.t0)); };
    el.addEventListener('pointerdown', grab);
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') grab(e); });
    tag.querySelector('button').addEventListener('click', () => { done = true; end(true); });
    raf = requestAnimationFrame(t => { last = t; step(t); });
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden && armed && !done && !document.querySelector('.cf')) setTimeout(pass, 4000); });

  /* ---- after the catch: ask for a code ---- */
  function card(html){ const old = document.querySelector('.cf-win'); if (old) old.remove(); const w = document.createElement('div'); w.className = 'cf-win'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-live', 'polite');
    w.innerHTML = `<button class="cf-x" type="button" aria-label="Close">×</button>${html}`; document.body.appendChild(w); w.querySelector('.cf-x').onclick = () => w.remove(); return w; }
  function vid(){ let v = get().vid; if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); put({vid: v}); } return v; }
  async function claim(ms){
    const w = card(`<h3>You caught it!</h3><p>Picking your treat...</p>`);
    let res;
    try {
      if (test) { const ks = Object.keys(REWARDS).filter(k => !(C.off || ['month50']).includes(k)); res = {ok: true, code: 'TEST-' + Math.random().toString(36).slice(2, 8).toUpperCase(), reward: ks[Math.floor(Math.random() * ks.length)]}; await new Promise(r => setTimeout(r, 600)); }
      else { const r = await fetch(C.endpoint || CONFIG.signupEndpoint, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify({action: 'catch', vid: vid(), ms, website: ''})}); res = await r.json(); }
    } catch (e) { res = {ok: false}; }
    if (!res || !res.ok || !res.code || !REWARDS[res.reward]) {
      w.innerHTML = `<button class="cf-x" type="button" aria-label="Close">×</button><h3>So close!</h3><p>${(res && res.error) || 'The kitchen is busy right now. Email chef@pluginsforbreakfast.com and mention the fruit, and we will sort you out.'}</p>`;
      w.querySelector('.cf-x').onclick = () => w.remove(); return; }
    put({code: res.code, reward: res.reward, caught: Date.now(), used: 0});
    const line = REWARDS[res.reward].line;
    w.innerHTML = `<button class="cf-x" type="button" aria-label="Close">×</button><h3>You caught it!</h3><p>Your treat: <b>${line}</b>.</p><div class="cf-code">${res.code}</div><p style="font-size:13px;opacity:.8">One use only. We saved it in your basket, so it is applied at checkout on this browser.</p><div class="cf-row"><button type="button" data-copy>Copy code</button><button type="button" class="cf-ghost" data-menu>${res.reward === 'plugin50' ? 'Pick a plugin' : 'See the deal'}</button></div>`;
    w.querySelector('.cf-x').onclick = () => w.remove();
    w.querySelector('[data-copy]').onclick = e => { (navigator.clipboard ? navigator.clipboard.writeText(res.code) : Promise.reject()).then(() => e.target.textContent = 'Copied', () => e.target.textContent = res.code); };
    w.querySelector('[data-menu]').onclick = () => { w.remove(); const t = document.querySelector(res.reward === 'plugin50' ? '#oc' : '.tiers'); if (t) t.scrollIntoView({behavior: reduce ? 'auto' : 'smooth'}); };
    const rf = G('refresh'); if (rf) try { rf(); } catch (e) {}
  }
})();
