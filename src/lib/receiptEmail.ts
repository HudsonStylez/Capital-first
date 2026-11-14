// Client helper: build + send official Capital One receipt emails.
// The backend (Cloudflare Worker / Express) rebuilds the statement HTML from
// `receiptData` so the emailed receipt is identical to the in-app receipt.

type ReceiptAccount = {
  type: string;
  accountName?: string;
  accountNumber?: string;
  last4?: string;
  balanceBefore?: number;
  balanceAfter?: number;
  availableCredit?: number;
  creditLimit?: number;
  swiftCode?: string;
  minPaymentDue?: number;
};

type ReceiptTransaction = {
  referenceNumber: string;
  merchant: string;
  type: string;
  status: string;
  amount: number;
  date?: string;
  category?: string;
  destinationDetails?: string;
  adminFeedback?: string;
};

export function getApiBase(): string {
  const envBase =
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL;
  if (envBase) return envBase;
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin;
  }
  return 'http://localhost:3001';
}

export function buildReceiptData(
  holderName: string,
  transaction: ReceiptTransaction,
  account: ReceiptAccount
) {
  const last4 = account.last4 || (account.accountNumber || '').slice(-4) || '0000';
  const isCredit = account.type === 'credit';
  return {
    holderName,
    period: new Date(transaction.date || Date.now()).toLocaleDateString('en-US', {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    }),
    billingDays: 31,
    transaction,
    account: {
      accountName:
        account.accountName || (isCredit ? 'Capital One Platinum Mastercard' : '360 Checking'),
      accountType: account.type,
      last4,
      paymentDueDate: isCredit ? new Date(Date.now() + 12 * 864e5).toISOString() : undefined,
      minPaymentDue: isCredit ? account.minPaymentDue || 35 : undefined,
      swiftCode: account.swiftCode,
    },
    balances: {
      before: account.balanceBefore ?? transaction.amount,
      after: account.balanceAfter ?? transaction.amount,
      creditLimit: account.creditLimit,
      availableCredit: account.availableCredit,
      transactions: Math.abs(transaction.amount),
    },
  };
}

export async function sendReceiptEmail(params: {
  to: string;
  holderName: string;
  transaction: ReceiptTransaction;
  account: ReceiptAccount;
}): Promise<{ success: boolean; error?: string }> {
  const { to, holderName, transaction, account } = params;
  if (!to) return { success: false, error: 'No recipient email' };
  const receiptData = buildReceiptData(holderName, transaction, account);
  try {
    const res = await fetch(`${getApiBase()}/api/send-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to,
        subject: `Capital One Receipt — REF-${transaction.referenceNumber}`,
        holderName,
        transaction,
        account,
        receiptData,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return { success: false, error: data.error || 'Failed to send' };
    return { success: true };
  } catch (e) {
    return { success: false, error: e instanceof Error ? e.message : 'Network error' };
  }
}
