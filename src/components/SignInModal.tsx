import React, { useState } from 'react';
import { X, Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { CapitalOneLogo } from './CapitalOneLogo';
import { useAdminStore } from '../store/AdminStore';
import { useEscapeKey } from '../hooks/useEscapeKey';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (path: string) => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose, onNavigate }) => {
  const { login } = useAdminStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [signedInUser, setSignedInUser] = useState<string | null>(null);

  useEscapeKey(() => onClose(), isOpen);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      const res = login(username, password);
      if (res.success && res.user) {
        setSignedInUser(`${res.user.firstName} ${res.user.lastName}`);
        if (onNavigate) {
          onClose();
          onNavigate('/dashboard');
        }
      } else {
        if (res.error?.includes('locked')) {
          onClose();
          if (onNavigate) onNavigate('/enroll/account-lock');
        } else {
          setErrorMessage(res.error || 'Invalid credentials');
        }
      }
    }, 600);
  };

  const handleSignOut = () => {
    setSignedInUser(null);
    setUsername('');
    setPassword('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close Sign In Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <CapitalOneLogo className="h-8 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-slate-900">
            {signedInUser ? 'Welcome back' : 'Sign in to your account'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Access cards, checking, savings, and auto financing
          </p>
        </div>

        {signedInUser ? (
          /* Authenticated Simulated Dashboard State */
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">
              Welcome, {signedInUser}!
            </h4>
            <p className="text-xs text-slate-500 mt-1 mb-6">
              You are securely signed in to Capital One Digital Banking.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left mb-6 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Active Accounts:</span>
                <span className="font-bold text-slate-800">Venture X (..4819)</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Available Balance:</span>
                <span className="font-bold text-emerald-700 font-mono">$18,450.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Next Payment:</span>
                <span className="font-semibold text-slate-700">$0.00 due</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg transition-colors"
              >
                Continue to Homepage
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full text-sm px-3.5 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D] focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full text-sm px-3.5 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#005C9D] focus:ring-[#005C9D]"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate?.('/sign-in-help');
                }}
                className="text-[#005C9D] hover:underline font-medium cursor-pointer"
              >
                Forgot info?
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-sm rounded-lg transition-colors shadow-sm cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="pt-3 border-t border-slate-100 text-center">
              <div className="text-xs text-slate-600">
                Don't have an online account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigate?.('/enroll');
                  }}
                  className="text-[#005C9D] font-bold hover:underline cursor-pointer"
                >
                  Set up access
                </button>
              </div>
            </div>

            <div className="mt-4 pt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected by 256-bit encryption &amp; Eno® fraud protection</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
