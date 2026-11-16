# Deploying on Vercel (frontend + backend)

Yes — you can run **both** the frontend and the email backend on Vercel.
The frontend is a static Vite build; the backend is a serverless function in
`/api`. They live on the **same domain**, so the app calls `/api/send-receipt`
with no configuration.

## What's already in the repo

| File | Purpose |
|---|---|
| `vercel.json` | Vite framework, build output `dist/`, security headers (HSTS, CSP, nosniff, frame, referrer, permissions) |
| `api/send-receipt.js` | Serverless email endpoint (SendGrid → Mailgun → mock) |
| `api/health.js` | `GET /api/health` status check |
| App code | Uses same-origin `/api/send-receipt` in production (no env needed) |

The app uses **hash routing** (`/#/dashboard`), so no SPA rewrite rules are
required — `/` serves `index.html` and everything else is client-side.

## Deploy steps

1. Push this repo to GitHub (already done).
2. Go to **vercel.com → Add New → Project → Import** the repo.
3. Vercel auto-detects **Vite**. Leave defaults (they match `vercel.json`).
4. **Environment Variables** (Project → Settings → Environment Variables):
   - `SENDGRID_API_KEY` — **or**
   - `MAILGUN_API_KEY` and `MAILGUN_DOMAIN`
   - `EMAIL_FROM` (optional, e.g. `Capital One <no-reply@yourdomain.com>`)
   > Without keys, email runs in **mock mode** (logged) and the endpoint still
   > returns success, so the app works immediately.
5. **Deploy.** Your app is live at `https://<project>.vercel.app`.

## Verify after deploy

```bash
curl https://<project>.vercel.app/api/health
# { "status": "ok", "email": "sendgrid" | "mailgun" | "mock", ... }

curl -I https://<project>.vercel.app/
# should include content-security-policy, strict-transport-security, x-content-type-options
```

## Custom domain (recommended)

Vercel → Project → **Domains** → add `app.yourdomain.com` and follow the DNS
steps. A domain you own is far less likely to be flagged by Safe Browsing than
a shared subdomain (see `docs/SAFE_BROWSING_AND_INSTALL.md`). After adding it,
update `public/sitemap.xml` and `public/.well-known/security.txt` with the new
URL.

## Notes

- **Deployment protection:** if you enable Vercel "Deployment Protection",
  public/automated visitors (and Safe Browsing crawlers) get an auth wall — turn
  it **off** for a public site.
- **Both platforms:** the repo works on **Cloudflare Workers** *and* **Vercel**
  simultaneously. The `workers/api.js` (Cloudflare) and `api/send-receipt.js`
  (Vercel) implement the same endpoint; keep whichever you deploy on.
- **Server (`server.js`):** for local dev only (`npm run server`).
