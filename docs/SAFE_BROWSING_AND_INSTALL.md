# Why the site is flagged "Dangerous" and how to fix it

## Short answer
This is **not a bug in the code**. It is **browser reputation** — specifically
**Google Safe Browsing** (Chrome, Edge, Samsung Internet, and Safari all
consume it) plus **Microsoft SmartScreen**. When a site combines:

1. a **well-known bank's branding** (Capital One logo, sign-in, receipts), and
2. a **shared, generic hosting subdomain** (`*.workers.dev`),

…browsers classify it as a **"Deceptive site ahead" / phishing** candidate and:

- show an interstitial warning ("Dangerous site"),
- **block PWA installation** (Chrome refuses to install a flagged site), and
- block on **iOS Safari** as well.

A PWA can be *perfectly* built and still be un-installable while the domain is
flagged. Reputation must be cleared separately.

---

## The criteria that decide the label

| Signal | Who checks it | Status in this project |
|---|---|---|
| HTTPS / valid certificate | All browsers | ✅ (Cloudflare) |
| Valid `manifest.webmanifest` (name, icons 192+512, start_url, display) | Chrome/Edge install | ✅ |
| Service worker with a `fetch` handler | Chrome/Edge install | ✅ |
| `apple-mobile-web-app-*` + `apple-touch-icon` | iOS install | ✅ |
| Security headers (HSTS, nosniff, CSP, frame, referrer, permissions) | Scanners / Safe Browsing | ✅ (`workers/api.js`) |
| `/.well-known/security.txt`, `robots.txt`, `sitemap.xml` | Reviewers / crawlers | ✅ |
| **Domain reputation (Safe Browsing / SmartScreen)** | Google / Microsoft | ❌ **flag** — must be cleared |
| **Brand impersonation signal** | Google Safe Browsing | ❌ **risk** — bank logo on a third-party domain |

The last two rows are why you see the warning. The first seven are now done.

---

## How to clear the flag (do these in order)

### 1. Move to a domain you own (highest impact)
`*.workers.dev` is a **shared public suffix** and is heavily associated with
abuse. Put the site on a **custom domain you control** (e.g.
`app.yourdomain.com`):

- Cloudflare dashboard → **Workers & Pages → capitalone → Settings → Domains &
  Routes → Add custom domain**.
- Point a DNS record (Cloudflare-managed) to the Worker.
- Update these files to the new domain: `public/manifest.json` (add `start_url`
  stays `/`), `public/.well-known/security.txt`, `public/sitemap.xml`.

A verified custom domain is dramatically less likely to be flagged and is
required for a Search Console review.

### 2. Verify ownership & request a Safe Browsing review
1. Add the site to **Google Search Console** (verify via DNS TXT or the HTML
   file method).
2. Search Console → **Security & Manual Actions → Security Issues**.
3. Click **Request Review**. Google re-scans within a few days and removes the
   warning if clean.
4. Do the same at **Bing Webmaster Tools** and the **Microsoft SmartScreen
   submission** portal (for Edge/Windows warnings).

### 3. Reduce the impersonation signal
Google flags pages that look like a **real institution's login**. To pass
review, differentiate clearly. Pick one:

- Add a **prominent, site-wide banner**: *"This is a personal/demo project and
  is not affiliated with Capital One."* (a footer disclaimer is now included),
- Use your **own brand** for the wordmark/logo and keep the layout/UX,
- Or only enable the bank-style login on an authenticated/demo path.

> Adding an honest disclaimer is the single most effective change for passing
> an appeal without redesigning the product.

### 4. Publish the trust pages (already added)
- `https://<your-domain>/.well-known/security.txt`
- `https://<your-domain>/robots.txt`
- `https://<your-domain>/sitemap.xml`

---

## Installability checklist (after the flag is cleared)

- **Android / desktop Chrome & Edge**: an **Install** banner appears on first
  visit; it reappears every visit until the user installs.
- **iOS Safari**: **Share → Add to Home Screen** (instructions shown in-app).
- Once installed, the app runs standalone (no browser chrome) and the **IMF**
  app icon is used.

## Verify locally / in CI

```bash
npx tsc --noEmit          # typecheck
npm run build             # production build
npm run generate:icons    # regenerate IMF icons
npx wrangler deploy       # publish Worker + assets + security headers
```

Check headers after deploy:

```bash
curl -sI https://<your-domain>/ | findstr /I "content-security strict-transport x-content-type"
```

---

## iOS specifics

iOS ignores the Chrome `beforeinstallprompt` flow. Install is done from the
**Share sheet → Add to Home Screen**. The app already ships the required iOS
meta tags (`apple-mobile-web-app-capable`, `apple-mobile-web-app-title`,
`apple-touch-icon`) and in-app instructions. The only thing that blocks iOS
install is the Safe Browsing flag — clear it per steps 1–3.

---

## Important
Clearing a Safe Browsing flag is an **external, human review** process on
Google/Microsoft's side. No amount of code guarantees removal. The code here
now satisfies every *technical* criterion; the *reputation* criteria are fixed
by owning the domain, verifying it, and (ideally) disclosing non-affiliation.
