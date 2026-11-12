/* One-line list sign-up: "Join the list, get a 10% Maître D' code". Drop <div data-listjoin></div> anywhere and load this file.
   Opt-in only: joining is the tick-free act of pressing the button, and the line says what they get (emails + a code).
   The email goes to our own list (CONFIG.signupEndpoint, source listjoin-<page>), then the visitor's one Maître D' 10% code
   is fetched (action 'maitred', with the email so the Apps Script can keep it to one per email) and kept in the same
   localStorage slot the Maître D' uses ('pfb-md'), so the home basket shows it at checkout. */
(() => {
  const C = window.CONFIG || {}, EP = (C.maitredDiscount || {}).endpoint || C.signupEndpoint, KEY = 'pfb-md';
  const boxes = document.querySelectorAll('[data-listjoin]'); if (!boxes.length || !EP) return;
  const get = () => { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch (e) { return {}; } };
  const put = o => { try { localStorage.setItem(KEY, JSON.stringify(Object.assign(get(), o))); } catch (e) {} };
  const vid = () => { let v = get().vid; if (!v) { v = Math.random().toString(36).slice(2) + Date.now().toString(36); put({vid: v}); } return v; };
  const post = async o => { const r = await fetch(EP, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, body: JSON.stringify(o)}); return r.json(); };
  const esc = s => String(s).replace(/[<>&"]/g, '');
  const page = (location.pathname.replace(/\/(index\.html)?$/, '').split('/').filter(Boolean).pop() || 'home').slice(0, 40);
  const css = document.createElement('style');
  css.textContent = `.lj{--lj-bg:#fffaf0;--lj-fg:#2b1d16;--lj-line:#e3d2b4;--lj-acc:#c4532f;display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;background:var(--lj-bg);color:var(--lj-fg);border:1px dashed var(--lj-acc);border-radius:18px;padding:12px 14px 12px 18px;margin:22px auto;max-width:760px;font:15px/1.45 Manrope,system-ui,sans-serif;text-align:left}
.lj .lj-t{flex:1 1 220px;font-weight:800}.lj .lj-t small{display:block;font-weight:400;opacity:.75;font-size:13px}
.lj,.lj *{box-sizing:border-box}.lj form{display:flex;gap:8px;flex:1 1 300px;min-width:0;max-width:100%}
.lj input{flex:1;min-width:0;font:inherit;padding:11px 14px;border-radius:12px;border:2px solid var(--lj-line);background:#fff;color:#2b1d16}
.lj input:focus{outline:none;border-color:var(--lj-acc)}
.lj button{font:inherit;font-weight:800;border:0;border-radius:12px;padding:11px 16px;background:var(--lj-acc);color:#fff;cursor:pointer;white-space:nowrap}
.lj button[disabled]{opacity:.6;cursor:wait}
.lj .lj-code{display:inline-block;background:var(--lj-acc);color:#fff;border-radius:10px;padding:3px 10px;letter-spacing:.06em;margin:0 4px;cursor:pointer}
.lj .lj-hp{position:absolute;left:-9999px}
@media (max-width:520px){.lj{padding:14px}.lj form{flex-basis:100%}.lj button{padding:11px 12px}}`;
  document.head.appendChild(css);
  const done = (box, code, email) => {
    box.innerHTML = `<div class="lj-t">Welcome to the table${email ? ', ' + esc(email.split('@')[0]) : ''}! 🧈 Your 10% code: <span class="lj-code" title="Click to copy">${esc(code)}</span><small>Type it in the coupon box at checkout. One use only, and Butter Spread is on its way to your inbox too.</small></div>`;
    const c = box.querySelector('.lj-code'); c.onclick = () => { try { navigator.clipboard.writeText(code); c.textContent = 'Copied!'; setTimeout(() => c.textContent = code, 1200); } catch (e) {} };
  };
  boxes.forEach(box => {
    box.classList.add('lj');
    const have = get(); if (have.code && !have.used && have.joined) { done(box, have.code, ''); return; }
    box.innerHTML = `<div class="lj-t">Join the list, get a 10% Maître D' code<small>A short, tasty email when something new comes out of the oven. Unsubscribe any time.</small></div>
      <form novalidate><label class="lj-hp" aria-hidden="true">Leave empty<input name="website" tabindex="-1" autocomplete="off"></label><input type="email" name="email" placeholder="you@studio.com" autocomplete="email" required aria-label="Your email"><button type="submit">Serve my code</button></form>`;
    const f = box.querySelector('form'), btn = f.querySelector('button'), inp = f.querySelector('input[type=email]');
    f.addEventListener('submit', async e => {
      e.preventDefault(); const email = inp.value.trim().replace(/^mailto:/i, '');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { inp.style.borderColor = '#c4532f'; inp.focus(); return; }
      if (f.website.value) return;
      btn.disabled = true; btn.textContent = 'Whisking...';
      try {
        const j = await post({email, name: '', source: 'listjoin-' + page, consent: true, website: '', t: Date.now()}).catch(() => ({ok: true}));
        if (j && j.ok === false) throw (j.error || 0);
        let code = get().used ? '' : get().code;
        if (!code) { const r = await post({action: 'maitred', vid: vid(), email}); if (!r || !r.ok || !r.code) throw (r && r.error ? String(r.error) : 0); code = r.code; put({code, at: Date.now()}); }
        put({joined: Date.now()}); done(box, code, email);
      } catch (err) { btn.disabled = false; btn.textContent = 'Serve my code';
        let m = box.querySelector('.lj-err'); if (!m) { m = document.createElement('small'); m.className = 'lj-err'; m.style.cssText = 'flex-basis:100%;color:#c4532f;font-weight:800'; box.appendChild(m); }
        m.textContent = typeof err === 'string' && err ? err : 'The kitchen is in a bit of a flap. Please try again in a minute.'; }
    });
  });
})();
