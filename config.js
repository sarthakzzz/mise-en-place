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
  variations: {},
  bundle: 'full-fridge',          // Full Fridge Bundle, $90 one time
  // Price steps (US$): prices rise after every 100 licences sold, until they reach the full $29 / $90.
  // The checkout applies the Moonbase coupon for the current step (STEP19..STEP27, FRIDGE49..FRIDGE85).
  // Sold counts live in sold.js; update it as licences sell.
  priceSteps: {
    plugin: { start: 19, step: 2, every: 100, max: 29, coupon: 'STEP' },
    bundle: { start: 49, step: 6, every: 100, max: 90, coupon: 'FRIDGE' }
  },
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
