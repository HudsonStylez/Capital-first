import React, { useState } from 'react';
import { useAdminStore } from '../store/AdminStore';
import { X, Lock, KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CapitalOneLogo } from './CapitalOneLogo';

interface AdminPasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasscodeModal: React.FC<AdminPasscodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { setAdminStatus } = useAdminStore();
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === '123456') {
      setError(false);
      setAdminStatus(true);
      onSuccess();
      onClose();
    } else {
      setError(true);
      setPasscode('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-sm w-full p-6 text-white shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#005C9D]/30 border border-[#005C9D] text-sky-400 mx-auto flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold">Admin Access</h3>
          <p className="text-xs text-slate-400 mt-1">
            Enter the 6-digit administrative passcode to proceed.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>Invalid Passcode</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-semibold text-slate-300 mb-1">
              Passcode
            </label>
            <input
              type="password"
              maxLength={6}
              autoFocus
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError(false);
              }}
              placeholder="••••••"
              className="w-full text-center text-xl tracking-widest font-mono py-2.5 px-3 bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D] text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Authenticate &amp; Open /admin
          </button>

          <div className="text-center pt-2">
            <span className="text-[11px] text-slate-500">
              Hint: Administrative testing passcode is <code className="text-sky-400 font-mono font-bold">123456</code>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
