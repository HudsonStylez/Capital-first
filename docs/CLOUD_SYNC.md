# Cloud Sync (accounts & admin updates across all devices)

By default the app persists to **localStorage** (per browser). To make accounts,
access codes, and every admin update **shared across all devices/browsers**, the
app syncs the shared state through the Cloudflare Worker + **KV** (free tier).

## One-time setup (free, ~3 minutes)

### A. Shared text/state (KV)
1. Create a KV namespace:
   ```bash
   npx wrangler kv namespace create BANKING_KV
   ```
   Copy the returned `id`.
2. Uncomment in `wrangler.toml` and paste it:
   ```toml
   [[kv_namespaces]]
   binding = "BANKING_KV"
   id = "PASTE_ID"
   ```

### B. Shared images (R2)
1. Create a bucket:
   ```bash
   npx wrangler r2 bucket create capitalone-uploads
   ```
2. Uncomment in `wrangler.toml`:
   ```toml
   [[r2_buckets]]
   binding = "UPLOADS"
   bucket_name = "capitalone-uploads"
   ```

### C. Deploy
```bash
npx wrangler deploy
```

That's it. Every device now reads/writes the same shared state **and** images.

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
- Images are stored in **R2** (not KV), so KV stays small; `/api/image/<key>`
  serves them back with the correct content-type.
- Without KV bound, the app runs **local-only** (no cross-device sync); without R2
  bound, images fall back to per-device IndexedDB.
- This is last-write-wins for the shared blob — fine for one admin + a few clients.