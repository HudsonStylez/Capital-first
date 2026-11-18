import React, { useEffect, useState } from 'react';
import { Download, Share, Plus, MoreVertical, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useBankingStore } from '../store/useBankingStore';
import { isStandalone, wasAppInstalled, markAppInstalled, isIOS, isIOSNonSafari } from '../lib/install';

/**
 * Blocks the app until it is installed (when the admin enables "require install").
 * After a successful install, shows an "open the app" prompt, remembers the
 * install permanently (so the gate never reappears) and lets the user continue.
 * Pass `bypass` for routes that must remain reachable (e.g. /admin).
 */
export const InstallGate: React.FC<{ children: React.ReactNode; bypass?: boolean }> = ({
  children,
  bypass = false,
}) => {
  const requireInstall = useBankingStore((s) => s.enrollmentSettings?.requireInstall ?? true);
  const [installed, setInstalled] = useState<boolean>(() => isStandalone() || wasAppInstalled());
  const [justInstalled, setJustInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState<boolean>(
    () => typeof window !== 'undefined' && Boolean((window as any).__deferredPwaPrompt)
  );
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    const onInstalled = () => {
      markAppInstalled();
      setInstalled(true);
      setJustInstalled(true);
    };
    const onAvailable = () => setCanInstall(true);
    window.addEventListener('appinstalled', onInstalled);
    window.addEventListener('pwa-prompt-available', onAvailable);
    return () => {
      window.removeEventListener('appinstalled', onInstalled);
      window.removeEventListener('pwa-prompt-available', onAvailable);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = (window as any).__deferredPwaPrompt || (window as any).__pwaInstallPrompt;
    if (prompt && typeof prompt.prompt === 'function') {
      prompt.prompt();
      try {
        const { outcome } = await prompt.userChoice;
        if (outcome === 'accepted') {
          markAppInstalled();
          setInstalled(true);
          setJustInstalled(true);
        }
      } catch {
        /* ignore */
      }
      return;
    }
    await new Promise((r) => setTimeout(r, 700));
    const late = (window as any).__deferredPwaPrompt;
    if (late && typeof late.prompt === 'function') {
      late.prompt();
      return;
    }
    setShowManual(true);
  };

  // Post-install prompt: tell the user to open the installed app.
  if (justInstalled) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#001B3A] via-[#003865] to-[#005C9D] px-5 py-10">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-7 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-slate-900">Installation complete</h1>
          <p className="text-sm text-slate-500 mt-2">
            Tap the <strong>Capital One icon</strong> on your home screen (or app drawer) to open the app. It will launch
            full screen with no address bar.
          </p>
          <button
            type="button"
            onClick={() => setJustInstalled(false)}
            className="mt-6 w-full py-3.5 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-sm rounded-xl transition-colors cursor-pointer"
          >
            Continue here instead
          </button>
        </div>
      </div>
    );
  }

  if (!requireInstall || bypass || installed) return <>{children}</>;

  const ios = isIOS();
  const iosNonSafari = isIOSNonSafari();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#001B3A] via-[#003865] to-[#005C9D] px-5 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="px-7 pt-8 pb-6 text-center">
          <img
            src="/icons/icon-192.png"
            alt="Capital One"
            className="w-20 h-20 rounded-3xl shadow-md mx-auto mb-4"
          />
          <h1 className="text-xl font-bold text-slate-900">Install the Capital One app</h1>
          <p className="text-sm text-slate-500 mt-2">
            Installation is required to continue. Add the app to your device, then open it from your home screen.
          </p>

          {ios ? (
            iosNonSafari ? (
              <div className="mt-6 text-left space-y-3">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Share className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-amber-900">
                    Open this page in <strong>Safari</strong>, then tap <strong>Share → Add to Home Screen</strong>.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-left space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-9 h-9 rounded-xl bg-[#005C9D] text-white flex items-center justify-center shrink-0">
                    <Share className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Step 1.</strong> Tap the <strong>Share</strong> icon.
                  </p>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="w-9 h-9 rounded-xl bg-[#005C9D] text-white flex items-center justify-center shrink-0">
                    <Plus className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-700">
                    <strong>Step 2.</strong> Choose <strong>Add to Home Screen</strong>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    markAppInstalled();
                    setInstalled(true);
                    setJustInstalled(true);
                  }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl cursor-pointer"
                >
                  I've added it to my home screen
                </button>
              </div>
            )
          ) : (
            <div className="mt-6 space-y-3">
              {showManual && (
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                  <div className="w-9 h-9 rounded-xl bg-[#005C9D] text-white flex items-center justify-center shrink-0">
                    <MoreVertical className="w-4 h-4" />
                  </div>
                  <p className="text-xs text-slate-700">
                    If no install dialog appeared, open your browser menu and choose <strong>Install app</strong> or{' '}
                    <strong>Add to Home screen</strong>.
                  </p>
                </div>
              )}
              <button
                type="button"
                onClick={handleInstall}
                className="w-full py-3.5 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Install App
              </button>
            </div>
          )}

          <div className="flex items-center justify-center gap-4 mt-6 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> Full screen
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Secure
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallGate;
