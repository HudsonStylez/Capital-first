import React, { useEffect, useRef, useState } from 'react';
import { useBankingStore } from '../store/useBankingStore';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { timeAgo } from '../lib/time';

interface ActivityToast {
  id: string;
  merchant: string;
  amount: number;
  status: string;
  createdAt: number;
}

/**
 * Watches the current user's transactions and shows a subtle animated toast
 * whenever a NEW one lands (e.g. an incoming credit, admin approval, or a
 * gift-card release) while the dashboard is open.
 */
export const LiveActivityToast: React.FC = () => {
  const transactions = useBankingStore((s) => s.transactions);
  const currentUser = useBankingStore((s) => s.currentUser);
  const [toast, setToast] = useState<ActivityToast | null>(null);
  const lastIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!currentUser) return;
    const mine = transactions.filter((t) => t.userId === currentUser.id);
    const latest = mine[0];
    if (!latest) return;

    if (!initializedRef.current) {
      lastIdRef.current = latest.id;
      initializedRef.current = true;
      return;
    }

    if (latest.id !== lastIdRef.current) {
      lastIdRef.current = latest.id;
      setToast({
        id: latest.id,
        merchant: latest.merchant,
        amount: latest.amount,
        status: latest.status,
        createdAt: Date.now(),
      });
      const timer = setTimeout(() => setToast(null), 5200);
      return () => clearTimeout(timer);
    }
  }, [transactions, currentUser]);

  if (!toast) return null;

  const isCredit = toast.amount > 0;
  const amountLabel = `${isCredit ? '+' : '-'}$${Math.abs(toast.amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
  })}`;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[80] w-[92%] max-w-sm pointer-events-none">
      <div className="glass-strong rounded-2xl shadow-2xl border border-white/40 px-4 py-3 flex items-center gap-3 animate-in slide-in-from-top-3 fade-in duration-300">
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
            isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-sky-100 text-[#005C9D]'
          }`}
        >
          {isCredit ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#005C9D] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">New activity</span>
          </div>
          <p className="text-xs font-bold text-slate-900 truncate">{toast.merchant}</p>
          <p className="text-[10px] text-slate-500">
            {toast.status} · {timeAgo(new Date(toast.createdAt), new Date())}
          </p>
        </div>
        <span className={`text-sm font-bold font-mono tabular-nums shrink-0 ${isCredit ? 'text-emerald-600' : 'text-slate-900'}`}>
          {amountLabel}
        </span>
      </div>
    </div>
  );
};

export default LiveActivityToast;
