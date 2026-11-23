/* Tap-to-play 20-second demo: five of our plugins back to back, the name switching as each one comes in.
   Drop <div data-demo></div> anywhere and load this file. Logs /event/demo-play (and demo-end) with the visit's source. */
(() => {
  const STEPS = [[0, 'Orange Crusher', 'distortion'], [4, 'Popcorn Sandwich', 'compressor'], [8, 'Spaghetti Delay', 'delay'], [12, 'Bread Oven', 'reverb'], [16, 'Burnt Toast', 'tape']];
  const boxes = document.querySelectorAll('[data-demo]'); if (!boxes.length) return;
  const css = document.createElement('style');
  css.textContent = `.demo{display:flex;align-items:center;gap:12px;background:#2b1d16;color:#f6ead4;border-radius:18px;padding:10px 14px 10px 10px;margin:12px 0;text-align:left;cursor:pointer;font-family:Manrope,system-ui,sans-serif;border:0;width:100%}
.demo .dp{flex:none;width:48px;height:48px;border-radius:50%;background:#f7c96b;color:#2b1d16;display:grid;place-items:center}.demo .dp svg{width:22px;height:22px}
.demo .dt{flex:1;min-width:0}.demo b{display:block;font:800 16px/1.2 Fraunces,Georgia,serif;color:#f7c96b}.demo small{display:block;font-size:13px;opacity:.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.demo .bar{height:4px;border-radius:4px;background:rgba(246,234,212,.2);margin-top:6px;overflow:hidden}.demo .bar i{display:block;height:100%;width:0;background:#f7c96b;transition:width .25s linear}`;
  document.head.appendChild(css);
  const PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>', PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor"/></svg>';
  const au = new Audio(); au.preload = 'none'; let src = false, active = null;
  const ev = n => { try { window.pfbEvent && pfbEvent(n); } catch (e) {} };
  boxes.forEach(box => {
    box.innerHTML = `<button class="demo" type="button" aria-label="Play a 20-second demo of five plugins"><span class="dp">${PLAY}</span><span class="dt"><b>Hear 5 plugins in 20 seconds</b><small>Tap to play · sound on</small><span class="bar"><i></i></span></span></button>`;
    const btn = box.querySelector('.demo');
    btn.addEventListener('click', () => { active = box; if (!src) { au.src = '/assets/hear/montage.m4a'; src = true; } if (au.paused) { au.play().catch(() => {}); ev('demo-play'); } else au.pause(); });
  });
  const paint = () => { boxes.forEach(box => { const on = box === active && !au.paused, t = au.currentTime || 0, s = STEPS.filter(x => x[0] <= t).pop();
    box.querySelector('.dp').innerHTML = on ? PAUSE : PLAY;
    box.querySelector('small').textContent = on ? `Now: ${s[1]} (${s[2]})` : (box === active && t > 0 && !au.ended ? 'Paused · tap to carry on' : 'Tap to play · sound on');
    box.querySelector('.bar i').style.width = (box === active ? Math.min(100, t / 20.3 * 100) : 0) + '%'; }); };
  ['play', 'pause', 'timeupdate'].forEach(e => au.addEventListener(e, paint));
  au.addEventListener('ended', () => { ev('demo-end'); paint(); boxes.forEach(b => b.querySelector('small').textContent = 'Liked it? All 16 are one tap away'); });
})();
