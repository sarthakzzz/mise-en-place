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

  // Newsletter: Zoho Forms (own captcha + consent). The site adds ?source=website-footer or butter-spread-popup
  signupForm: 'https://forms.zohopublic.in/sarthakescaes1/form/PluginsforBreakfastJointhelist/formperma/2LG-lwgrWvlbXXXVYhO2BVRPVbe8ChhblJQOp2vSQhk',
  unsubscribeForm: 'https://forms.zohopublic.in/sarthakescaes1/form/PluginsforBreakfastUnsubscribe/formperma/hUDjJQT4BqadQOnWX58lq52NhVeuJs9gPkizDCmx7kQ',

  // If Moonbase can't load, the Butter Spread button falls back to the open-source release page
  butterSpreadFallback: 'https://github.com/sarthakzzz/butter-spread/releases/latest',
  // The Butter Spread page (/butter-spread/) downloads this file directly when the store can't load
  butterSpreadInstaller: 'https://github.com/sarthakzzz/butter-spread/releases/download/v1.0.0/Butter-Spread-1.0.0-mac.pkg'
};
