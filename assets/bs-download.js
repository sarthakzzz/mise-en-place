/* Butter Spread download choice: Mac and Windows buttons plus the Read Me First link.
   PFB_BS.buttons(className) returns an element; the visitor's own system comes first. */
(() => {
  const C = (window.CONFIG || {}).butterSpread || {}, fb = (window.CONFIG || {}).butterSpreadFallback || 'https://github.com/sarthakzzz/butter-spread/releases/latest';
  const isWin = /Windows/i.test(navigator.userAgent);
  const css = `.bsdl{display:flex;flex-direction:column;align-items:center;gap:8px;margin-top:12px}
.bsdl-row{display:flex;flex-wrap:wrap;gap:10px;justify-content:center}
.bsdl-row a{text-decoration:none}
.bsdl-row a.alt{opacity:.85}
.bsdl-rm{font-size:14px;font-weight:700}
.bsdl.left{align-items:flex-start}.bsdl.left .bsdl-row{justify-content:flex-start}`;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
  function buttons(btnClass, opts = {}){
    const box = document.createElement('div'); box.className = 'bsdl' + (opts.left ? ' left' : '');
    const row = document.createElement('div'); row.className = 'bsdl-row';
    const make = (os, label, href) => { const a = document.createElement('a'); a.className = btnClass; a.href = href || fb; a.setAttribute('download', ''); a.textContent = label; a.dataset.os = os; return a; };
    const mac = make('mac', 'Download for Mac', C.mac), win = make('win', 'Download for Windows', C.win);
    (isWin ? [win, mac] : [mac, win]).forEach((a, i) => { if (i) a.classList.add('alt'); row.append(a); });
    const rm = document.createElement('a'); rm.className = 'bsdl-rm'; rm.href = C.readme || '/butter-spread/read-me-first/'; rm.target = '_blank'; rm.rel = 'noopener';
    rm.textContent = 'Read Me First: opening it the first time';
    box.append(row, rm);
    return box;
  }
  window.PFB_BS = {buttons, isWin};
})();
