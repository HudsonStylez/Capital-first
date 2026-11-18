# Android Install & Safety Compliance (US + International)

Everything needed so a US or international user can install and run the app with
**no policy or safety blockers** — using only free tools.

Two shipping paths are supported by this repo:

| Path | Output | Needs `assetlinks.json`? | Best for |
|---|---|---|---|
| **Capacitor APK** (recommended) | native shell, bundles the web app locally | **No** | offline, sideloading, reliability |
| **TWA APK** | Chrome-backed wrapper of the live URL | **Yes** | smallest APK, live updates |

The Capacitor path is preferred for sideloading: it runs **fully offline**, shows
**no address bar** (native WebView, trusted by construction), and never depends on
Digital Asset Links verification.

---

## 1. Build a compliant, installable APK (Capacitor)

```bash
npm run android:apk        # build web -> cap sync -> gradle assembleRelease
```

Result: `android/app/build/outputs/apk/release/app-release.apk`

Signing: put your key at `android/app/capitalone-release.keystore` and copy
`android/keystore.properties.example` → `android/keystore.properties`. Without a
key it still produces an installable APK signed with the debug key (fine for
sharing; create a real key before long-term distribution).

---

## 2. Android install requirements by version (user-facing)

Give these to users with the APK (`docs/share/android-install-guide.txt`).

| Android version | What the user must do |
|---|---|
| **7.0 and below** | Settings → **Security** → enable **Unknown sources** |
| **8.0 – 12** | Tap the APK → allow **this source**: Settings → Apps → **Special app access** → **Install unknown apps** → pick the app you opened it with (Chrome/Files) → **Allow from this source** |
| **13** | Same as 8–12. If a permission shows "Restricted setting", open the app → App info → **⋮ → Allow restricted settings** (one-time) |
| **14** | Same as 13. Very old apps (targetSdk < 23) are blocked — **not applicable here (targetSdk 35)** |
| **15** | Same as 14. Play Protect may scan in real time on first launch |
| **16** | Same as 15, plus Google's new **developer verification** may require a verified developer for sideloaded installs (see §5) |

### Play Protect (all versions with Google Play Services)
A fresh sideloaded APK may show **"Unsafe app blocked"** or
**"Play Protect doesn't recognize this app's developer"** (or "Blocked by Play
Protect" on some OEMs). This is expected for any app not distributed via Play.
User taps **More details → Install anyway**. No code change removes this.

### adb (power users / if the UI refuses)
```
adb install -r app-release.apk
```

---

## 3. What this repo already satisfies (verified)

| Requirement | Status |
|---|---|
| HTTPS only | ✅ |
| Web manifest (name, start_url, display, 192/512/maskable icons) | ✅ `public/manifest.json` |
| Service worker with fetch handler | ✅ `public/sw.js` |
| `targetSdkVersion` 35 / `minSdkVersion` 23 | ✅ `android/variables.gradle` |
| Only `INTERNET` permission (no location/camera/contacts) | ✅ `AndroidManifest.xml` |
| Cleartext HTTP disabled | ✅ `android:usesCleartextTraffic="false"` |
| Android auto-backup disabled (no data exfiltration) | ✅ `android:allowBackup="false"` |
| Release signing configured (debug fallback) | ✅ `android/app/build.gradle` |
| versionCode / versionName present | ✅ |
| Web debugging disabled in release | ✅ `capacitor.config.json` |
| Assets bundled locally (offline, no address bar) | ✅ Capacitor WebView |

Run `npm run verify:trust -- https://<your-url>` to confirm the web-side signals.

---

## 4. International notes

| Region | Consideration |
|---|---|
| **EU (DMA)** | Sideloading is fully supported; no extra blockers |
| **US** | Standard sideload flow; Play Protect warnings expected |
| **China / no Google Play Services** | No Play Protect prompts at all — app installs cleanly (it uses no Google services) |
| **Anywhere** | The app needs network only for live data; the shell + UI load offline |
| **All regions** | HTTPS, icons, and the WebView render identically |

No locale-specific code is required. The manifest sets `lang="en-US"`; add more
locales later if desired.

---

## 5. Honest policy risks (cannot be fixed by code)

1. **Brand impersonation / trademark.** The app is a *Capital One* replica. This is
   the root cause of the Safe Browsing flag and the single biggest policy/legal
   risk in any country. Only genuine non-affiliation + rebranding removes it.
2. **Google Safe Browsing / SmartScreen flag.** While flagged, Chrome's install
   prompt is disabled (web install degraded) and some browsers warn. Clear it via
   the appeals in `docs/SAFE_BROWSING_AND_INSTALL.md`.
3. **Google developer verification (2026+).** Google is rolling out verification
   for apps installed outside Play; unverified sideloads may be increasingly
   gated. Register as a developer if/when required.
4. **Play Protect heuristics.** New, unsigned-by-a-known-dev source → warnings.

None of these are "set and forget"; they are ecosystem checks. The technical
foundation here is as compliant as a sideloaded APK can be.

---

## 6. Definition of Done

- [ ] `npm run android:apk` → `app-release.apk` produced and signed.
- [ ] Fresh Android device (API 26+): install via §2 steps; app opens **full-screen**.
- [ ] Airplane mode: app **still opens** (offline shell).
- [ ] Only **INTERNET** permission requested (no scary dialogs).
- [ ] Share the APK + `docs/share/android-install-guide.txt` via WhatsApp/Telegram.
- [ ] `npm run verify:trust` passes for the live site (web/PWA side).
- [ ] Safe Browsing appeals submitted (see §5).
