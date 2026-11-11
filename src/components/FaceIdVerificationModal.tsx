import React, { useState, useEffect } from 'react';
import {
  Scan,
  ShieldCheck,
  CheckCircle2,
  X,
  Camera,
  AlertCircle,
  Smartphone,
  Sparkles,
} from 'lucide-react';

interface FaceIdVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const FaceIdVerificationModal: React.FC<FaceIdVerificationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'initializing' | 'scanning' | 'analyzing' | 'success'>('initializing');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setStep('initializing');
      setProgress(0);
      return;
    }

    // Step 1: Initializing
    const timer1 = setTimeout(() => {
      setStep('scanning');
    }, 700);

    // Step 2: Scanning (Progress 0 -> 75%)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 250);

    // Step 3: Analyzing
    const timer2 = setTimeout(() => {
      setStep('analyzing');
      setProgress(100);
    }, 2000);

    // Step 4: Success
    const timer3 = setTimeout(() => {
      setStep('success');
    }, 2800);

    return () => {
      clearTimeout(timer1);
      clearInterval(interval);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFinish = () => {
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl relative flex flex-col items-center text-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Biometric Scanner Visualizer */}
        <div className="relative my-6 w-36 h-36 flex items-center justify-center">
          {/* Outer Scanner Target Ring */}
          <div
            className={`w-36 h-36 rounded-3xl border-2 transition-all duration-500 relative flex items-center justify-center ${
              step === 'success'
                ? 'border-emerald-500 bg-emerald-950/30'
                : 'border-sky-500/60 bg-sky-950/20 shadow-lg shadow-sky-500/20'
            }`}
          >
            {/* Corner Target Markers */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-sky-400" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-sky-400" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-sky-400" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-sky-400" />

            {/* Scanning Laser Beam */}
            {step === 'scanning' && (
              <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_8px_#38bdf8] animate-[bounce_1.5s_infinite]" />
            )}

            {step === 'success' ? (
              <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-in zoom-in-75 duration-300" />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Scan className="w-14 h-14 text-sky-400 animate-pulse" />
                <span className="text-[10px] font-mono text-sky-300 font-bold uppercase tracking-wider">
                  {step === 'initializing'
                    ? 'Align Face'
                    : step === 'scanning'
                    ? 'Scanning...'
                    : 'Matching...'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status Text & Instructions */}
        <div className="space-y-1.5 mb-5">
          <h3 className="text-base font-bold text-white">
            {step === 'initializing' && 'Preparing Biometric Sensor'}
            {step === 'scanning' && 'Hold Still Inside Frame'}
            {step === 'analyzing' && 'Verifying 30,000 Depth Coordinates'}
            {step === 'success' && 'FaceID Enrollment Complete'}
          </h3>

          <p className="text-xs text-slate-400 max-w-xs">
            {step === 'success'
              ? 'Your facial biometrics have been verified and securely registered. You can now use FaceID for instant authentication.'
              : 'Keep your device at eye level with adequate lighting to complete security enrollment.'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="w-full bg-slate-800 rounded-full h-1.5 mb-6 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              step === 'success' ? 'bg-emerald-500' : 'bg-sky-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Action Button */}
        {step === 'success' ? (
          <button
            type="button"
            onClick={handleFinish}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/40 cursor-pointer transition-colors"
          >
            Activate FaceID
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl cursor-pointer transition-colors"
          >
            Cancel
          </button>
        )}

        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Biometric data encrypted locally in Secure Enclave</span>
        </div>
      </div>
    </div>
  );
};
