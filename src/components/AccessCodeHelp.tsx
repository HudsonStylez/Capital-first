import React, { useState } from 'react';
import { KeyRound, Send, CheckCircle2 } from 'lucide-react';
import { useBankingStore } from '../store/useBankingStore';

/**
 * "I don't have an access code" flow: the visitor leaves their email + a message,
 * which creates a support request the admin sees and follows up on.
 */
export const AccessCodeHelp: React.FC = () => {
  const requestAccessSupport = useBankingStore((s) => s.requestAccessSupport);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr('Enter a valid email address.');
      return;
    }
    if (!message.trim()) {
      setErr('Tell us briefly how we can help.');
      return;
    }
    requestAccessSupport(email.trim(), message.trim());
    setErr(null);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          Request received. Our team will reach out to <strong>{email.trim()}</strong>.
        </span>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[#005C9D] font-bold hover:underline cursor-pointer flex items-center gap-1 text-xs"
      >
        <KeyRound className="w-3.5 h-3.5" /> Don't have an access code? Contact support
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs">
      <p className="text-slate-600">
        No access code yet? Leave your email and a short note — our team will contact you with one.
      </p>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="How can we help? (e.g. I'd like online access)"
        rows={3}
        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
      />
      {err && <p className="text-red-600 font-semibold">{err}</p>}
      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 py-2 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold rounded-md flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" /> Send request
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-md cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AccessCodeHelp;
