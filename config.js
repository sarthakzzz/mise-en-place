// Everything the site needs to know about the store and the launch. Change values here, not in index.html.
window.CONFIG = {
  store: 'https://escae-studios.moonbase.sh',
  // How the store panels look and behave on our pages (no store branding, checkout stays on our site)
  storeOptions: {
    toolbar: { enabled: false, show: { cart: false, account: false, moonbase: false } },
    checkout: { redirect: 'never' },
    activation: { websiteLink: { enabled: false } },
    theme: {
      dark: false,
      colors: { primary: '#c4532f', background: '#f6ead4' },
      fonts: { heading: { family: 'Fraunces', stylesheet: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600..800&family=Manrope:wght@400;600;800&display=swap' }, body: { family: 'Manrope', stylesheet: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600..800&family=Manrope:wght@400;600;800&display=swap' } },
      corners: 'round', buttons: 'light', cards: 'shadow'
    }
  },
  supportEmail: 'chef@pluginsforbreakfast.com',

  // Waitlist mode (countdown, sign-ups, no selling) until launch. Times are India time (+05:30).
  launch: '2026-11-15T00:00:00+05:30',
  salesOpen: true,  // true opens the store on the site straight away (ignores the dates)
  earlyAccess: '2026-11-12T00:00:00+05:30',
  // Waitlist members get https://<site>/?menu=<earlyKey> on 12 November; it unlocks the basket on their browser.
  // Moonbase decides what can really be bought, so this only changes what the page shows.
  earlyKey: 'first-bite',
  earlyCode: '',                   // no separate early-access code: early buyers get the step price automatically

  // Moonbase product IDs (from the Moonbase dashboard).
  products: {
    oc: 'orange-crusher', pc: 'popping-candy', bs: 'butter-spread', ss: 'spice-shelf', ps: 'popcorn-sandwich',
    sd: 'spaghetti-delay', ff: 'food-fight', bo: 'bread-oven', ct: 'cherry-on-the-top', gp: 'ghost-pepper',
    hp: 'hot-o-pan', gg: 'gummy-gate', mc: 'milkshake-chorus', bt: 'burnt-toast', nf: 'noodle-filter',
    mg: 'muesli-granular'
  },
  // Optional Moonbase variation id per item (e.g. oc: 'regular'); sent with each checkout item when set
  variations: { oc: 'regularregular', pc: 'regular', ss: 'regular', ps: 'regular', sd: 'regular', ff: 'regular', bo: 'regular', ct: 'regular', gp: 'regular', hp: 'regular', gg: 'regular', mc: 'regular', bt: 'regular', nf: 'regular', mg: 'regular', bs: 'free', fridge: 'full-fridge' },
  bundle: 'full-fridge',          // Full Fridge Bundle, $90 one time
  // Price steps (US$): prices rise after every 100 licences sold, until they reach the full $29 / $90.
  // The checkout applies the Moonbase coupon for the current step (STEP19..STEP27, FRIDGE49..FRIDGE85).
  // Sold counts live in sold.js; update it as licences sell.
  priceSteps: {
    plugin: { start: 19, step: 2, every: 100, max: 29, coupon: 'STEP' },
    bundle: { start: 49, step: 6, every: 100, max: 90, coupon: 'FRIDGE' }
  },
  stepsFrom: '2026-11-12T00:00:00+05:30',     // STEP/FRIDGE coupons are live in the store from this moment
  // Simple dynamic prices (Sarthak 10 Nov): each item steps up after every 100 of THAT item sold (counts: SOLD.items in sold.js).
  // The store charges the current step as its list price (no coupons); the site shows the final price struck through and 'X left at this price'.
  // simplePricing: true switches the site over (no STEP/FRIDGE coupons, Lifetime Pass on, Yearly Pass off). Flip together with the store.
  simplePricing: true,
  // Full Fridge bonus line (black-friday page, home Full Fridge card, basket): false hides it
  bfBonus: 'Bonus: grab the Full Fridge before 1 Dec and our 17th plugin, Jelly Wobble, lands in your account free on 15 Dec.',  // Sarthak said yes 14 Nov
  bfBonusUntil: '2026-12-01T00:00:00Z',  // hidden everywhere from this moment
  ladders: { every: 100, plugin: [19, 21, 23, 25, 27, 29], monthly: [7, 7.5, 8, 8.5, 9, 10], fridge: [50, 60, 70, 80, 90, 100], club: [75, 90, 105, 120, 135, 150], lifetime: [150, 170, 190, 210, 230, 250] },
  clubPrice: 90,                              // Breakfast Club price (a promotion, renewals also $90; shown as $150 struck through)
  clubVariation: 'breakfast-club',            // Breakfast Club: the yearly ($150) price's variation ID on the full-fridge bundle

  // Newsletter: our own list. Sign-ups POST to this Google Apps Script web app (owned by pluginsforbreakfast@gmail.com),
  // which saves them to our Google Sheet and emails a confirmation from The Chef. Also used by /confirm/ and /unsubscribe/.
  signupEndpoint: 'https://script.google.com/macros/s/AKfycbxJIiLH-Q_huphSw9bz8F8nHEBEanzNBISOMjuulfHxjAPZQxhx2o7eBMLAXgE-J3GGCQ/exec',

  // If Moonbase can't load, the Butter Spread button falls back to the open-source release page
  butterSpreadFallback: 'https://github.com/sarthakzzz/butter-spread/releases/latest',
  // The Butter Spread page (/butter-spread/) downloads this file directly when the store can't load
  butterSpreadInstaller: 'https://github.com/sarthakzzz/butter-spread/releases/download/v1.0.0/Butter-Spread-1.0.0-mac.zip',
  // Visitor counter: GoatCounter (free, no cookies). Put the site code here once the account exists, e.g. 'pluginsforbreakfast'.
  goatcounter: '',
  // Tag the Chef: post a video with any plugin, tag us, pick one plugin free (India time). Shown on the pricing scene in this window.
  tagTheChef: { from: '2026-11-15T00:00:00+05:30', until: '2027-02-01T00:00:00+05:30' },
  // Catch the fruit (assets/catch.js): a fruit rolls across the page on a visitor's first scroll, then at most once a week.
  // Catching it gets one single-use Moonbase code with a random reward, handed out by our Apps Script ("Catch codes" tab).
  // on: false keeps it hidden (preview any time with ?catch=test). Rewards: plugin50, fridge50, month50 (first month of the Club, once that exists).
  retention: { on: true, variation: 'monthly-pass', price: 5 },   // $5 stay offer on cancel: STAY codes from the Apps Script 'stay' action (live 10 Nov); off = email The Chef
  partingGift: { on: true },   // 6-month plugin gift when someone cancels anyway: GIFT codes via the Apps Script 'parting' action, always a one-plugin checkout (live 10 Nov)
  maitredDiscount: { on: true },   // Maître D' 10% code from the Apps Script 'maitred' action (live 10 Nov)
  // Follow us, get 10% off (home page, above the footer). Honour system; hands out the visitor's one Maître D' code.
  followOffer: { on: true, profiles: [['Instagram', 'https://www.instagram.com/pluginsforbreakfast'], ['TikTok', 'https://www.tiktok.com/@pluginsforbreakfast'], ['YouTube', 'https://www.youtube.com/@pluginsforbreakfast'], ['X', 'https://x.com/PFBAudio'], ['Threads', 'https://www.threads.com/@pluginsforbreakfast'], ['Pinterest', 'https://www.pinterest.com/pluginsforbreakfast']] },
  catchFruit: { on: true, everyDays: 7, passes: 3, gapSeconds: 30, label: 'Catch me for 50% off!' },
  // Free Butter Spread downloads: each zip holds the installer plus a READ ME FIRST for the security warning
  butterSpread: {
    mac: 'https://github.com/sarthakzzz/butter-spread/releases/download/v1.0.0/Butter-Spread-1.0.0-mac.zip',
    win: 'https://github.com/sarthakzzz/butter-spread/releases/download/v1.0.0/Butter-Spread-1.0.0-windows.zip',
    readme: '/butter-spread/read-me-first/'
  }
};

