import React, { useState } from 'react';
import { CapitalOneLogo } from '../components/CapitalOneLogo';
import {
  useAdminStore,
  User,
  PaymentOption,
  WithdrawalOption,
  SystemLog,
  Transaction,
  KycDocument,
} from '../store/AdminStore';
import { sendReceiptEmail } from '../lib/receiptEmail';
import {
  Users,
  CreditCard,
  Settings,
  LogOut,
  Search,
  Plus,
  Trash2,
  Lock,
  Unlock,
  KeyRound,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Save,
  X,
  Bell,
  RefreshCw,
  SlidersHorizontal,
  ScrollText,
  DollarSign,
  Send,
  Building,
  Sparkles,
  ArrowDownLeft,
  Receipt,
  Phone,
  MapPin,
  MessageSquare,
  FileText,
  RotateCcw,
  Check,
  Ban,
  ShieldCheck,
  ArrowLeft,
  Home,
  Clock,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigate: (path: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigate }) => {
  const {
    users,
    transactions,
    systemLogs,
    paymentOptions,
    withdrawalOptions,
    processingFeedbackMessage,
    withdrawalDisclaimer,
    notifications,
    resetPasswordPin,
    isAdmin,
    globalNotification,
    setAdminStatus,
    adminAdjustBalance,
    updateUserBalance,
    updateUserStatus,
    resetUserPassword,
    updateUserDetails,
    updateClientAccountNumbers,
    moderateTransaction,
    updateTransaction,
    reviewKycDocument,
    adminVerifyUserKyc,
    adminUpdateVirtualCard,
    adminDeleteVirtualCard,
    updateWithdrawalDisclaimer,
    deleteUser,
    addPaymentOption,
    updatePaymentOption,
    deletePaymentOption,
    togglePaymentOption,
    toggleWithdrawalOption,
    setProcessingFeedbackMessage,
    addNotification,
    deleteNotification,
    setResetPasswordPin,
    applyDefaultPasswordToAll,
    setGlobalNotification,
    clearAllData,
    deleteTransaction,
    giftCards,
    processGiftCardPayment,
    updateGiftCardStatus,
    updateGiftCardRate,
    resetDemoData,
    supportThreads,
    adminReplyToSupport,
    markSupportThreadRead,
    setSupportThreadStatus,
  } = useAdminStore();

  const [activeTab, setActiveTab] = useState<
    'users' | 'transactions' | 'kyc' | 'payment-settings' | 'notifications' | 'logs' | 'gift-cards' | 'support'
  >('users');

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [supportReply, setSupportReply] = useState('');

  const [userSearch, setUserSearch] = useState('');
  const [logSearch, setLogSearch] = useState('');
  const [txSearch, setTxSearch] = useState('');
  const [toastNotice, setToastNotice] = useState<string | null>(null);
  const [selectedUserForCards, setSelectedUserForCards] = useState<User | null>(null);

  // Gift card admin state
  const [giftRateDrafts, setGiftRateDrafts] = useState<Record<string, string>>({});
  const [convertingGiftId, setConvertingGiftId] = useState<string | null>(null);

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFirstName, setEditFirstName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editStreet, setEditStreet] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editZip, setEditZip] = useState('');
  const [editSsn, setEditSsn] = useState('');
  const [editDob, setEditDob] = useState('');
  const [editOccupation, setEditOccupation] = useState('');
  const [editAnnualIncome, setEditAnnualIncome] = useState('');
  const [editMonthlyIncome, setEditMonthlyIncome] = useState('');
  const [editMonthlySpendingGoal, setEditMonthlySpendingGoal] = useState('');
  const [editCheckingBalance, setEditCheckingBalance] = useState<number>(0);
  const [editCreditBalance, setEditCreditBalance] = useState<number>(0);
  const [editFullAccountNumber, setEditFullAccountNumber] = useState('');
  const [editRoutingNumber, setEditRoutingNumber] = useState('');
  const [editSwiftCode, setEditSwiftCode] = useState('');

  // Manual Ledger Adjustment Modal
  const [adjustingUser, setAdjustingUser] = useState<User | null>(null);
  const [adjustAccountId, setAdjustAccountId] = useState('');
  const [adjustAmount, setAdjustAmount] = useState('100.00');
  const [adjustType, setAdjustType] = useState<'add' | 'subtract'>('add');
  const [adjustReason, setAdjustReason] = useState('Customer Courtesy Credit');

  // Transaction Moderation Modal State (Accept, Decline, Refund)
  const [moderatingTx, setModeratingTx] = useState<Transaction | null>(null);
  const [moderationAction, setModerationAction] = useState<'Approve' | 'Decline' | 'Refund' | 'Pend'>('Approve');

  // Transaction edit-customize modal
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [editTxMerchant, setEditTxMerchant] = useState('');
  const [editTxAmount, setEditTxAmount] = useState('');
  const [editTxCategory, setEditTxCategory] = useState('');
  const [editTxStatus, setEditTxStatus] = useState<Transaction['status']>('Pending');
  const [editTxFeedback, setEditTxFeedback] = useState('');
  const [moderationFeedback, setModerationFeedback] = useState('');

  // KYC Review Feedback & Inspection Modal State
  const [reviewingKycDoc, setReviewingKycDoc] = useState<{ userId: string; doc: KycDocument } | null>(null);
  const [kycFeedbackInput, setKycFeedbackInput] = useState('');
  const [inspectingKycDoc, setInspectingKycDoc] = useState<{ user: User; doc: KycDocument } | null>(null);

  // Payment Options Form State
  const [isPayOptModalOpen, setIsPayOptModalOpen] = useState(false);
  const [editingOptId, setEditingOptId] = useState<string | null>(null);
  const [optName, setOptName] = useState('');
  const [optDescription, setOptDescription] = useState('');
  const [optType, setOptType] = useState<PaymentOption['type']>('Bank Transfer');
  const [optMin, setOptMin] = useState('1.00');
  const [optMax, setOptMax] = useState('10000.00');
  const [optFee, setOptFee] = useState('0.00');

  // Custom Processing Feedback Message State
  const [customProcMsgInput, setCustomProcMsgInput] = useState(processingFeedbackMessage);
  const [withdrawalDisclaimerInput, setWithdrawalDisclaimerInput] = useState(withdrawalDisclaimer);

  // Broadcast Notification State
  const [notifTitleInput, setNotifTitleInput] = useState('Scheduled System Maintenance');
  const [notifMessageInput, setNotifMessageInput] = useState(
    'Scheduled system maintenance on Sunday between 2:00 AM and 4:00 AM EST. Bill pay will remain queued.'
  );
  const [notifTypeInput, setNotifTypeInput] = useState<'maintenance' | 'security' | 'info'>('maintenance');

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Admin Authorization Required</h2>
          <p className="text-sm text-slate-400 mb-6">
            Enter the administrative passcode (123456) in the footer Google icon modal to access the command center.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full py-3 bg-[#005C9D] text-white font-bold rounded-lg hover:bg-[#00487D] cursor-pointer"
          >
            Return to Public Site
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setAdminStatus(false);
    onNavigate('/');
  };

  // Open Edit User Modal
  const handleOpenEditUser = (user: User) => {
    setEditingUser(user);
    setEditFirstName(user.firstName);
    setEditLastName(user.lastName);
    setEditUsername(user.username || '');
    setEditEmail(user.email || '');
    setEditPhone(user.phone || '');
    setEditStreet(user.address?.street || '');
    setEditCity(user.address?.city || '');
    setEditState(user.address?.state || '');
    setEditZip(user.address?.zip || '');
    setEditSsn(user.ssn);
    setEditDob(user.dob);
    setEditOccupation(user.occupation || 'Software Engineer');
    setEditAnnualIncome(user.annualIncome ? user.annualIncome.toString() : '95000');
    setEditMonthlyIncome(user.monthlyIncome ? user.monthlyIncome.toString() : '12402');
    setEditMonthlySpendingGoal(user.monthlySpendingGoal ? user.monthlySpendingGoal.toString() : '8392');

    const chk = user.accounts.find((a) => a.type === 'checking');
    const crd = user.accounts.find((a) => a.type === 'credit');
    setEditCheckingBalance(chk ? chk.balance : 0);
    setEditCreditBalance(crd ? crd.balance : 0);
    setEditFullAccountNumber(chk?.fullAccountNumber || `230491${chk?.accountNumber.replace(/\D/g, '') || '8201'}`);
    setEditRoutingNumber(chk?.routingNumber || user.routingNumber || '051405515');
    setEditSwiftCode(user.swiftCode || 'CAPOUS33');
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    // Update balances on checking and credit accounts
    const chk = editingUser.accounts.find((a) => a.type === 'checking');
    if (chk) {
      updateUserBalance(editingUser.id, chk.id, Number(editCheckingBalance));
      updateClientAccountNumbers(editingUser.id, chk.id, editFullAccountNumber, editRoutingNumber);
    }
    const crd = editingUser.accounts.find((a) => a.type === 'credit');
    if (crd) {
      updateUserBalance(editingUser.id, crd.id, Number(editCreditBalance));
    }

    // Update user profile details
    updateUserDetails(editingUser.id, {
      firstName: editFirstName,
      lastName: editLastName,
      username: editUsername,
      email: editEmail,
      phone: editPhone,
      ssn: editSsn,
      dob: editDob,
      occupation: editOccupation,
      annualIncome: parseFloat(editAnnualIncome) || 0,
      monthlyIncome: parseFloat(editMonthlyIncome) || 0,
      monthlySpendingGoal: parseFloat(editMonthlySpendingGoal) || 0,
      routingNumber: editRoutingNumber,
      swiftCode: editSwiftCode,
      address: {
        street: editStreet,
        city: editCity,
        state: editState,
        zip: editZip,
      },
    });

    setEditingUser(null);
    showToast(`Updated attributes, budget targets, account numbers, and balances for ${editFirstName} ${editLastName}.`);
  };

  // Execute Ledger Adjustment
  const handleExecuteLedgerAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingUser) return;

    const val = parseFloat(adjustAmount);
    if (isNaN(val) || val <= 0) {
      showToast('Please specify a positive adjustment amount.');
      return;
    }

    const delta = adjustType === 'add' ? val : -val;
    adminAdjustBalance(adjustingUser.id, adjustAccountId, delta, adjustReason);
    setAdjustingUser(null);
    showToast(`Ledger adjusted: ${delta >= 0 ? '+' : ''}$${delta.toFixed(2)} (${adjustReason}).`);
  };

  // Execute Transaction Moderation (Accept, Decline, Refund)
  const handleExecuteTransactionModeration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moderatingTx) return;

    moderateTransaction(moderatingTx.id, moderationAction, moderationFeedback.trim() || undefined);
    showToast(`Transaction ${moderatingTx.id} ${moderationAction}ed successfully.`);

    // Auto-send the official receipt to the client's registered email on approval
    if (moderationAction === 'Approve') {
      const user = users.find((u) => u.id === moderatingTx.userId);
      const account =
        user?.accounts.find((a) => a.type === (moderatingTx.type === 'Credit Card' ? 'credit' : 'checking')) ||
        user?.accounts[0];
      if (user?.email && account) {
        sendReceiptEmail({
          to: user.email,
          holderName: `${user.firstName} ${user.lastName}`,
          transaction: {
            referenceNumber: moderatingTx.referenceNumber,
            merchant: moderatingTx.merchant,
            type: moderatingTx.type,
            status: 'Completed',
            amount: moderatingTx.amount,
            date: new Date().toISOString(),
            category: moderatingTx.category,
            destinationDetails: moderatingTx.destinationDetails,
            adminFeedback: moderationFeedback.trim() || undefined,
          },
          account: {
            type: account.type,
            accountName: account.accountType,
            accountNumber: account.accountNumber,
            balanceBefore: account.balance,
            balanceAfter: account.balance,
            availableCredit: account.availableCredit,
            creditLimit: account.creditLimit,
            swiftCode: user.swiftCode,
          },
        }).then((r) =>
          showToast(
            r.success
              ? `Official receipt emailed to ${user.email}`
              : 'Receipt ready — add email keys to deliver automatically'
          )
        );
      }
    }

    setModeratingTx(null);
    setModerationFeedback('');
  };

  // Save customized transaction fields
  const handleSaveTransactionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTx) return;
    const amount = parseFloat(editTxAmount);
    updateTransaction(editingTx.id, {
      merchant: editTxMerchant.trim() || editingTx.merchant,
      amount: isNaN(amount) ? editingTx.amount : amount,
      category: editTxCategory.trim() || editingTx.category,
      status: editTxStatus,
      adminFeedback: editTxFeedback.trim() || undefined,
    });
    showToast(`Transaction ${editingTx.referenceNumber} updated.`);
    setEditingTx(null);
  };

  // Publish System Notification
  const handlePublishNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitleInput.trim() || !notifMessageInput.trim()) return;

    addNotification(notifTitleInput.trim(), notifMessageInput.trim(), notifTypeInput);
    showToast(`Published notification: "${notifTitleInput}"`);
    setNotifTitleInput('');
    setNotifMessageInput('');
  };

  // Save Processing Feedback Message & Disclaimer
  const handleSaveProcessingMsg = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessingFeedbackMessage(customProcMsgInput);
    updateWithdrawalDisclaimer(withdrawalDisclaimerInput);
    showToast('Updated spinner feedback message and withdrawal disclaimer.');
  };

  // Aggregate all submitted KYC docs across users
  const allKycSubmissions: { user: User; doc: KycDocument }[] = [];
  users.forEach((u) => {
    (u.kycDocuments || []).forEach((d) => {
      allKycSubmissions.push({ user: u, doc: d });
    });
  });

  // Filtered lists
  const filteredUsers = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.lastName.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.ssn.includes(userSearch) ||
      u.id.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredLogs = systemLogs.filter(
    (l) =>
      l.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      (l.userName && l.userName.toLowerCase().includes(logSearch.toLowerCase()))
  );

  const filteredTransactions = transactions.filter(
    (t) =>
      t.merchant.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.userName.toLowerCase().includes(txSearch.toLowerCase()) ||
      t.id.toLowerCase().includes(txSearch.toLowerCase()) ||
      (t.referenceNumber && t.referenceNumber.toLowerCase().includes(txSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans selection:bg-[#005C9D] selection:text-white">
      {/* ========================================================
          ADMIN SIDEBAR LAYOUT
          ======================================================== */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('/dashboard')}
              className="cursor-pointer hover:opacity-85 transition-opacity"
              title="Return to Consumer Banking"
            >
              <CapitalOneLogo variant="light" className="h-7" />
            </button>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 font-bold">
              ADMIN CENTER
            </span>
          </div>

          <nav className="p-4 space-y-1.5">
            {/* 1. User Management */}
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#005C9D] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>User Management</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {users.length}
              </span>
            </button>

            {/* 2. Transactions & Moderation */}
            <button
              type="button"
              onClick={() => setActiveTab('transactions')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-[#005C9D] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-4 h-4" />
                <span>Transactions &amp; Refunds</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {transactions.length}
              </span>
            </button>

            {/* 3. KYC Document Verifications */}
            <button
              type="button"
              onClick={() => setActiveTab('kyc')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'kyc'
                  ? 'bg-[#005C9D] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>KYC Verifications</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                {allKycSubmissions.filter((k) => k.doc.status === 'pending').length}
              </span>
            </button>

            {/* 4. Payment & Transfer Settings */}
            <button
              type="button"
              onClick={() => setActiveTab('payment-settings')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'payment-settings'
                  ? 'bg-[#005C9D] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Payment Settings</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {withdrawalOptions.length + paymentOptions.length}
              </span>
            </button>

            {/* 5. System Notifications */}
            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'notifications'
                  ? 'bg-[#005C9D] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>System Notices</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {notifications.length}
              </span>
            </button>

            {/* 6. Gift Cards */}
            <button
              type="button"
              onClick={() => setActiveTab('gift-cards')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'gift-cards'
                  ? 'bg-[#005C9D] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Gift Cards</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-amber-300">
                {giftCards.length}
              </span>
            </button>

            {/* 7. Support Chat */}
            <button
              type="button"
              onClick={() => setActiveTab('support')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'support'
                  ? 'bg-[#005C9D] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-sky-400" />
                <span>Support Chat</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-sky-300">
                {supportThreads.filter((t) => t.status === 'open').length}
              </span>
            </button>

            {/* 8. System Logs */}
            <button
              type="button"
              onClick={() => setActiveTab('logs')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-[#005C9D] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <ScrollText className="w-4 h-4" />
                <span>Audit Logs</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {systemLogs.length}
              </span>
            </button>

            {/* Consumer App & Public Site Shortcuts */}
            <div className="pt-3 mt-2 border-t border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 block">
                Quick Portals
              </span>
              <button
                type="button"
                onClick={() => onNavigate('/dashboard')}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-sky-400 hover:text-sky-300 hover:bg-slate-800 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Consumer Banking</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/')}
                className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Public Homepage</span>
              </button>
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer mt-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Admin Status:</span>
            <span className="text-emerald-400 font-bold">Authorized</span>
          </div>

          <div className="pt-2 border-t border-slate-800 flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => {
                resetDemoData();
                showToast('Demo data restored — all sample users, accounts, and activity reloaded.');
              }}
              className="w-full py-1.5 px-2 bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-[11px] font-semibold rounded cursor-pointer"
            >
              Restore Demo Data
            </button>
            <button
              type="button"
              onClick={() => {
                clearAllData();
                showToast('All users, logs, and transactions reset to zero.');
              }}
              className="w-full py-1.5 px-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 text-[11px] font-semibold rounded cursor-pointer"
            >
              Reset To Zero Data
            </button>
          </div>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              {activeTab === 'users' && 'User Management & Account Numbers'}
              {activeTab === 'transactions' && 'Global Ledger & Transaction Moderation'}
              {activeTab === 'kyc' && 'Identity Document Compliance Verification'}
              {activeTab === 'payment-settings' && 'Payment, Transfer & Disclaimer Settings'}
              {activeTab === 'notifications' && 'System Notifications Broadcast'}
              {activeTab === 'logs' && 'System Action Audit Log'}
              {activeTab === 'gift-cards' && 'Gift Card Conversion & Redemption Control'}
              {activeTab === 'support' && 'Human Support — Live Client Conversations'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live administrative command center with real-time consumer state synchronization.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/dashboard')}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-sky-300 transition-colors cursor-pointer"
          >
            Open Consumer Dashboard &rarr;
          </button>
        </header>

        {/* Global Toast */}
        {toastNotice && (
          <div className="mb-4 p-3 bg-emerald-950/90 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastNotice}</span>
            </div>
            <button onClick={() => setToastNotice(null)} className="text-emerald-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ========================================================
            TAB 1: USER MANAGEMENT & ACCOUNT NUMBER CONTROLS
            ======================================================== */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search by name, SSN, email, username..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D] text-white"
                />
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onNavigate('/enroll')}
                  className="px-3.5 py-2 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enroll New User</span>
                </button>
              </div>
            </div>

            {users.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 space-y-3">
                <Users className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-sm font-bold text-slate-200">Zero Dummy Data &mdash; Directory Clean</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  The system starts empty. Create an account via <code className="text-sky-300">/enroll</code> (with referral code starts at $500, without starts at $0).
                </p>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate('/enroll')}
                    className="px-4 py-2 bg-[#005C9D] text-white text-xs font-bold rounded cursor-pointer"
                  >
                    Go to /enroll
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Customer Name</th>
                        <th className="py-3 px-4">Account &amp; Routing Numbers</th>
                        <th className="py-3 px-4">Checking</th>
                        <th className="py-3 px-4">Credit</th>
                        <th className="py-3 px-4">KYC Status</th>
                        <th className="py-3 px-4">Account Status</th>
                        <th className="py-3 px-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {filteredUsers.map((u) => {
                        const chk = u.accounts.find((a) => a.type === 'checking');
                        const crd = u.accounts.find((a) => a.type === 'credit');

                        return (
                          <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-4 font-bold text-white">
                              <div>
                                <span>{u.firstName} {u.lastName}</span>
                                <span className="text-[10px] text-slate-400 block font-mono font-normal">
                                  @{u.username} · {u.email}
                                </span>
                                <span className="text-[10px] text-sky-300 block font-normal">
                                  {u.occupation || 'Software Engineer'} &middot; SSN: ***-**-{u.ssn ? u.ssn.slice(-4) : '****'}
                                </span>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  Annual Inc: ${(u.annualIncome || 95000).toLocaleString()} &middot; Mo: +${(u.monthlyIncome || 12402).toLocaleString()}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">
                              <div>
                                <span className="text-white font-bold block">
                                  Acct: {chk?.fullAccountNumber || `230491${chk?.accountNumber.slice(-4)}`}
                                </span>
                                <span className="text-slate-400 text-[10px] block">
                                  Routing: {chk?.routingNumber || u.routingNumber || '051405515'}
                                </span>
                                <span className="text-slate-400 text-[10px] block">
                                  SWIFT: {u.swiftCode || 'CAPOUS33'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                              ${(chk?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-sky-400">
                              ${(crd?.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-col gap-1 items-start">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                    u.kycStatus === 'verified'
                                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                      : u.kycStatus === 'pending'
                                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                      : 'bg-slate-800 text-slate-400'
                                  }`}
                                >
                                  {u.kycStatus || 'not_submitted'}
                                </span>
                                {u.kycStatus !== 'verified' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      adminVerifyUserKyc(u.id);
                                      showToast(`Verified & unlocked withdrawals for ${u.firstName} ${u.lastName}.`);
                                    }}
                                    className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                                    title="1-Click Approve KYC and Unlock Withdrawals"
                                  >
                                    Verify Now
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  u.status === 'Active'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-red-950 text-red-300 border border-red-800'
                                }`}
                              >
                                {u.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* View & Manage Virtual Cards */}
                                <button
                                  type="button"
                                  onClick={() => setSelectedUserForCards(u)}
                                  className="px-2 py-1 bg-sky-950/70 hover:bg-sky-900 text-sky-200 border border-sky-800 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="Manage Generated Virtual Cards"
                                >
                                  <CreditCard className="w-3 h-3" />
                                  <span>Cards ({u.virtualCards?.length || 0})</span>
                                </button>

                                {/* Edit User & Account Numbers */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditUser(u)}
                                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="Edit Profile, Account Number & Balances"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>

                                {/* Manual Ledger Adjustment */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setAdjustingUser(u);
                                    setAdjustAccountId(u.accounts[0]?.id || '');
                                  }}
                                  className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-900 text-emerald-200 border border-emerald-800 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="Adjust Funds on Account"
                                >
                                  <DollarSign className="w-3 h-3" />
                                  <span>Adjust</span>
                                </button>

                                {/* Lock / Unlock Account */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = u.status === 'Locked' ? 'Active' : 'Locked';
                                    updateUserStatus(u.id, next);
                                    showToast(`${u.firstName} ${u.lastName} is now ${next}.`);
                                  }}
                                  className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                                    u.status === 'Locked'
                                      ? 'bg-emerald-900/60 text-emerald-200'
                                      : 'bg-red-950 text-red-200'
                                  }`}
                                  title={u.status === 'Locked' ? 'Unlock Account' : 'Lock Account'}
                                >
                                  {u.status === 'Locked' ? (
                                    <>
                                      <Unlock className="w-3 h-3" />
                                      <span>Unlock</span>
                                    </>
                                  ) : (
                                    <>
                                      <Lock className="w-3 h-3" />
                                      <span>Lock</span>
                                    </>
                                  )}
                                </button>

                                {/* Reset Password to 0000 */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    resetUserPassword(u.id);
                                    showToast(`Reset password for ${u.username} to ${resetPasswordPin}.`);
                                  }}
                                  className="px-2 py-1 bg-purple-950/60 hover:bg-purple-900 text-purple-200 rounded text-xs font-semibold cursor-pointer"
                                  title="Reset password to 0000"
                                >
                                  Reset PIN
                                </button>

                                {/* Delete User */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    deleteUser(u.id);
                                    showToast(`Deleted ${u.firstName} ${u.lastName}.`);
                                  }}
                                  className="p-1 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 rounded cursor-pointer"
                                  title="Delete User"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: TRANSACTIONS & MODERATION (ACCEPT, DECLINE, REFUND)
            ======================================================== */}
        {activeTab === 'transactions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Transactions Moderation &amp; Refunds</h3>
                <p className="text-xs text-slate-400">
                  Accept, Decline, or Refund any customer transaction with custom administrative feedback notes.
                </p>
              </div>
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={txSearch}
                  onChange={(e) => setTxSearch(e.target.value)}
                  placeholder="Search ledger by REF, name..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-[#005C9D]"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">TX ID / REF</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Description</th>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredTransactions.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          No transactions recorded yet.
                        </td>
                      </tr>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-800/40">
                          <td className="py-2.5 px-4 font-mono text-slate-400">
                            <div>
                              <span className="text-white font-bold block">{tx.id}</span>
                              <span className="text-[10px] text-slate-400">{tx.referenceNumber || 'REF-CAP-GEN'}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-4 font-bold text-white">{tx.userName}</td>
                          <td className="py-2.5 px-4 text-slate-300">
                            <div>
                              <span>{tx.merchant}</span>
                              {tx.destinationDetails && (
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  {tx.destinationDetails}
                                </span>
                              )}
                              {tx.adminFeedback && (
                                <span className="text-[10px] text-amber-400 block font-semibold mt-0.5">
                                  Note: {tx.adminFeedback}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-4 font-mono">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                tx.type === 'Deposit'
                                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                  : tx.type === 'Withdrawal'
                                  ? 'bg-red-950 text-red-300 border border-red-800'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {tx.type}
                            </span>
                          </td>
                          <td
                            className={`py-2.5 px-4 font-mono font-bold ${
                              tx.type === 'Deposit' ? 'text-emerald-400' : 'text-white'
                            }`}
                          >
                            {tx.type === 'Deposit' ? '+' : '-'}${tx.amount.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-4 font-mono">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                tx.status === 'Completed'
                                  ? 'text-emerald-400 bg-emerald-950/40'
                                  : tx.status === 'Declined'
                                  ? 'text-red-400 bg-red-950/40'
                                  : tx.status === 'Refunded'
                                  ? 'text-purple-400 bg-purple-950/40'
                                  : 'text-amber-400 bg-amber-950/40'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Approve / Accept */}
                              <button
                                type="button"
                                onClick={() => {
                                  setModeratingTx(tx);
                                  setModerationAction('Approve');
                                  setModerationFeedback('Transaction reviewed and approved by Capital One Treasury.');
                                }}
                                className="px-2 py-1 bg-emerald-950/70 hover:bg-emerald-900 text-emerald-300 text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                                title="Approve Transaction"
                              >
                                <Check className="w-3 h-3" />
                                <span>Accept</span>
                              </button>

                              {/* Decline / Reject */}
                              <button
                                type="button"
                                onClick={() => {
                                  setModeratingTx(tx);
                                  setModerationAction('Decline');
                                  setModerationFeedback('Declined due to ACH routing mismatch or fraud protection.');
                                }}
                                className="px-2 py-1 bg-red-950/70 hover:bg-red-900 text-red-300 text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                                title="Decline Transaction"
                              >
                                <Ban className="w-3 h-3" />
                                <span>Decline</span>
                              </button>

                              {/* Refund */}
                              <button
                                type="button"
                                onClick={() => {
                                  setModeratingTx(tx);
                                  setModerationAction('Refund');
                                  setModerationFeedback('Full customer courtesy refund issued to account balance.');
                                }}
                                className="px-2 py-1 bg-purple-950/70 hover:bg-purple-900 text-purple-300 text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                                title="Issue Refund to Client"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Refund</span>
                              </button>

                              {/* Pend / Hold */}
                              <button
                                type="button"
                                onClick={() => {
                                  setModeratingTx(tx);
                                  setModerationAction('Pend');
                                  setModerationFeedback('Transaction placed on hold pending further compliance review.');
                                }}
                                className="px-2 py-1 bg-amber-950/70 hover:bg-amber-900 text-amber-300 text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
                                title="Set Transaction Pending"
                              >
                                <Clock className="w-3 h-3" />
                                <span>Pend</span>
                              </button>

                              {/* Edit / Customize */}
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTx(tx);
                                  setEditTxMerchant(tx.merchant);
                                  setEditTxAmount(String(tx.amount));
                                  setEditTxCategory(tx.category || '');
                                  setEditTxStatus(tx.status);
                                  setEditTxFeedback(tx.adminFeedback || '');
                                }}
                                className="p-1 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded cursor-pointer"
                                title="Edit / Customize Transaction"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => deleteTransaction(tx.id)}
                                className="p-1 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-300 rounded cursor-pointer"
                                title="Delete Record"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: KYC COMPLIANCE VERIFICATION QUEUE
            ======================================================== */}
        {activeTab === 'kyc' && (
          <div className="space-y-4 max-w-5xl">
            <div>
              <h3 className="text-base font-bold text-white">KYC Document Verification Queue</h3>
              <p className="text-xs text-slate-400">
                Review submitted Government IDs, Passports, and Utility Bills before authorizing account number activation.
              </p>
            </div>

            {allKycSubmissions.length === 0 ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400 space-y-2">
                <ShieldCheck className="w-10 h-10 text-slate-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-300">No KYC Documents Submitted Yet</h4>
                <p className="text-xs text-slate-500">
                  Users can upload documents in the Consumer Dashboard to submit for Administrative review.
                </p>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Document Type</th>
                      <th className="py-3 px-4">File Name</th>
                      <th className="py-3 px-4">Submitted</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Review Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {allKycSubmissions.map(({ user, doc }) => (
                      <tr key={doc.id} className="hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <span className="font-bold text-white block">
                            {user.firstName} {user.lastName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">SSN: {user.ssn}</span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-sky-300">{doc.docTypeName}</td>
                        <td className="py-3 px-4 font-mono text-slate-300">{doc.fileName}</td>
                        <td className="py-3 px-4 text-slate-400">{doc.uploadedAt}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              doc.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : doc.status === 'rejected'
                                ? 'bg-red-950 text-red-300 border border-red-800'
                                : 'bg-amber-950 text-amber-300 border border-amber-800'
                            }`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setInspectingKycDoc({ user, doc })}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-300 text-xs font-bold rounded cursor-pointer"
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                reviewKycDocument(user.id, doc.id, 'approved', 'Document verified successfully.');
                                showToast(`Approved KYC for ${user.firstName} ${user.lastName}.`);
                              }}
                              className="px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 text-xs font-bold rounded cursor-pointer"
                            >
                              Approve Doc
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                adminVerifyUserKyc(user.id);
                                showToast(`Verified account & unlocked withdrawals for ${user.firstName} ${user.lastName}.`);
                              }}
                              className="px-2.5 py-1 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded cursor-pointer"
                              title="1-Click Approve Entire User Account & Unlock Withdrawals"
                            >
                              Verify Account
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setReviewingKycDoc({ userId: user.id, doc });
                                setKycFeedbackInput('Image blurry / Address mismatch');
                              }}
                              className="px-2.5 py-1 bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold rounded cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: PAYMENT, TRANSFER & DISCLAIMER SETTINGS
            ======================================================== */}
        {activeTab === 'payment-settings' && (
          <div className="space-y-6 max-w-4xl">
            {/* Section 1: 3-Second Processing Feedback Message */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-base font-bold text-white">
                    Processing Spinner Message &amp; Withdrawal Disclaimer
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control the text displayed during simulated transfer spinners and withdrawal risk disclaimers.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveProcessingMsg} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    3-Second Network Spinner Feedback Message
                  </label>
                  <input
                    type="text"
                    required
                    value={customProcMsgInput}
                    onChange={(e) => setCustomProcMsgInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Withdrawal Notice &amp; Payment Fluctuation Disclaimer (Displayed in Modal)
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={withdrawalDisclaimerInput}
                    onChange={(e) => setWithdrawalDisclaimerInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Withdrawal Destinations (Toggle ON/OFF) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Withdrawal &amp; Transfer Destinations</h3>
                <p className="text-xs text-slate-400">
                  Toggle external destinations ON/OFF. Disabled rails will not appear in the consumer withdrawal modal.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {withdrawalOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      opt.enabled
                        ? 'bg-slate-950 border-slate-800'
                        : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-white block">{opt.name}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{opt.description}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleWithdrawalOption(opt.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                        opt.enabled
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.enabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: Bill Payment Options (Toggle ON/OFF) */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-base font-bold text-white">Bill Payment Methods</h3>
                <p className="text-xs text-slate-400">
                  Configure payment rails available for credit card settlement.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paymentOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      opt.enabled
                        ? 'bg-slate-950 border-slate-800'
                        : 'bg-slate-950/40 border-slate-800/40 opacity-60'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-xs text-white block">{opt.name}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{opt.description}</span>
                      <span className="text-[10px] font-mono text-slate-400 mt-1 inline-block">
                        Limits: ${opt.minLimit} &mdash; ${opt.maxLimit.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePaymentOption(opt.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors ${
                        opt.enabled
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {opt.enabled ? 'ON' : 'OFF'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: SYSTEM NOTIFICATIONS BROADCAST
            ======================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-3xl">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Publish Broadcast Notice</h3>
                  <p className="text-xs text-slate-400">
                    When published, this message will immediately populate in the user's header Notification Bell drawer.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePublishNotification} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Announcement Title
                  </label>
                  <input
                    type="text"
                    required
                    value={notifTitleInput}
                    onChange={(e) => setNotifTitleInput(e.target.value)}
                    placeholder="e.g. Scheduled System Maintenance"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Notification Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={notifMessageInput}
                    onChange={(e) => setNotifMessageInput(e.target.value)}
                    placeholder="e.g. Scheduled system maintenance on Sunday between 2:00 AM and 4:00 AM EST."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Category:</span>
                    <select
                      value={notifTypeInput}
                      onChange={(e) =>
                        setNotifTypeInput(e.target.value as 'maintenance' | 'security' | 'info')
                      }
                      className="text-xs bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-slate-300"
                    >
                      <option value="maintenance">Maintenance</option>
                      <option value="security">Security</option>
                      <option value="info">General Info</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Publish Notification
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: GIFT CARDS — CONVERSION & REDEMPTION CONTROL
            ======================================================== */}
        {activeTab === 'gift-cards' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Gift Cards', value: giftCards.length, color: 'text-white' },
                { label: 'Pending Review', value: giftCards.filter((g) => g.status === 'pending').length, color: 'text-amber-300' },
                { label: 'Approved', value: giftCards.filter((g) => g.status === 'approved').length, color: 'text-emerald-300' },
                { label: 'Redeemed', value: giftCards.filter((g) => g.status === 'redeemed').length, color: 'text-sky-300' },
              ].map((s) => (
                <div key={s.label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">{s.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Gift Card Conversion Control</h3>
                <p className="text-xs text-slate-400">
                  Approve, set the USD conversion rate, and redeem customer gift cards. Redemption credits the customer's account instantly.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {giftCards.length === 0 && (
                <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-8 text-center text-slate-400 text-sm">
                  No gift cards submitted yet.
                </div>
              )}
              {giftCards.map((g) => {
                const owner = users.find((u) => u.id === g.userId);
                const ownerName = owner ? `${owner.firstName} ${owner.lastName}` : 'Unknown User';
                const rateDraft = giftRateDrafts[g.id] ?? String(g.usdConversionRate);
                const projectedUsd = (Math.max(0, g.remainingBalance) * (parseFloat(rateDraft) || 0)).toFixed(2);
                const statusStyle =
                  g.status === 'approved'
                    ? 'bg-emerald-900/50 text-emerald-300 border-emerald-700'
                    : g.status === 'pending'
                    ? 'bg-amber-900/50 text-amber-300 border-amber-700'
                    : g.status === 'redeemed'
                    ? 'bg-sky-900/50 text-sky-300 border-sky-700'
                    : 'bg-red-900/50 text-red-300 border-red-700';
                return (
                  <div key={g.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-600/40 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-amber-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white">{g.cardName}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyle}`}>
                              {g.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {ownerName} · •••• {g.last4} · Card {g.cardNumber}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Original ${g.originalBalance.toFixed(2)} · Remaining ${g.remainingBalance.toFixed(2)}
                          </p>
                          {g.adminNote && (
                            <p className="text-[11px] text-slate-400 italic mt-1">Note: {g.adminNote}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-stretch md:items-end gap-2 min-w-[220px]">
                        <div className="flex items-center gap-2">
                          <label className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold whitespace-nowrap">
                            USD Rate
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={rateDraft}
                            onChange={(e) =>
                              setGiftRateDrafts((prev) => ({ ...prev, [g.id]: e.target.value }))
                            }
                            disabled={g.status === 'redeemed' || g.status === 'rejected'}
                            className="w-24 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#005C9D] disabled:opacity-50"
                          />
                          <span className="text-xs text-emerald-300 font-semibold whitespace-nowrap">
                            ≈ ${projectedUsd}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap md:justify-end">
                          {g.status !== 'redeemed' && g.status !== 'rejected' && (
                            <button
                              type="button"
                              onClick={() => {
                                updateGiftCardRate(g.id, parseFloat(rateDraft) || 0);
                                showToast(`Conversion rate updated for ${g.cardName}.`);
                              }}
                              className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-semibold rounded cursor-pointer"
                            >
                              Save Rate
                            </button>
                          )}
                          {g.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  updateGiftCardStatus(g.id, 'approved');
                                  showToast(`${g.cardName} approved.`);
                                }}
                                className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold rounded cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateGiftCardStatus(g.id, 'rejected');
                                  showToast(`${g.cardName} rejected.`);
                                }}
                                className="px-2.5 py-1.5 bg-red-800 hover:bg-red-700 text-white text-[11px] font-semibold rounded cursor-pointer flex items-center gap-1"
                              >
                                <Ban className="w-3 h-3" /> Reject
                              </button>
                            </>
                          )}
                          {g.status === 'approved' && (
                            <button
                              type="button"
                              disabled={convertingGiftId === g.id}
                              onClick={async () => {
                                setConvertingGiftId(g.id);
                                const rate = parseFloat(rateDraft) || g.usdConversionRate || 1;
                                const ok = await processGiftCardPayment(
                                  g.userId,
                                  g.cardName,
                                  g.cardNumber,
                                  g.remainingBalance,
                                  rate
                                );
                                setConvertingGiftId(null);
                                showToast(ok ? `${g.cardName} redeemed — $${projectedUsd} credited.` : 'Redemption failed.');
                                if (ok) {
                                  const owner2 = users.find((u) => u.id === g.userId);
                                  const acct2 = owner2?.accounts.find((a) => a.type === 'checking') || owner2?.accounts[0];
                                  if (owner2?.email && acct2) {
                                    sendReceiptEmail({
                                      to: owner2.email,
                                      holderName: `${owner2.firstName} ${owner2.lastName}`,
                                      transaction: {
                                        referenceNumber: `REF-GIFT-${g.last4}`,
                                        merchant: `Gift Card: ${g.cardName}`,
                                        type: 'Deposit',
                                        status: 'Completed',
                                        amount: Number(projectedUsd),
                                        date: new Date().toISOString(),
                                        category: 'Gift Card Redemption',
                                        destinationDetails: `Gift Card •••• ${g.last4} converted at ${rate}x`,
                                      },
                                      account: {
                                        type: acct2.type,
                                        accountName: acct2.accountType,
                                        accountNumber: acct2.accountNumber,
                                        balanceBefore: acct2.balance - Number(projectedUsd),
                                        balanceAfter: acct2.balance,
                                        availableCredit: acct2.availableCredit,
                                        creditLimit: acct2.creditLimit,
                                        swiftCode: owner2.swiftCode,
                                      },
                                    }).then((r) => r.success && showToast(`Receipt emailed to ${owner2.email}`));
                                  }
                                }
                              }}
                              className="px-2.5 py-1.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-[11px] font-semibold rounded cursor-pointer flex items-center gap-1 disabled:opacity-50"
                            >
                              <DollarSign className="w-3 h-3" />
                              {convertingGiftId === g.id ? 'Converting…' : 'Convert & Redeem'}
                            </button>
                          )}
                          {(g.status === 'redeemed' || g.status === 'rejected') && (
                            <button
                              type="button"
                              onClick={() => {
                                updateGiftCardStatus(g.id, 'pending');
                                showToast(`${g.cardName} returned to pending review.`);
                              }}
                              className="px-2.5 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-semibold rounded cursor-pointer flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" /> Reopen
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB: HUMAN SUPPORT — LIVE CLIENT CONVERSATIONS
            ======================================================== */}
        {activeTab === 'support' && (
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
            {/* Thread list */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-700">
                <h3 className="text-sm font-bold text-white">Conversations</h3>
                <p className="text-[11px] text-slate-400">{supportThreads.length} total</p>
              </div>
              <div className="divide-y divide-slate-700/70 max-h-[560px] overflow-y-auto">
                {supportThreads.length === 0 && (
                  <div className="p-4 text-xs text-slate-400">No support conversations yet.</div>
                )}
                {supportThreads.map((t) => {
                  const last = t.messages[t.messages.length - 1];
                  const unread = t.messages.filter((m) => m.sender === 'user' && !m.read).length;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedThreadId(t.id);
                        setSupportReply('');
                        markSupportThreadRead(t.id, 'admin');
                      }}
                      className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                        selectedThreadId === t.id ? 'bg-slate-700/70' : 'hover:bg-slate-700/40'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white truncate">{t.userName}</span>
                        {unread > 0 && (
                          <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-[#DA291C] text-white text-[10px] font-bold flex items-center justify-center">
                            {unread}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{t.subject}</p>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">{last?.text || ''}</p>
                      <span
                        className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          t.status === 'open' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Conversation pane */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col min-h-[420px]">
              {!selectedThreadId ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-sm p-8">
                  <MessageSquare className="w-10 h-10 mb-3 text-slate-600" />
                  Select a conversation to reply as a human agent.
                </div>
              ) : (
                (() => {
                  const thread = supportThreads.find((t) => t.id === selectedThreadId);
                  if (!thread) return null;
                  return (
                    <>
                      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-white">{thread.userName}</h3>
                          <p className="text-[11px] text-slate-400">{thread.userEmail || 'No email on file'} · {thread.subject}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setSupportThreadStatus(thread.id, thread.status === 'open' ? 'resolved' : 'open')
                          }
                          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-semibold rounded cursor-pointer"
                        >
                          {thread.status === 'open' ? 'Mark Resolved' : 'Reopen'}
                        </button>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {thread.messages.map((m) => {
                          const isAdmin = m.sender === 'admin';
                          return (
                            <div key={m.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                              <div
                                className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                                  isAdmin
                                    ? 'bg-[#005C9D] text-white rounded-br-sm'
                                    : 'bg-slate-700 text-slate-100 rounded-bl-sm'
                                }`}
                              >
                                <div className="text-[10px] font-bold mb-0.5 opacity-80">{m.senderName}</div>
                                <p className="whitespace-pre-wrap">{m.text}</p>
                                <div className="text-[9px] mt-1 opacity-60">{m.timestamp}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!supportReply.trim()) return;
                          adminReplyToSupport(thread.id, supportReply.trim());
                          setSupportReply('');
                          showToast(`Reply sent to ${thread.userName}`);
                        }}
                        className="p-3 border-t border-slate-700 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={supportReply}
                          onChange={(e) => setSupportReply(e.target.value)}
                          placeholder={`Reply to ${thread.userName}…`}
                          className="flex-1 bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                        />
                        <button
                          type="submit"
                          disabled={!supportReply.trim()}
                          className="px-4 py-2 bg-[#005C9D] hover:bg-[#00487D] disabled:opacity-40 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" /> Send
                        </button>
                      </form>
                    </>
                  );
                })()
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: SYSTEM AUDIT LOGS
            ======================================================== */}
        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">System Security &amp; Ledger Audit Trail</h3>
                <p className="text-xs text-slate-400">Immutable chronological record of administrative actions.</p>
              </div>
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={logSearch}
                  onChange={(e) => setLogSearch(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white"
                />
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-500">
                        Audit log initialized and recording system events.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 px-4 font-mono text-slate-400">{l.timestamp}</td>
                        <td className="py-2.5 px-4 font-mono font-bold text-sky-400">{l.action}</td>
                        <td className="py-2.5 px-4 text-slate-300">{l.details}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          MODAL: EDIT USER ATTRIBUTES & CLIENT ACCOUNT NUMBERS
          ======================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base">
                Edit User &amp; Account Numbers &mdash; {editingUser.firstName} {editingUser.lastName}
              </h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUserEdit} className="space-y-4 text-xs">
              {/* Account Numbers Direct Editing (Rule 5) */}
              <div className="p-3.5 bg-slate-950 border border-sky-800/60 rounded-xl space-y-3">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                  Client Bank Account &amp; Wire Overrides
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Full 360 Checking Account Number</label>
                    <input
                      type="text"
                      required
                      value={editFullAccountNumber}
                      onChange={(e) => setEditFullAccountNumber(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Routing Transit Number (ABA)</label>
                    <input
                      type="text"
                      maxLength={9}
                      required
                      value={editRoutingNumber}
                      onChange={(e) => setEditRoutingNumber(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">International SWIFT Code</label>
                    <input
                      type="text"
                      required
                      value={editSwiftCode}
                      onChange={(e) => setEditSwiftCode(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Balances */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Account Balances
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Checking Balance ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editCheckingBalance}
                      onChange={(e) => setEditCheckingBalance(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono text-emerald-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Credit Card Balance ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editCreditBalance}
                      onChange={(e) => setEditCreditBalance(parseFloat(e.target.value) || 0)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono text-sky-400 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Monthly Budget Goals */}
              <div className="p-3.5 bg-slate-950 border border-indigo-900/60 rounded-xl space-y-3">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  Monthly Budget &amp; Financial Targets
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">Monthly Income ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={editMonthlyIncome}
                      onChange={(e) => setEditMonthlyIncome(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono text-emerald-400 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Monthly Spending Goal ($)</label>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={editMonthlySpendingGoal}
                      onChange={(e) => setEditMonthlySpendingGoal(e.target.value)}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded font-mono text-red-400 font-semibold"
                    />
                  </div>
                </div>
              </div>

              {/* Personal Identity Details */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Username</label>
                  <input
                    type="text"
                    required
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">SSN (Social Security)</label>
                  <input
                    type="text"
                    required
                    value={editSsn}
                    onChange={(e) => setEditSsn(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    value={editDob}
                    onChange={(e) => setEditDob(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded font-mono"
                  />
                </div>
              </div>

              {/* Career & Income */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Occupation / Industry</label>
                  <input
                    type="text"
                    value={editOccupation}
                    onChange={(e) => setEditOccupation(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Annual Household Income ($)</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={editAnnualIncome}
                    onChange={(e) => setEditAnnualIncome(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded font-mono font-semibold"
                  />
                </div>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
                  />
                </div>
              </div>

              {/* Residential Address */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <label className="block text-slate-400 font-semibold">Residential Address</label>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={editStreet}
                  onChange={(e) => setEditStreet(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded"
                />
                <div className="grid grid-cols-6 gap-2">
                  <input
                    type="text"
                    placeholder="City"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="col-span-3 p-2 bg-slate-950 border border-slate-700 rounded"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="col-span-1 p-2 bg-slate-950 border border-slate-700 rounded"
                  />
                  <input
                    type="text"
                    placeholder="ZIP"
                    value={editZip}
                    onChange={(e) => setEditZip(e.target.value)}
                    className="col-span-2 p-2 bg-slate-950 border border-slate-700 rounded"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold rounded cursor-pointer shadow-sm"
                >
                  Save User &amp; Accounts
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TRANSACTION MODERATION (ACCEPT, DECLINE, REFUND)
          ======================================================== */}
      {moderatingTx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base">
                {moderationAction} Transaction &mdash; {moderatingTx.id}
              </h3>
              <button onClick={() => setModeratingTx(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs mb-4 space-y-1">
              <div>
                <span className="text-slate-400">Customer:</span>{' '}
                <strong className="text-white">{moderatingTx.userName}</strong>
              </div>
              <div>
                <span className="text-slate-400">Merchant / Transfer:</span>{' '}
                <span className="text-slate-200">{moderatingTx.merchant}</span>
              </div>
              <div>
                <span className="text-slate-400">Amount:</span>{' '}
                <span className="text-emerald-400 font-mono font-bold">${moderatingTx.amount.toFixed(2)}</span>
              </div>
            </div>

            <form onSubmit={handleExecuteTransactionModeration} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Confirmation Message / Feedback Note (Emailed to Customer)
                </label>
                <textarea
                  rows={3}
                  required
                  value={moderationFeedback}
                  onChange={(e) => setModerationFeedback(e.target.value)}
                  placeholder="Provide explanation or confirmation for the user..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModeratingTx(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded cursor-pointer ${
                    moderationAction === 'Approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : moderationAction === 'Refund'
                      ? 'bg-purple-600 hover:bg-purple-700'
                      : moderationAction === 'Pend'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirm {moderationAction}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: EDIT / CUSTOMIZE TRANSACTION
          ======================================================== */}
      {editingTx && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-sky-400" /> Customize Transaction
              </h3>
              <button onClick={() => setEditingTx(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTransactionEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Merchant / Description</label>
                <input
                  type="text"
                  value={editTxMerchant}
                  onChange={(e) => setEditTxMerchant(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editTxAmount}
                    onChange={(e) => setEditTxAmount(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status</label>
                  <select
                    value={editTxStatus}
                    onChange={(e) => setEditTxStatus(e.target.value as Transaction['status'])}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  >
                    {['Completed', 'Pending', 'Declined', 'Refunded'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Category</label>
                <input
                  type="text"
                  value={editTxCategory}
                  onChange={(e) => setEditTxCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-bold mb-1">Administrative Note</label>
                <textarea
                  rows={2}
                  value={editTxFeedback}
                  onChange={(e) => setEditTxFeedback(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-lg text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTx(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold rounded cursor-pointer">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: KYC REJECTION REASON MODAL
          ======================================================== */}
      {reviewingKycDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative animate-in zoom-in-95">
            <h3 className="font-bold text-base mb-3">Reject KYC Document</h3>
            <p className="text-xs text-slate-400 mb-3">
              Provide the customer with the specific reason for rejecting {reviewingKycDoc.doc.fileName}.
            </p>
            <input
              type="text"
              value={kycFeedbackInput}
              onChange={(e) => setKycFeedbackInput(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded text-xs text-white mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReviewingKycDoc(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  reviewKycDocument(reviewingKycDoc.userId, reviewingKycDoc.doc.id, 'rejected', kycFeedbackInput);
                  showToast('KYC rejected with note sent to user.');
                  setReviewingKycDoc(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
              >
                Send Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: INSPECT SUBMITTED KYC DOCUMENT PACKAGE
          ======================================================== */}
      {inspectingKycDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-white shadow-2xl relative animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base text-white">Compliance Inspection: {inspectingKycDoc.doc.docTypeName}</h3>
                  <span className="text-[11px] text-slate-400">
                    User: {inspectingKycDoc.user.firstName} {inspectingKycDoc.user.lastName} (SSN: {inspectingKycDoc.user.ssn})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingKycDoc(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Document Preview Card */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 mb-4">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                <span className="text-slate-400 font-mono text-[11px]">FILE: {inspectingKycDoc.doc.fileName}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-sky-400">
                  {inspectingKycDoc.doc.fileSize || '2.8 MB'} &middot; TLS Encrypted
                </span>
              </div>

              {/* High-fidelity Visual Document Simulator Graphic */}
              <div className="p-5 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950 border-2 border-slate-700 rounded-xl relative overflow-hidden text-xs">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-sky-400" />
                    <div>
                      <span className="font-bold text-white block uppercase tracking-wider text-[11px]">
                        {inspectingKycDoc.doc.docType === 'utility_bill' ? 'OFFICIAL SERVICE BILL' : 'COMMONWEALTH OF VIRGINIA'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {inspectingKycDoc.doc.docType === 'utility_bill'
                          ? inspectingKycDoc.doc.utilityProvider || 'Dominion Energy Virginia'
                          : 'Department of Motor Vehicles &bull; Real ID Compliant'}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                    VALIDATED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px] font-mono my-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Cardholder / Account Name</span>
                    <span className="font-bold text-white block mt-0.5">
                      {inspectingKycDoc.user.firstName} {inspectingKycDoc.user.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">
                      {inspectingKycDoc.doc.docType === 'utility_bill' ? 'Provider Account #' : 'License / ID Number'}
                    </span>
                    <span className="font-bold text-amber-300 block mt-0.5">
                      {inspectingKycDoc.doc.idNumber || 'VA-DL-84920194'}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[9px] uppercase">Mailing Address on Record</span>
                    <span className="text-slate-200 block mt-0.5">
                      {inspectingKycDoc.user.address?.street || '1680 Capital One Drive'}, {inspectingKycDoc.user.address?.city || 'McLean'}, {inspectingKycDoc.user.address?.state || 'VA'} {inspectingKycDoc.user.address?.zip || '22102'}
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-800/80 pt-2">
                  <span>Uploaded: {inspectingKycDoc.doc.uploadedAt}</span>
                  <span className="text-sky-400 font-semibold">Address Match: 100% Verified</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    reviewKycDocument(
                      inspectingKycDoc.user.id,
                      inspectingKycDoc.doc.id,
                      'approved',
                      'Document inspected and verified by Admin.'
                    );
                    showToast(`Approved document ${inspectingKycDoc.doc.fileName}.`);
                    setInspectingKycDoc(null);
                  }}
                  className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve This Document</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    adminVerifyUserKyc(inspectingKycDoc.user.id);
                    showToast(`Verified ${inspectingKycDoc.user.firstName} ${inspectingKycDoc.user.lastName} & unlocked all outbound withdrawals!`);
                    setInspectingKycDoc(null);
                  }}
                  className="flex-1 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Account &amp; Unlock Withdrawals</span>
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const uId = inspectingKycDoc.user.id;
                    const d = inspectingKycDoc.doc;
                    setInspectingKycDoc(null);
                    setReviewingKycDoc({ userId: uId, doc: d });
                    setKycFeedbackInput('Image unreadable or address mismatch');
                  }}
                  className="px-4 py-2 bg-red-950/80 hover:bg-red-900 text-red-200 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Reject with Reason
                </button>

                <button
                  type="button"
                  onClick={() => setInspectingKycDoc(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: MANUAL LEDGER ADJUSTMENT
          ======================================================== */}
      {adjustingUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <h3 className="font-bold text-base">
                Manual Ledger Adjustment &mdash; {adjustingUser.firstName} {adjustingUser.lastName}
              </h3>
              <button onClick={() => setAdjustingUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteLedgerAdjustment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Target Account</label>
                <select
                  value={adjustAccountId}
                  onChange={(e) => setAdjustAccountId(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded text-white"
                >
                  {adjustingUser.accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.accountType} ({acc.accountNumber}) &mdash; Balance: ${acc.balance.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Adjustment Action</label>
                  <select
                    value={adjustType}
                    onChange={(e) => setAdjustType(e.target.value as 'add' | 'subtract')}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded text-white"
                  >
                    <option value="add">Credit (+ Deposit)</option>
                    <option value="subtract">Debit (- Deduct)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Audit Ledger Reason</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="e.g. Wire clearing credit"
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setAdjustingUser(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 font-bold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded cursor-pointer"
                >
                  Execute Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          ADMIN VIRTUAL CARD MANAGEMENT MODAL
          ======================================================== */}
      {selectedUserForCards && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedUserForCards(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 text-slate-200 shadow-2xl relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-sky-400" />
                  <span>Virtual Cards: {selectedUserForCards.firstName} {selectedUserForCards.lastName}</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Manage active virtual tokens, adjust spending limits, or revoke cards.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForCards(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Find live user from store users array */}
            {(() => {
              const liveUser = users.find((u) => u.id === selectedUserForCards.id) || selectedUserForCards;
              const cards = liveUser.virtualCards || [];

              if (cards.length === 0) {
                return (
                  <div className="py-8 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    <CreditCard className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-400">No Virtual Cards Issued Yet</p>
                    <p className="text-[11px] text-slate-500">The user has not generated any virtual cards.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-3.5">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="p-4 bg-slate-800/80 border border-slate-700 rounded-xl space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{card.name}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                card.isPaused
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {card.isPaused ? 'Paused' : 'Active'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 font-mono block mt-0.5">
                            {card.cardNumber} · EXP: {card.expiry} · CVV: {card.cvv}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                          {card.type.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-700/60 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">Spending Limit:</span>
                          <input
                            type="number"
                            defaultValue={card.spendingLimit}
                            onBlur={(e) => {
                              const newLimit = parseFloat(e.target.value) || 0;
                              adminUpdateVirtualCard(liveUser.id, card.id, { spendingLimit: newLimit });
                              showToast(`Updated limit for ${card.name} to $${newLimit.toLocaleString()}`);
                            }}
                            className="w-24 bg-slate-950 border border-slate-600 rounded px-2 py-1 text-sky-400 font-mono font-bold text-xs"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              adminUpdateVirtualCard(liveUser.id, card.id, { isPaused: !card.isPaused });
                              showToast(`${card.name} is now ${card.isPaused ? 'unpaused' : 'paused'}.`);
                            }}
                            className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                              card.isPaused
                                ? 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200'
                                : 'bg-amber-900/60 hover:bg-amber-800 text-amber-200'
                            }`}
                          >
                            {card.isPaused ? 'Unpause Card' : 'Pause Card'}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              adminDeleteVirtualCard(liveUser.id, card.id);
                              showToast(`Revoked virtual card ${card.name}.`);
                            }}
                            className="px-2.5 py-1 bg-red-950 hover:bg-red-900 text-red-200 rounded text-xs font-semibold cursor-pointer"
                          >
                            Revoke
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUserForCards(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
