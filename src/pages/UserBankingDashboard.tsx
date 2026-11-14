import React, { useState, useEffect } from 'react';
import { CapitalOneLogo } from '../components/CapitalOneLogo';
import { useBankingStore, User, UserAccount, Transaction, VirtualCard, KycDocument } from '../store/useBankingStore';
import { BottomNav } from '../components/BottomNav';
import { DarkDropdown, DropdownOption } from '../components/DarkDropdown';
import {
  CreditCard,
  Landmark,
  LogOut,
  Bell,
  ShieldCheck,
  PlusCircle,
  ArrowDownLeft,
  X,
  Receipt,
  AlertCircle,
  DollarSign,
  Wallet,
  Camera,
  Repeat,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  Info,
  ChevronRight,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Plane,
  Utensils,
  Ticket,
  QrCode,
  Lock,
  Unlock,
  FileText,
  Clock,
  Printer,
  ChevronDown,
  Smartphone,
  Layers,
  Pause,
  Play,
  Share2,
  Home,
  MapPin,
  Building,
  Edit2,
  Trash2,
  Save,
  Tag,
  ShoppingBag,
  Car,
  Zap,
  Film,
  PieChart,
  Download,
} from 'lucide-react';
import { BudgetPieChart } from '../components/BudgetPieChart';
import { TransactionExportModal } from '../components/TransactionExportModal';
import { SupportChat } from '../components/SupportChat';
import { TransactionReceipt } from '../components/TransactionReceipt';

interface UserBankingDashboardProps {
  onNavigate: (path: string) => void;
}

