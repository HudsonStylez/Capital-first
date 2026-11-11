import React, { useState } from 'react';
import { Megaphone, X, ZoomIn, ZoomOut, Eye, CheckCircle2, MessageSquare, Send } from 'lucide-react';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface FloatingMegaphoneProps {
  fontSizeLevel: 'normal' | 'large' | 'xlarge';
  onChangeFontSize: (level: 'normal' | 'large' | 'xlarge') => void;
  isHighContrast: boolean;
  onToggleHighContrast: () => void;
}

export const FloatingMegaphone: React.FC<FloatingMegaphoneProps> = ({
  fontSizeLevel,
  onChangeFontSize,
  isHighContrast,
  onToggleHighContrast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  useEscapeKey(() => setIsOpen(false), isOpen);

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText('');
      setIsOpen(false);
    }, 2000);
  };

  return (
    <>
      {/* Floating Blue Megaphone Button Fixed to Bottom Right */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-5 z-40 w-12 h-12 rounded-full bg-[#005C9D] hover:bg-[#00487D] text-white shadow-xl hover:shadow-2xl flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#005C9D]/40 cursor-pointer"
        aria-label="Accessibility & Feedback Assistant"
        title="Accessibility & Feedback"
      >
        <Megaphone className="w-5 h-5 -rotate-12" />
        {/* Subtle accessibility badge ring */}
        <span className="sr-only">Open Accessibility and Feedback</span>
      </button>

      {/* Accessibility & Feedback Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sky-100 text-[#005C9D] flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Accessibility &amp; Feedback
                  </h3>
                  <span className="text-[11px] text-slate-500">Capital One Digital Inclusion</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Adjustments */}
            <div className="space-y-4 mb-6">
              {/* Text Size Scale */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Display Text Sizing
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'Default (100%)' },
                    { id: 'large', label: 'Large (110%)' },
                    { id: 'xlarge', label: 'Extra Large (125%)' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onChangeFontSize(item.id as any)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        fontSizeLevel === item.id
                          ? 'bg-[#005C9D] text-white border-[#005C9D]'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast Mode */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-700" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">High Contrast Mode</span>
                    <span className="text-[11px] text-slate-500">Boosts contrast borders and text sharpness</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggleHighContrast}
                  className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isHighContrast ? 'bg-[#005C9D]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      isHighContrast ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Direct Feedback Form */}
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-800 block mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#005C9D]" />
                <span>Have feedback or accessibility needs?</span>
              </span>

              {feedbackSent ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thank you! Your feedback has been received.</span>
                </div>
              ) : (
                <form onSubmit={handleSendFeedback} className="space-y-2">
                  <textarea
                    rows={2}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Tell us how we can improve your experience..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!feedbackText.trim()}
                      className="px-4 py-1.5 bg-[#005C9D] disabled:opacity-50 text-white rounded-md text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Submit</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
