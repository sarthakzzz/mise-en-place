// Licences sold so far, for the price steps on the site. Update as sales come in.
// plugins = single-plugin licences (all plugins together), bundles = Full Fridge Bundles.
// Simple dynamic prices (written by scripts/store/price_ladder.py): steps = current step index per item, items = sold at that step.
// Keys: Moonbase product ids for plugins (orange-crusher, ...), plus monthly, fridge, club, lifetime. Missing = first step, 0 sold.
window.SOLD = { plugins: 0, bundles: 0, items: {}, steps: {}, updated: '2026-11-10' };
