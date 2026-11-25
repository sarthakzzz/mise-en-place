/* One-time Black Friday reminder (tactic 16, 25 Nov). Drop <div data-remind="<page>"></div> where it should go and load this file.
   Opt-in only: pressing "Remind me" saves the email for one reminder (Newsletter's Remind.gs, action 'remind', consent tick required).
   Never joins the newsletter; the promise is exactly one email on 1 Dec. Logs /event/bf-remind.
   Shown only while the $29 deal runs and CONFIG.bfRemind is true (set once Remind.gs is deployed; the backend closes it at 1 Dec 12:00Z); ?remind=preview shows it anyway. */
(() => {
  const boxes = document.querySelectorAll('[data-remind]'); if (!boxes.length) return;
  const C = window.CONFIG || {}, pv = /[?&]remind=preview/.test(location.search);
  const F = window.pfbFlash && pfbFlash();
  if (!F || !(C.bfRemind || pv) || !C.signupEndpoint || Date.now() > Date.parse('2026-12-01T11:30:00Z')) return;
  const css = document.createElement('style');
  css.textContent = `.remind{margin:10px auto 0;max-width:460px;text-align:left;font-family:Manrope,system-ui,sans-serif}
.remind p{margin:0 0 6px;font-size:14px;font-weight:700;line-height:1.3}
.remind form{display:flex;flex-wrap:wrap;gap:6px}
.remind input{flex:1;min-width:0;font:600 15px Manrope,system-ui,sans-serif;padding:9px 12px;border-radius:999px;border:2px solid rgba(43,29,22,.25);background:#fffaf0;color:#2b1d16}
.remind button{flex:none;font:800 14px Manrope,system-ui,sans-serif;padding:9px 14px;border-radius:999px;border:2px solid currentColor;background:transparent;color:inherit;cursor:pointer}
.remind .ok{flex-basis:100%;display:flex;gap:6px;align-items:flex-start;margin-top:2px;font-size:12px;line-height:1.3;opacity:.85;cursor:pointer}.remind .ok input{all:revert;margin:1px 0 0;flex:none}
.remind small{display:block;margin-top:3px;font-size:12px;font-weight:700}.remind small:empty{display:none}
.remind .hp{position:absolute;left:-9999px;width:1px;height:1px;opacity:0}`;
  document.head.appendChild(css);
  const t0 = Date.now(), done = (() => { try { return localStorage.getItem('pfb-remind'); } catch (e) { return null; } })();
  const ev = n => { try { window.pfbEvent && pfbEvent(n); } catch (e) {} };
  boxes.forEach(box => {
    const page = box.dataset.remind || 'bf';
    box.className = 'remind';
    if (done) { box.innerHTML = `<p>We'll remind you once before $${F.price} ends. That's the only email.</p>`; return; }
    box.innerHTML = `<p>Not ready yet? We'll remind you once before $${F.price} ends.</p>
<form novalidate><label class="hp">Leave empty <input name="website" tabindex="-1" autocomplete="off"></label><input type="email" name="email" placeholder="you@studio.com" autocomplete="email" required aria-label="Your email for the one reminder"><button type="submit">Remind me</button>
<label class="ok"><input type="checkbox" name="consent"> Email me once before the $${F.price} deal ends. Just one email, not the newsletter.</label></form><small></small>`;
    const f = box.querySelector('form'), s = box.querySelector('small'), b = f.querySelector('button');
    f.addEventListener('submit', async e => { e.preventDefault();
      const email = f.email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email)) { s.textContent = 'That email looks a little undercooked. Try again?'; return; }
      if (!f.consent.checked) { s.textContent = 'Tick the box so we can send you that one email.'; return; }
      b.disabled = true; s.textContent = 'Saving...';
      let ref = ''; try { ref = sessionStorage.getItem('pfb-src') || ''; } catch (x) {}
      try {
        const r = await fetch(C.signupEndpoint, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'},
          body: JSON.stringify({action: 'remind', email, consent: true, source: page === 'bf' ? 'bf-remind' : 'bf-remind-' + page, ref, website: f.website.value, t: t0})}).then(x => x.json());
        if (r && r.closed) { box.remove(); return; }
        if (r && r.ok && (r.status === 'set' || r.status === 'already')) { ev('bf-remind'); try { localStorage.setItem('pfb-remind', '1'); } catch (x) {}
          box.innerHTML = `<p>Done. We'll email you once before $${F.price} ends, and that's it.</p>`; return; }
        s.textContent = (r && r.error) || 'The kitchen dropped that one. Please try again.';
      } catch (x) { s.textContent = 'The kitchen dropped that one. Please try again.'; }
      b.disabled = false; });
  });
})();
