import React, { useState } from 'react';
import { Share2, X, CheckCircle2 } from 'lucide-react';

interface ShareButtonProps {
  variant?: 'fab' | 'inline';
}

export const ShareButton: React.FC<ShareButtonProps> = ({ variant = 'fab' }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [shared, setShared] = useState(false);

  const shareUrl =
    typeof window !== 'undefined' && window.location.origin
      ? `${window.location.origin}/`
      : 'https://capitalone.hudson-ofccl.workers.dev/';
  const shareTitle = 'Capital One Mobile';
  const shareText = 'Check out the Capital One Mobile app — credit cards, banking, auto navigator, and credit monitoring all in one.';

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return true;
      } catch {
        // fall through
      }
    }
    return false;
  };

  const handleCapacitorShare = async () => {
    try {
      const { Share } = await import('@capacitor/share');
      if (typeof Share !== 'undefined') {
        await Share.share({ title: shareTitle, text: shareText, url: shareUrl });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
        return true;
      }
    } catch {
      // fall through
    }
    return false;
  };

  const handleShare = async () => {
    if (await handleNativeShare()) return;
    if (await handleCapacitorShare()) return;
    await handleCopy();
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      setShowDialog(true);
    }
  };

  if (variant === 'fab') {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowDialog(true)}
          className="fixed bottom-24 right-5 z-40 w-12 h-12 rounded-full bg-[#005C9D] hover:bg-[#00487D] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#005C9D]/40 cursor-pointer"
          aria-label="Share this app"
          title="Share this app"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {showDialog && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
              <button
                type="button"
                onClick={() => setShowDialog(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close share dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-full bg-[#005C9D]/10 text-[#005C9D] mx-auto flex items-center justify-center mb-3">
                  <Share2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Share Capital One Mobile</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Send this app to friends via WhatsApp, Xender, or any messaging app.
                </p>
              </div>

              {shared && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Shared successfully!</span>
                </div>
              )}

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="w-full py-3 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share via Native Share</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Copy Link to Clipboard</span>
                </button>
                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 break-all">
                  {shareUrl}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setShowDialog(true)}
      className="text-[#005C9D] hover:underline font-medium cursor-pointer flex items-center gap-1"
    >
      <Share2 className="w-3 h-3" />
      <span>Share</span>
    </button>
  );
};

export default ShareButton;