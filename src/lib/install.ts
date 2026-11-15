// Small helper to open the global "Install app" sheet from anywhere.

export const INSTALL_EVENT = 'capitalone:show-install';

export function showInstallPrompt(): void {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(INSTALL_EVENT));
  }
}

export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as unknown as { standalone?: boolean })?.standalone === true
  );
}

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}
