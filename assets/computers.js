// "All my computers are in use" (9 Nov 2026). Shared by /activate/ and /account/.
// Every licence works on 3 computers. When a plugin is on all of them, the customer can remove an old computer
// right here, or add 2 more computers at half price (the "extra computers" option of that plugin in the store,
// see CONFIG.extraComputers). Needs moonbase.js set up and the customer signed in.
window.Computers = (() => {
  const api = () => (CONFIG.store || 'https://escae-studios.moonbase.sh').replace(/\/$/, '');
  const extra = () => CONFIG.extraComputers || {};

  async function call(path, method) {
    const t = await Moonbase.getAccessToken();
    if (!t) throw new Error('not signed in');
    const r = await fetch(api() + path, { method: method || 'GET', mode: 'cors', redirect: 'manual',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'x-mb-cors': '1', Authorization: 'Bearer ' + t } });
    if (r.status >= 400 || r.status === 0) throw new Error(path + ' ' + r.status);
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  }
  const items = r => (r && (Array.isArray(r) ? r : r.items)) || [];

  /** How many computers a plugin is on, over every licence the customer has for it. */
  async function seats(productId) {
    const licences = items(await call(`/api/customer/inventory/products/${encodeURIComponent(productId)}/licenses`));
    const used = licences.reduce((n, l) => n + (l.activeNumberOfActivations || 0), 0);
    const max = licences.reduce((n, l) => n + (l.maxNumberOfActivations || 0), 0);
    const full = licences.length > 0 && licences.every(l => (l.activeNumberOfActivations || 0) >= (l.maxNumberOfActivations || 0));
    return { used, max, full, licences };
  }

  /** The computers a plugin is activated on: { id, licenseId, name, activationMethod, lastValidatedAt }. */
  async function devices(productId) {
    return items(await call(`/api/customer/inventory/products/${encodeURIComponent(productId)}/licenses/activations`));
  }

  const remove = (licenseId, activationId) =>
    call(`/api/customer/inventory/licenses/${encodeURIComponent(licenseId)}/activations/${encodeURIComponent(activationId)}/revoke`, 'POST');

  /** Opens the checkout for 2 more computers. The store takes 50% off for anyone who already owns the plugin. */
  function buyMore(productId) {
    const v = extra().variation;
    return Moonbase.purchase([{ product_id: productId, ...(v ? { variation_id: v } : {}) }]);
  }

  const when = d => { const t = d && Date.parse(d); if (!t) return ''; const days = Math.floor((Date.now() - t) / 864e5);
    return days < 1 ? 'used today' : days === 1 ? 'used yesterday' : days < 60 ? `used ${days} days ago` : `last used ${new Date(t).toLocaleDateString()}`; };
  const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };

  /** Fills `box` with a plugin's computers: each with Remove, plus "Add 2 computers". onChange() runs after a removal.
      `full` puts the "all in use" heading on top (the activate page). */
  async function render(box, { productId, name, full, onChange }) {
    box.textContent = '';
    box.classList.add('computers');
    const count = extra().count || 2;
    let s = null, list = [];
    try { [s, list] = await Promise.all([seats(productId), devices(productId)]); }
    catch (e) { box.appendChild(el('p', 'soft', `We couldn't load the computers for ${name}. Refresh, or email ${CONFIG.supportEmail}.`)); return; }

    if (full) {
      box.appendChild(el('h3', null, `${name} is on all ${s.max || 3} of your computers`));
      box.appendChild(el('p', 'soft', `Remove a computer you don't use any more, or add ${count} more computers at half price. Then it unlocks here.`));
    }
    const ul = el('ul', 'device-list');
    for (const d of list) {
      const li = el('li', 'device');
      const label = el('span', null, d.name || 'A computer');
      label.appendChild(el('small', null, [d.activationMethod === 'Offline' ? 'offline' : '', when(d.lastValidatedAt)].filter(Boolean).join(', ')));
      li.appendChild(label);
      if (d.activationMethod === 'Offline') {
        li.appendChild(el('small', 'soft', `Offline: email ${CONFIG.supportEmail} to move it`));
      } else {
        const b = el('button', 'mini', 'Remove');
        b.type = 'button';
        b.addEventListener('click', async () => {
          if (!confirm(`Remove ${d.name || 'this computer'}? ${name} stops working there until you activate it again.`)) return;
          b.disabled = true; b.textContent = 'Removing...';
          try { await remove(d.licenseId, d.id); li.remove(); if (onChange) onChange(); }
          catch (e) { b.disabled = false; b.textContent = 'Remove'; alert(`That computer couldn't be removed here. Email ${CONFIG.supportEmail} and we'll do it for you.`); }
        });
        li.appendChild(b);
      }
      ul.appendChild(li);
    }
    if (!list.length) ul.appendChild(el('li', 'device soft', 'Not on any computer yet.'));
    box.appendChild(ul);

    const more = el('button', 'act' + (s.full ? ' main' : ''));
    more.type = 'button';
    more.append(el('b', null, `Add ${count} computers`), el('span', null, 'Half price if you bought this plugin'));
    more.addEventListener('click', () => buyMore(productId).catch(() => alert(`The checkout didn't open. Email ${CONFIG.supportEmail} and we'll sort it out.`)));
    const row = el('div', 'actions');
    row.appendChild(more);
    box.appendChild(row);
    return s;
  }

  // Looks shared by both pages
  const css = document.createElement('style');
  css.textContent = `.soft{color:var(--soft)}
.computers{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:16px 18px;margin:14px 0}
.computers h3{font-family:Fraunces,Georgia,serif;font-size:21px;margin:0 0 4px}
.device-list{list-style:none;padding:0;margin:12px 0 0}
.device{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 0;border-top:1px dashed var(--line);font-weight:800}
.device small{display:block;font-weight:600;color:var(--soft)}
.mini{font:inherit;font-weight:800;font-size:14px;color:var(--accent);background:transparent;border:2px solid var(--accent);border-radius:999px;padding:4px 14px;cursor:pointer;flex:none}
.mini:disabled{opacity:.5;cursor:default}
.computers .actions{margin:14px 0 4px}`;
  document.head.appendChild(css);

  return { seats, devices, remove, buyMore, render };
})();
