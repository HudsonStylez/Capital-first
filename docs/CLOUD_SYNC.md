# Cloud Sync (accounts & admin updates across all devices)

By default the app persists to **localStorage** (per browser). To make accounts,
access codes, and every admin update **shared across all devices/browsers**, the
app syncs the shared state through the Cloudflare Worker + **KV** (free tier).

## One-time setup (free, ~2 minutes)

1. **Create a KV namespace:**
   ```bash
   npx wrangler kv namespace create BANKING_KV
   ```
   Copy the returned `id`.

2. **Bind it** — uncomment the block at the bottom of `wrangler.toml` and paste the id:
   ```toml
   [[kv_namespaces]]
   binding = "BANKING_KV"
   id = "PASTE_YOUR_KV_NAMESPACE_ID_HERE"
   ```

3. **Deploy:**
   ```bash
   npx wrangler deploy
   ```

That's it. Every device now reads/writes the same shared state.

## What syncs vs. what stays local

| Synced (cloud) | Local only (per device) |
|---|---|
| users, transactions, systemLogs | currentUser (session) |
| paymentOptions, withdrawalOptions | isAdmin |
| giftCards, notifications | pendingUser |
| supportThreads, budgetCategories | theme, isBalanceHidden |
| accessCodes, enrollmentSettings | |
| resetPasswordPin, globalNotification, installCount | |

## How it behaves

- On load, the app **pulls** the cloud state (source of truth).
- On any shared change, it **pushes** (debounced ~0.7s).
- It **polls every 15s** and refreshes on window focus — so an **admin edit appears
  on the client within ~15s** (or instantly when the client refocuses the tab).
- No funds are ever added on account creation (referral codes are tracked with no bonus).

## Packaged app (Capacitor APK)

The APK has no same-origin server, so point it at the Worker at build time:
```bash
VITE_API_BASE=https://capitalone.hudson-ofccl.workers.dev npm run build
npm run android:apk
```
(On web, leave `VITE_API_BASE` empty — it uses same-origin `/api/state`.)

## Notes / limits

- Without KV bound, the app runs **local-only** (no cross-device sync) and logs a
  503 from `/api/state`; nothing breaks.
- KV values max **25 MB**. State with many uploaded images can grow; for heavy
  image volumes, move images to R2 (object storage) later.
- This is last-write-wins for the shared blob — fine for one admin + a few clients.