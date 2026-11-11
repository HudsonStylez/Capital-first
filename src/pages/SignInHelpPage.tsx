import React, { useState } from 'react';
import { CapitalOneLogo } from '../components/CapitalOneLogo';
import { useAdminStore } from '../store/AdminStore';
import {
  Search,
  CheckCircle2,
  Calendar,
  ArrowLeft,
  Mail,
  ChevronDown,
} from 'lucide-react';

interface SignInHelpPageProps {
  onNavigate: (path: string) => void;
}

export const SignInHelpPage: React.FC<SignInHelpPageProps> = ({ onNavigate }) => {
  const { users } = useAdminStore();
  const [lastName, setLastName] = useState('');
  const [ssn, setSsn] = useState('');
  const [dob, setDob] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [matchedEmail, setMatchedEmail] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastName || !ssn || !dob) return;

    // Search existing users in the state store or mock lookup
    const found = users.find(
      (u) =>
        u.lastName.toLowerCase().includes(lastName.toLowerCase()) ||
        u.ssn.replace(/\D/g, '').endsWith(ssn.replace(/\D/g, '').slice(-4))
    );

    if (found) {
      setMatchedEmail(found.email || `${found.username}@example.com`);
    } else {
      setMatchedEmail(`${lastName.toLowerCase()}****@example.com`);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-between text-[#1A1A1A]">
      {/* Header */}
      <div>
        <div className="bg-white border-b border-slate-200 py-3.5 px-4 shadow-xs">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 cursor-pointer focus:outline-none"
            >
              <CapitalOneLogo className="h-8 sm:h-9" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('/signin')}
              className="text-xs font-bold text-[#005C9D] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 my-8">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-[8px] p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] text-center">
          {/* Visuals: A magnifying glass icon inside a blue circle */}
          <div className="w-16 h-16 rounded-full bg-sky-50 border-2 border-sky-200 mx-auto flex items-center justify-center mb-5">
            <div className="w-10 h-10 rounded-full bg-[#005C9D] flex items-center justify-center text-white shadow-xs">
              <Search className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>

          {/* Title: "First, let's find your username" */}
          <h1 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] mb-2 tracking-tight">
            First, let's find your username
          </h1>
          <p className="text-xs text-slate-500 mb-6">
            Enter the details associated with your Capital One accounts.
          </p>

          {isSubmitted ? (
            /* Success State */
            <div className="text-center py-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>

              {/* Required message: "Your username has been sent to the email on file." */}
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Your username has been sent to the email on file.
              </h2>
              <p className="text-xs text-slate-600 mb-6">
                Check {matchedEmail || 'your email'} for sign-in recovery instructions.
              </p>

              <button
                type="button"
                onClick={() => onNavigate('/signin')}
                className="w-full py-3 px-6 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-sm rounded-md transition-colors cursor-pointer shadow-sm"
              >
                Return to Sign In
              </button>
            </div>
          ) : (
            /* Recovery Form: Same as enrollment (Last Name, SSN, DOB) but button text is "Find Me" */
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Chen"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Social Security Number or ITIN
                </label>
                <input
                  type="text"
                  required
                  value={ssn}
                  onChange={(e) => setSsn(e.target.value)}
                  placeholder="000000000"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date of Birth
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    placeholder="mm / dd / yyyy"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D] font-mono"
                  />
                  <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Primary CTA: "Find Me" */}
              <button
                type="submit"
                className="w-full py-3.5 px-6 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-base rounded-md transition-colors shadow-sm active:scale-98 cursor-pointer mt-4 flex items-center justify-center gap-2"
              >
                <span>Find Me</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-4 text-center text-[11px] text-slate-400 border-t border-slate-200 bg-white">
        &copy;2026 Capital One · Member FDIC · Online Account Help
      </div>
    </div>
  );
};
