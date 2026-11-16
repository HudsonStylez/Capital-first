import React, { useState, useEffect, useCallback } from 'react';
import { Download, X, Share, Plus, MoreVertical, CheckCircle2, Smartphone } from 'lucide-react';
import { INSTALL_EVENT, isStandalone, isIOS } from '../lib/install';
import { useBankingStore } from '../store/useBankingStore';

declare global {
  interface Window {
    __pwaInstallPrompt?: any;
  }
}

/**
 * A single, native-feeling "Install app" sheet used on every platform:
 *  - Android / PC (Chrome, Edge): one-tap Install via the browser's prompt.
 *  - iOS Safari: an app-style guided sheet (Share → Add to Home Screen).
 * Appears automatically on first visit and stays until the app is installed.
 */
export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [ios, setIos] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const recordAppInstall = useBankingStore((s) => s.recordAppInstall);

  const open = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    if (isStandalone()) return;

    setIos(isIOS());

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      (window as any).__pwaInstallPrompt = e;
    };
    const handleInstalled = () => {
      setInstalled(true);
      setIsOpen(false);
      recordAppInstall();
      try {
        sessionStorage.removeItem('capitalone_pwa_dismissed_session');
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleInstalled);
    window.addEventListener(INSTALL_EVENT, open);

    // Auto-show on first visit (returns every visit until installed)
    let timer: ReturnType<typeof setTimeout> | undefined;
    const dismissedThisVisit = sessionStorage.getItem('capitalone_pwa_dismissed_session');
    if (!dismissedThisVisit) {
      timer = setTimeout(() => setIsOpen(true), 2500);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
      window.removeEventListener(INSTALL_EVENT, open);
      if (timer) clearTimeout(timer);
    };
  }, [open]);

  const handleInstall = async () => {
    const prompt = deferredPrompt || (window as any).__pwaInstallPrompt;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setIsOpen(false);
      }
      setDeferredPrompt(null);
      (window as any).__pwaInstallPrompt = null;
    } else {
      // No native prompt available — keep the sheet open with manual guidance
      setCanInstall(false);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem('capitalone_pwa_dismissed_session', 'true');
    } catch {
      /* ignore */
    }
  };

  if (isStandalone()) return null;

  // Installed confirmation
  if (installed) {
    return (
      <div className="fixed z-[90] bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:w-80">
        <div className="glass-strong border border-emerald-200 rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-in slide-in-from-bottom-4 duration-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-900 text-sm">App Installed!</h4>
            <p className="text-xs text-emerald-700">Capital One is now on your home screen.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleDismiss} />

      <div className="relative w-full sm:max-w-md glass-strong border border-white/40 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-300">
        {/* Grab handle (mobile) */}
        <div className="pt-3 pb-1 flex justify-center sm:hidden">
          <span className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        <div className="p-6 safe-bottom">
          {/* App identity */}
          <div className="flex items-center gap-4">
            <img src="/icons/icon-192.png" alt="Capital One app icon" className="w-16 h-16 rounded-2xl shadow-md" />
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-slate-900">Install Capital One</h3>
              <p className="text-xs text-slate-500">
                Add the app to your home screen for instant, full-screen access.
              </p>
              <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
                <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" /> Fast</span>
                <span aria-hidden>·</span>
                <span>Offline-ready</span>
                <span aria-hidden>·</span>
                <span>Notifications</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Platform-specific action */}
          {ios ? (
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-[#005C9D] text-white flex items-center justify-center shrink-0">
                  <Share className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Step 1.</strong> Tap the <strong>Share</strong> icon in Safari's toolbar.
                </p>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-[#005C9D] text-white flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-700">
                  <strong>Step 2.</strong> Choose <strong>Add to Home Screen</strong>, then tap <strong>Add</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-3 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Got it
              </button>
            </div>
          ) : canInstall || deferredPrompt ? (
            <div className="mt-5 flex gap-2">
              <button
                type="button"
                onClick={handleDismiss}
                className="flex-1 py-3 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
              >
                Maybe later
              </button>
              <button
                type="button"
                onClick={handleInstall}
                className="flex-1 py-3 text-sm font-bold text-white bg-[#005C9D] hover:bg-[#00487D] rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Install
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-[#005C9D] text-white flex items-center justify-center shrink-0">
                  <MoreVertical className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-700">
                  Open your browser menu and choose <strong>Install app</strong> or{' '}
                  <strong>Add to Home screen</strong>.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          )}

          <p className="a11y-hidden">
            Demo project — not affiliated with Capital One.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
