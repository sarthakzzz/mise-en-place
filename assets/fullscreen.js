/* Full screen plugin pictures: every plugin's real picture gets a "Full screen" button (and opens on a click).
   It shows the plugin exactly as it is on the page right now (the current frame of its real recording),
   filling the whole screen. Esc, a click or the pretzel closes it. */
(() => {
  const css = `
.fs-btn{position:absolute;top:12px;right:12px;z-index:3;display:inline-flex;align-items:center;gap:7px;padding:8px 13px 8px 10px;border:0;border-radius:999px;
  background:rgba(255,248,232,.92);color:#2b1d16;font:800 13px/1 var(--body,system-ui);cursor:pointer;box-shadow:0 6px 16px -6px rgba(0,0,0,.45),inset 0 0 0 1.5px rgba(43,29,22,.18);
  transition:transform .25s cubic-bezier(.3,1.7,.5,1),background .2s;opacity:.9}
.fs-btn:hover,.fs-btn:focus-visible{transform:scale(1.08);background:#fff8e8;opacity:1}
.fs-btn svg{width:16px;height:16px;flex:none}
.real .frame .realv{cursor:zoom-in}
.fs-back{position:fixed;inset:0;z-index:60;background:#140c08;display:grid;place-items:center;animation:fade .25s}
.fs-back[hidden]{display:none}
.fs-back canvas,.fs-back img{display:block;width:min(100vw,calc(100vh * var(--ar,1.43)));height:auto;cursor:zoom-out}
.fs-back .fs-x{position:fixed;top:14px;right:14px;z-index:1}
.fs-back .fs-cap{display:none;position:fixed;left:14px;top:14px;margin:0;color:#fff8e8;font:700 14px/1.2 var(--body,system-ui);background:rgba(20,12,8,.55);padding:7px 14px;border-radius:999px;pointer-events:none;white-space:nowrap}
@media (max-width:600px){.fs-btn span{display:none}.fs-btn{padding:9px}}`;
  const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  const icon = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4"/></svg>';

  const back = document.createElement('div');
  back.className = 'fs-back'; back.hidden = true;
  back.setAttribute('role', 'dialog'); back.setAttribute('aria-modal', 'true'); back.setAttribute('aria-label', 'Plugin, full screen');
  back.innerHTML = '<button class="fs-btn fs-x" type="button" aria-label="Close full screen">' +
    '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg><span>Back to the menu</span></button>' +
    '<div class="fs-pic"></div><p class="fs-cap"></p>';
  document.body.appendChild(back);
  const pic = back.querySelector('.fs-pic'), cap = back.querySelector('.fs-cap'), xBtn = back.querySelector('.fs-x');
  let lastFocus = null;

  function open (stage) {
    const v = stage.querySelector('.realv'), name = stage.closest('.plug')?.querySelector('h2')?.textContent.trim() || 'Plugin';
    pic.innerHTML = '';
    if (v && v.readyState >= 2 && v.videoWidth) {
      // the plugin exactly as it is on the page right now
      const c = document.createElement('canvas'); c.width = v.videoWidth; c.height = v.videoHeight;
      c.getContext('2d').drawImage(v, 0, 0); c.setAttribute('role', 'img'); c.setAttribute('aria-label', name);
      pic.appendChild(c); back.style.setProperty('--ar', v.videoWidth / v.videoHeight);
    } else {
      const img = new Image(); img.alt = name; img.src = v?.dataset.poster || v?.poster || ''; pic.appendChild(img);
      back.style.setProperty('--ar', v?.dataset.ar || 1.43);
    }
    cap.textContent = name + ' · served full size';
    lastFocus = document.activeElement; back.hidden = false; document.documentElement.style.overflow = 'hidden';
    if (back.requestFullscreen) back.requestFullscreen().catch(() => {});
    else if (back.webkitRequestFullscreen) back.webkitRequestFullscreen();
    xBtn.focus();
  }

  function close () {
    if (back.hidden) return;
    back.hidden = true; document.documentElement.style.overflow = ''; pic.innerHTML = '';
    const fs = document.fullscreenElement || document.webkitFullscreenElement;
    if (fs === back) { const p = (document.exitFullscreen || document.webkitExitFullscreen).call(document); p && p.catch && p.catch(() => {}); }
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }

  back.addEventListener('click', close);
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  const onFs = () => { if (!(document.fullscreenElement || document.webkitFullscreenElement)) close(); };
  document.addEventListener('fullscreenchange', onFs); document.addEventListener('webkitfullscreenchange', onFs);

  document.querySelectorAll('.stage.real').forEach(stage => {
    const frame = stage.querySelector('.frame'); if (!frame) return;
    const b = document.createElement('button');
    b.className = 'fs-btn'; b.type = 'button'; b.title = 'Super-size it';
    b.setAttribute('aria-label', 'See this plugin full screen');
    b.innerHTML = icon + '<span>Full screen</span>';
    b.addEventListener('click', e => { e.stopPropagation(); open(stage); });
    frame.appendChild(b);
    stage.querySelector('.realv')?.addEventListener('click', () => open(stage));
  });
})();
