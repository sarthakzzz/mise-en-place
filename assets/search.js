/* Plugin search + categories (Sarthak 15 Nov: "add a search button... categorize all the plugins, categories on top").
   A Search button in the header opens a panel: search box, category chips on top, and all 16 plugins as cards.
   Any element with data-search-cat="<cat>" (or "all") opens the panel on that category. "/" opens it too.
   On the home page, "Add to basket" uses the page's own basket and "See it" scrolls to the plugin; elsewhere they go to /?add=<id>#order and /plugins/<slug>/. */
(() => {
  if (window.__pfbSearch) return; window.__pfbSearch = 1;
  const CATS = [['all', 'All 16'], ['dyn', 'Dynamics'], ['eq', 'EQ & Filter'], ['sat', 'Saturation'], ['space', 'Reverb & Delay'], ['mod', 'Modulation & Stereo'], ['fx', 'Creative FX'], ['mst', 'Mastering']];
  const P = [
    ['oc', 'Orange Crusher', 'Distortion', 'orange-crusher', 'oc', ['sat'], 'Squeeze, zest and pulp your sound from warm tape to full chaos.', 'distortion saturation drive fuzz drums bass grit warm'],
    ['ps', 'Popcorn Sandwich Compressor', 'Compressor', 'popcorn-sandwich-compressor', 'popcorn-sandwich', ['dyn'], 'Squeeze it flat or pop it open, all from one dial.', 'compressor compression dynamics punch glue drums vocals bus'],
    ['gg', 'Gummy Gate', 'Gate', 'gummy-gate', 'gummy-gate', ['dyn'], 'The jar fills with your signal and the gate swings open.', 'gate noise gate dynamics drums trance gate chop'],
    ['gp', 'Ghost Pepper Clipper', 'Clipper', 'ghost-pepper-clipper', 'ghost-pepper-clipper', ['dyn', 'sat'], 'Hot, clean loudness. The ghost rises as you clip.', 'clipper clipping loud loudness limiter drums trap 808 master'],
    ['ss', 'Spice Shelf EQ', 'EQ', 'spice-shelf-eq', 'spice-shelf', ['eq'], 'Five spice jars that season your sound: an EQ you play by taste.', 'eq equaliser equalizer tone bass treble mids vocals mix'],
    ['nf', 'Noodle Filter', 'Filter', 'noodle-filter', 'noodle-filter', ['eq', 'fx'], 'Lift the noodles to open the filter, curl them for resonance.', 'filter low pass high pass resonance sweep build up transitions'],
    ['bt', 'Burnt Toast Tape Machine', 'Tape', 'burnt-toast-tape-machine', 'burnt-toast', ['sat'], 'A toaster that thinks it is a tape machine.', 'tape saturation lofi lo-fi wow flutter warm vintage hiss'],
    ['bo', 'Bread Oven Reverb', 'Reverb', 'bread-oven-reverb', 'bread-oven', ['space'], 'Rooms, chambers, halls and plates, baked to taste.', 'reverb room hall plate space ambience vocals'],
    ['sd', 'Spaghetti Delay', 'Delay', 'spaghetti-delay', 'spaghetti-delay', ['space'], 'Echoes rolled out of a pasta machine, one cherry tomato per repeat.', 'delay echo ping pong tape delay dub vocals'],
    ['mc', 'Milkshake Chorus', 'Chorus', 'milkshake-chorus', 'milkshake-chorus', ['mod'], 'Thick, creamy chorus: from vintage synth to a full ensemble.', 'chorus modulation ensemble wide synth guitar'],
    ['hp', 'Hot-o-Pan', 'Auto-pan', 'hot-o-pan', 'hot-o-pan', ['mod'], 'The pancake flips between left and right.', 'autopan auto pan panner stereo movement tremolo'],
    ['bs', 'Butter Spread', 'Stereo widener', 'butter-spread', 'butter-spread', ['mod'], 'Spread your mix wider, smooth as butter, and safe in mono.', 'stereo widener width imager wide mono free'],
    ['pc', 'Popping Candy', 'Stutter & glitch', 'popping-candy', 'popping-candy', ['fx'], 'Nine jars of effects that pop on random steps, in time with your track.', 'glitch stutter beat repeat random creative fx edm'],
    ['ff', 'Food Fight', 'Performance effects', 'food-fight', 'food-fight', ['fx'], 'Eight foods, eight effects, and a catapult that throws them in time.', 'performance fx creative live build up transitions dj'],
    ['mg', 'Muesli Granular', 'Granular', 'muesli-granular', 'muesli-granular', ['fx'], 'Your audio, cut into grains and scattered over a breakfast bowl.', 'granular grains texture ambient sound design pad'],
    ['ct', 'Cherry on the Top Mastering', 'Mastering', 'cherry-on-the-top-mastering', 'chefs-kiss', ['mst'], 'Finish a track with one dial: the cherry lands on top at 100%.', 'mastering master limiter loudness finish one knob']
  ];
  const home = !!document.querySelector('section.plug[data-id="oc"]');
  const price = id => { if (id === 'bs') return 'Free'; try { const L = (window.CONFIG || {}).ladders, S = window.SOLD || {}; if (L) { const k = (CONFIG.products || {})[id] || id, i = Math.max(0, Math.min(+((S.steps || {})[k]) || 0, L.plugin.length - 1)); return '$' + L.plugin[i]; } } catch (e) {} return '$19'; };
  const css = document.createElement('style');
  css.textContent = `.sx-btn{display:inline-flex;align-items:center;gap:6px;border:0;background:none;color:inherit;font:inherit;font-weight:700;font-size:14px;cursor:pointer;padding:6px 10px;border-radius:999px}
.sx-btn svg{width:17px;height:17px}.sx-btn:hover{background:rgba(127,127,127,.15)}
.sx{position:fixed;inset:0;z-index:200;background:rgba(30,20,14,.55);display:flex;align-items:flex-start;justify-content:center;padding:4vh 12px;font-family:Manrope,system-ui,sans-serif}
.sx[hidden]{display:none}
.sx-box{background:#fffaf0;color:#2b1d16;width:min(1000px,100%);max-height:92vh;border-radius:24px;box-shadow:0 20px 60px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden}
.sx-top{padding:18px 18px 10px;border-bottom:1px solid #eadcc3}
.sx-row{display:flex;gap:10px;align-items:center}
.sx-in{flex:1;min-width:0;font:inherit;font-size:18px;padding:13px 16px 13px 44px;border-radius:14px;border:2px solid #e3d2b4;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237a5c45' stroke-width='2.4' stroke-linecap='round'%3E%3Ccircle cx='11' cy='11' r='7'/%3E%3Cpath d='m20 20-4-4'/%3E%3C/svg%3E") 14px 50%/20px no-repeat;color:#2b1d16}
.sx-in:focus{outline:none;border-color:#c4532f}
.sx-x{border:0;background:#f1e4cc;color:#2b1d16;font:800 15px Manrope,sans-serif;border-radius:12px;padding:12px 14px;cursor:pointer}
.sx-cats{display:flex;gap:8px;overflow-x:auto;padding:12px 0 4px;scrollbar-width:none}.sx-cats::-webkit-scrollbar{display:none}
.sx-cats button,.sx-chips button{flex:none;border:2px solid #e3d2b4;background:#fff;color:#2b1d16;font:800 14px Manrope,sans-serif;border-radius:999px;padding:8px 14px;cursor:pointer;white-space:nowrap}
.sx-cats button[aria-pressed=true]{background:#2b1d16;border-color:#2b1d16;color:#f7c96b}
.sx-list{flex:1;min-height:0;grid-auto-rows:max-content;overflow-y:auto;padding:14px 18px 20px;display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
.sx-c{background:#fff;border:1px solid #eadcc3;border-radius:16px;overflow:hidden;display:flex;flex-direction:column}
.sx-c>a{display:block}.sx-c img{width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;display:block;background:#f1e4cc}
.sx-c>div{padding:10px 12px 12px;display:flex;flex-direction:column;gap:3px;flex:1}
.sx-c b{font:800 16px/1.2 Fraunces,Georgia,serif}.sx-c small{font-weight:800;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#9a6b4c}
.sx-c p{margin:0;font-size:13px;line-height:1.4;color:#5a4334}
.sx-c .sx-a{display:flex;align-items:center;gap:8px;margin-top:auto;padding-top:8px}
.sx-c .sx-a span{font:800 17px Fraunces,Georgia,serif;margin-right:auto}
.sx-c .sx-a a,.sx-c .sx-a button{font:800 13px Manrope,sans-serif;border-radius:10px;padding:8px 10px;text-decoration:none;cursor:pointer;border:0;white-space:nowrap}
.sx-c .sx-add{background:#c4532f;color:#fff}.sx-c .sx-see{background:#f1e4cc;color:#2b1d16}
.sx-none{grid-column:1/-1;text-align:center;padding:30px 10px;color:#5a4334}
.sx-chips{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:22px auto 0;max-width:900px}
.sx-chips .lbl{flex-basis:100%;text-align:center;font-weight:800;font-size:13px;letter-spacing:.12em;text-transform:uppercase;opacity:.7}
@media (max-width:600px){.sx{padding:0}.sx-box{max-height:100vh;height:100%;border-radius:0}.sx-list{grid-template-columns:1fr 1fr;gap:10px;padding:12px}.sx-c p{display:none}.sx-c .sx-a{flex-wrap:wrap;gap:6px}.sx-c .sx-a span{flex-basis:100%;margin:0}.sx-c .sx-a .sx-see{display:none}.sx-c .sx-a .sx-add{flex:1}.sx-in{font-size:16px}}`;
  document.head.appendChild(css);
  const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>';
  const root = document.createElement('div'); root.className = 'sx'; root.hidden = true; root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', 'Search the menu');
  root.innerHTML = `<div class="sx-box"><div class="sx-top"><div class="sx-row"><input class="sx-in" type="search" placeholder="Search the menu: reverb, drums, tape..." aria-label="Search plugins" autocomplete="off"><button class="sx-x" type="button">Close</button></div><div class="sx-cats" role="group" aria-label="Categories">${CATS.map(([k, n]) => `<button type="button" data-k="${k}" aria-pressed="${k === 'all'}">${n}</button>`).join('')}</div></div><div class="sx-list" aria-live="polite"></div></div>`;
  const inp = root.querySelector('.sx-in'), list = root.querySelector('.sx-list'); let cat = 'all', last = null;
  const norm = s => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ');
  const draw = () => {
    const q = norm(inp.value).split(' ').filter(Boolean);
    const hits = P.filter(p => (cat === 'all' || p[5].includes(cat)) && q.every(w => norm([p[1], p[2], p[6], p[7], p[5].map(c => (CATS.find(x => x[0] === c) || [])[1]).join(' ')].join(' ')).includes(w)));
    list.innerHTML = hits.length ? hits.map(p => `<article class="sx-c"><a href="${home ? '#' + p[0] : '/plugins/' + p[3] + '/'}" data-see="${p[0]}" tabindex="-1"><img src="/assets/seo/${p[4]}-480.webp" alt="${p[1]}" width="480" height="300" loading="lazy"></a><div><small>${p[2]}</small><b>${p[1]}</b><p>${p[6]}</p><div class="sx-a"><span>${price(p[0])}</span><button class="sx-add" type="button" data-id="${p[0]}">${p[0] === 'bs' ? 'Get it free' : 'Add to basket'}</button><a class="sx-see" href="${home ? '#' + p[0] : '/plugins/' + p[3] + '/'}" data-see="${p[0]}">See</a></div></div></article>`).join('')
      : `<p class="sx-none">Nothing on the menu matches that yet. Try “reverb”, “drums” or “tape”, or write to <a href="mailto:chef@pluginsforbreakfast.com">chef@pluginsforbreakfast.com</a> with your idea.</p>`;
  };
  const setCat = k => { cat = k; root.querySelectorAll('.sx-cats button').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k)); draw(); };
  const open = (k = 'all') => { last = document.activeElement; root.hidden = false; document.documentElement.style.overflow = 'hidden'; setCat(k); setTimeout(() => inp.focus(), 30); try { window.pfbEvent && pfbEvent('search-open'); } catch (e) {} };
  const close = () => { root.hidden = true; document.documentElement.style.overflow = ''; if (last && last.focus) last.focus(); };
  window.pfbSearch = open;
  root.addEventListener('click', e => {
    if (e.target === root || e.target.closest('.sx-x')) return close();
    const c = e.target.closest('.sx-cats button'); if (c) return setCat(c.dataset.k);
    const a = e.target.closest('.sx-add'); if (a) { const id = a.dataset.id;
      if (id === 'bs') { close(); const pop = document.querySelector('[data-open-pop]'); if (home && pop) pop.click(); else location.href = '/butter-spread/'; return; }
      if (home && typeof window.add === 'function') { close(); const b = document.querySelector(`[data-add="${id}"]`); window.add(id, b || a); setTimeout(() => { try { openCart(); } catch (x) {} }, 900); }
      else location.href = `/?add=${id}#order`; return; }
    const s = e.target.closest('[data-see]'); if (s && home) { e.preventDefault(); close(); const t = document.getElementById(s.dataset.see); if (t) t.scrollIntoView({behavior: 'smooth'}); }
  });
  inp.addEventListener('input', draw);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !root.hidden) close(); else if (e.key === '/' && root.hidden && !/input|textarea|select/i.test((document.activeElement || {}).tagName || '') && !(document.activeElement || {}).isContentEditable) { e.preventDefault(); open(); } });
  document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-search-cat]'); if (t) { e.preventDefault(); open(t.dataset.searchCat || 'all'); } });
  const mount = () => {
    document.body.appendChild(root);
    const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'sx-btn'; btn.setAttribute('aria-label', 'Search plugins'); btn.innerHTML = ICON + '<span>Search</span>'; btn.addEventListener('click', () => open());
    const acct = document.getElementById('acct');
    if (home && acct) { acct.before(btn); if (matchMedia('(max-width:820px)').matches) btn.querySelector('span').style.display = 'none'; }
    else { const nav = document.querySelector('header nav'); if (nav) nav.appendChild(btn); else { btn.style.cssText = 'position:fixed;top:12px;right:12px;z-index:150;background:#fffaf0;color:#2b1d16;box-shadow:0 4px 14px rgba(0,0,0,.15)'; document.body.appendChild(btn); } }
    // category chips under the home story line ("categories on top" of the plugin menu)
    const story = document.getElementById('storyText');
    if (home && story && !document.querySelector('.sx-chips')) story.insertAdjacentHTML('afterend', `<div class="sx-chips"><span class="lbl">Browse the menu</span>${CATS.map(([k, n]) => `<button type="button" data-search-cat="${k}">${n}</button>`).join('')}</div>`);
  };
  document.body ? mount() : addEventListener('DOMContentLoaded', mount);
})();
