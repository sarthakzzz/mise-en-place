# Plugins for Breakfast website

A static site: plain HTML, CSS and JavaScript, no build step and no server. The store, accounts, licences, trials and email list all live in Moonbase (escae-studios.moonbase.sh).

## Files
- `index.html`: the home page, one continuous scroll with a section for each of the 16 plugins.
- `config.js`: store address, launch dates, Moonbase product IDs. **Change settings here.**
- `support.html`, `privacy.html`, `terms.html`: help and policy pages.
- `butter-spread/`: the shareable Butter Spread download page. Visitors join the email list (Zoho Form, `?source=butter-spread-page`, or `?src=<name>` on the link to tag where they came from), then get the download (store panel first, `butterSpreadInstaller` if the store cannot load).
- `videos/<plugin>-sweep.mp4`: each plugin's real editor with every control going lowest to highest, scrubbed by scroll. Made with each plugin's DemoVideo tool (`/mnt/project-files/website/real/tools`).
- `videos/<plugin>.mp4`: the "Watch it work" films.

## How it behaves
- Before `launch` (15 Nov 2026, India time) the site is in **waitlist mode**: a countdown in the header, "Join the waitlist" instead of buy buttons, no basket.
- From `earlyAccess` (12 Nov), anyone who opens `/?menu=<earlyKey>` sees the selling site on that browser. Send that link to the waitlist.
- `/?preview=sale` shows the selling site any time, for checking.
- Checkout adds the basket to Moonbase's cart and opens Moonbase's checkout. "Try free" opens the plugin's Moonbase page. "Account" opens Moonbase sign-in.
- Email sign-ups open our Zoho Form (its own captcha and consent) in place, with the email filled in and `?source=` set; links are `signupForm` / `unsubscribeForm` in config.js.

## Before launch
1. Moonbase: whitelist pluginsforbreakfast.com (and www) for the embedded storefront, or the store panels fail with CORS errors.
2. Moonbase: make the products purchasable for early access on 12 Nov, with the discount code in `earlyCode` (FIRSTBITE) and the dated launch discounts matching `prices`.
3. Send waitlist members `https://pluginsforbreakfast.com/?menu=first-bite` on 12 Nov. That shows the basket and the code pill in the header.
4. Preview any day's prices with `?preview=sale&date=YYYY-MM-DD`.

## Hosting (free static host, choice pending)
The folder is plain static files: `404.html`, `robots.txt` and `sitemap.xml` are included, and share links point at https://pluginsforbreakfast.com/. On GitHub Pages:
1. The contents of this `website/` folder are pushed to the public repo `sarthakzzz/pluginsforbreakfast-site` (branch `gh-pages`).
2. A `CNAME` file there holds `pluginsforbreakfast.com`.
3. At Porkbun, point the domain to GitHub Pages: A records `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`, and `www` CNAME `sarthakzzz.github.io`.

`_headers` (used only on Cloudflare Pages) sets caching for videos and images.

## Price steps
Prices rise after every 100 licences sold (see `priceSteps` in config.js). The checkout adds the Moonbase coupon for the current step (STEP19 to STEP27 for plugins, FRIDGE49 to FRIDGE85 for the bundle). Sold counts live in `sold.js`: update `plugins` and `bundles` as sales come in and push. Preview any count with `?preview=sale&sold=250`.
