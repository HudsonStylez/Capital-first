import React, { useState, useEffect } from 'react';
import { Download, X, Share2, CheckCircle2 } from 'lucide-react';

declare global {
  interface Window {
    __pwaInstallPrompt?: any;
  }
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window as any).navigator?.standalone === true;
    setIsStandalone(standalone);
    if (standalone) return;

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if already dismissed
    const dismissed = localStorage.getItem('capitalone_pwa_dismissed');
    if (dismissed) return;

    // Listen for the beforeinstallprompt event (Chrome/Edge/Android)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show the install banner after a short delay
      setTimeout(() => setShowPrompt(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for appinstalled event
    const handleInstalled = () => {
      setInstalled(true);
      setShowPrompt(false);
    };
    window.addEventListener('appinstalled', handleInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('capitalone_pwa_dismissed', 'true');
  };

  // iOS instructions
  if (isIOS && showPrompt && !installed) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-[#005C9D] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 text-sm">Add to Home Screen</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Tap <span className="font-semibold">Share</span> → <span className="font-semibold">Add to Home Screen</span> to install the app
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
      </div>
    );
  }

  // Chrome/Edge/Android native prompt
  if (showPrompt && deferredPrompt && !installed) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-xl bg-[#005C9D] flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900 text-sm">Install Capital One Mobile</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Add to your home screen for offline access and a native app experience
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
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={handleDismiss}
            className="flex-1 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
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
      </div>
    );
  }

  // Installed confirmation
  if (installed) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-emerald-50 border border-emerald-200 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="font-bold text-emerald-900 text-sm">App Installed!</h4>
            <p className="text-xs text-emerald-700">Capital One Mobile is now on your home screen.</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PWAInstallPrompt;