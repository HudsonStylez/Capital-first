import React, { useState, useEffect } from 'react';
import { CapitalOneLogo } from '../components/CapitalOneLogo';
import { useAdminStore } from '../store/AdminStore';
import {
  User as UserIcon,
  Lock,
  Eye,
  EyeOff,
  Building,
  KeyRound,
  AlertCircle,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface SignInPageProps {
  onNavigate: (path: string) => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onNavigate }) => {
  const { login, passkeyLogin, users } = useAdminStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [passkeyNotice, setPasskeyNotice] = useState(false);
  const [infoNotice, setInfoNotice] = useState<string | null>(null);

  // Prefill a previously saved username (user opted to save info for next login)
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('capitalone_saved_user');
      if (savedUser) {
        setUsername(savedUser);
        setRememberMe(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const res = login(username, password);

      if (res.error === 'ACCOUNT_LOCKED') {
        onNavigate('/enroll/account-lock');
        return;
      }

      if (!res.success) {
        setErrorMessage(
          res.error ||
            "The username or password you entered doesn't match our records. Please try again or use Forgot Username or Password."
        );
        return;
      }

      // Save or clear the login info for next time
      try {
        if (rememberMe) {
          localStorage.setItem('capitalone_saved_user', username.trim());
        } else {
          localStorage.removeItem('capitalone_saved_user');
        }
      } catch {
        /* ignore */
      }

      onNavigate('/dashboard');
    }, 600);
  };

  const handlePasskey = () => {
    setPasskeyNotice(true);
    setTimeout(() => {
      setPasskeyNotice(false);
      const res = passkeyLogin();
      if (res.success) {
        onNavigate('/dashboard');
      } else {
        if (res.error === 'ACCOUNT_LOCKED') {
          onNavigate('/enroll/account-lock');
        } else {
          setErrorMessage(res.error || 'Passkey authentication failed. Please sign in or enroll.');
        }
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-between text-[#1A1A1A]">
      {/* Top Header Section */}
      <div>
        {/* FDIC Guarantee Top Strip */}
        <div className="bg-white border-b border-slate-200 py-2 px-4 text-xs text-slate-700">
          <div className="max-w-4xl mx-auto flex items-center justify-center sm:justify-start gap-2">
            <div className="w-4 h-4 rounded bg-slate-900 text-white flex items-center justify-center text-[9px] font-bold">
              FDIC
            </div>
            <span className="font-medium text-slate-700 text-[11px] sm:text-xs">
              FDIC-Insured - Backed by the full faith and credit of the U.S. Government
            </span>
          </div>
        </div>

        {/* Brand Bar with Logo on left and English dropdown on right */}
        <div className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <CapitalOneLogo className="h-8 sm:h-9" />
            </button>

            {/* Language Selector: US Flag + English + dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">
              <span className="text-base leading-none">🇺🇸</span>
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Sign-In Card Container */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 my-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-[8px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] relative animate-in fade-in zoom-in-95 duration-200">
          {/* Centered Large Capital One Logo */}
          <div className="text-center mb-6">
            <CapitalOneLogo className="h-8 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Sign In</h1>
          </div>

          {infoNotice && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{infoNotice}</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{errorMessage}</span>
                {users.length === 0 && (
                  <button
                    type="button"
                    onClick={() => onNavigate('/enroll')}
                    className="block font-bold text-[#005C9D] underline mt-1"
                  >
                    No accounts yet &mdash; Click here to Enroll now &gt;
                  </button>
                )}
              </div>
            </div>
          )}

          {passkeyNotice && (
            <div className="mb-4 p-3 bg-sky-50 border border-sky-200 rounded-md text-xs text-sky-800 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border-2 border-sky-600 border-t-transparent animate-spin shrink-0" />
              <span>Verifying biometric passkey token with device...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Input with User Icon */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your username"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input with Lock Icon & Toggle Eye */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Save info for next login checkbox */}
            <div className="flex items-center pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#005C9D] focus:ring-[#005C9D] border-slate-300 cursor-pointer"
                />
                <span>Save my info for next login</span>
              </label>
            </div>

            {/* Blue Sign-In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-base rounded-md transition-colors shadow-sm active:scale-98 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>

            {/* Passkey Section */}
            <div className="mt-5 p-4 border border-slate-200 rounded-lg bg-slate-50/70 text-left">
              <div className="flex items-center gap-2 mb-1">
                <KeyRound className="w-4 h-4 text-[#005C9D]" />
                <h3 className="text-xs font-bold text-slate-900">
                  Go passwordless with a passkey
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                No more having to remember a password. Use a passkey to sign in using your face or fingerprint.
              </p>
              <button
                type="button"
                onClick={handlePasskey}
                className="text-xs font-bold text-[#005C9D] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>Sign in with Passkey &gt;</span>
              </button>
            </div>

            {/* Footer Links inside Card */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
              <button
                type="button"
                onClick={() => onNavigate('/sign-in-help')}
                className="text-[#005C9D] hover:underline font-medium cursor-pointer"
              >
                Forgot Username or Password?
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/enroll')}
                className="text-[#005C9D] hover:underline font-bold cursor-pointer"
              >
                Set Up Online Access
              </button>
            </div>
          </form>

        </div>

        {/* Below Card Centered Links */}
        <div className="mt-6 text-center text-xs text-slate-600">
          <span>Looking for these accounts? </span>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="text-[#005C9D] font-bold hover:underline cursor-pointer"
          >
            Commercial or Trade Credit &gt;
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 px-4 border-t border-slate-200 bg-white text-xs text-slate-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-[11px] text-slate-500">
            <button onClick={() => onNavigate('/')} className="hover:text-black">
              Contact Us
            </button>
            <span>|</span>
            <button onClick={() => onNavigate('/')} className="hover:text-black">
              Privacy &amp; Security
            </button>
            <span>|</span>
            <button onClick={() => onNavigate('/')} className="hover:text-black">
              Terms &amp; Conditions
            </button>
          </div>
          <div className="text-[11px] text-slate-400 text-center sm:text-right">
            &copy; 2026 Capital One. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};
