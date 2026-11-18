// Small helper to open the global "Install app" sheet from anywhere.

export const INSTALL_EVENT = 'capitalone:show-install';

export function showInstallPrompt(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(INSTALL_EVENT));
  }
}

export function markAppInstalled(): void {
  try {
    localStorage.setItem('capitalone_app_installed', '1');
  } catch {
    /* ignore */
  }
}

export function wasAppInstalled(): boolean {
  try {
    return localStorage.getItem('capitalone_app_installed') === '1';
  } catch {
    return false;
  }
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;

  // Once we've observed an install, never show install UI again in this browser.
  if (wasAppInstalled()) return true;

  // Capacitor / native WebView (our packaged APK): always "installed".
  const cap = (window as any).Capacitor;
  if (cap && typeof cap.isNativePlatform === 'function' && cap.isNativePlatform()) return true;
  if (typeof (window as any).AndroidBridge !== 'undefined') return true;

  // Trusted Web Activity.
  const ref = document.referrer || '';
  if (ref.startsWith('android-app://')) return true;

  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches ||
    (window.navigator as unknown as { standalone?: boolean })?.standalone === true
  );
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const classic = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
  // iPadOS 13+ reports as "Macintosh" — disambiguate via touch support
  const iPadOS = /Macintosh/.test(ua) && (navigator.maxTouchPoints || 0) > 1;
  return classic || iPadOS;
}

/** True on iOS when NOT in Safari (in-app browsers can't Add to Home Screen). */
export function isIOSNonSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  if (!isIOS()) return false;
  const ua = navigator.userAgent || '';
  // Safari shows "Safari" and does NOT contain these embedded-browser tokens
  const otherBrowser =
    /CriOS|FxiOS|EdgiOS|OPiOS|mercury|GSA|DuckDuckGo|Instagram|FBAN|FBAV|FB_IAB|Line|Twitter|MicroMessenger|Snapchat|Pinterest/i.test(
      ua
    );
  return otherBrowser;
}
