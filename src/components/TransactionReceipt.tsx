import React, { useState, useMemo, useRef } from 'react';
import { X, Copy, Send, Mail, Printer, Download, Share2, CheckCircle2, Loader2 } from 'lucide-react';
import { buildReceiptHTML } from '../lib/receiptTemplate.js';

interface TransactionReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: {
    id: string;
    referenceNumber: string;
    merchant: string;
    type: string;
    status: string;
    amount: number;
    date: string;
    category?: string;
    destinationDetails?: string;
    adminFeedback?: string;
  };
  account: {
    type: 'checking' | 'credit' | 'savings';
    accountName?: string;
    accountNumber: string;
    balanceBefore: number;
    balanceAfter: number;
    availableCredit?: number;
    creditLimit?: number;
    swiftCode?: string;
  };
  holderName?: string;
  defaultEmail?: string;
  onEmailSent?: () => void;
}

const API_BASE =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
    ? window.location.origin
    : 'http://localhost:3001');

export const TransactionReceipt: React.FC<TransactionReceiptProps> = ({
  isOpen,
  onClose,
  transaction,
  account,
  holderName,
  defaultEmail,
  onEmailSent,
}) => {
  const [copied, setCopied] = useState(false);
  const [emailAddress, setEmailAddress] = useState(defaultEmail || '');
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const reference = transaction.referenceNumber || `REF-CAP-${Math.floor(Math.random() * 900000) + 100000}`;

  const receiptData = useMemo(
    () => ({
      holderName: holderName || 'Capital One Customer',
      period: new Date(transaction.date || Date.now()).toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      }),
      billingDays: 31,
      transaction: { ...transaction, referenceNumber: reference },
      account: {
        accountName: account.accountName || (account.type === 'credit' ? 'Capital One Platinum Mastercard' : '360 Checking'),
        accountType: account.type,
        last4: account.accountNumber.slice(-4),
        paymentDueDate: account.type === 'credit' ? new Date(Date.now() + 12 * 864e5).toISOString() : undefined,
        minPaymentDue: account.type === 'credit' ? 35 : undefined,
        swiftCode: account.swiftCode,
      },
      balances: {
        before: account.balanceBefore,
        after: account.balanceAfter,
        creditLimit: account.creditLimit,
        availableCredit: account.availableCredit,
        transactions: Math.abs(transaction.amount),
      },
    }),
    [transaction, account, holderName, reference]
  );

  const html = useMemo(() => buildReceiptHTML(receiptData), [receiptData]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(reference);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CapitalOne-Receipt-${reference}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    const frame = iframeRef.current;
    if (frame && frame.contentWindow) {
      frame.contentWindow.focus();
      frame.contentWindow.print();
    } else {
      window.print();
    }
  };

  const handleShare = async () => {
    const shareText = `Capital One receipt ${reference} — ${transaction.merchant} (${transaction.status})`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Capital One Receipt', text: shareText });
      } else {
        await navigator.clipboard?.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* cancelled */
    }
  };

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
      const response = await fetch(`${API_BASE}/api/send-receipt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: emailAddress.trim(),
          subject: `Capital One Receipt — REF-${reference}`,
          holderName: holderName || 'Capital One Customer',
          transaction: { ...transaction, referenceNumber: reference },
          account,
          receiptData,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Failed to send email');
      setSent(true);
      onEmailSent?.();
      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      setEmailError(error instanceof Error ? error.message : 'Failed to send email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-[820px] max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#005C9D] flex items-center justify-center">
              <Mail className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-none">Official Transaction Receipt</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">REF {reference}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 cursor-pointer" aria-label="Close receipt">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Statement preview */}
        <div className="flex-1 overflow-hidden bg-[#EEF2F6]">
          <iframe ref={iframeRef} title="Capital One Receipt" srcDoc={html} className="w-full h-full min-h-[420px] border-0" />
        </div>

        {/* Actions */}
        <div className="border-t border-slate-200 bg-white px-4 py-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button type="button" onClick={handleDownload} className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#005C9D] hover:bg-slate-100 rounded-lg border border-[#005C9D]/30 cursor-pointer">
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            <button type="button" onClick={handlePrint} className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#005C9D] hover:bg-slate-100 rounded-lg border border-[#005C9D]/30 cursor-pointer">
              <Printer className="w-3.5 h-3.5" /> Print / PDF
            </button>
            <button type="button" onClick={handleShare} className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#005C9D] hover:bg-slate-100 rounded-lg border border-[#005C9D]/30 cursor-pointer">
              <Share2 className="w-3.5 h-3.5" /> Share
            </button>
            <button type="button" onClick={handleCopy} className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#005C9D] hover:bg-slate-100 rounded-lg border border-[#005C9D]/30 cursor-pointer">
              <Copy className="w-3.5 h-3.5" /> {copied ? 'Copied' : 'Copy Ref'}
            </button>
          </div>

          {showEmailInput ? (
            <form onSubmit={handleEmailSend} className="mt-3">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                />
                <button type="submit" disabled={isSending || sent} className="px-4 py-2.5 bg-[#005C9D] hover:bg-[#00487D] disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                  {isSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : sent ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                  {isSending ? 'Sending…' : sent ? 'Sent' : 'Send Email'}
                </button>
              </div>
              {emailError && <p className="mt-2 text-xs text-red-500">{emailError}</p>}
            </form>
          ) : (
            <button type="button" onClick={() => setShowEmailInput(true)} className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#005C9D] hover:bg-[#00487D] rounded-lg shadow-md shadow-[#005C9D]/30 cursor-pointer">
              <Mail className="w-3.5 h-3.5" /> Email Official Receipt
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionReceipt;
