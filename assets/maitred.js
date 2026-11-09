/* The Maître D': a small, free, scripted helper. It answers from our own FAQ and hands anything else to a person by email. */
(() => {
  const C = window.CONFIG || {}, MAIL = C.supportEmail || 'chef@pluginsforbreakfast.com';
  const NAME = C.assistantName || "Maître D'";
  const price = () => window.PRICE || {plugin: 29, bundle: 90};
  const root = /\/(account|activate)\//.test(location.pathname) ? '../' : '';
  const A = [
    {k: 'trial try free demo test', q: 'How does the free trial work?', a: () => `Make a free account, download the plugin and use everything for 3 days. No card needed. When you buy, the same install unlocks and your presets stay put.`},
    {k: 'price cost how much buy pay dollar bundle fridge discount launch', q: 'What does it cost?', a: () => { const p = price(); return `Each plugin is $${p.plugin}${p.label ? ' (' + p.label.replace(/^Launch/, 'launch') + ')' : ''}. The Full Fridge Bundle, every plugin we have released, is $${p.bundle}. Breakfast Club is $${C.clubPrice || 150} for a year of everything, and you keep it all.`; }},
    {k: 'club membership subscription year renew', q: 'What is Breakfast Club?', a: () => `$90 for one year (usually $150). You get every plugin, including every new one released during your year, and you keep all of them forever, even if you don't renew.`},
    {k: 'daw logic ableton fl cubase reaper studio bitwig pro tools format au vst vst3 aax mac windows garageband nuendo reason performer cakewalk sonar waveform ardour mixbus luna renoise mainstage compatible compatibility work', q: 'Will it work in my DAW?', a: () => `Mac: AU, VST3 and AAX (Pro Tools). Windows 10 and 11: VST3, 64-bit. They work in Logic Pro, GarageBand, Ableton Live, Pro Tools (Mac), FL Studio, Cubase, Nuendo, Studio One, Reaper, Bitwig, Reason, Digital Performer, Cakewalk Sonar, Waveform, Ardour, Mixbus, LUNA, Renoise and any host that loads these formats. We test in Logic, Ableton and Pro Tools. <a href="${root}#daws">See the full list</a>. The formats for each plugin are listed with its download.`},
    {k: 'licence license computer machine activate activation install new offline', q: 'Licences and computers', a: () => `Each licence works on 3 of your computers, and offline activation works too. Moving to a new computer? Open <a href="${root}account/">your account</a>, remove the old one, then activate on the new one.`},
    {k: 'butter spread free widener', q: 'Is Butter Spread free?', a: () => `Yes, completely. Join our list and the download link appears right away. It's open source too.`},
    {k: 'account sign login download where my plugins', q: 'Where are my plugins?', a: () => `In <a href="${root}account/">your account</a>. Sign in with the email you bought with, and every plugin you own or are trying is there.`},
    {k: 'missing show scan not appear crash bug problem broken', q: 'A plugin isn\'t showing up', a: () => `Restart your DAW and rescan plugins. In Logic, open Plug-in Manager and reset the plugin. Still missing? Tell me your DAW and your macOS or Windows version below and I'll pass it to the kitchen.`},
  ];
  const css = `
.md-btn{position:fixed;left:16px;bottom:16px;z-index:70;display:inline-flex;align-items:center;gap:10px;border:0;border-radius:999px;padding:10px 18px 10px 12px;background:#2b1d16;color:#f6ead4;font:700 14px/1 Manrope,system-ui,sans-serif;cursor:pointer;box-shadow:0 14px 30px -12px rgba(0,0,0,.55)}
.md-btn svg{width:30px;height:30px}
.md-btn em{font-family:Fraunces,Georgia,serif;font-style:italic;font-weight:700;font-size:16px;color:#f3c77a}
.md-panel{position:fixed;left:16px;bottom:76px;z-index:71;width:min(380px,calc(100vw - 32px));max-height:min(560px,calc(100vh - 110px));display:flex;flex-direction:column;background:#fbf4e6;color:#2b1d16;border-radius:22px;overflow:hidden;box-shadow:0 40px 80px -30px rgba(0,0,0,.6);font:15px/1.5 Manrope,system-ui,sans-serif;animation:mdIn .3s cubic-bezier(.3,1.4,.5,1)}
.md-panel[hidden]{display:none}
@keyframes mdIn{from{transform:translateY(16px) scale(.97);opacity:0}}
.md-head{display:flex;align-items:center;gap:12px;padding:16px 18px;background:#2b1d16;color:#f6ead4}
.md-head svg{width:38px;height:38px;flex:none}
.md-head b{display:block;font-family:Fraunces,Georgia,serif;font-size:20px;font-style:italic;color:#f3c77a;line-height:1.1}
.md-head small{font-size:12px;letter-spacing:.14em;text-transform:uppercase;opacity:.75}
.md-x{margin-left:auto;border:0;background:none;color:#f6ead4;font-size:24px;cursor:pointer;line-height:1}
.md-log{flex:1;min-height:0;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px}
.md-m{max-width:88%;padding:10px 14px;border-radius:16px 16px 16px 4px;background:#fff;border:1px solid #ead9bb}
.md-m.me{align-self:flex-end;border-radius:16px 16px 4px 16px;background:#c4532f;border-color:#c4532f;color:#fff}
.md-m a{color:#c4532f;font-weight:700}
.md-chips{flex:none;display:flex;flex-wrap:nowrap;overflow-x:auto;gap:6px;padding:2px 16px 12px;scrollbar-width:none}
.md-chips button{flex:none}
.md-chips button{border:1px solid #d9c3a0;background:transparent;border-radius:999px;padding:6px 12px;font:600 13px Manrope,system-ui,sans-serif;color:#2b1d16;cursor:pointer}
.md-chips button:hover{background:#2b1d16;color:#f6ead4;border-color:#2b1d16}
.md-form{display:flex;gap:8px;padding:12px;border-top:1px solid #ead9bb;background:#f6ead4}
.md-form input{flex:1;min-width:0;border:1px solid #d9c3a0;border-radius:999px;padding:10px 14px;font:inherit;background:#fff;color:#2b1d16}
.md-form button{border:0;border-radius:999px;padding:0 16px;background:#2b1d16;color:#f6ead4;font:700 14px Manrope,system-ui,sans-serif;cursor:pointer}
@media (max-width:600px){.md-btn span{display:none}.md-btn{padding:10px}}`;
  const cloche = `<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 34h36" stroke="#f3c77a" stroke-width="3" stroke-linecap="round"/><path d="M9 32a15 15 0 0 1 30 0z" fill="#f3c77a"/><path d="M14 27a10 10 0 0 1 7-8" stroke="#fff6dd" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".8"/><circle cx="24" cy="14.5" r="2.6" fill="#f3c77a"/><path d="M8 38h32" stroke="#f3c77a" stroke-width="2" stroke-linecap="round" opacity=".6"/></svg>`;
  document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);
  const btn = Object.assign(document.createElement('button'), {className: 'md-btn', type: 'button', innerHTML: `${cloche}<span>Ask the <em>${NAME}</em></span>`});
  btn.setAttribute('aria-label', `Ask the ${NAME}`);
  const panel = document.createElement('div'); panel.className = 'md-panel'; panel.hidden = true; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', NAME);
  panel.innerHTML = `<div class="md-head">${cloche}<div><b>${NAME}</b><small>At your service</small></div><button class="md-x" type="button" aria-label="Close">×</button></div>
    <div class="md-log" aria-live="polite"></div><div class="md-chips"></div>
    <form class="md-form"><input type="text" placeholder="Ask anything..." aria-label="Your question" maxlength="300"><button type="submit">Ask</button></form>`;
  document.body.append(btn, panel);
  const log = panel.querySelector('.md-log'), chips = panel.querySelector('.md-chips'), input = panel.querySelector('input');
  const say = (html, me) => { const m = document.createElement('div'); m.className = 'md-m' + (me ? ' me' : ''); if (me) m.textContent = html; else m.innerHTML = html; log.append(m); log.scrollTop = log.scrollHeight; };
  const person = q => `I'll pass this to the kitchen. <a href="mailto:${MAIL}?subject=${encodeURIComponent('A question for Plugins for Breakfast')}&body=${encodeURIComponent(q || '')}">Email ${MAIL}</a> and The Chef will reply, usually within a day.`;
  const answer = q => {
    const w = q.toLowerCase().split(/[^a-z0-9]+/).filter(x => x.length > 1);
    let best = null, score = 0;
    for (const e of A) { const s = w.filter(x => e.k.split(' ').some(k => k.startsWith(x) || x.startsWith(k))).length; if (s > score) { score = s; best = e; } }
    setTimeout(() => say(best ? best.a() : person(q)), 350);
  };
  A.forEach(e => { const b = Object.assign(document.createElement('button'), {type: 'button', textContent: e.q}); b.onclick = () => { say(e.q, true); setTimeout(() => say(e.a()), 350); }; chips.append(b); });
  const human = Object.assign(document.createElement('button'), {type: 'button', textContent: 'Talk to a person'}); human.onclick = () => { say('Talk to a person', true); setTimeout(() => say(person('')), 350); }; chips.append(human);
  let greeted = false;
  const open = () => { panel.hidden = false; btn.hidden = true; if (!greeted) { greeted = true; const h = new Date().getHours(); say(`${h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'}, and welcome. I'm the ${NAME}. How may I help you?`); } setTimeout(() => input.focus({preventScroll: true}), 50); };
  const close = () => { panel.hidden = true; btn.hidden = false; };
  btn.onclick = open; panel.querySelector('.md-x').onclick = close;
  addEventListener('keydown', e => { if (e.key === 'Escape' && !panel.hidden) close(); });
  panel.querySelector('form').onsubmit = e => { e.preventDefault(); const q = input.value.trim(); if (!q) return; input.value = ''; say(q, true); answer(q); };
})();
