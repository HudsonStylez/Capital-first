import React, { useState, useEffect } from 'react';
import { Download, X, Share2, CheckCircle2, MoreVertical } from 'lucide-react';

declare global {
  interface Window {
    __pwaInstallPrompt?: any;
  }
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Already installed / running as an app → never prompt
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window as any).navigator?.standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Dismissal lasts for the current visit only — the prompt returns next visit
    // (and keeps returning) until the app is actually installed.
    const dismissedThisVisit = sessionStorage.getItem('capitalone_pwa_dismissed_session');
    if (dismissedThisVisit) return;

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      (window as any).__pwaInstallPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    const handleInstalled = () => {
      setInstalled(true);
      setShowPrompt(false);
      try {
        sessionStorage.removeItem('capitalone_pwa_dismissed_session');
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('appinstalled', handleInstalled);

    // Show the prompt on first visit regardless of platform
    const timer = setTimeout(() => setShowPrompt(true), 2500);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPrompt || (window as any).__pwaInstallPrompt;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
      (window as any).__pwaInstallPrompt = null;
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      sessionStorage.setItem('capitalone_pwa_dismissed_session', 'true');
    } catch {
      /* ignore */
    }
  };

  if (isStandalone) return null;

  if (installed) {
    return (
      <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 glass-strong border border-emerald-200 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-900 text-sm">App Installed!</h4>
            <p className="text-xs text-emerald-700">Capital One is now on your home screen.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 glass-strong border border-slate-200 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <img src="/icons/icon-192.png" alt="Capital One app icon" className="w-11 h-11 rounded-xl shadow-sm shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-slate-900 text-sm">Install Capital One</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isIOS
                ? 'Tap Share, then "Add to Home Screen" for a full-screen app experience.'
                : 'Add it to your home screen for instant access, offline use, and notifications.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Dismiss install prompt"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {isIOS ? (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
          <Share2 className="w-3.5 h-3.5 text-[#005C9D]" />
          <span>Tap the <strong>Share</strong> icon in Safari, then <strong>Add to Home Screen</strong>.</span>
        </div>
      ) : deferredPrompt ? (
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            Not Now
          </button>
          <button
            type="button"
            onClick={handleInstall}
            className="flex-1 py-2 text-xs font-bold text-white bg-[#005C9D] hover:bg-[#00487D] rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-600 bg-slate-50 rounded-lg px-3 py-2">
          <MoreVertical className="w-3.5 h-3.5 text-[#005C9D]" />
          <span>Open your browser menu and choose <strong>Install app</strong> / <strong>Add to Home screen</strong>.</span>
        </div>
      )}
    </div>
  );
};

export default PWAInstallPrompt;