// Visitor counter (no cookies): loads only when CONFIG.goatcounter is set, and never on local test pages.
(() => { const c = window.CONFIG.goatcounter; if (!c || !/pluginsforbreakfast\.com$/.test(location.hostname)) return;
  const s = document.createElement('script'); s.async = true; s.src = 'https://gc.zgo.at/count.js'; s.dataset.goatcounter = `https://${c}.goatcounter.com/count`;
  (document.head || document.documentElement).appendChild(s); })();
// Our own page-view counter (no cookies, no personal data): one tiny beacon per page view to our Apps Script ('visit' action),
// counted per day in the Sheet's Visits tab; daily totals at <signupEndpoint>?a=visits. Sends: path, referrer domain, time zone
// (a rough country), language, and whether this browser has visited before. Skips bots, local tests and our own ?notrack browsers.
(() => { try {
  if (window.__pfbVisit || !/pluginsforbreakfast\.com$/.test(location.hostname) || navigator.webdriver) return; window.__pfbVisit = 1;
  const q = new URLSearchParams(location.search); if (q.has('notrack')) localStorage.setItem('pfb-notrack', '1');
  if (localStorage.getItem('pfb-notrack') === '1') return;
  let ref = ''; try { const r = new URL(document.referrer); ref = r.hostname === location.hostname ? '' : r.hostname.replace(/^www\./, ''); } catch (e) {}
  const seen = localStorage.getItem('pfb-seen'); if (!seen) localStorage.setItem('pfb-seen', '1');
  const body = JSON.stringify({action: 'visit', path: location.pathname.slice(0, 120), ref: ref.slice(0, 80), utm: (q.get('utm_source') || q.get('src') || '').slice(0, 40),
    tz: (Intl.DateTimeFormat().resolvedOptions().timeZone || '').slice(0, 40), lang: (navigator.language || '').slice(0, 12), new: !seen, mobile: matchMedia('(max-width: 820px)').matches});
  const ep = window.CONFIG.signupEndpoint; if (!ep) return;
  const blob = new Blob([body], {type: 'text/plain;charset=utf-8'});
  if (!(navigator.sendBeacon && navigator.sendBeacon(ep, blob))) fetch(ep, {method: 'POST', mode: 'no-cors', keepalive: true, headers: {'Content-Type': 'text/plain;charset=utf-8'}, body});
} catch (e) {} })();

// Black Friday strip on every page (offer live 14 Nov to 30 Nov 23:59 UK), linking /black-friday/. Preview any time with ?bf=preview.
(() => { try {
  const t = Date.now(), pv = new URLSearchParams(location.search).get('bf') === 'preview';
  if (!pv && (t < Date.parse('2026-11-14T00:00:00Z') || t > Date.parse('2026-11-30T23:59:59Z'))) return;
  if (location.pathname.startsWith('/black-friday')) return;
  const go = () => { if (document.getElementById('bfStrip')) return; const a = document.createElement('a'); a.id = 'bfStrip'; a.href = '/black-friday/';
    a.textContent = 'Black Friday: all 16 plugins for $50, plugin #17 on us. Until 30 Nov →';
    a.style.cssText = 'display:block;position:relative;z-index:60;background:#2b1d16;color:#f7c96b;text-align:center;font:800 14px/1.35 Manrope,system-ui,sans-serif;padding:9px 16px;text-decoration:none';
    document.body.prepend(a); };
  document.body ? go() : addEventListener('DOMContentLoaded', go);
} catch (e) {} })();
