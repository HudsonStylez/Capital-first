import React, { useState } from 'react';
import { CheckCircle2, X, Copy, Send, Mail, Printer, CreditCard, Banknote, Clock, AlertTriangle } from 'lucide-react';

interface TransactionReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    referenceNumber: string;
    merchant: string;
    type: 'Deposit' | 'Withdrawal' | 'Payment' | 'Transfer';
    status: 'Completed' | 'Pending' | 'Declined';
    amount: number;
    date: string;
    category?: string;
    destinationDetails?: string;
    adminFeedback?: string;
  };
  account: {
    type: 'checking' | 'credit';
    accountNumber: string;
    balanceBefore: number;
    balanceAfter: number;
    availableCredit?: number;
  };
  onEmailSent?: () => void;
}

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  isOpen,
  onClose,
  transaction,
  account,
  onEmailSent,
}) => {
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const amountAbs = Math.abs(transaction.amount);
  const isDeposit = transaction.type === 'Deposit';
  const isWithdrawal = transaction.type === 'Withdrawal';
  const isPayment = transaction.type === 'Payment';
  const isTransfer = transaction.type === 'Transfer';

  const typeLabel = (() => {
    switch (transaction.type) {
      case 'Deposit': return 'Direct Deposit';
      case 'Withdrawal': return 'ATM Cash Withdrawal';
      case 'Payment': return 'Bill Payment';
      case 'Transfer': return 'Internal Transfer';
      default: return transaction.type;
    }
  })();

  const typeColor = (() => {
    switch (transaction.type) {
      case 'Deposit': return 'text-emerald-600 bg-emerald-50';
      case 'Withdrawal': return 'text-red-600 bg-red-50';
      case 'Payment': return 'text-[#005C9D] bg-[#005C9D]/10';
      case 'Transfer': return 'text-sky-600 bg-sky-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  })();

  const receiptDate = new Date(transaction.date);
  const formattedDate = receiptDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = receiptDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const formattedAmount = amountAbs.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const formattedBalanceBefore = account.balanceBefore.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const formattedBalanceAfter = account.balanceAfter.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const maskedAccount = `•••• ${account.accountNumber.slice(-4)}`;
  const reference = transaction.referenceNumber || `REF-CAP-${Math.floor(Math.random() * 900000) + 100000}`;

  const handleEmailSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress.trim()) {
      setEmailError('Email address is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress.trim())) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setIsSending(true);
    setEmailError('');

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/send-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailAddress.trim(),
          subject: `Capital One Transaction Receipt - REF-${reference}`,
          transaction: {
            ...transaction,
            referenceNumber: reference,
          },
          account,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSent(true);
      onEmailSent?.();
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to send email');
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      {/* Receipt Container - sized like a mobile receipt/email */}
      <div className="bg-white w-full max-w-[390px] max-h-[800px] overflow-hidden rounded-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] flex flex-col">
        
        {/* Receipt Header */}
        <div className="bg-[#F4F6F8] px-6 py-5 border-b border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#005C9D] flex items-center justify-center">
                <span className="text-[10px] font-bold text-white tracking-tight">CO</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">Capital One</h3>
                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Transaction Receipt</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-900">REF #{reference}</p>
              <p className="text-[9px] text-slate-400">{formattedDate} · {formattedTime}</p>
            </div>
          </div>
          <div className="h-[1px] bg-gradient-to-r from-[#005C9D] via-transparent to-[#DA291C] mt-2"></div>
        </div>

        {/* Transaction Type Badge */}
        <div className="px-6 py-3 border-b border-slate-100">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${typeColor}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            <span>{typeLabel}</span>
          </div>
        </div>

        {/* Receipt Body */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          {/* Merchant / Counterparty */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              {isDeposit ? (
                <Banknote className="w-4 h-4 text-emerald-600" />
              ) : isWithdrawal ? (
                <CreditCard className="w-4 h-4 text-red-600" />
              ) : isPayment ? (
                <Mail className="w-4 h-4 text-[#005C9D]" />
              ) : (
                <Clock className="w-4 h-4 text-sky-600" />
              )}
              <span className="text-sm font-bold text-slate-900">{transaction.merchant}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {transaction.destinationDetails || 'Capital One Digital Banking'}
            </p>
          </div>

          {/* Amount */}
          <div className="mb-6">
            <div className="flex items-end gap-1">
              <span className="text-[10px] text-slate-400 font-medium">Amount</span>
              <span className={`text-3xl font-bold ${isDeposit ? 'text-emerald-600' : 'text-slate-900'}`}>
                {isDeposit ? '+' : '-'}{formattedAmount}
              </span>
            </div>
            <div className="h-[1px] bg-slate-100 mt-1"></div>
          </div>

          {/* Account */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-xl mb-4 border border-slate-100">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Account</span>
              <span className="text-sm font-medium text-slate-900">{account.type === 'checking' ? '360 Checking' : 'Quicksilver Rewards'}</span>
              <span className="text-[10px] font-mono text-slate-500">{maskedAccount}</span>
            </div>
            <span className={`text-sm font-bold ${isDeposit ? 'text-emerald-600' : 'text-slate-900'}`}>
              {isDeposit ? '+' : '-'}{formattedAmount}
            </span>
          </div>

          {/* Balance Summary */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Balance Before</span>
              <span className="text-sm text-slate-600">{formattedBalanceBefore}</span>
            </div>
            <div className="h-[1px] bg-slate-100"></div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] font-bold text-slate-900">Available Balance</span>
              <span className="text-sm font-bold text-slate-900">{formattedBalanceAfter}</span>
            </div>
          </div>

          {account.availableCredit && (
            <div className="flex items-center justify-between px-3 py-2 bg-[#005C9D]/5 rounded-xl mb-4 border border-[#005C9D]/20">
              <span className="text-[10px] text-[#005C9D] font-bold uppercase tracking-wider">Available Credit</span>
              <span className="text-sm font-bold text-[#005C9D]">${account.availableCredit.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
            </div>
          )}

          {/* Category / Details */}
          {transaction.category && (
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 mb-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Category</span>
              <span className="text-sm text-slate-700">{transaction.category}</span>
            </div>
          )}

          {transaction.adminFeedback && (
            <div className="px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 mb-4">
              <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">Administrative Note</span>
              <span className="text-sm text-slate-700 italic">{transaction.adminFeedback}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 px-6 py-4">
          <div className="text-center mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <p className="text-[11px] font-bold text-emerald-700">Transaction Completed Successfully</p>
          </div>
          
          <div className="space-y-1">
            <p className="text-[9px] text-slate-500 leading-relaxed">
              Capital One, N.A. Member FDIC. Equal Housing Lender. This receipt is an electronic record of your
              transaction and may be used for your records. Please retain for your personal accounting.
            </p>
            <p className="text-[9px] text-slate-500">
              Questions? Visit capitalone.com or call 1-877-383-4802.
            </p>
          </div>
          <div className="h-[1px] bg-slate-100 mt-4"></div>
          <div className="flex justify-end mt-2">
            <span className="text-[9px] text-slate-400">Receipt #{reference} · Capital One Digital Banking</span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="border-t border-slate-200 bg-slate-50/50 px-6 py-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(reference);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-[#005C9D] hover:bg-slate-100 rounded-lg transition-colors border border-[#005C9D]/30 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Copied' : 'Copy Ref'}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold text-[#005C9D] hover:bg-slate-100 rounded-lg transition-colors border border-[#005C9D]/30 cursor-pointer"
            >
              <Printer className="w-3 h-3" />
              Print
            </button>
          </div>
          {showEmailInput ? (
            <form onSubmit={handleEmailSend} className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2.5 bg-[#005C9D] hover:bg-[#00487D] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-colors text-xs font-semibold"
                >
                  {isSending ? 'Sending...' : 'Send Email'}
                </button>
              </div>
              {emailError && (
                <p className="mt-2 text-xs text-red-500">{emailError}</p>
              )}
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowEmailInput(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#005C9D] hover:bg-[#00487D] rounded-lg transition-colors shadow-md shadow-[#005C9D]/30 cursor-pointer"
            >
              <Mail className="w-3 h-3" />
              {sent ? 'Email Sent ✓' : 'Email Receipt'}
            </button>
          )}
        </div>

        {/* Close on backdrop click */}
        <button
          type="button"
          onClick={onClose}
          className="absolute inset-0 z-0"
          aria-label="Close receipt"
        />
      </div>
    </div>
  );
};

export default TransactionReceipt;