export const UserBankingDashboard: React.FC<UserBankingDashboardProps> = ({ onNavigate }) => {
  const {
    currentUser,
    users,
    transactions,
    logout,
    hasUserDeposited,
    processDeposit,
    processPayment,
    processWithdrawal,
    processInternalTransfer,
    createVirtualCard,
    togglePauseVirtualCard,
    deleteVirtualCard,
    regenerateVirtualCard,
    uploadKycDocument,
    uploadKycPackage,
    buyStock,
    sellStock,
    budgetCategories,
    updateBudgetCategoryLimit,
    updateBudgetCategorySpent,
    updateBudgetCategoryItem,
    deleteBudgetCategory,
    addBudgetCategory,
    updateUserMonthlyBudget,
    bookTravelBenefit,
    paymentOptions,
    withdrawalOptions,
    processingFeedbackMessage,
    withdrawalDisclaimer,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    globalNotification,
    isBalanceHidden,
    toggleBalanceHidden,
    submitGiftCard,
  } = useBankingStore();

  // Keep active user synced with state
  const activeUser = users.find((u) => u.id === currentUser?.id) || currentUser;

  // View Mode: 'dashboard' | 'my-card' | 'my-budget' | 'at-a-glance' | 'investments'
  const [activeViewMode, setActiveViewMode] = useState<'dashboard' | 'my-card' | 'my-budget' | 'at-a-glance' | 'investments'>('dashboard');

  // Interactive Budget View State
  const userMonthlyIncome = activeUser?.monthlyIncome || 12402;
  const userMonthlySpending = activeUser?.monthlySpendingGoal || 8392;
  const [isEditingBudgetGoals, setIsEditingBudgetGoals] = useState(false);
  const [budgetIncomeInput, setBudgetIncomeInput] = useState(userMonthlyIncome.toString());
  const [budgetSpendingInput, setBudgetSpendingInput] = useState(userMonthlySpending.toString());
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCatName, setEditCatName] = useState('');
  const [editCatLimit, setEditCatLimit] = useState('');
  const [editCatSpent, setEditCatSpent] = useState('');
  const [editCatIcon, setEditCatIcon] = useState('tag');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatLimit, setNewCatLimit] = useState('');
  const [newCatSpent, setNewCatSpent] = useState('0');
  const [newCatIcon, setNewCatIcon] = useState('tag');

  // Notification Drawer State
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  // Account Details Modal State
  const [inspectingAccount, setInspectingAccount] = useState<UserAccount | null>(null);
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  // Selected Transaction for Detailed Receipt Modal
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<Transaction | null>(null);

  // Export History (CSV / PDF) Modal State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Deposit ("Add Money") Modal State
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositTab, setDepositTab] = useState<'traditional' | 'crypto' | 'gift-card'>('traditional');
  const [depositAccountId, setDepositAccountId] = useState('');
  const [depositAmount, setDepositAmount] = useState('100.00');
  const [depositMethod, setDepositMethod] = useState('Mobile Check Deposit');
  const [checkFrontCaptured, setCheckFrontCaptured] = useState(false);
  const [checkBackCaptured, setCheckBackCaptured] = useState(false);
  const [cryptoNetwork, setCryptoNetwork] = useState<'BTC' | 'ETH' | 'USDT'>('BTC');
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false);
  const [depositError, setDepositError] = useState<string | null>(null);

  // Gift card submission state
  const [giftCardBrand, setGiftCardBrand] = useState('Amazon');
  const [giftCardNumber, setGiftCardNumber] = useState('');
  const [giftCardBalance, setGiftCardBalance] = useState('100.00');
  const [giftCardImageName, setGiftCardImageName] = useState('');
  const [giftSubmitResult, setGiftSubmitResult] = useState<{ reference: string; etaHours: number } | null>(null);

  // Post-transaction official receipt modal
  const [receiptState, setReceiptState] = useState<{
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
      accountName: string;
      accountNumber: string;
      balanceBefore: number;
      balanceAfter: number;
      availableCredit?: number;
      creditLimit?: number;
      swiftCode?: string;
    };
    holderName: string;
    email?: string;
  } | null>(null);

  // Withdraw Funds Modal State (With Full Banking Fields)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [withdrawAccountId, setWithdrawAccountId] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('50.00');
  const [withdrawDestinationId, setWithdrawDestinationId] = useState('');
  const [withdrawRecipientName, setWithdrawRecipientName] = useState('');
  const [withdrawBankName, setWithdrawBankName] = useState('JPMorgan Chase Bank');
  const [withdrawRoutingNumber, setWithdrawRoutingNumber] = useState('021000021');
  const [withdrawAccountNumber, setWithdrawAccountNumber] = useState('');
  const [withdrawConfirmAccountNumber, setWithdrawConfirmAccountNumber] = useState('');
  const [withdrawMemo, setWithdrawMemo] = useState('Personal Funds Withdrawal');
  const [isProcessingWithdrawal, setIsProcessingWithdrawal] = useState(false);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [showFirstDepositAlert, setShowFirstDepositAlert] = useState(false);

  // Pay Bill Modal State (With Full Biller Fields)
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAccountId, setPayAccountId] = useState('');
  const [payAmount, setPayAmount] = useState('35.00');
  const [selectedPaymentOptId, setSelectedPaymentOptId] = useState('');
  const [billerName, setBillerName] = useState('Capital One Card Services');
  const [billerAccount, setBillerAccount] = useState('');
  const [billerZip, setBillerZip] = useState('22102');
  const [billerDueDate, setBillerDueDate] = useState('Today (Immediate)');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Internal Transfer Modal State
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [transferFromId, setTransferFromId] = useState('');
  const [transferToId, setTransferToId] = useState('');
  const [transferAmount, setTransferAmount] = useState('50.00');
  const [isProcessingTransfer, setIsProcessingTransfer] = useState(false);
  const [transferError, setTransferError] = useState<string | null>(null);

  // Virtual Cards Modal State
  const [isVirtualCardModalOpen, setIsVirtualCardModalOpen] = useState(false);
  const [isCreateCardModalOpen, setIsCreateCardModalOpen] = useState(false);
  const [newCardType, setNewCardType] = useState<'standard' | 'eno' | 'venture_x'>('standard');
  const [newCardCustomName, setNewCardCustomName] = useState('');
  const [revealedCardNumbers, setRevealedCardNumbers] = useState<{ [cardId: string]: boolean }>({});
  const [isCreatingCard, setIsCreatingCard] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // KYC Document Upload Modal State (2-Step Verification Package: ID + Utility Bill)
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [kycDocType, setKycDocType] = useState<'driver_license' | 'passport' | 'utility_bill'>('driver_license');
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [kycStep, setKycStep] = useState<1 | 2>(1);
  const [kycIdType, setKycIdType] = useState<'driver_license' | 'passport'>('driver_license');
  const [kycIdNumber, setKycIdNumber] = useState('VA-DL-84920194');
  const [kycIdFrontFile, setKycIdFrontFile] = useState('turner_virginia_dl_front.jpg');
  const [kycIdBackFile, setKycIdBackFile] = useState('turner_virginia_dl_back.jpg');
  const [kycUtilityProvider, setKycUtilityProvider] = useState('Dominion Energy Virginia');
  const [kycUtilityFile, setKycUtilityFile] = useState('dominion_energy_electric_bill.pdf');
  const [kycBillDate, setKycBillDate] = useState('October 14, 2026');
  const [isSubmittingKycPackage, setIsSubmittingKycPackage] = useState(false);
  const [showWithdrawalRestrictedModal, setShowWithdrawalRestrictedModal] = useState(false);

  // Official Banking Tools Modal State
  const [isDirectDepositModalOpen, setIsDirectDepositModalOpen] = useState(false);
  const [directDepositEmployer, setDirectDepositEmployer] = useState('Apex Global Enterprises LLC');
  const [directDepositSplitType, setDirectDepositSplitType] = useState<'100' | 'amount'>('100');
  const [isWireInstructionsModalOpen, setIsWireInstructionsModalOpen] = useState(false);
  const [isZelleModalOpen, setIsZelleModalOpen] = useState(false);
  const [zelleRecipient, setZelleRecipient] = useState('');
  const [zelleAmount, setZelleAmount] = useState('50.00');
  const [zelleMemo, setZelleMemo] = useState('Reimbursement');
  const [isSendingZelle, setIsSendingZelle] = useState(false);
  const [isCafeLocatorModalOpen, setIsCafeLocatorModalOpen] = useState(false);
  const [cafeSearchZip, setCafeSearchZip] = useState('22102');

  // Live Financial Telemetry & Equities Ticker State
  const [liveTickerData, setLiveTickerData] = useState({
    cofPrice: 154.20,
    cofChange: 1.42,
    sp500Price: 5984.30,
    sp500Change: 0.41,
    nasdaqPrice: 19290.15,
    nasdaqChange: 0.55,
    us10yYield: 4.41,
    us10yChange: -0.02,
    savingsApy: 4.25,
    lastTick: 'Just now',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveTickerData((prev) => {
        const deltaCof = (Math.random() - 0.48) * 0.35;
        const deltaSp = (Math.random() - 0.48) * 2.2;
        const deltaNasdaq = (Math.random() - 0.48) * 6.5;
        const newCof = +(prev.cofPrice + deltaCof).toFixed(2);
        return {
          ...prev,
          cofPrice: newCof,
          cofChange: +(((newCof - 152.04) / 152.04) * 100).toFixed(2),
          sp500Price: +(prev.sp500Price + deltaSp).toFixed(2),
          nasdaqPrice: +(prev.nasdaqPrice + deltaNasdaq).toFixed(2),
          lastTick: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };
      });
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Travel & Rewards Booking Modal State
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [travelType, setTravelType] = useState<'Flight' | 'Hotel' | 'Dining' | 'Entertainment'>('Flight');
  const [travelSearchQuery, setTravelSearchQuery] = useState('New York (JFK) to London (LHR)');
  const [flightOrigin, setFlightOrigin] = useState('JFK');
  const [flightDestination, setFlightDestination] = useState('LHR');
  const [flightCabinClass, setFlightCabinClass] = useState<'Economy' | 'Premium' | 'First'>('Economy');
  const [selectedSeat, setSelectedSeat] = useState('14A');
  const [selectedAirline, setSelectedAirline] = useState('Delta Air Lines (DL 001)');
  const [travelCost, setTravelCost] = useState(485.0);
  const [useRewardsForTravel, setUseRewardsForTravel] = useState(true);
  const [isBookingTravel, setIsBookingTravel] = useState(false);
  const [confirmedBookingPass, setConfirmedBookingPass] = useState<{
    confirmationCode: string;
    flight: string;
    from: string;
    to: string;
    seat: string;
    gate: string;
    terminal: string;
    passenger: string;
    cabin: string;
    cost: number;
  } | null>(null);

  // Stock Trading Modal State
  const [selectedStockSymbol, setSelectedStockSymbol] = useState<'AAPL' | 'GOOGL' | 'TSLA' | 'NVDA'>('AAPL');
  const [tradeShares, setTradeShares] = useState(1);
  const [isTradingStock, setIsTradingStock] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);

  // Toast Notification State
  const [topRightToast, setTopRightToast] = useState<{ message: string; id: number } | null>(null);

  const showTopRightToast = (message: string) => {
    setTopRightToast({ message, id: Date.now() });
    setTimeout(() => {
      setTopRightToast(null);
    }, 4500);
  };

  // If locked, immediately redirect
  useEffect(() => {
    if (activeUser?.status === 'Locked') {
      onNavigate('/enroll/account-lock');
    }
  }, [activeUser?.status, onNavigate]);

  // Synchronize default accounts
  useEffect(() => {
    if (activeUser?.accounts?.length) {
      if (!depositAccountId) setDepositAccountId(activeUser.accounts[0].id);
      if (!withdrawAccountId) setWithdrawAccountId(activeUser.accounts[0].id);
      if (!payAccountId) {
        const card = activeUser.accounts.find((a) => a.type === 'credit');
        setPayAccountId(card ? card.id : activeUser.accounts[0].id);
      }
      if (!transferFromId) setTransferFromId(activeUser.accounts[0].id);
      if (!transferToId && activeUser.accounts.length > 1) {
        setTransferToId(activeUser.accounts[1].id);
      }
    }
  }, [activeUser]);

  // Active withdrawal options (toggled by Admin)
  const enabledWithdrawalOptions = withdrawalOptions.filter((o) => o.enabled);

  useEffect(() => {
    if (enabledWithdrawalOptions.length > 0 && !withdrawDestinationId) {
      setWithdrawDestinationId(enabledWithdrawalOptions[0].id);
    }
  }, [enabledWithdrawalOptions, withdrawDestinationId]);

  if (!activeUser) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-md w-full text-center shadow-lg">
          <CapitalOneLogo className="h-8 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Active Session</h2>
          <p className="text-xs text-slate-500 mb-6">
            Please enroll or sign in to access your Capital One accounts.
          </p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => onNavigate('/signin')}
              className="px-5 py-2.5 bg-[#005C9D] text-white font-bold text-xs rounded-lg hover:bg-[#00487D] cursor-pointer"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/enroll')}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-lg hover:bg-slate-200 cursor-pointer"
            >
              Set Up Online Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeUser.status === 'Locked') {
    return null;
  }

  const enabledPaymentOptions = paymentOptions.filter((o) => o.enabled);
  const userTransactions = transactions.filter((t) => t.userId === activeUser.id);
  const checkingAcc = activeUser.accounts.find((a) => a.type === 'checking') || activeUser.accounts[0];
  const creditCard = activeUser.accounts.find((a) => a.type === 'credit') || activeUser.accounts[0];

  // Selected withdrawal account object and its available balance
  const selectedWithdrawAccount = activeUser.accounts.find((a) => a.id === withdrawAccountId) || activeUser.accounts[0];
  const maxWithdrawAllowed = selectedWithdrawAccount ? selectedWithdrawAccount.balance : 0;

  // Selected payment account object and checking source balance
  const selectedPayAccount = activeUser.accounts.find((a) => a.id === payAccountId) || creditCard;

  // Selected transfer from account
  const selectedTransferFrom = activeUser.accounts.find((a) => a.id === transferFromId) || activeUser.accounts[0];
  const maxTransferAllowed = selectedTransferFrom ? selectedTransferFrom.balance : 0;

  // Virtual cards list
  const userVirtualCards = activeUser.virtualCards || [];

  // Stock Market Prices
  const stockPrices: { [key: string]: { name: string; price: number; change: number } } = {
    AAPL: { name: 'Apple Inc.', price: 224.23, change: 1.84 },
    GOOGL: { name: 'Alphabet Inc.', price: 178.5, change: -0.62 },
    TSLA: { name: 'Tesla Inc.', price: 218.4, change: 3.12 },
    NVDA: { name: 'NVIDIA Corp.', price: 128.9, change: 2.45 },
  };

  // Crypto deposit addresses
  const cryptoWallets = {
    BTC: {
      network: 'Bitcoin (SegWit)',
      address: 'bc1q9p7s4capitalone88219xkz743a9d01',
      rate: 94850,
      symbol: 'BTC',
    },
    ETH: {
      network: 'Ethereum (ERC-20)',
      address: '0x3F8a01C92aB9D88a44210CapitalOne890',
      rate: 3420,
      symbol: 'ETH',
    },
    USDT: {
      network: 'Tether (TRC-20)',
      address: 'TQ8a91xKz743CapitalOneTetherUSDT09',
      rate: 1.0,
      symbol: 'USDT',
    },
  };

  // Helper format currency
  const formatMoney = (val: number) => {
    if (isBalanceHidden) {
      return '$••••••';
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedNotice(`Copied ${label} to clipboard!`);
    setTimeout(() => setCopiedNotice(null), 2500);
  };

  // ----------------------------------------------------
  // 1. EXECUTE DEPOSIT (Traditional or Crypto)
  // ----------------------------------------------------
  const handleExecuteDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < 0.01) {
      setDepositError('Deposit amount must be at least $0.01.');
      return;
    }

    setDepositError(null);
    setIsProcessingDeposit(true);

    try {
      const isCrypto = depositTab === 'crypto';
      const selectedCrypto = cryptoWallets[cryptoNetwork];

      await processDeposit(
        activeUser.id,
        depositAccountId,
        amount,
        isCrypto ? `Crypto Deposit (${cryptoNetwork})` : depositMethod,
        isCrypto ? { cryptoNetwork: selectedCrypto.network, cryptoAddress: selectedCrypto.address } : undefined
      );

      setIsProcessingDeposit(false);
      setIsDepositModalOpen(false);

      const targetAccount = activeUser.accounts.find((a) => a.id === depositAccountId);
      const accName = targetAccount ? `${targetAccount.accountType} (${targetAccount.accountNumber})` : 'Account';

      showTopRightToast(`Successfully deposited $${amount.toFixed(2)} to ${accName}`);
      showReceiptForLatest(depositAccountId);
    } catch {
      setIsProcessingDeposit(false);
      setDepositError('An error occurred while processing the deposit.');
    }
  };

  // Show the official Capital One statement-style receipt for the latest transaction
  const showReceiptForLatest = (accountId: string) => {
    const state = useBankingStore.getState();
    const u = state.users.find((x) => x.id === activeUser.id);
    if (!u) return;
    const tx = state.transactions.find((t) => t.userId === u.id);
    if (!tx) return;
    const acc = u.accounts.find((a) => a.id === accountId) || u.accounts[0];
    if (!acc) return;
    const isDebit = tx.amount < 0 || ['Withdrawal', 'Payment', 'Transfer'].includes(tx.type);
    const after = acc.balance;
    const before = isDebit ? after + Math.abs(tx.amount) : after - Math.abs(tx.amount);
    setReceiptState({
      transaction: {
        id: tx.id,
        referenceNumber: tx.referenceNumber,
        merchant: tx.merchant,
        type: tx.type,
        status: tx.status,
        amount: tx.amount,
        date: new Date().toISOString(),
        category: tx.category,
        destinationDetails: tx.destinationDetails,
        adminFeedback: tx.adminFeedback,
      },
      account: {
        type: acc.type,
        accountName: acc.accountType,
        accountNumber: acc.accountNumber,
        balanceBefore: before,
        balanceAfter: after,
        availableCredit: acc.availableCredit,
        creditLimit: acc.creditLimit,
        swiftCode: u.swiftCode,
      },
      holderName: `${u.firstName} ${u.lastName}`,
      email: u.email,
    });
  };

  // ----------------------------------------------------
  // GIFT CARD SUBMISSION (converts to USD after admin approval)
  // ----------------------------------------------------
  const handleGiftCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(giftCardBalance);
    if (!giftCardNumber.trim() || giftCardNumber.replace(/\D/g, '').length < 4) {
      setDepositError('Enter a valid gift card number (at least 4 digits).');
      return;
    }
    if (isNaN(balance) || balance < 1) {
      setDepositError('Gift card balance must be at least $1.00.');
      return;
    }
    setDepositError(null);
    const result = submitGiftCard(activeUser.id, giftCardBrand, giftCardNumber, balance, giftCardImageName);
    setGiftSubmitResult(result);
  };

  // ----------------------------------------------------
  // 2. CHECK & EXECUTE WITHDRAWAL
  // ----------------------------------------------------
  const handleInitiateWithdrawalClick = () => {
    // 1. Account Activation / Identity Verification Enforcement
    if (activeUser.kycStatus !== 'verified') {
      setShowWithdrawalRestrictedModal(true);
      return;
    }

    // 2. Check if client has made deposits first (Rule 3)
    const hasDeposits = hasUserDeposited(activeUser.id);
    if (!hasDeposits) {
      setShowFirstDepositAlert(true);
      return;
    }

    setWithdrawAccountId(checkingAcc?.id || activeUser.accounts[0].id);
    setWithdrawAmount('50.00');
    setWithdrawError(null);
    if (enabledWithdrawalOptions.length > 0) {
      setWithdrawDestinationId(enabledWithdrawalOptions[0].id);
    }
    setIsWithdrawModalOpen(true);
  };

  const handleExecuteWithdrawal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeUser.kycStatus !== 'verified') {
      setWithdrawError(
        'Account activation required: Outbound withdrawals are locked until your identity documents are approved by Admin.'
      );
      return;
    }

    const amount = parseFloat(withdrawAmount);

    if (isNaN(amount) || amount < 0.01) {
      setWithdrawError('Withdrawal amount must be at least $0.01.');
      return;
    }

    if (amount > maxWithdrawAllowed) {
      setWithdrawError(
        `Amount exceeds available balance. Maximum withdrawable is $${maxWithdrawAllowed.toFixed(2)}.`
      );
      return;
    }

    if (!withdrawRecipientName.trim()) {
      setWithdrawError('Please enter recipient full name or business entity.');
      return;
    }

    if (withdrawRoutingNumber.replace(/\D/g, '').length !== 9) {
      setWithdrawError('Routing Transit Number must be exactly 9 digits.');
      return;
    }

    if (!withdrawAccountNumber.trim() || withdrawAccountNumber.length < 4) {
      setWithdrawError('Please provide a valid account number (minimum 4 digits).');
      return;
    }

    if (withdrawAccountNumber !== withdrawConfirmAccountNumber) {
      setWithdrawError('Account numbers do not match. Please re-enter.');
      return;
    }

    const destinationOpt = enabledWithdrawalOptions.find((o) => o.id === withdrawDestinationId);
    if (!destinationOpt) {
      setWithdrawError('Please select a valid destination.');
      return;
    }

    setWithdrawError(null);
    setIsProcessingWithdrawal(true);

    try {
      const success = await processWithdrawal(activeUser.id, withdrawAccountId, amount, destinationOpt.name, {
        recipientName: withdrawRecipientName.trim(),
        bankName: withdrawBankName.trim() || destinationOpt.name,
        routingNumber: withdrawRoutingNumber.trim(),
        accountNumber: withdrawAccountNumber.trim(),
        memo: withdrawMemo.trim() || undefined,
      });

      setIsProcessingWithdrawal(false);

      if (!success) {
        setWithdrawError('Account verification required: Withdrawals cannot be processed until identity documents are approved by Admin.');
        return;
      }

      setIsWithdrawModalOpen(false);

      showTopRightToast(`Withdrawal of $${amount.toFixed(2)} to ${withdrawBankName || destinationOpt.name} is complete.`);
      showReceiptForLatest(withdrawAccountId);
    } catch {
      setIsProcessingWithdrawal(false);
      setWithdrawError('An error occurred during withdrawal transfer.');
    }
  };

  // ----------------------------------------------------
  // 3. EXECUTE BILL PAYMENT
  // ----------------------------------------------------
  const handleExecutePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payAmount);

    if (isNaN(amount) || amount < 0.01) {
      setPaymentError('Payment amount must be at least $0.01.');
      return;
    }

    if (checkingAcc && amount > checkingAcc.balance) {
      setPaymentError(`Insufficient checking funds. Maximum available is $${checkingAcc.balance.toFixed(2)}.`);
      return;
    }

    if (!billerName.trim()) {
      setPaymentError('Please enter the payee or biller name.');
      return;
    }

    const opt = enabledPaymentOptions.find((o) => o.id === selectedPaymentOptId) || enabledPaymentOptions[0];

    setPaymentError(null);
    setIsProcessingPayment(true);

    try {
      await processPayment(activeUser.id, payAccountId, amount, opt?.name || '360 Checking', {
        billerName: billerName.trim(),
        billerAccount: billerAccount.trim() || `ACC-${Math.floor(100000 + Math.random() * 900000)}`,
        billerZip: billerZip.trim(),
        paymentDate: billerDueDate,
      });

      setIsProcessingPayment(false);
      setIsPayModalOpen(false);

      showTopRightToast(`Successfully posted payment of $${amount.toFixed(2)} to ${billerName}.`);
      showReceiptForLatest(payAccountId);
    } catch {
      setIsProcessingPayment(false);
      setPaymentError('An error occurred while processing payment.');
    }
  };

  // ----------------------------------------------------
  // 4. EXECUTE INTERNAL TRANSFER
  // ----------------------------------------------------
  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);

    if (isNaN(amount) || amount < 0.01) {
      setTransferError('Transfer amount must be at least $0.01.');
      return;
    }

    if (transferFromId === transferToId) {
      setTransferError('Source and destination accounts must be different.');
      return;
    }

    if (amount > maxTransferAllowed) {
      setTransferError(`Amount exceeds available balance of $${maxTransferAllowed.toFixed(2)}.`);
      return;
    }

    setTransferError(null);
    setIsProcessingTransfer(true);

    try {
      await processInternalTransfer(activeUser.id, transferFromId, transferToId, amount);
      setIsProcessingTransfer(false);
      setIsTransferModalOpen(false);

      showTopRightToast(`Successfully transferred $${amount.toFixed(2)} between accounts.`);
      showReceiptForLatest(transferFromId);
    } catch {
      setIsProcessingTransfer(false);
      setTransferError('An error occurred during transfer.');
    }
  };

  // ----------------------------------------------------
  // 5. CREATE VIRTUAL CARD
  // ----------------------------------------------------
  const handleCreateVirtualCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError(null);
    setIsCreatingCard(true);

    const fee = newCardType === 'eno' ? 2.99 : newCardType === 'venture_x' ? 9.99 : 0;
    if (fee > 0 && checkingAcc.balance < fee) {
      setCardError(`Insufficient balance. Virtual card activation requires a fee of $${fee.toFixed(2)}.`);
      setIsCreatingCard(false);
      return;
    }

    const res = await createVirtualCard(activeUser.id, newCardType, newCardCustomName);
    setIsCreatingCard(false);

    if (res.success && res.card) {
      setIsCreateCardModalOpen(false);
      showTopRightToast(`Created ${res.card.name} successfully!`);
    } else {
      setCardError(res.error || 'Failed to create virtual card.');
    }
  };

  // ----------------------------------------------------
  // 6. UPLOAD KYC DOCUMENT
  // ----------------------------------------------------
  const handleUploadKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fileName = simulatedFileName.trim() || `${activeUser.lastName.toLowerCase()}_${kycDocType}_verified.pdf`;
    uploadKycDocument(activeUser.id, kycDocType, fileName);
    setIsKycModalOpen(false);
    setSimulatedFileName('');
    showTopRightToast('Document uploaded for Admin verification.');
  };

  const handleUploadKycPackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingKycPackage(true);

    const doc1 = {
      docType: kycIdType,
      fileName: kycIdFrontFile.trim() || `${activeUser.lastName.toLowerCase()}_gov_photo_id.jpg`,
      idNumber: kycIdNumber.trim() || 'VA-DL-84920194',
      fileSize: '3.4 MB',
    };

    const doc2 = {
      docType: 'utility_bill' as const,
      fileName: kycUtilityFile.trim() || `${activeUser.lastName.toLowerCase()}_electric_utility_bill.pdf`,
      utilityProvider: kycUtilityProvider.trim() || 'Dominion Energy Virginia',
      fileSize: '1.8 MB',
    };

    setTimeout(() => {
      uploadKycPackage(activeUser.id, [doc1, doc2]);
      setIsSubmittingKycPackage(false);
      setIsKycModalOpen(false);
      setShowWithdrawalRestrictedModal(false);
      showTopRightToast('Verification Package Submitted: ID & Utility Bill sent to Admin panel.');
    }, 600);
  };

  const handleExecuteZelle = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(zelleAmount);
    if (isNaN(amount) || amount <= 0) {
      showTopRightToast('Please enter a valid transfer amount.');
      return;
    }
    if (!zelleRecipient.trim()) {
      showTopRightToast('Please enter recipient email or mobile phone.');
      return;
    }
    if (amount > (checkingAcc?.balance || 0)) {
      showTopRightToast('Insufficient funds in 360 Checking.');
      return;
    }

    setIsSendingZelle(true);
    setTimeout(async () => {
      await processPayment(activeUser.id, checkingAcc.id, amount, 'Zelle® Instant Transfer', {
        billerName: zelleRecipient,
        billerAccount: zelleMemo || 'Personal Transfer',
      });
      setIsSendingZelle(false);
      setIsZelleModalOpen(false);
      setZelleRecipient('');
      showTopRightToast(`Sent $${amount.toFixed(2)} to ${zelleRecipient} via Zelle®!`);
    }, 800);
  };

  // ----------------------------------------------------
  // 7. STOCK TRADING (BUY / SELL)
  // ----------------------------------------------------
  const handleBuyStock = async () => {
    const stock = stockPrices[selectedStockSymbol];
    setIsTradingStock(true);
    setStockError(null);

    const res = await buyStock(activeUser.id, selectedStockSymbol, tradeShares, stock.price);
    setIsTradingStock(false);

    if (res.success) {
      showTopRightToast(`Purchased ${tradeShares}x ${selectedStockSymbol} for $${(tradeShares * stock.price).toFixed(2)}!`);
    } else {
      setStockError(res.error || 'Trade could not be executed.');
    }
  };

  const handleSellStock = async () => {
    const stock = stockPrices[selectedStockSymbol];
    setIsTradingStock(true);
    setStockError(null);

    const res = await sellStock(activeUser.id, selectedStockSymbol, tradeShares, stock.price);
    setIsTradingStock(false);

    if (res.success) {
      showTopRightToast(`Sold ${tradeShares}x ${selectedStockSymbol} for $${(tradeShares * stock.price).toFixed(2)}!`);
    } else {
      setStockError(res.error || 'Trade could not be executed.');
    }
  };

  // ----------------------------------------------------
  // 8. BOOK TRAVEL RESERVATION
  // ----------------------------------------------------
  const handleBookTravel = async () => {
    setIsBookingTravel(true);
    const confCode = `C1-${Math.floor(100000 + Math.random() * 900000)}`;

    const effectiveTitle =
      travelType === 'Flight'
        ? `${selectedAirline} (${flightOrigin} → ${flightDestination})`
        : `${travelType}: ${travelSearchQuery}`;

    await bookTravelBenefit(activeUser.id, {
      category: travelType,
      title: effectiveTitle,
      description: `Confirmation #${confCode} · ${travelType === 'Flight' ? `Seat ${selectedSeat} (${flightCabinClass})` : travelSearchQuery}`,
      cost: travelCost,
      useRewards: useRewardsForTravel,
    });

    setIsBookingTravel(false);

    if (travelType === 'Flight') {
      setConfirmedBookingPass({
        confirmationCode: confCode,
        flight: selectedAirline,
        from: flightOrigin,
        to: flightDestination,
        seat: selectedSeat,
        gate: `B${Math.floor(12 + Math.random() * 20)}`,
        terminal: 'Terminal 4',
        passenger: `${activeUser.firstName} ${activeUser.lastName}`,
        cabin: flightCabinClass,
        cost: travelCost,
      });
    } else {
      setIsTravelModalOpen(false);
    }

    showTopRightToast(`Confirmed ${travelType} booking (${effectiveTitle}) for $${travelCost.toFixed(2)}!`);
  };

  // Dropdown options
  const accountDropdownOptions: DropdownOption[] = activeUser.accounts.map((acc) => ({
    id: acc.id,
    label: acc.accountType,
    sublabel: `${acc.accountNumber} · Available: $${acc.balance.toFixed(2)}`,
    badge: acc.type === 'credit' ? 'Credit' : 'Checking',
  }));

  const destinationDropdownOptions: DropdownOption[] = enabledWithdrawalOptions.map((opt) => ({
    id: opt.id,
    label: opt.name,
    sublabel: opt.description,
    badge: opt.type,
  }));

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex flex-col justify-between text-[#1A1A1A] relative">
      {/* ========================================================
          TOP-RIGHT SUCCESS TOAST NOTIFICATION
          ======================================================== */}
      {topRightToast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold flex items-center gap-2.5 animate-in slide-in-from-top-3 fade-in duration-200 max-w-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="leading-snug">{topRightToast.message}</span>
          <button
            type="button"
            onClick={() => setTopRightToast(null)}
            className="ml-auto text-slate-400 hover:text-white p-0.5"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================
          1. HEADER & NOTIFICATIONS (Logo left, Bell with unread badge, Sign Out right)
          ======================================================== */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveViewMode('dashboard');
                onNavigate('/dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="cursor-pointer focus:outline-none hover:opacity-85 transition-opacity"
              title="Capital One Online Banking"
            >
              <CapitalOneLogo className="h-7 sm:h-8" />
            </button>
            <span className="hidden sm:inline-block h-4 w-px bg-slate-200" />
            <button
              type="button"
              onClick={() => {
                setActiveViewMode('dashboard');
                onNavigate('/dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold text-slate-700 hover:text-[#005C9D] bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-[#005C9D]" />
              <span>Home</span>
            </button>
          </div>

          {/* Quick View Mode Switcher on Header */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveViewMode('dashboard')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeViewMode === 'dashboard' ? 'bg-white text-[#005C9D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Accounts
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('my-card')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeViewMode === 'my-card' ? 'bg-white text-[#005C9D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Card
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('my-budget')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeViewMode === 'my-budget' ? 'bg-white text-[#005C9D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              My Budget
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('at-a-glance')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeViewMode === 'at-a-glance' ? 'bg-white text-[#005C9D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              At A Glance
            </button>
            <button
              type="button"
              onClick={() => setActiveViewMode('investments')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${
                activeViewMode === 'investments' ? 'bg-white text-[#005C9D] shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Investments
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Show / Hide Balance Toggle */}
            <button
              type="button"
              onClick={toggleBalanceHidden}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold cursor-pointer transition-colors"
              title={isBalanceHidden ? 'Show Account Balances' : 'Hide Account Balances'}
            >
              {isBalanceHidden ? <EyeOff className="w-4 h-4 text-slate-500" /> : <Eye className="w-4 h-4 text-[#005C9D]" />}
              <span className="hidden md:inline">{isBalanceHidden ? 'Show Balances' : 'Hide Balances'}</span>
            </button>

            {/* Notification Bell with Red Dot & Number Badge */}
            <button
              type="button"
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title="View Alerts & System Notices"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1 border-2 border-white animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Greeting (Desktop) */}
            <div className="text-right hidden sm:block pl-2 border-l border-slate-200">
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {activeUser.firstName} {activeUser.lastName}
              </span>
              <span className="text-[11px] font-mono text-emerald-600 font-semibold">
                Member #{activeUser.id}
              </span>
            </div>

            {/* Sign Out Button */}
            <button
              type="button"
              onClick={() => {
                logout();
                onNavigate('/signin');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-red-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Live Financial Telemetry & Equities Ticker Bar */}
      <div className="bg-[#001326] text-white border-b border-slate-800 px-4 py-2 text-xs overflow-x-auto shadow-inner">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 min-w-max">
          <div className="flex items-center gap-6 font-mono text-[11px]">
            {/* Capital One Financial (COF) */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sky-400">COF</span>
              <span className="font-bold text-white">${liveTickerData.cofPrice.toFixed(2)}</span>
              <span
                className={`text-[10px] font-bold ${
                  liveTickerData.cofChange >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {liveTickerData.cofChange >= 0 ? '+' : ''}
                {liveTickerData.cofChange.toFixed(2)}%
              </span>
            </div>

            <span className="text-slate-700">|</span>

            {/* S&P 500 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">S&amp;P 500</span>
              <span className="font-bold text-white">{liveTickerData.sp500Price.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 font-bold">
                +{liveTickerData.sp500Change.toFixed(2)}%
              </span>
            </div>

            <span className="text-slate-700">|</span>

            {/* NASDAQ */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">NASDAQ</span>
              <span className="font-bold text-white">{liveTickerData.nasdaqPrice.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 font-bold">
                +{liveTickerData.nasdaqChange.toFixed(2)}%
              </span>
            </div>

            <span className="text-slate-700">|</span>

            {/* 10Y US Treasury */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-sans">10Y Yield</span>
              <span className="font-bold text-amber-300">{liveTickerData.us10yYield.toFixed(2)}%</span>
              <span className="text-[10px] text-slate-400 font-bold">
                {liveTickerData.us10yChange.toFixed(2)}%
              </span>
            </div>

            <span className="text-slate-700">|</span>

            {/* 360 Performance Savings APY */}
            <div className="flex items-center gap-1.5">
              <span className="text-sky-300 font-sans font-bold">360 Savings:</span>
              <span className="font-bold text-emerald-400 font-mono">4.25% APY</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-950 text-sky-200 border border-sky-800 font-sans">
                FDIC Insured
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-sans">Live Market Feed</span>
            <span className="font-mono text-slate-500 hidden sm:inline">{liveTickerData.lastTick}</span>
          </div>
        </div>
      </div>

      {/* Global Broadcast Banner */}
      {globalNotification && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-900">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600 shrink-0" />
              <span className="font-bold text-amber-950">Notice:</span>
              <span>{globalNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsNotificationDrawerOpen(true)}
              className="text-[11px] font-bold text-amber-900 underline hover:text-amber-950 shrink-0"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* KYC Verification Status Banner */}
      {activeUser.kycStatus !== 'verified' && (
        <div
          className={`border-b px-4 py-2.5 text-xs ${
            activeUser.kycStatus === 'pending'
              ? 'bg-amber-500/10 border-amber-200 text-amber-900'
              : activeUser.kycStatus === 'rejected'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-blue-50 border-blue-200 text-[#005C9D]'
          }`}
        >
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {activeUser.kycStatus === 'pending' ? (
                <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4 shrink-0" />
              )}
              <div>
                <strong>
                  {activeUser.kycStatus === 'pending'
                    ? 'Compliance Verification In Progress'
                    : activeUser.kycStatus === 'rejected'
                    ? 'Identity Verification Notice'
                    : 'Activate Full Account Number Features'}
                </strong>
                <span className="ml-1.5 opacity-90 text-[11px]">
                  {activeUser.kycStatus === 'pending'
                    ? 'Documents submitted to Administration for review. Estimated time: within 24 hours.'
                    : activeUser.kycStatus === 'rejected'
                    ? 'Your submitted documents require resubmission. Please upload clear government ID.'
                    : 'Submit government ID and proof of residence to complete KYC activation.'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsKycModalOpen(true)}
              className="px-3 py-1 rounded bg-[#005C9D] text-white font-bold text-[11px] hover:bg-[#00487D] cursor-pointer shrink-0"
            >
              {activeUser.kycStatus === 'pending' ? 'View Submitted Docs' : 'Upload Documents'}
            </button>
          </div>
        </div>
      )}

      {/* Main Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6 my-2">
        {/* ========================================================
            VIEW MODE 1: DEFAULT ACCOUNTS DASHBOARD
            ======================================================== */}
        {activeViewMode === 'dashboard' && (
          <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-[#001B3A] via-[#003865] to-[#005C9D] rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-sky-200 font-bold">
                  WELCOME BACK
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
                  Hello, {activeUser.firstName}
                </h1>
                <p className="text-xs sm:text-sm text-sky-100 mt-1">
                  Live financial balances secured with Capital One 256-bit encryption.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                {/* 1. Pay Bill */}
                <button
                  type="button"
                  onClick={() => {
                    const card = activeUser.accounts.find((a) => a.type === 'credit');
                    setPayAccountId(card ? card.id : activeUser.accounts[0].id);
                    setPayAmount('35.00');
                    setPaymentError(null);
                    setIsPayModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-white hover:bg-sky-50 text-[#005C9D] font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Receipt className="w-4 h-4 text-[#005C9D]" />
                  <span>Pay Bill</span>
                </button>

                {/* 2. Withdraw Funds */}
                <button
                  type="button"
                  onClick={handleInitiateWithdrawalClick}
                  className="px-4 py-2.5 bg-[#00487D] hover:bg-[#003865] text-white border border-sky-400/30 font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowDownLeft className="w-4 h-4 text-sky-300" />
                  <span>Withdraw Funds</span>
                </button>

                {/* 3. Add Money */}
                <button
                  type="button"
                  onClick={() => {
                    setDepositAccountId(checkingAcc?.id || activeUser.accounts[0].id);
                    setDepositAmount('100.00');
                    setDepositError(null);
                    setCheckFrontCaptured(false);
                    setCheckBackCaptured(false);
                    setIsDepositModalOpen(true);
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-200" />
                  <span>Add Money</span>
                </button>
              </div>
            </div>

            {/* Account Activation & KYC Status Banner */}
            {activeUser.kycStatus !== 'verified' && (
              <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-amber-950">
                        {activeUser.kycStatus === 'pending'
                          ? 'Verification In Progress (Awaiting Admin Approval)'
                          : 'Account Activation Required: Identity & Address Verification'}
                      </h4>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                        {activeUser.kycStatus === 'pending' ? 'Pending Review' : 'Action Required'}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-800 mt-1">
                      {activeUser.kycStatus === 'pending'
                        ? 'Your identification and proof of address documents were submitted. Outbound withdrawals are locked until an Administrator approves your verification in the Admin Panel.'
                        : 'In compliance with federal banking regulations, please upload your Government ID and Utility Bill to unlock outbound withdrawals and wires.'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsKycModalOpen(true)}
                  className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shrink-0 self-start sm:self-auto shadow-xs"
                >
                  {activeUser.kycStatus === 'pending' ? 'View Submitted Documents' : 'Upload Verification Docs'}
                </button>
              </div>
            )}

            {/* Quick Feature Pills Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setIsVirtualCardModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-800 font-bold shadow-xs shrink-0 cursor-pointer"
              >
                <CreditCard className="w-4 h-4 text-[#005C9D]" />
                <span>Virtual Cards ({userVirtualCards.length}/3)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsTravelModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-800 font-bold shadow-xs shrink-0 cursor-pointer"
              >
                <Plane className="w-4 h-4 text-sky-600" />
                <span>Travel &amp; Flights</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDirectDepositModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-800 font-bold shadow-xs shrink-0 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Direct Deposit Form</span>
              </button>

              <button
                type="button"
                onClick={() => setIsWireInstructionsModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-800 font-bold shadow-xs shrink-0 cursor-pointer"
              >
                <Building className="w-4 h-4 text-indigo-600" />
                <span>Wire &amp; RTN (051405515)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsZelleModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-800 font-bold shadow-xs shrink-0 cursor-pointer"
              >
                <Repeat className="w-4 h-4 text-purple-600" />
                <span>Zelle® Send Money</span>
              </button>

              <button
                type="button"
                onClick={() => setIsCafeLocatorModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-800 font-bold shadow-xs shrink-0 cursor-pointer"
              >
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Café &amp; Branch Locator</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveViewMode('my-budget')}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-800 font-bold shadow-xs shrink-0 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>My Budget Tracker</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveViewMode('investments')}
                className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-800 font-bold shadow-xs shrink-0 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-purple-600" />
                <span>Stock &amp; Crypto Hub</span>
              </button>
            </div>

            {/* Accounts & Recent Activity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Column: Account Cards (7 cols) */}
              <div className="md:col-span-7 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-[#005C9D]" />
                    <span>Your Accounts</span>
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      setTransferFromId(activeUser.accounts[0]?.id || '');
                      setTransferToId(activeUser.accounts[1]?.id || activeUser.accounts[0]?.id || '');
                      setTransferAmount('50.00');
                      setTransferError(null);
                      setIsTransferModalOpen(true);
                    }}
                    className="text-xs font-bold text-[#005C9D] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Internal Transfer</span>
                  </button>
                </div>

                {activeUser.accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          {acc.type === 'credit' ? (
                            <CreditCard className="w-4 h-4 text-[#005C9D]" />
                          ) : (
                            <Landmark className="w-4 h-4 text-emerald-600" />
                          )}
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            {acc.type === 'credit' ? 'Credit Card' : 'Deposit Account'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                          {acc.accountType}
                        </h3>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-mono text-slate-500">{acc.accountNumber}</span>
                          <button
                            type="button"
                            onClick={() => setInspectingAccount(acc)}
                            className="text-[11px] font-semibold text-[#005C9D] hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Info className="w-3 h-3" />
                            <span>Details</span>
                          </button>
                        </div>
                      </div>

                      {acc.type === 'credit' && acc.rewardsCash !== undefined && (
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block uppercase font-semibold">
                            Rewards Cash
                          </span>
                          <span className="text-sm font-bold text-emerald-600 font-mono">
                            ${acc.rewardsCash.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-xs text-slate-500 block">
                          {acc.type === 'credit' ? 'Current Balance' : 'Available Balance'}
                        </span>
                        <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                          {formatMoney(acc.balance)}
                        </span>
                      </div>

                      {acc.type === 'credit' ? (
                        <div>
                          <span className="text-xs text-slate-500 block">Available Credit</span>
                          <span className="text-2xl font-extrabold text-emerald-600 font-mono tabular-nums">
                            {formatMoney(acc.availableCredit || 3800)}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-xs text-slate-500 block">APY Interest Rate</span>
                          <span className="text-xl font-bold text-emerald-600 font-mono">4.25%</span>
                        </div>
                      )}
                    </div>

                    {/* Screenshot Matching Action Buttons */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        {acc.type === 'credit'
                          ? `Minimum payment due: $${(acc.minPaymentDue || 0).toFixed(2)}`
                          : 'Fee-Free Capital One 360'}
                      </span>
                      <div className="flex items-center gap-3">
                        {acc.type === 'checking' ? (
                          <button
                            type="button"
                            onClick={() => setIsVirtualCardModalOpen(true)}
                            className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md hover:bg-sky-100 cursor-pointer"
                          >
                            View your debit card &rarr;
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsVirtualCardModalOpen(true)}
                            className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md hover:bg-sky-100 cursor-pointer"
                          >
                            Get your virtual card &rarr;
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (acc.type === 'credit') {
                              setPayAccountId(acc.id);
                              setPayAmount('35.00');
                              setPaymentError(null);
                              setIsPayModalOpen(true);
                            } else {
                              handleInitiateWithdrawalClick();
                            }
                          }}
                          className="text-xs font-bold text-[#005C9D] hover:underline cursor-pointer"
                        >
                          {acc.type === 'credit' ? 'Pay Bill >' : 'Withdraw >'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Rewards & Benefits Banner (Matching Screenshot_20261110-010700_e6ff0b7a.png) */}
                <div className="bg-gradient-to-br from-[#003865] to-[#005C9D] text-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-sky-200 uppercase font-semibold">
                        Explore rewards and benefits
                      </span>
                      <div className="text-2xl font-extrabold font-mono mt-0.5">$60.80</div>
                      <span className="text-xs text-sky-100">Rewards cash</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsTravelModalOpen(true)}
                      className="px-3 py-1.5 bg-white text-[#005C9D] rounded-lg text-xs font-bold hover:bg-sky-50 cursor-pointer"
                    >
                      Redeem Cash
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-sky-400/30 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setTravelType('Flight');
                        setIsTravelModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Plane className="w-4 h-4 text-sky-200" />
                      <span className="text-xs font-semibold">Travel</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTravelType('Dining');
                        setIsTravelModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Utensils className="w-4 h-4 text-sky-200" />
                      <span className="text-xs font-semibold">Dining</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTravelType('Entertainment');
                        setIsTravelModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <Ticket className="w-4 h-4 text-sky-200" />
                      <span className="text-xs font-semibold">Entertainment</span>
                    </button>
                  </div>
                </div>

                {/* CreditWise Card (Matching Screenshot_20261110-010700_e6ff0b7a.png) */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-600" />
                      <span className="font-bold text-slate-800 text-sm">creditwise</span>
                    </div>
                    <span className="text-xs text-slate-400">by Capital One</span>
                  </div>

                  <span className="text-xs text-slate-500">Your credit score:</span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono">780</span>
                    <span className="text-xs font-bold text-emerald-600">Very Good</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    Updated on: Oct 31, 2026 · VantageScore® 3.0
                  </span>

                  {/* Visual Score Gauge Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden flex">
                    <div className="w-1/4 bg-red-400" />
                    <div className="w-1/4 bg-amber-400" />
                    <div className="w-1/4 bg-sky-400" />
                    <div className="w-1/4 bg-emerald-500" />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>300</span>
                    <span>850</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Recent Activity & Detailed Receipts */}
              <div className="md:col-span-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-[#005C9D]" />
                    <h2 className="text-base font-bold text-slate-900">Recent Activity</h2>
                    <span className="text-xs font-mono text-slate-500">
                      ({userTransactions.length})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsExportModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#005C9D] border border-sky-200/80 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                    title="Export transaction statement to CSV or PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export (CSV/PDF)</span>
                  </button>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm divide-y divide-slate-100">
                  {userTransactions.length === 0 ? (
                    <div className="py-12 text-center text-slate-400 space-y-2">
                      <Receipt className="w-8 h-8 mx-auto opacity-40 text-slate-400" />
                      <p className="text-xs font-semibold text-slate-600">No transactions recorded yet.</p>
                      <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                        Activity will populate as you make deposits, payments, and withdrawals.
                      </p>
                    </div>
                  ) : (
                    userTransactions.map((tx) => {
                      const isDeposit = tx.type === 'Deposit';
                      const isWithdrawal = tx.type === 'Withdrawal';
                      const isPayment = tx.type === 'Payment';

                      return (
                        <div
                          key={tx.id}
                          onClick={() => setSelectedReceiptTx(tx)}
                          className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0 cursor-pointer hover:bg-slate-50/70 p-2 rounded-xl transition-colors"
                          title="Click to view official receipt"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* Status Icon */}
                            <div
                              className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                isDeposit
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : isWithdrawal
                                  ? 'bg-red-100 text-red-700'
                                  : isPayment
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-purple-100 text-purple-700'
                              }`}
                            >
                              {isDeposit ? (
                                <DollarSign className="w-4 h-4 stroke-[2.5]" />
                              ) : isWithdrawal ? (
                                <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                              ) : isPayment ? (
                                <Receipt className="w-4 h-4 stroke-[2.5]" />
                              ) : (
                                <Repeat className="w-4 h-4 stroke-[2.5]" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-900 block truncate">
                                {tx.merchant}
                              </span>
                              <span className="text-[10px] text-slate-400 block font-mono">
                                {tx.date} &middot; {tx.category}
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span
                              className={`text-xs font-bold font-mono tabular-nums block ${
                                isDeposit ? 'text-emerald-600' : 'text-slate-900'
                              }`}
                            >
                              {isDeposit ? '+' : '-'}{formatMoney(tx.amount)}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                                tx.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : tx.status === 'Declined'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : tx.status === 'Refunded'
                                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW MODE 2: "MY CARD" VIEW (Matching original_3a18d749.png)
            ======================================================== */}
        {activeViewMode === 'my-card' && (
          <div className="max-w-xl mx-auto space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-slate-900">My Card</h2>
              <button
                type="button"
                onClick={() => setIsCreateCardModalOpen(true)}
                className="text-xs font-bold text-[#005C9D] bg-sky-50 px-3 py-1.5 rounded-lg hover:bg-sky-100 cursor-pointer"
              >
                + New Virtual Card
              </button>
            </div>

            {/* Gradient Realistic Card */}
            <div className="w-full aspect-[1.586/1] bg-gradient-to-tr from-[#9b1d20] via-[#5c1d38] to-[#12305a] rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold tracking-wider font-serif">VISA</span>
                <span className="text-[10px] tracking-widest font-mono uppercase bg-white/20 px-2 py-0.5 rounded">
                  Capital One
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-200 uppercase tracking-wider block">Balance</span>
                <span className="text-3xl font-extrabold font-mono tracking-tight">
                  {formatMoney(checkingAcc?.balance || 7630)}
                </span>
              </div>

              <div className="flex items-center justify-between font-mono text-sm tracking-widest text-slate-200">
                <span>**** {creditCard?.accountNumber?.slice(-4) || '0149'}</span>
                <span>05/29</span>
              </div>
            </div>

            {/* Income & Spending Pills Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-medium block">Income</span>
                <span className="text-2xl font-bold text-emerald-600 font-mono block mt-1">
                  +$12,402
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded inline-block mt-2">
                  4.5% ↗
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-xs text-slate-500 font-medium block">Spending</span>
                <span className="text-2xl font-bold text-red-600 font-mono block mt-1">
                  -$8,392
                </span>
                <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded inline-block mt-2">
                  4.5% ↗
                </span>
              </div>
            </div>

            {/* Quick Service: Transfer & Pause Card */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Quick Service
              </span>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(true)}
                  className="bg-white hover:bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Repeat className="w-5 h-5 text-slate-800" />
                  <span className="text-xs font-bold text-slate-900">Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const firstCard = userVirtualCards[0];
                    if (firstCard) {
                      togglePauseVirtualCard(activeUser.id, firstCard.id);
                      showTopRightToast(firstCard.isPaused ? 'Virtual card unpaused!' : 'Virtual card paused!');
                    } else {
                      showTopRightToast('No active card to pause.');
                    }
                  }}
                  className="bg-white hover:bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Pause className="w-5 h-5 text-slate-800" />
                  <span className="text-xs font-bold text-slate-900">Pause Card</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW MODE 3: "MY BUDGET" VIEW (Matching images__1__4cc67120.jpeg)
            ======================================================== */}
        {/* ========================================================
            VIEW MODE 3: "MY BUDGET" VIEW - FULLY INTERACTIVE
            ======================================================== */}
        {activeViewMode === 'my-budget' && (() => {
          const totalSpent = budgetCategories.reduce((sum, c) => sum + (c.spentAmount || 0), 0);
          const totalBudget = budgetCategories.reduce((sum, c) => sum + (c.budgetAmount || 0), 0);
          const netCashFlow = userMonthlyIncome - totalSpent;
          const overallSpendingPct = userMonthlySpending > 0 ? Math.min(100, Math.round((totalSpent / userMonthlySpending) * 100)) : 0;

          const getCategoryIcon = (iconName: string) => {
            switch (iconName) {
              case 'home':
                return <Home className="w-4 h-4 text-sky-400" />;
              case 'utensils':
                return <Utensils className="w-4 h-4 text-amber-400" />;
              case 'car':
                return <Car className="w-4 h-4 text-emerald-400" />;
              case 'film':
                return <Film className="w-4 h-4 text-purple-400" />;
              case 'zap':
                return <Zap className="w-4 h-4 text-yellow-400" />;
              case 'bag':
              case 'shopping':
                return <ShoppingBag className="w-4 h-4 text-pink-400" />;
              default:
                return <Tag className="w-4 h-4 text-cyan-400" />;
            }
          };

          return (
            <div className="max-w-xl mx-auto bg-slate-950 text-slate-100 p-5 sm:p-6 rounded-3xl shadow-2xl space-y-5 animate-in fade-in border border-slate-800">
              {/* Header with Title & Goal Edit Button */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                    <PieChart className="w-6 h-6 text-[#005C9D]" />
                    <span>My Budget &amp; Cash Flow</span>
                  </h2>
                  <span className="text-xs text-slate-400">
                    Live budget calculations synchronizing with Admin records
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingBudgetGoals(!isEditingBudgetGoals);
                    setBudgetIncomeInput(userMonthlyIncome.toString());
                    setBudgetSpendingInput(userMonthlySpending.toString());
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold text-xs rounded-xl border border-slate-700 cursor-pointer flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingBudgetGoals ? 'Close Goals' : 'Edit Goals'}</span>
                </button>
              </div>

              {/* Interactive Goals Form Drawer */}
              {isEditingBudgetGoals && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const inc = parseFloat(budgetIncomeInput) || 0;
                    const spd = parseFloat(budgetSpendingInput) || 0;
                    updateUserMonthlyBudget(activeUser.id, inc, spd);
                    setIsEditingBudgetGoals(false);
                    showTopRightToast('Monthly Income & Spending Goals updated and saved.');
                  }}
                  className="p-4 bg-slate-900 border border-sky-900/60 rounded-2xl space-y-3 animate-in fade-in"
                >
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">
                    Update Monthly Income &amp; Spending Cap
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Monthly Income ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        required
                        value={budgetIncomeInput}
                        onChange={(e) => setBudgetIncomeInput(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono font-bold focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Monthly Spending Target ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        required
                        value={budgetSpendingInput}
                        onChange={(e) => setBudgetSpendingInput(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-red-400 font-mono font-bold focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsEditingBudgetGoals(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Goals</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Top Stat Pills - Income & Spending with Interactive Details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 block font-semibold">Monthly Income</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingBudgetGoals(true);
                        setBudgetIncomeInput(userMonthlyIncome.toString());
                      }}
                      className="text-slate-500 hover:text-sky-300 transition-colors p-1"
                      title="Edit Income"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400 font-mono block mt-1">
                    +${userMonthlyIncome.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800 inline-block">
                      Net Flow: +${netCashFlow.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 relative group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 block font-semibold">Spending Goal</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingBudgetGoals(true);
                        setBudgetSpendingInput(userMonthlySpending.toString());
                      }}
                      className="text-slate-500 hover:text-sky-300 transition-colors p-1"
                      title="Edit Spending Target"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </div>
                  <span className="text-2xl font-bold text-red-400 font-mono block mt-1">
                    -${userMonthlySpending.toLocaleString()}
                  </span>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-bold text-red-300 bg-red-950/60 px-1.5 py-0.5 rounded border border-red-800 inline-block">
                      {overallSpendingPct}% used (${totalSpent.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>

              {/* Monthly Overview Progress Bar */}
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-400 font-semibold">
                  <span>Total Allocated Categories</span>
                  <span className="font-mono text-slate-200">${totalBudget.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      overallSpendingPct > 95
                        ? 'bg-red-500'
                        : overallSpendingPct > 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, overallSpendingPct)}%` }}
                  />
                </div>
              </div>

              {/* D3 Interactive Category Spending Pie Chart */}
              <BudgetPieChart
                categories={budgetCategories}
                totalSpending={totalSpent}
                monthlyGoal={userMonthlySpending}
              />

              {/* Add New Category Form Drawer */}
              {isAddingCategory ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCatName.trim()) return;
                    const limit = parseFloat(newCatLimit) || 0;
                    addBudgetCategory(newCatName.trim(), limit, newCatIcon);
                    if (newCatSpent && parseFloat(newCatSpent) > 0) {
                      setTimeout(() => {
                        const all = useBankingStore.getState().budgetCategories;
                        const match = all.find((c) => c.name === newCatName.trim());
                        if (match) {
                          updateBudgetCategorySpent(match.id, parseFloat(newCatSpent));
                        }
                      }, 50);
                    }
                    setIsAddingCategory(false);
                    setNewCatName('');
                    setNewCatLimit('');
                    setNewCatSpent('0');
                    showTopRightToast(`Added budget category "${newCatName}".`);
                  }}
                  className="p-4 bg-slate-900 border border-sky-800 rounded-2xl space-y-3 animate-in fade-in text-xs"
                >
                  <span className="font-bold text-sky-400 uppercase tracking-wider block">
                    Create New Budget Category
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Category Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Subscriptions, Fitness, Pet Care"
                        value={newCatName}
                        onChange={(e) => setNewCatName(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Monthly Budget Limit ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        required
                        placeholder="e.g. 250.00"
                        value={newCatLimit}
                        onChange={(e) => setNewCatLimit(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-sky-300 font-mono font-bold focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Spent So Far ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="5"
                        value={newCatSpent}
                        onChange={(e) => setNewCatSpent(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-mono focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1 font-semibold">Category Icon</label>
                      <select
                        value={newCatIcon}
                        onChange={(e) => setNewCatIcon(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-[#005C9D] focus:outline-none"
                      >
                        <option value="tag">General / Tag</option>
                        <option value="home">Housing / Home</option>
                        <option value="utensils">Dining / Food</option>
                        <option value="car">Auto / Transportation</option>
                        <option value="film">Entertainment</option>
                        <option value="zap">Utilities / Electric</option>
                        <option value="bag">Shopping</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsAddingCategory(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Add Category</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Budget Categories ({budgetCategories.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-sky-400 hover:text-white border border-slate-800 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-sky-400" />
                    <span>Add Category</span>
                  </button>
                </div>
              )}

              {/* Budget Category Interactive Rows & Inline Editors */}
              <div className="space-y-3">
                {budgetCategories.map((cat) => {
                  const pct = Math.min(100, Math.round((cat.spentAmount / (cat.budgetAmount || 1)) * 100));
                  const isEditingThis = editingCategoryId === cat.id;

                  if (isEditingThis) {
                    return (
                      <form
                        key={cat.id}
                        onSubmit={(e) => {
                          e.preventDefault();
                          const limit = parseFloat(editCatLimit) || 0;
                          const spent = parseFloat(editCatSpent) || 0;
                          updateBudgetCategoryItem(cat.id, {
                            name: editCatName.trim(),
                            budgetAmount: limit,
                            spentAmount: spent,
                            icon: editCatIcon,
                          });
                          setEditingCategoryId(null);
                          showTopRightToast(`Updated category "${editCatName}".`);
                        }}
                        className="bg-slate-900 border border-sky-600 p-4 rounded-2xl text-white space-y-3 animate-in fade-in"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <span className="text-xs font-bold text-sky-300 uppercase">
                            Edit Category &mdash; {cat.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => setEditingCategoryId(null)}
                            className="text-slate-400 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-400 mb-1">Name</label>
                            <input
                              type="text"
                              required
                              value={editCatName}
                              onChange={(e) => setEditCatName(e.target.value)}
                              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">Budget Limit ($)</label>
                            <input
                              type="number"
                              min="0"
                              step="10"
                              required
                              value={editCatLimit}
                              onChange={(e) => setEditCatLimit(e.target.value)}
                              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-sky-300 font-mono font-bold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-slate-400 mb-1">Total Spent ($)</label>
                            <input
                              type="number"
                              min="0"
                              step="5"
                              required
                              value={editCatSpent}
                              onChange={(e) => setEditCatSpent(e.target.value)}
                              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-emerald-400 font-mono font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-400 mb-1">Icon Style</label>
                            <select
                              value={editCatIcon}
                              onChange={(e) => setEditCatIcon(e.target.value)}
                              className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-white"
                            >
                              <option value="tag">General / Tag</option>
                              <option value="home">Housing / Home</option>
                              <option value="utensils">Dining / Food</option>
                              <option value="car">Auto / Transportation</option>
                              <option value="film">Entertainment</option>
                              <option value="zap">Utilities / Electric</option>
                              <option value="bag">Shopping</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              deleteBudgetCategory(cat.id);
                              setEditingCategoryId(null);
                              showTopRightToast(`Deleted budget category "${cat.name}".`);
                            }}
                            className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 border border-red-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingCategoryId(null)}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-lg cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>Save Changes</span>
                            </button>
                          </div>
                        </div>
                      </form>
                    );
                  }

                  return (
                    <div
                      key={cat.id}
                      className="bg-[#0b3866] hover:bg-[#0c447d] transition-colors p-4 rounded-2xl text-white group cursor-pointer border border-[#164a85]"
                      onClick={() => {
                        setEditingCategoryId(cat.id);
                        setEditCatName(cat.name);
                        setEditCatLimit(cat.budgetAmount.toString());
                        setEditCatSpent(cat.spentAmount.toString());
                        setEditCatIcon(cat.icon || 'tag');
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
                            {getCategoryIcon(cat.icon)}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">{cat.name}</span>
                            <span className="text-xs text-sky-200 font-mono block mt-0.5">
                              Budget: ${cat.budgetAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-2">
                          <div>
                            <span className="text-sm font-bold font-mono text-emerald-300 block">
                              ${cat.spentAmount.toFixed(2)}
                            </span>
                            <span className="text-[10px] text-sky-200 font-semibold block">
                              {pct}% used
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingCategoryId(cat.id);
                              setEditCatName(cat.name);
                              setEditCatLimit(cat.budgetAmount.toString());
                              setEditCatSpent(cat.spentAmount.toString());
                              setEditCatIcon(cat.icon || 'tag');
                            }}
                            className="p-1 text-sky-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                            title="Edit Category Details"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3 w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            pct > 95 ? 'bg-red-400' : pct > 75 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* ========================================================
            VIEW MODE 4: "AT A GLANCE" (Matching Screenshot_20261110-010821_c00478d3.png)
            ======================================================== */}
        {activeViewMode === 'at-a-glance' && (
          <div className="max-w-xl mx-auto space-y-5 animate-in fade-in">
            <h2 className="text-2xl font-bold text-slate-900">At a glance</h2>

            {/* Credit Limit Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-600" />
                  <span className="font-bold text-slate-900">Capital One card</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block uppercase font-semibold">Credit limit</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    ${(creditCard?.creditLimit || 3000).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-slate-900 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((creditCard?.balance || 677) / (creditCard?.creditLimit || 3000)) * 100
                    )}%`,
                  }}
                />
              </div>

              <div className="flex justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Used</span>
                  <span className="font-bold text-slate-900">
                    ${(creditCard?.balance || 677).toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase">Remaining</span>
                  <span className="font-bold text-emerald-600">
                    ${((creditCard?.creditLimit || 3000) - (creditCard?.balance || 677)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details Container */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Payment details</h3>

              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Payment due by</span>
                  <span className="font-bold text-slate-900">{creditCard?.paymentDueDate || 'May 15, 2026'}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Minimum payment amount</span>
                  <span className="font-bold text-slate-900">${(creditCard?.minPaymentDue || 35).toFixed(2)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-slate-500">Last statement</span>
                  <span className="font-bold text-slate-900">$450.21</span>
                </div>
              </div>

              {/* Last Payment Accepted Notice */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-600 block">Your last payment was accepted</span>
                  <span className="text-sm font-bold font-mono text-emerald-800">$150.49</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>accepted</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW MODE 5: STOCK & CRYPTO HUB
            ======================================================== */}
        {activeViewMode === 'investments' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Capital One Investing &amp; Digital Assets</h2>
                <p className="text-xs text-slate-500">
                  Trade blue-chip equities directly from your 360 Checking balance.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDepositTab('crypto');
                  setIsDepositModalOpen(true);
                }}
                className="px-3.5 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>Crypto Deposit (QR)</span>
              </button>
            </div>

            {/* Stocks Selector Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['AAPL', 'GOOGL', 'TSLA', 'NVDA'] as const).map((sym) => {
                const stock = stockPrices[sym];
                const isSelected = selectedStockSymbol === sym;

                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => setSelectedStockSymbol(sym)}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#005C9D] bg-sky-50/60 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-900 block">{sym}</span>
                    <span className="text-[11px] text-slate-500 truncate block">{stock.name}</span>
                    <span className="text-base font-extrabold font-mono text-slate-900 block mt-1">
                      ${stock.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-[10px] font-bold font-mono mt-0.5 inline-block ${
                        stock.change >= 0 ? 'text-emerald-600' : 'text-red-600'
                      }`}
                    >
                      {stock.change >= 0 ? '+' : ''}{stock.change}%
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Stock Trading Box */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {selectedStockSymbol} &mdash; {stockPrices[selectedStockSymbol].name}
                  </h3>
                  <span className="text-xs text-slate-500">Live Simulated Equities Feed</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-slate-900">
                    ${stockPrices[selectedStockSymbol].price.toFixed(2)}
                  </span>
                  <span className="text-xs text-emerald-600 font-bold block">+1.84% Today</span>
                </div>
              </div>

              {stockError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{stockError}</span>
                </div>
              )}

              {/* Trading Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Shares to Trade</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={tradeShares}
                    onChange={(e) => setTradeShares(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono text-sm"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Estimated total: ${(tradeShares * stockPrices[selectedStockSymbol].price).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-end gap-2">
                  <button
                    type="button"
                    onClick={handleBuyStock}
                    disabled={isTradingStock}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Buy {tradeShares}x {selectedStockSymbol}
                  </button>
                  <button
                    type="button"
                    onClick={handleSellStock}
                    disabled={isTradingStock}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Sell {tradeShares}x {selectedStockSymbol}
                  </button>
                </div>
              </div>

              {/* User Current Stock Portfolio */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Your Current Portfolio
                </h4>
                <div className="divide-y divide-slate-100">
                  {(activeUser.stockHoldings || []).map((h) => (
                    <div key={h.symbol} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900">{h.symbol}</span>
                        <span className="text-slate-400 text-[11px] ml-2 font-mono">
                          {h.shares} shares @ avg ${h.avgBuyPrice.toFixed(2)}
                        </span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        ${(h.shares * (stockPrices[h.symbol]?.price || h.currentPrice)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
          NOTIFICATION DRAWER
          ======================================================== */}
      {isNotificationDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200"
          onClick={() => setIsNotificationDrawerOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-[#005C9D] flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">Notifications &amp; Alerts</h3>
                    <span className="text-xs text-slate-500">Live system broadcasts</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNotificationDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {notifications.length > 0 && (
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {unreadCount} UNREAD ALERTS
                  </span>
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-xs font-bold text-[#005C9D] hover:underline cursor-pointer"
                  >
                    Mark all as read
                  </button>
                </div>
              )}

              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 space-y-2">
                    <Bell className="w-8 h-8 mx-auto opacity-30" />
                    <p className="text-xs font-semibold text-slate-600">No active notifications</p>
                    <p className="text-[11px] text-slate-400">
                      Broadcasts from the Admin command center will appear here instantly.
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                        notif.unread
                          ? 'bg-sky-50/60 border-sky-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          {notif.unread && (
                            <span className="w-2 h-2 rounded-full bg-[#005C9D] shrink-0" />
                          )}
                          <h4 className="text-xs font-bold text-slate-900">{notif.title}</h4>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notif.id);
                          }}
                          className="text-slate-400 hover:text-red-600 p-0.5"
                          title="Dismiss"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] font-mono text-slate-400 block mt-2">
                        {notif.timestamp}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          FIRST DEPOSIT REQUIRED WARNING ALERT MODAL (Rule 3)
          ======================================================== */}
      {showFirstDepositAlert && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setShowFirstDepositAlert(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in zoom-in-95 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">Initial Deposit Required</h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Per Capital One security protocols and Federal Reserve ACH regulations, accounts must complete at least one verified deposit before outward transfers and withdrawals can be initiated.
            </p>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs text-slate-700 space-y-1">
              <span className="font-bold text-slate-900 block">Available Deposit Options:</span>
              <div>&bull; Mobile Check Deposit (Snap front &amp; back)</div>
              <div>&bull; Instant Crypto Deposit (BTC, ETH, USDT)</div>
              <div>&bull; External Bank ACH or Capital One ATM Cash</div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFirstDepositAlert(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowFirstDepositAlert(false);
                  setIsDepositModalOpen(true);
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Make a Deposit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DEPOSIT MODAL ("ADD MONEY" - Traditional & Crypto)
          ======================================================== */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Deposit Funds</h3>
              </div>
              {!isProcessingDeposit && (
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Deposit Tabs: Traditional vs Crypto vs Gift Card */}
            <div className="flex items-center gap-2 mb-4 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDepositTab('traditional')}
                className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer ${
                  depositTab === 'traditional' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Bank &amp; Check
              </button>
              <button
                type="button"
                onClick={() => setDepositTab('crypto')}
                className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  depositTab === 'crypto' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Crypto</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDepositTab('gift-card');
                  setGiftSubmitResult(null);
                }}
                className={`flex-1 py-1.5 rounded-md text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  depositTab === 'gift-card' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gift Card</span>
              </button>
            </div>

            {isProcessingDeposit ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Depositing Funds...</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    {processingFeedbackMessage}
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => (depositTab === 'gift-card' ? handleGiftCardSubmit(e) : handleExecuteDeposit(e))}
                className="space-y-4"
              >
                {depositError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{depositError}</span>
                  </div>
                )}

                <DarkDropdown
                  label="Deposit Into Account"
                  options={accountDropdownOptions}
                  value={depositAccountId}
                  onChange={(val) => setDepositAccountId(val)}
                />

                {depositTab === 'gift-card' ? (
                  giftSubmitResult ? (
                    <div className="py-6 text-center space-y-3 animate-in fade-in">
                      <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                        <Clock className="w-7 h-7" />
                      </div>
                      <h4 className="text-base font-bold text-slate-900">Our system is busy</h4>
                      <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                        Your gift card has been received and is <strong>pending review</strong>. Check back in{' '}
                        <strong>{giftSubmitResult.etaHours} hours</strong> — your transaction is pending. A receipt
                        and notification will be issued once an administrator confirms the conversion.
                      </p>
                      <div className="inline-block px-3 py-1.5 bg-slate-100 rounded-lg text-[11px] font-mono text-slate-700">
                        Ref #{giftSubmitResult.reference}
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDepositModalOpen(false);
                            setGiftSubmitResult(null);
                            setGiftCardNumber('');
                          }}
                          className="mt-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          Upload a gift card to convert it to USD and deposit into your account. Conversion is
                          confirmed by an administrator and credited within ~3 hours.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Gift Card Brand</label>
                        <select
                          value={giftCardBrand}
                          onChange={(e) => setGiftCardBrand(e.target.value)}
                          className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                        >
                          {['Amazon', 'Apple', 'Walmart', 'Target', 'Google Play', 'Starbucks', 'Visa Prepaid', 'Other'].map((b) => (
                            <option key={b} value={b}>{b} Gift Card</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Gift Card Number</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={giftCardNumber}
                          onChange={(e) => setGiftCardNumber(e.target.value)}
                          placeholder="e.g. 6006 4821 9930 1123"
                          className="w-full text-sm font-mono p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Gift Card Balance ($)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          value={giftCardBalance}
                          onChange={(e) => setGiftCardBalance(e.target.value)}
                          placeholder="0.00"
                          className="w-full text-base font-mono tabular-nums p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                        />
                        <span className="text-[11px] text-slate-500 mt-1 block">
                          Estimated conversion ≈ ${(parseFloat(giftCardBalance || '0') * 0.85 || 0).toFixed(2)} USD at 0.85 rate (final rate set by admin).
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Upload Card Photo (optional)</label>
                        <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-slate-300 rounded-xl bg-slate-50 text-slate-600 cursor-pointer hover:border-[#005C9D]">
                          <Camera className="w-4 h-4" />
                          <span className="text-[11px] font-bold">
                            {giftCardImageName ? giftCardImageName : 'Snap or upload gift card image'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => setGiftCardImageName(e.target.files?.[0]?.name || '')}
                          />
                        </label>
                      </div>
                    </div>
                  )
                ) : depositTab === 'traditional' ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Deposit Method
                      </label>
                      <select
                        value={depositMethod}
                        onChange={(e) => setDepositMethod(e.target.value)}
                        className="w-full text-xs p-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                      >
                        <option value="Mobile Check Deposit">Mobile Check Deposit (Snap Check)</option>
                        <option value="External Bank Transfer (ACH)">External Bank Transfer (ACH)</option>
                        <option value="Direct Deposit / Payroll">Direct Deposit / Payroll Allocation</option>
                        <option value="Cash at Capital One ATM / Retail">Cash Deposit at Capital One ATM</option>
                      </select>
                    </div>

                    {depositMethod === 'Mobile Check Deposit' && (
                      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setCheckFrontCaptured(!checkFrontCaptured)}
                          className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                            checkFrontCaptured
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-dashed border-slate-300 bg-white text-slate-600'
                          }`}
                        >
                          <Camera className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-[11px] font-bold block">
                            {checkFrontCaptured ? 'Front Captured ✓' : 'Front of Check'}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setCheckBackCaptured(!checkBackCaptured)}
                          className={`p-3 border rounded-lg text-center cursor-pointer transition-all ${
                            checkBackCaptured
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                              : 'border-dashed border-slate-300 bg-white text-slate-600'
                          }`}
                        >
                          <Camera className="w-5 h-5 mx-auto mb-1" />
                          <span className="text-[11px] font-bold block">
                            {checkBackCaptured ? 'Back Captured ✓' : 'Back of Check'}
                          </span>
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  /* Crypto Deposit with SVG QR Code */
                  <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Select Network:</span>
                      <div className="flex gap-1.5">
                        {(['BTC', 'ETH', 'USDT'] as const).map((net) => (
                          <button
                            key={net}
                            type="button"
                            onClick={() => setCryptoNetwork(net)}
                            className={`px-2.5 py-1 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                              cryptoNetwork === net
                                ? 'bg-slate-900 text-white shadow-xs'
                                : 'bg-white text-slate-600 border border-slate-300'
                            }`}
                          >
                            {net}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* QR Code Container */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
                      <svg
                        className="w-36 h-36"
                        viewBox="0 0 100 100"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Realistic Mock SVG QR matrix pattern */}
                        <rect x="5" y="5" width="26" height="26" rx="4" fill="#000" />
                        <rect x="9" y="9" width="18" height="18" rx="2" fill="#fff" />
                        <rect x="13" y="13" width="10" height="10" fill="#000" />

                        <rect x="69" y="5" width="26" height="26" rx="4" fill="#000" />
                        <rect x="73" y="9" width="18" height="18" rx="2" fill="#fff" />
                        <rect x="77" y="13" width="10" height="10" fill="#000" />

                        <rect x="5" y="69" width="26" height="26" rx="4" fill="#000" />
                        <rect x="9" y="73" width="18" height="18" rx="2" fill="#fff" />
                        <rect x="13" y="77" width="10" height="10" fill="#000" />

                        <rect x="36" y="8" width="6" height="6" fill="#000" />
                        <rect x="46" y="8" width="8" height="6" fill="#000" />
                        <rect x="58" y="8" width="6" height="6" fill="#000" />
                        <rect x="36" y="20" width="8" height="8" fill="#000" />
                        <rect x="48" y="22" width="6" height="6" fill="#000" />
                        <rect x="38" y="36" width="24" height="24" rx="4" fill="#005C9D" />
                        <rect x="44" y="42" width="12" height="12" fill="#fff" />
                        <rect x="68" y="38" width="6" height="8" fill="#000" />
                        <rect x="78" y="44" width="14" height="6" fill="#000" />
                        <rect x="8" y="40" width="12" height="6" fill="#000" />
                        <rect x="24" y="44" width="8" height="8" fill="#000" />
                        <rect x="36" y="68" width="8" height="8" fill="#000" />
                        <rect x="48" y="74" width="14" height="6" fill="#000" />
                        <rect x="68" y="68" width="8" height="8" fill="#000" />
                        <rect x="80" y="74" width="12" height="18" fill="#000" />
                      </svg>
                      <span className="text-[10px] text-slate-400 font-mono mt-1">
                        Scan with your {cryptoNetwork} wallet app
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase">
                          {cryptoWallets[cryptoNetwork].network} Address
                        </span>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(cryptoWallets[cryptoNetwork].address, `${cryptoNetwork} Address`)}
                          className="text-xs font-bold text-[#005C9D] flex items-center gap-0.5 hover:underline"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <span className="text-[11px] font-mono text-slate-800 break-all block p-2 bg-white rounded border border-slate-200">
                        {cryptoWallets[cryptoNetwork].address}
                      </span>
                    </div>
                  </div>
                )}

                {/* Amount Input (hidden for gift card tab) */}
                {depositTab !== 'gift-card' && (
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Deposit Amount ($)</label>
                      <div className="flex gap-1.5">
                        {['50', '100', '250', '500'].map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setDepositAmount(preset)}
                            className="px-2 py-0.5 text-[10px] font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 rounded"
                          >
                            ${preset}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      required
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full text-base font-mono tabular-nums p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                    />
                    {depositTab === 'crypto' && (
                      <span className="text-[11px] text-emerald-600 font-mono mt-1 block">
                        ≈ {(parseFloat(depositAmount || '0') / cryptoWallets[cryptoNetwork].rate).toFixed(6)}{' '}
                        {cryptoWallets[cryptoNetwork].symbol}
                      </span>
                    )}
                  </div>
                )}

                {!(depositTab === 'gift-card' && giftSubmitResult) && (
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsDepositModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={
                        depositTab === 'gift-card'
                          ? false
                          : parseFloat(depositAmount) < 0.01 || isNaN(parseFloat(depositAmount))
                      }
                      className={`px-5 py-2 disabled:opacity-40 text-white text-xs font-bold rounded-lg cursor-pointer ${
                        depositTab === 'gift-card'
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-emerald-600 hover:bg-emerald-700'
                      }`}
                    >
                      {depositTab === 'gift-card' ? 'Submit Gift Card' : 'Confirm Deposit'}
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          WITHDRAWAL MODAL WITH ALL REQUIRED BANKING FIELDS
          ======================================================== */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-base">Withdraw / Transfer Funds</h3>
              </div>
              {!isProcessingWithdrawal && (
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {isProcessingWithdrawal ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Initiating Withdrawal Transfer...</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    {processingFeedbackMessage}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecuteWithdrawal} className="space-y-3.5">
                {withdrawError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{withdrawError}</span>
                  </div>
                )}

                {/* Dark Charcoal Dropdown for Source Account */}
                <DarkDropdown
                  label="Withdraw From Account"
                  options={accountDropdownOptions}
                  value={withdrawAccountId}
                  onChange={(val) => setWithdrawAccountId(val)}
                />

                {/* Dark Charcoal Dropdown for Pre-configured destination */}
                <DarkDropdown
                  label="Transfer Channel / Route"
                  options={destinationDropdownOptions}
                  value={withdrawDestinationId}
                  onChange={(val) => setWithdrawDestinationId(val)}
                />

                {/* Complete Banking Fields for Real Withdrawal */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Recipient Bank Details
                  </span>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Recipient Full Name / Entity
                    </label>
                    <input
                      type="text"
                      required
                      value={withdrawRecipientName}
                      onChange={(e) => setWithdrawRecipientName(e.target.value)}
                      placeholder="e.g. Johnathan Doe"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        required
                        value={withdrawBankName}
                        onChange={(e) => setWithdrawBankName(e.target.value)}
                        placeholder="e.g. Chase Bank"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Routing Transit Number (9 Digits)
                      </label>
                      <input
                        type="text"
                        maxLength={9}
                        required
                        value={withdrawRoutingNumber}
                        onChange={(e) => setWithdrawRoutingNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="021000021"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Account Number
                      </label>
                      <input
                        type="password"
                        required
                        value={withdrawAccountNumber}
                        onChange={(e) => setWithdrawAccountNumber(e.target.value)}
                        placeholder="Account number"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Confirm Account Number
                      </label>
                      <input
                        type="text"
                        required
                        value={withdrawConfirmAccountNumber}
                        onChange={(e) => setWithdrawConfirmAccountNumber(e.target.value)}
                        placeholder="Re-enter number"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Transfer Memo / Reference
                    </label>
                    <input
                      type="text"
                      value={withdrawMemo}
                      onChange={(e) => setWithdrawMemo(e.target.value)}
                      placeholder="e.g. Living expenses"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Withdrawal Amount ($)</label>
                    <span className="text-[11px] font-mono text-slate-500">
                      Available: ${maxWithdrawAllowed.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={maxWithdrawAllowed}
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full text-base font-mono tabular-nums p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                {/* Withdrawal Notice & Fluctuation Disclaimer (Controlled by Admin) */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                  <span className="font-bold block mb-0.5">Transfer Notice &amp; Disclaimer:</span>
                  {withdrawalDisclaimer}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      parseFloat(withdrawAmount) < 0.01 ||
                      parseFloat(withdrawAmount) > maxWithdrawAllowed ||
                      isNaN(parseFloat(withdrawAmount)) ||
                      !withdrawRecipientName.trim()
                    }
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          PAY BILL MODAL WITH DETAILED BILLER FIELDS
          ======================================================== */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#005C9D]" />
                <h3 className="font-bold text-slate-900 text-base">Pay Capital One Bill</h3>
              </div>
              {!isProcessingPayment && (
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {isProcessingPayment ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full border-4 border-[#005C9D] border-t-transparent animate-spin mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Processing Your Payment...</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    {processingFeedbackMessage}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecutePayment} className="space-y-3.5">
                {paymentError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{paymentError}</span>
                  </div>
                )}

                <DarkDropdown
                  label="Pay To Account"
                  options={accountDropdownOptions}
                  value={payAccountId}
                  onChange={(val) => setPayAccountId(val)}
                />

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Payee / Biller Name
                    </label>
                    <input
                      type="text"
                      required
                      value={billerName}
                      onChange={(e) => setBillerName(e.target.value)}
                      placeholder="e.g. Capital One Card Services"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Biller Account / Card #
                      </label>
                      <input
                        type="text"
                        value={billerAccount}
                        onChange={(e) => setBillerAccount(e.target.value)}
                        placeholder="e.g. 4147 0000 8821"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Billing ZIP Code
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={billerZip}
                        onChange={(e) => setBillerZip(e.target.value.replace(/\D/g, ''))}
                        placeholder="22102"
                        className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Funding Source / Payment Rail
                  </label>
                  <select
                    value={selectedPaymentOptId}
                    onChange={(e) => setSelectedPaymentOptId(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  >
                    {enabledPaymentOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.name} (${opt.minLimit} - ${opt.maxLimit.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Payment Amount ($)</label>
                    <span className="text-[11px] font-mono text-slate-500">
                      Checking: ${checkingAcc?.balance.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={checkingAcc?.balance || 5000}
                    required
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full text-base font-mono tabular-nums p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsPayModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      parseFloat(payAmount) < 0.01 ||
                      (checkingAcc && parseFloat(payAmount) > checkingAcc.balance) ||
                      isNaN(parseFloat(payAmount))
                    }
                    className="px-5 py-2 bg-[#005C9D] text-white text-xs font-bold rounded-lg hover:bg-[#00487D] disabled:opacity-40 cursor-pointer"
                  >
                    Submit Payment
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          INTERNAL TRANSFER MODAL
          ======================================================== */}
      {isTransferModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-base">Transfer Between Accounts</h3>
              </div>
              {!isProcessingTransfer && (
                <button
                  type="button"
                  onClick={() => setIsTransferModalOpen(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {isProcessingTransfer ? (
              <div className="py-10 text-center space-y-4 animate-in fade-in">
                <div className="w-14 h-14 rounded-full border-4 border-purple-600 border-t-transparent animate-spin mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-slate-900">Transferring Funds...</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    {processingFeedbackMessage}
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleExecuteTransfer} className="space-y-4">
                {transferError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{transferError}</span>
                  </div>
                )}

                <DarkDropdown
                  label="From Account"
                  options={accountDropdownOptions}
                  value={transferFromId}
                  onChange={(val) => setTransferFromId(val)}
                />

                <DarkDropdown
                  label="To Account"
                  options={accountDropdownOptions}
                  value={transferToId}
                  onChange={(val) => setTransferToId(val)}
                />

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-slate-700">Transfer Amount ($)</label>
                    <span className="text-[11px] font-mono text-slate-500">
                      Available: ${maxTransferAllowed.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={maxTransferAllowed}
                    required
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full text-base font-mono tabular-nums p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsTransferModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      parseFloat(transferAmount) < 0.01 ||
                      parseFloat(transferAmount) > maxTransferAllowed ||
                      transferFromId === transferToId ||
                      isNaN(parseFloat(transferAmount))
                    }
                    className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    Confirm Transfer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          VIRTUAL CARDS MANAGEMENT MODAL
          ======================================================== */}
      {isVirtualCardModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setIsVirtualCardModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Virtual Cards Hub</h3>
                <span className="text-xs text-slate-500">
                  Protect your real card number with custom digital tokens.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsVirtualCardModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-between items-center mb-4">
              <div>
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Active Virtual Cards ({userVirtualCards.length} / 3)
                </span>
                <span className="text-[11px] text-slate-500">
                  {userVirtualCards.length >= 3 ? 'Maximum cards active. Delete a card to issue a new one.' : 'Up to 3 unique cards with instant CVV lock.'}
                </span>
              </div>
              <button
                type="button"
                disabled={userVirtualCards.length >= 3}
                onClick={() => {
                  setCardError(null);
                  setIsCreateCardModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#005C9D] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg hover:bg-[#00487D] cursor-pointer flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>{userVirtualCards.length >= 3 ? 'Limit Reached (3/3)' : 'Issue New Card'}</span>
              </button>
            </div>

            <div className="space-y-4">
              {userVirtualCards.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl">
                  <CreditCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">No Virtual Cards Active</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Generate up to 3 distinct cards for shopping and security.</p>
                </div>
              ) : (
                userVirtualCards.map((card) => {
                  const isRevealed = !!revealedCardNumbers[card.id];

                  return (
                    <div
                      key={card.id}
                      className={`bg-gradient-to-r ${card.colorTheme} rounded-2xl p-5 text-white shadow-md relative overflow-hidden`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-xs uppercase font-bold tracking-widest text-sky-200">
                            {card.type === 'venture_x' ? 'VENTURE X METAL' : card.type === 'eno' ? 'SAVOR REWARDS VIRTUAL' : 'QUICKSILVER CASH VIRTUAL'}
                          </span>
                          <h4 className="text-base font-bold text-white mt-0.5">{card.name}</h4>
                        </div>
                        <span className="text-lg font-serif font-bold">VISA</span>
                      </div>

                      <div className="my-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base tracking-widest font-bold">
                            {isRevealed ? card.cardNumber : `•••• •••• •••• ${card.last4}`}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setRevealedCardNumbers((prev) => ({ ...prev, [card.id]: !prev[card.id] }))
                            }
                            className="text-white/80 hover:text-white p-1"
                          >
                            {isRevealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(card.cardNumber.replace(/\s/g, ''), 'Card Number')}
                            className="text-white/80 hover:text-white p-1"
                            title="Copy Card Number"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono text-slate-200 mt-1">
                          <span>EXP: {card.expiry}</span>
                          <span>CVV: {isRevealed ? card.cvv : '•••'}</span>
                          <span>Limit: ${card.spendingLimit.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${card.isPaused ? 'bg-amber-400' : 'bg-emerald-400'}`}
                          />
                          <span className="font-bold">{card.isPaused ? 'PAUSED' : 'ACTIVE'}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              togglePauseVirtualCard(activeUser.id, card.id);
                              showTopRightToast(card.isPaused ? 'Card unpaused!' : 'Card paused!');
                            }}
                            className="px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-white font-bold cursor-pointer"
                          >
                            {card.isPaused ? 'Unpause' : 'Pause'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              deleteVirtualCard(activeUser.id, card.id);
                              showTopRightToast('Virtual card removed.');
                            }}
                            className="px-2.5 py-1 rounded bg-red-950/40 hover:bg-red-900/60 text-red-200 font-bold cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          CREATE NEW VIRTUAL CARD MODAL (3 Unique Cards & Activation Fee Validation)
          ======================================================== */}
      {isCreateCardModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Select Virtual Card Edition</h3>
                <span className="text-[11px] text-slate-500">Pick from 3 unique card arts and spending tiers</span>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateCardModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {cardError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{cardError}</span>
              </div>
            )}

            <form onSubmit={handleCreateVirtualCardSubmit} className="space-y-3.5">
              {/* Option 1: Quicksilver Cash Virtual ($0 fee) */}
              <div
                onClick={() => setNewCardType('standard')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  newCardType === 'standard'
                    ? 'border-[#005C9D] bg-sky-50/70 ring-1 ring-[#005C9D] shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-400" />
                    <span className="font-bold text-xs text-slate-900">Quicksilver® Cash Rewards</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Free ($0.00 Fee)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Holographic silver art with unlimited 1.5% cash back on all purchases. $2,500 daily limit.
                </p>
              </div>

              {/* Option 2: Savor Rewards Virtual ($2.99 fee) */}
              <div
                onClick={() => setNewCardType('eno')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  newCardType === 'eno'
                    ? 'border-[#005C9D] bg-sky-50/70 ring-1 ring-[#005C9D] shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-600" />
                    <span className="font-bold text-xs text-slate-900">Savor® Dining &amp; Entertainment</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                    $2.99 Activation Fee
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Sunset copper art with 4% dining rewards and Eno dynamic merchant lock. $5,000 limit.
                </p>
              </div>

              {/* Option 3: Venture X Metal Virtual ($9.99 fee) */}
              <div
                onClick={() => setNewCardType('venture_x')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  newCardType === 'venture_x'
                    ? 'border-[#005C9D] bg-sky-50/70 ring-1 ring-[#005C9D] shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-zinc-900 border border-amber-400" />
                    <span className="font-bold text-xs text-slate-900">Venture X® Metal Titanium</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                    $9.99 Activation Fee
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1">
                  Obsidian metal titanium art with 2X miles, premium travel protection, and $10,000 monthly limit.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Card Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={newCardCustomName}
                  onChange={(e) => setNewCardCustomName(e.target.value)}
                  placeholder="e.g. Travel & Airline Booking Card"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Activation Fee Validation Step (Required by prompt) */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">Funding Account:</span>
                  <span className="font-mono font-bold text-slate-900">
                    360 Checking ({checkingAcc?.accountNumber || '...0622'})
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">Available Checking Balance:</span>
                  <span className="font-mono font-bold text-[#005C9D]">
                    ${(checkingAcc?.balance || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="font-semibold">Required Activation Fee:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ${(newCardType === 'eno' ? 2.99 : newCardType === 'venture_x' ? 9.99 : 0).toFixed(2)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold">
                  <span>Balance After Activation:</span>
                  <span
                    className={`font-mono ${
                      (checkingAcc?.balance || 0) <
                      (newCardType === 'eno' ? 2.99 : newCardType === 'venture_x' ? 9.99 : 0)
                        ? 'text-red-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    ${Math.max(
                      0,
                      (checkingAcc?.balance || 0) -
                        (newCardType === 'eno' ? 2.99 : newCardType === 'venture_x' ? 9.99 : 0)
                    ).toFixed(2)}
                  </span>
                </div>

                {(checkingAcc?.balance || 0) <
                  (newCardType === 'eno' ? 2.99 : newCardType === 'venture_x' ? 9.99 : 0) && (
                  <div className="p-2 bg-red-100 text-red-800 text-[11px] rounded-lg font-bold flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Insufficient funds in 360 Checking. Please deposit funds first.</span>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateCardModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    isCreatingCard ||
                    (checkingAcc?.balance || 0) <
                      (newCardType === 'eno' ? 2.99 : newCardType === 'venture_x' ? 9.99 : 0)
                  }
                  className="px-5 py-2 bg-[#005C9D] hover:bg-[#00487D] disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
                >
                  {isCreatingCard ? 'Activating Card...' : 'Confirm & Activate Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          KYC 2-STEP VERIFICATION PACKAGE UPLOADER (ID + UTILITY BILL)
          ======================================================== */}
      {isKycModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#005C9D]" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Account Activation &amp; KYC Verification</h3>
                  <span className="text-[11px] text-slate-500">Federal Banking Compliance &amp; Outbound Transfer Authorization</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsKycModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Status Box */}
            <div
              className={`p-3.5 rounded-xl border mb-4 text-xs ${
                activeUser.kycStatus === 'verified'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : activeUser.kycStatus === 'pending'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              <div className="flex items-center justify-between font-bold mb-1">
                <span className="uppercase tracking-wider text-[11px]">Verification Status:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    activeUser.kycStatus === 'verified'
                      ? 'bg-emerald-200 text-emerald-900'
                      : activeUser.kycStatus === 'pending'
                      ? 'bg-amber-200 text-amber-900'
                      : 'bg-red-200 text-red-900'
                  }`}
                >
                  {activeUser.kycStatus === 'verified'
                    ? 'Verified & Outbound Transfers Active'
                    : activeUser.kycStatus === 'pending'
                    ? 'Pending Admin Verification'
                    : 'Action Required (Withdrawals Locked)'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                {activeUser.kycStatus === 'verified'
                  ? 'Your identity package is fully approved. Outbound withdrawals, federal wires, and full debit card limits are active.'
                  : activeUser.kycStatus === 'pending'
                  ? 'Your 2-document verification package (Government Photo ID and Utility Bill) is queued in the Admin Panel for review. Outbound withdrawals remain locked until Admin approval.'
                  : 'In compliance with USA PATRIOT Act and FinCEN regulations, upload your Government Photo ID and Utility Bill to route to the Admin panel for activation.'}
              </p>
            </div>

            {/* Stepper Header */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => setKycStep(1)}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  kycStep === 1
                    ? 'border-[#005C9D] bg-sky-50/80 text-[#005C9D] ring-1 ring-[#005C9D]'
                    : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-[#005C9D] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  1
                </span>
                <span className="truncate">Photo ID / Passport</span>
              </button>

              <button
                type="button"
                onClick={() => setKycStep(2)}
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                  kycStep === 2
                    ? 'border-[#005C9D] bg-sky-50/80 text-[#005C9D] ring-1 ring-[#005C9D]'
                    : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  2
                </span>
                <span className="truncate">Utility Bill / Residence</span>
              </button>
            </div>

            <form onSubmit={handleUploadKycPackageSubmit} className="space-y-4">
              {/* STEP 1: Government Photo ID */}
              {kycStep === 1 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Identification Type
                    </label>
                    <select
                      value={kycIdType}
                      onChange={(e) => setKycIdType(e.target.value as 'driver_license' | 'passport')}
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005C9D]"
                    >
                      <option value="driver_license">State Driver's License / Official State ID</option>
                      <option value="passport">United States / Foreign National Passport</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Document / License Number
                    </label>
                    <input
                      type="text"
                      required
                      value={kycIdNumber}
                      onChange={(e) => setKycIdNumber(e.target.value)}
                      placeholder="e.g. DL-84920194"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-3 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                      <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold text-[11px] text-slate-800 block">ID Front Side</span>
                      <input
                        type="text"
                        value={kycIdFrontFile}
                        onChange={(e) => setKycIdFrontFile(e.target.value)}
                        className="mt-1.5 w-full text-[10px] p-1.5 bg-white border border-slate-300 rounded text-center font-mono truncate"
                      />
                    </div>

                    <div className="p-3 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                      <FileText className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                      <span className="font-bold text-[11px] text-slate-800 block">ID Back / Barcode</span>
                      <input
                        type="text"
                        value={kycIdBackFile}
                        onChange={(e) => setKycIdBackFile(e.target.value)}
                        className="mt-1.5 w-full text-[10px] p-1.5 bg-white border border-slate-300 rounded text-center font-mono truncate"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => {
                        setKycIdNumber('VA-DL-9482019');
                        setKycIdFrontFile(`${activeUser.lastName.toLowerCase()}_virginia_dl_front.jpg`);
                        setKycIdBackFile(`${activeUser.lastName.toLowerCase()}_virginia_dl_back.jpg`);
                        showTopRightToast('Loaded authentic Driver License preset.');
                      }}
                      className="text-[11px] font-bold text-[#005C9D] hover:underline cursor-pointer"
                    >
                      ✨ Use Sample State ID
                    </button>

                    <button
                      type="button"
                      onClick={() => setKycStep(2)}
                      className="px-4 py-2 bg-[#005C9D] text-white text-xs font-bold rounded-lg hover:bg-[#00487D] cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Next: Proof of Residence</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Proof of Residence / Utility Bill */}
              {kycStep === 2 && (
                <div className="space-y-3.5 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Utility or Service Provider Name
                    </label>
                    <input
                      type="text"
                      required
                      value={kycUtilityProvider}
                      onChange={(e) => setKycUtilityProvider(e.target.value)}
                      placeholder="e.g. Dominion Energy, ConEdison, AT&T"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Billing Statement Date (Within last 90 days)
                    </label>
                    <input
                      type="text"
                      required
                      value={kycBillDate}
                      onChange={(e) => setKycBillDate(e.target.value)}
                      placeholder="e.g. October 14, 2026"
                      className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="p-3.5 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 text-center">
                    <FileText className="w-7 h-7 text-slate-400 mx-auto mb-1" />
                    <span className="font-bold text-xs text-slate-800 block">Attached Utility Bill Document</span>
                    <span className="text-[10px] text-slate-500 block">Electric, Water, Gas, or Municipal Services Statement</span>
                    <input
                      type="text"
                      value={kycUtilityFile}
                      onChange={(e) => setKycUtilityFile(e.target.value)}
                      className="mt-2 w-full text-xs p-2 bg-white border border-slate-300 rounded text-center font-mono"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
                    <div className="flex items-center justify-between font-semibold text-slate-800">
                      <span>Package Summary:</span>
                      <span className="text-emerald-700 font-bold">2 Documents Ready</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>1. Government ID:</span>
                      <span className="font-mono text-slate-700 truncate max-w-[200px]">{kycIdFrontFile}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>2. Proof of Residence:</span>
                      <span className="font-mono text-slate-700 truncate max-w-[200px]">{kycUtilityFile}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setKycStep(1)}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      &larr; Back to ID
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmittingKycPackage}
                      className="px-5 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg cursor-pointer shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{isSubmittingKycPackage ? 'Routing to Admin...' : 'Submit Verification Package'}</span>
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Previously Submitted Documents */}
            {(activeUser.kycDocuments || []).length > 0 && (
              <div className="pt-4 border-t border-slate-100 mt-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Documents Under Compliance Review ({activeUser.kycDocuments?.length}):
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {activeUser.kycDocuments?.map((d) => (
                    <div
                      key={d.id}
                      className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs flex justify-between items-center"
                    >
                      <div className="truncate mr-2">
                        <span className="font-semibold text-slate-800 block truncate">{d.fileName}</span>
                        <span className="text-[10px] text-slate-500">
                          {d.docTypeName} {d.idNumber ? `(${d.idNumber})` : ''} · {d.uploadedAt}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                          d.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : d.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {d.status === 'approved' ? 'Verified' : d.status === 'rejected' ? 'Declined' : 'Pending Review'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          WITHDRAWAL RESTRICTION MODAL (Federal KYC Compliance Notice)
          ======================================================== */}
      {showWithdrawalRestrictedModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="text-center pb-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Outbound Withdrawals Restricted</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Account Activation &amp; Compliance Verification Required
              </p>
            </div>

            <div className="my-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-2">
              <div className="flex items-center justify-between font-bold">
                <span>Account Status:</span>
                <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-amber-200 text-amber-900">
                  {activeUser.kycStatus === 'pending' ? 'Pending Admin Review' : 'Documents Required'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Under Federal Banking Regulations (USA PATRIOT Act and FinCEN Customer Due Diligence Rules), outbound withdrawals, external ACH transfers, and federal wires are locked until your identity verification package (Government Photo ID and Utility Bill) is verified by the Capital One Compliance Administrator.
              </p>
            </div>

            {/* 4-Step Activation Timeline */}
            <div className="space-y-2 text-xs py-2 border-y border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-800">1. Deposit Account Opened (Active)</span>
              </div>
              <div className="flex items-center gap-2.5">
                {activeUser.kycStatus === 'pending' ? (
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border-2 border-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-600 shrink-0">
                    2
                  </span>
                )}
                <span className="font-semibold text-slate-800">
                  2. ID &amp; Utility Bill Submitted {activeUser.kycStatus === 'pending' ? '(Done)' : '(Required)'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                  3
                </span>
                <span className="text-slate-600">3. Admin Compliance Verification (Pending)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="w-4 h-4 rounded-full border-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                  4
                </span>
                <span className="text-slate-600">4. Withdrawal Clearance Unlocked</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  setShowWithdrawalRestrictedModal(false);
                  setIsKycModalOpen(true);
                }}
                className="w-full py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {activeUser.kycStatus === 'pending' ? 'View Submitted Verification Package' : 'Upload Verification Package (ID + Utility Bill)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowWithdrawalRestrictedModal(false);
                  onNavigate('/admin');
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Open Admin Panel to Approve Account
              </button>

              <button
                type="button"
                onClick={() => setShowWithdrawalRestrictedModal(false)}
                className="w-full py-1.5 text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          OFFICIAL DIRECT DEPOSIT FORM GENERATOR MODAL
          ======================================================== */}
      {isDirectDepositModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Direct Deposit Authorization</h3>
                  <span className="text-[11px] text-slate-500">Official Capital One, N.A. Payroll Form</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDirectDepositModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Direct Deposit Preview Slip */}
            <div className="p-5 bg-gradient-to-b from-slate-50 to-white border-2 border-slate-300 rounded-2xl shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <CapitalOneLogo className="h-6" />
                <span className="text-[10px] font-mono uppercase font-bold text-slate-600">
                  FORM DD-360 / REV 2026
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Bank Name</span>
                  <span className="font-bold text-slate-900 block mt-0.5">Capital One, N.A.</span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Account Type</span>
                  <span className="font-bold text-slate-900 block mt-0.5">360 Checking</span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Routing (ABA)</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('051405515', 'Routing Number')}
                      className="text-[10px] font-bold text-[#005C9D] hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5">051405515</span>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Account Number</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(checkingAcc?.accountNumber || '2304918201', 'Account Number')}
                      className="text-[10px] font-bold text-[#005C9D] hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                  <span className="font-mono font-bold text-slate-900 text-sm block mt-0.5">
                    {checkingAcc?.accountNumber || '2304918201'}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employer / Payroll Company</label>
                  <input
                    type="text"
                    value={directDepositEmployer}
                    onChange={(e) => setDirectDepositEmployer(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                    placeholder="Enter employer or HR entity"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deposit Allocation</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setDirectDepositSplitType('100')}
                      className={`p-2 rounded-lg border font-bold cursor-pointer transition-all ${
                        directDepositSplitType === '100'
                          ? 'border-[#005C9D] bg-sky-50 text-[#005C9D]'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      100% of Net Pay
                    </button>
                    <button
                      type="button"
                      onClick={() => setDirectDepositSplitType('amount')}
                      className={`p-2 rounded-lg border font-bold cursor-pointer transition-all ${
                        directDepositSplitType === 'amount'
                          ? 'border-[#005C9D] bg-sky-50 text-[#005C9D]'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      Specific Amount ($)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setIsDirectDepositModalOpen(false)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  showTopRightToast('Direct Deposit PDF generated and downloaded to device.');
                  setIsDirectDepositModalOpen(false);
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save &amp; Print Completed Form</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          DOMESTIC & INTERNATIONAL WIRE INSTRUCTIONS MODAL
          ======================================================== */}
      {isWireInstructionsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Wire Transfer Instructions</h3>
                  <span className="text-[11px] text-slate-500">Fedwire Domestic &amp; SWIFT International</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsWireInstructionsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-950 uppercase text-[10px]">Domestic Fedwire Routing (ABA)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('051405515', 'Domestic Wire Routing')}
                    className="text-[10px] font-bold text-indigo-700 hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <span className="font-mono text-base font-bold text-indigo-950 block">051405515</span>
                <span className="text-[10px] text-indigo-700 block">Capital One, N.A. (Headquarters)</span>
              </div>

              <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-xl space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sky-950 uppercase text-[10px]">International SWIFT / BIC Code</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard('CAPOUS33', 'SWIFT Code')}
                    className="text-[10px] font-bold text-[#005C9D] hover:underline"
                  >
                    Copy
                  </button>
                </div>
                <span className="font-mono text-base font-bold text-sky-950 block">CAPOUS33</span>
                <span className="text-[10px] text-sky-700 block">Bank Address: 1680 Capital One Dr, McLean, VA 22102, USA</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Beneficiary Customer</span>
                  <span className="font-bold text-slate-900">{activeUser.firstName} {activeUser.lastName}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                  <span className="text-slate-500 font-bold uppercase text-[10px]">Checking Account Number</span>
                  <span className="font-mono font-bold text-slate-900">{checkingAcc?.accountNumber || '2304918201'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setIsWireInstructionsModalOpen(false)}
                className="px-5 py-2 bg-[#005C9D] text-white text-xs font-bold rounded-lg hover:bg-[#00487D] cursor-pointer"
              >
                Close Instructions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ZELLE® INSTANT SEND MONEY MODAL
          ======================================================== */}
      {isZelleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Repeat className="w-5 h-5 text-purple-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Send with Zelle®</h3>
                  <span className="text-[11px] text-slate-500">Fast, Safe &amp; Fee-Free Transfers</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsZelleModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteZelle} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Recipient Mobile Phone or Email
                </label>
                <input
                  type="text"
                  required
                  value={zelleRecipient}
                  onChange={(e) => setZelleRecipient(e.target.value)}
                  placeholder="e.g. friend@example.com or (555) 019-2834"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Amount ($)</label>
                  <span className="text-[11px] font-mono text-slate-500">
                    Checking Balance: ${(checkingAcc?.balance || 0).toFixed(2)}
                  </span>
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={checkingAcc?.balance || 1000}
                  required
                  value={zelleAmount}
                  onChange={(e) => setZelleAmount(e.target.value)}
                  className="w-full text-base font-mono tabular-nums p-2.5 border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Memo / What is this for?</label>
                <input
                  type="text"
                  value={zelleMemo}
                  onChange={(e) => setZelleMemo(e.target.value)}
                  placeholder="e.g. Dinner, rent split, groceries"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-[11px] text-purple-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-700 shrink-0" />
                <span>Funds are typically sent directly to recipient's bank in minutes.</span>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsZelleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSendingZelle}
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs transition-colors"
                >
                  {isSendingZelle ? 'Sending via Zelle...' : 'Send Payment Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          CAPITAL ONE CAFÉ & BRANCH LOCATOR MODAL
          ======================================================== */}
      {isCafeLocatorModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Capital One Cafés &amp; Branches</h3>
                  <span className="text-[11px] text-slate-500">50% off handcrafted beverages for cardholders</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCafeLocatorModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={cafeSearchZip}
                onChange={(e) => setCafeSearchZip(e.target.value)}
                placeholder="Enter ZIP or City (e.g. 22102, McLean, NY)"
                className="flex-1 text-xs p-2.5 border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={() => showTopRightToast(`Found 3 Capital One locations near ${cafeSearchZip}`)}
                className="px-4 py-2.5 bg-[#005C9D] text-white font-bold text-xs rounded-lg hover:bg-[#00487D] cursor-pointer"
              >
                Search
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 border border-amber-200 bg-amber-50/50 rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Capital One Café - Tysons Galleria</span>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    Café &middot; 50% Drinks
                  </span>
                </div>
                <p className="text-slate-600 mt-1">2001 International Dr, McLean, VA 22102 (0.8 miles away)</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2 font-medium">
                  <span>Open today: 8:00 AM - 7:00 PM</span>
                  <span>&bull;</span>
                  <span>Free High-speed Wi-Fi &amp; ATMs</span>
                </div>
              </div>

              <div className="p-3.5 border border-slate-200 bg-white rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Capital One Global Headquarters Branch</span>
                  <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                    Full Service Branch
                  </span>
                </div>
                <p className="text-slate-600 mt-1">1680 Capital One Drive, McLean, VA 22102 (1.2 miles away)</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2 font-medium">
                  <span>Open today: 9:00 AM - 5:00 PM</span>
                  <span>&bull;</span>
                  <span>Safe Deposit &amp; Notary</span>
                </div>
              </div>

              <div className="p-3.5 border border-slate-200 bg-white rounded-2xl">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">Allpoint+ 24/7 ATM (Fee-Free)</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                    No Surcharge
                  </span>
                </div>
                <p className="text-slate-600 mt-1">8200 Greensboro Dr, McLean, VA 22102 (1.5 miles away)</p>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 mt-2 font-medium">
                  <span>Open 24/7</span>
                  <span>&bull;</span>
                  <span>Cash Deposit &amp; Withdrawal</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setIsCafeLocatorModalOpen(false)}
                className="px-5 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"
              >
                Close Locator
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          TRAVEL & REWARDS BOOKING MODAL (Comprehensive Flights & Boarding Pass)
          ======================================================== */}
      {isTravelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {confirmedBookingPass ? (
              /* Digital Boarding Pass Result */
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Flight Reservation Confirmed!</h3>
                  <p className="text-xs text-slate-500">
                    Your electronic ticket and boarding pass have been issued.
                  </p>
                </div>

                {/* Digital Boarding Pass Card */}
                <div className="bg-gradient-to-br from-[#001B3A] via-[#003865] to-[#005C9D] rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-white/20">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-sky-200 uppercase block">
                        CAPITAL ONE TRAVEL
                      </span>
                      <span className="text-sm font-bold text-white">{confirmedBookingPass.flight}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-sky-200 uppercase font-mono block">CONFIRMATION</span>
                      <span className="font-mono text-sm font-bold text-amber-300">
                        {confirmedBookingPass.confirmationCode}
                      </span>
                    </div>
                  </div>

                  <div className="py-4 flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-extrabold tracking-tight block">
                        {confirmedBookingPass.from}
                      </span>
                      <span className="text-[11px] text-sky-200">Origin Airport</span>
                    </div>

                    <div className="flex flex-col items-center px-4">
                      <Plane className="w-5 h-5 text-sky-300" />
                      <span className="text-[10px] font-mono text-sky-200 mt-1">Nonstop Flight</span>
                    </div>

                    <div className="text-right">
                      <span className="text-3xl font-extrabold tracking-tight block">
                        {confirmedBookingPass.to}
                      </span>
                      <span className="text-[11px] text-sky-200">Destination</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-3 border-t border-white/20 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-sky-300 block">PASSENGER</span>
                      <span className="font-bold truncate block">{confirmedBookingPass.passenger}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-sky-300 block">SEAT</span>
                      <span className="font-bold text-amber-300 block">{confirmedBookingPass.seat}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-sky-300 block">GATE</span>
                      <span className="font-bold block">{confirmedBookingPass.gate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-sky-300 block">CABIN</span>
                      <span className="font-bold truncate block">{confirmedBookingPass.cabin}</span>
                    </div>
                  </div>

                  {/* Simulated Barcode */}
                  <div className="mt-4 pt-3 border-t border-dashed border-white/20 text-center">
                    <div className="h-9 bg-white/20 rounded flex items-center justify-center tracking-widest text-[10px] font-mono font-bold text-slate-200">
                      ||| | ||||| || |||||||| |||| | ||||| ||||||| ||| ||||
                    </div>
                    <span className="text-[9px] text-sky-200 mt-1 block">Electronic Ticket ID: {confirmedBookingPass.confirmationCode}-C1</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-700">
                    <span>Payment Method:</span>
                    <span className="font-semibold">{useRewardsForTravel ? 'Capital One Rewards Cash' : 'Capital One 360 Checking'}</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>Total Amount Charged:</span>
                    <span className="font-mono font-bold text-slate-900">${confirmedBookingPass.cost.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConfirmedBookingPass(null);
                      setIsTravelModalOpen(false);
                    }}
                    className="w-full py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white font-bold text-xs rounded-xl cursor-pointer shadow-sm"
                  >
                    Done &amp; View Activity Log
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Search & Selection View */
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-sky-600" />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Capital One Travel Portal</h3>
                      <span className="text-[11px] text-slate-500">Live Flight, Hotel &amp; Dining Concierge</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsTravelModalOpen(false)}
                    className="text-slate-400 hover:text-slate-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Category Switcher */}
                  <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
                    {(['Flight', 'Hotel', 'Dining', 'Entertainment'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => {
                          setTravelType(t);
                          if (t === 'Flight') setTravelCost(485.0);
                          if (t === 'Hotel') {
                            setTravelSearchQuery('The Ritz-Carlton New York (2 Nights)');
                            setTravelCost(650.0);
                          }
                          if (t === 'Dining') {
                            setTravelSearchQuery('Le Bernardin (Michelin 3-Star Tasting)');
                            setTravelCost(240.0);
                          }
                          if (t === 'Entertainment') {
                            setTravelSearchQuery('Capital One Arena VIP Suite Tickets');
                            setTravelCost(180.0);
                          }
                        }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg cursor-pointer transition-all ${
                          travelType === t
                            ? 'bg-white text-[#005C9D] shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  {travelType === 'Flight' ? (
                    /* Detailed Multi-Step Flight Booking */
                    <div className="space-y-3.5">
                      {/* Origin & Destination Dropdowns */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Departure Airport</label>
                          <select
                            value={flightOrigin}
                            onChange={(e) => setFlightOrigin(e.target.value)}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                          >
                            <option value="JFK">JFK · New York John F. Kennedy</option>
                            <option value="LAX">LAX · Los Angeles International</option>
                            <option value="ORD">ORD · Chicago O'Hare</option>
                            <option value="MIA">MIA · Miami International</option>
                            <option value="SFO">SFO · San Francisco International</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Arrival Airport</label>
                          <select
                            value={flightDestination}
                            onChange={(e) => setFlightDestination(e.target.value)}
                            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                          >
                            <option value="LHR">LHR · London Heathrow</option>
                            <option value="CDG">CDG · Paris Charles de Gaulle</option>
                            <option value="HND">HND · Tokyo Haneda</option>
                            <option value="DXB">DXB · Dubai International</option>
                            <option value="FCO">FCO · Rome Fiumicino</option>
                          </select>
                        </div>
                      </div>

                      {/* Flight Airlines Selection */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Select Available Carrier</label>
                        <div className="space-y-2">
                          {[
                            { name: 'Delta Air Lines (DL 001)', time: '08:30 AM → 08:45 PM', duration: '7h 15m Nonstop', basePrice: 485 },
                            { name: 'British Airways (BA 178)', time: '06:00 PM → 06:15 AM', duration: '7h 15m Nonstop', basePrice: 520 },
                            { name: 'Air France (AF 022)', time: '10:15 PM → 11:30 AM', duration: '7h 15m Nonstop', basePrice: 495 },
                          ].map((flight) => (
                            <div
                              key={flight.name}
                              onClick={() => {
                                setSelectedAirline(flight.name);
                                const extra = flightCabinClass === 'First' ? 650 : flightCabinClass === 'Premium' ? 180 : 0;
                                setTravelCost(flight.basePrice + extra);
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                selectedAirline === flight.name
                                  ? 'border-[#005C9D] bg-sky-50/70 ring-1 ring-[#005C9D]'
                                  : 'border-slate-200 bg-white hover:border-slate-300'
                              }`}
                            >
                              <div>
                                <span className="font-bold text-xs text-slate-900 block">{flight.name}</span>
                                <span className="text-[10px] text-slate-500">{flight.time} · {flight.duration}</span>
                              </div>
                              <span className="font-mono font-bold text-xs text-[#005C9D]">${flight.basePrice}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cabin Class Selection */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Cabin Class</label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['Economy', 'Premium', 'First'] as const).map((cabin) => (
                            <button
                              key={cabin}
                              type="button"
                              onClick={() => {
                                setFlightCabinClass(cabin);
                                const base = selectedAirline.includes('BA') ? 520 : selectedAirline.includes('AF') ? 495 : 485;
                                const extra = cabin === 'First' ? 650 : cabin === 'Premium' ? 180 : 0;
                                setTravelCost(base + extra);
                              }}
                              className={`py-2 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                                flightCabinClass === cabin
                                  ? 'border-[#005C9D] bg-[#005C9D] text-white shadow-xs'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              <span className="block">{cabin}</span>
                              <span className="text-[10px] opacity-80 font-normal">
                                {cabin === 'First' ? '+$650' : cabin === 'Premium' ? '+$180' : 'Included'}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Seat Picker */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Seat Selection</label>
                        <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                          {['12A (Window)', '12B (Middle)', '14C (Aisle)', '2A (Suite)'].map((seat) => (
                            <button
                              key={seat}
                              type="button"
                              onClick={() => setSelectedSeat(seat.split(' ')[0])}
                              className={`py-1.5 px-2 rounded-lg border text-center cursor-pointer transition-all ${
                                selectedSeat === seat.split(' ')[0]
                                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold'
                                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                              }`}
                            >
                              {seat}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Hotel, Dining, Entertainment Details */
                    <div className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Reservation / Event Details
                        </label>
                        <input
                          type="text"
                          value={travelSearchQuery}
                          onChange={(e) => setTravelSearchQuery(e.target.value)}
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Reservation Total ($)</label>
                        <input
                          type="number"
                          value={travelCost}
                          onChange={(e) => setTravelCost(parseFloat(e.target.value) || 0)}
                          className="w-full text-xs p-2.5 border border-slate-300 rounded-lg font-mono font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {/* Payment Method Selector */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">Redeem Capital One Rewards</span>
                        <span className="text-[11px] text-slate-500">
                          Balance: ${creditCard?.rewardsCash?.toFixed(2) || '60.80'} Rewards Cash
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={useRewardsForTravel}
                        onChange={(e) => setUseRewardsForTravel(e.target.checked)}
                        className="w-4 h-4 text-[#005C9D] rounded cursor-pointer"
                      />
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between font-bold">
                      <span className="text-slate-700">Total Price Due:</span>
                      <span className="font-mono text-base text-[#005C9D]">${travelCost.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsTravelModalOpen(false)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleBookTravel}
                      disabled={isBookingTravel}
                      className="px-5 py-2 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-lg cursor-pointer shadow-xs transition-colors"
                    >
                      {isBookingTravel ? 'Confirming Ticket...' : 'Confirm Flight & Issue Boarding Pass'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          OFFICIAL CAPITAL ONE TRANSACTION RECEIPT MODAL
          ======================================================== */}
      {selectedReceiptTx && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedReceiptTx(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Official Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <CapitalOneLogo className="h-6" />
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold uppercase">
                  Official Record
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReceiptTx(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center py-2 space-y-1">
              <span className="text-xs text-slate-400 uppercase font-bold tracking-wider">
                Total Transaction Amount
              </span>
              <div className="text-3xl font-extrabold text-slate-900 font-mono">
                ${selectedReceiptTx.amount.toFixed(2)}
              </div>
              <div className="inline-block mt-1">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    selectedReceiptTx.status === 'Completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedReceiptTx.status === 'Declined'
                      ? 'bg-red-100 text-red-800'
                      : selectedReceiptTx.status === 'Refunded'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedReceiptTx.status}
                </span>
              </div>
            </div>

            {/* Receipt Table */}
            <div className="my-4 bg-slate-50 border border-slate-200 rounded-2xl p-4 divide-y divide-slate-200 text-xs">
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Reference Number</span>
                <span className="font-mono font-bold text-slate-800">
                  {selectedReceiptTx.referenceNumber || 'REF-CAP-9840102'}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Merchant / Destination</span>
                <span className="font-bold text-slate-900 text-right truncate max-w-[200px]">
                  {selectedReceiptTx.merchant}
                </span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Date &amp; Timestamp</span>
                <span className="text-slate-700 font-mono">{selectedReceiptTx.date}</span>
              </div>
              <div className="py-2 flex justify-between">
                <span className="text-slate-500">Category</span>
                <span className="text-slate-800 font-semibold">{selectedReceiptTx.category}</span>
              </div>
              {selectedReceiptTx.destinationDetails && (
                <div className="py-2 flex justify-between">
                  <span className="text-slate-500">Route / Account</span>
                  <span className="text-slate-800 font-mono text-right">
                    {selectedReceiptTx.destinationDetails}
                  </span>
                </div>
              )}
              {selectedReceiptTx.adminFeedback && (
                <div className="py-2 text-left bg-amber-50/70 p-2 rounded-lg mt-1 border border-amber-200">
                  <span className="text-[10px] font-bold text-amber-900 uppercase block">
                    Admin Note / Email Feedback:
                  </span>
                  <p className="text-xs text-amber-950 mt-0.5">{selectedReceiptTx.adminFeedback}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  window.print?.();
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  showTopRightToast('Dispute request submitted to Capital One Fraud Department.');
                  setSelectedReceiptTx(null);
                }}
                className="flex-1 py-2.5 bg-[#005C9D] hover:bg-[#00487D] text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Dispute Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ACCOUNT DETAILS MODAL (Full Account & Routing Numbers)
          ======================================================== */}
      {inspectingAccount && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setInspectingAccount(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base">{inspectingAccount.accountType}</h3>
                <span className="text-xs text-slate-500">Official Account &amp; Routing Numbers</span>
              </div>
              <button
                type="button"
                onClick={() => setInspectingAccount(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {copiedNotice && (
              <div className="mb-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{copiedNotice}</span>
              </div>
            )}

            <div className="space-y-3.5">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Full Account Number</span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(
                        inspectingAccount.fullAccountNumber || `230491${inspectingAccount.accountNumber.replace(/\D/g, '')}`,
                        'Account Number'
                      )
                    }
                    className="text-xs font-bold text-[#005C9D] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <span className="text-sm font-mono font-bold text-slate-900">
                  {inspectingAccount.fullAccountNumber || `230491${inspectingAccount.accountNumber.replace(/\D/g, '')}`}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">Routing Transit Number (ABA)</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(inspectingAccount.routingNumber || '051405515', 'Routing Number')}
                    className="text-xs font-bold text-[#005C9D] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <span className="text-sm font-mono font-bold text-slate-900">
                  {inspectingAccount.routingNumber || '051405515'} (Capital One, N.A.)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-500 block">Available Balance</span>
                  <span className="text-base font-bold font-mono text-slate-900">
                    ${inspectingAccount.balance.toFixed(2)}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[11px] text-slate-500 block">
                    {inspectingAccount.type === 'credit' ? 'Variable APR' : 'Interest Rate'}
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-600">
                    {inspectingAccount.apr || '4.25% APY'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setInspectingAccount(null)}
                className="px-4 py-2 bg-[#005C9D] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Transaction History (CSV / PDF) Modal */}
      <TransactionExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        transactions={userTransactions}
        userName={`${activeUser.firstName} ${activeUser.lastName}`}
        accountNumber={checkingAcc?.fullAccountNumber || checkingAcc?.accountNumber || '2304918201'}
        checkingBalance={checkingAcc?.balance || 0}
        showToast={showTopRightToast}
      />

      {/* ========================================================
          SUPPORT CHAT WIDGET (Floating bottom-left)
          ======================================================== */}
      <SupportChat />

      {/* Official Capital One statement-style receipt (after every transaction) */}
      {receiptState && (
        <TransactionReceipt
          isOpen={!!receiptState}
          onClose={() => setReceiptState(null)}
          transaction={receiptState.transaction}
          account={receiptState.account}
          holderName={receiptState.holderName}
          defaultEmail={receiptState.email}
          onEmailSent={() => showTopRightToast('Official receipt emailed successfully')}
        />
      )}

      {/* ========================================================
          STICKY BOTTOM NAVIGATION (Home, Benefits, Pay/Move, Help, Profile)
          ======================================================== */}
      <BottomNav
        currentTab="home"
        onNavigate={onNavigate}
        onGoHome={() => setActiveViewMode('dashboard')}
        onOpenDeposit={() => {
          setDepositAccountId(checkingAcc?.id || activeUser.accounts[0].id);
          setDepositAmount('100.00');
          setDepositError(null);
          setIsDepositModalOpen(true);
        }}
        onOpenWithdraw={handleInitiateWithdrawalClick}
        onOpenPayBill={() => {
          setPayAccountId(creditCard?.id || activeUser.accounts[0].id);
          setPayAmount('35.00');
          setPaymentError(null);
          setIsPayModalOpen(true);
        }}
        onOpenTransfer={() => {
          setTransferFromId(activeUser.accounts[0]?.id || '');
          setTransferToId(activeUser.accounts[1]?.id || activeUser.accounts[0]?.id || '');
          setTransferAmount('50.00');
          setTransferError(null);
          setIsTransferModalOpen(true);
        }}
        onOpenTravel={() => setIsTravelModalOpen(true)}
        onOpenVirtualCards={() => setIsVirtualCardModalOpen(true)}
        onOpenKyc={() => setIsKycModalOpen(true)}
      />
    </div>
  );
};
