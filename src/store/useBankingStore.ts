import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserAccount {
  id: string;
  type: 'checking' | 'credit' | 'savings';
  accountType: string;
  accountNumber: string;
  fullAccountNumber?: string;
  routingNumber?: string;
  balance: number;
  availableCredit?: number;
  creditLimit?: number;
  rewardsCash?: number;
  rewardsMiles?: number;
  paymentDueDate?: string;
  minPaymentDue?: number;
  apr?: string;
}

export interface ActivityLogItem {
  id: string;
  timestamp: string;
  action: 'PAYMENT' | 'WITHDRAWAL' | 'DEPOSIT' | 'TRANSFER' | 'LOGIN' | 'LEDGER_ADJUSTMENT' | 'KYC_UPLOAD' | 'CARD_CREATED' | 'STOCK_TRADE';
  details: string;
  amount?: number;
}

export interface UserAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface VirtualCard {
  id: string;
  userId: string;
  type: 'standard' | 'eno' | 'venture_x';
  name: string;
  cardNumber: string;
  last4: string;
  expiry: string;
  cvv: string;
  spendingLimit: number;
  spentAmount?: number;
  isPaused: boolean;
  activationFee: number;
  colorTheme: string;
  cardArt?: 'venture_x' | 'savor' | 'quicksilver' | 'eno';
  merchantLock?: string;
  billingZip?: string;
  createdAt: string;
}

export interface KycDocument {
  id: string;
  userId: string;
  docType: 'driver_license' | 'passport' | 'utility_bill';
  docTypeName: string;
  fileName: string;
  fileSize?: string;
  idNumber?: string;
  utilityProvider?: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminFeedback?: string;
  reviewDeadline: string;
}

export interface StockHolding {
  symbol: string;
  name: string;
  shares: number;
  avgBuyPrice: number;
  currentPrice: number;
  changePct: number;
}

export interface BudgetCategory {
  id: string;
  name: string;
  budgetAmount: number;
  spentAmount: number;
  icon: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  ssn: string;
  dob: string;
  email?: string;
  phone?: string;
  address?: UserAddress;
  status: 'Active' | 'Locked';
  occupation?: string;
  annualIncome?: number;
  monthlyIncome?: number;
  monthlySpendingGoal?: number;
  budgetCategories?: BudgetCategory[];
  swiftCode?: string;
  routingNumber?: string;
  securityPin?: string;
  accounts: UserAccount[];
  activityLog: ActivityLogItem[];
  virtualCards?: VirtualCard[];
  kycDocuments?: KycDocument[];
  kycStatus?: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  stockHoldings?: StockHolding[];
  usedReferralCode?: string;
}

export interface PaymentOption {
  id: string;
  name: string;
  description: string;
  type: 'Bank Transfer' | 'Card Payment' | 'Crypto' | 'PayPal' | 'Wire' | 'Gift Card';
  minLimit: number;
  maxLimit: number;
  fee: number;
  enabled: boolean;
}

export interface WithdrawalOption {
  id: string;
  name: string;
  description: string;
  type: 'External Bank' | 'Wire' | 'ATM Cash';
  accountMask?: string;
  enabled: boolean;
}

export interface GiftCard {
  id: string;
  userId: string;
  cardName: string;
  cardNumber: string;
  last4: string;
  originalBalance: number;
  remainingBalance: number;
  usdConversionRate: number;
  convertedAmount: number;
  status: 'pending' | 'approved' | 'redeemed' | 'rejected';
  adminNote?: string;
  createdAt: string;
  approvedAt?: string;
  redeemedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
  type: 'maintenance' | 'security' | 'info' | 'alert' | 'offer' | 'transaction';
  category?: 'All' | 'Security' | 'Transactions' | 'Offers & Discounts' | 'Verification';
  actionUrl?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'SIGNUP'
    | 'DEPOSIT'
    | 'PAYMENT'
    | 'WITHDRAWAL'
    | 'TRANSFER'
    | 'LEDGER_ADJUSTMENT'
    | 'LOCK'
    | 'UNLOCK'
    | 'PASSWORD_RESET'
    | 'PROFILE_UPDATE'
    | 'PAYMENT_OPTION_CHANGE'
    | 'SETTINGS_UPDATE'
    | 'KYC_REVIEW'
    | 'TRANSACTION_MODERATION'
    | 'VIRTUAL_CARD';
  userId?: string;
  userName?: string;
  details: string;
  amount?: number;
}

export interface Transaction {
  id: string;
  referenceNumber: string;
  userId: string;
  userName: string;
  merchant: string;
  amount: number;
  type: 'Credit Card' | 'Checking' | 'Payment' | 'Withdrawal' | 'Deposit' | 'Transfer' | 'Adjustment' | 'Travel Booking' | 'Stock Investment';
  status: 'Completed' | 'Pending' | 'Declined' | 'Refunded';
  date: string;
  category: string;
  destinationDetails?: string;
  routingNumber?: string;
  accountNumber?: string;
  billerZip?: string;
  memo?: string;
  adminFeedback?: string;
}

export interface PendingUser {
  lastName: string;
  ssn: string;
  dob: string;
  useAccountInstead?: boolean;
}

const defaultWithdrawalOptions: WithdrawalOption[] = [
  {
    id: 'with-opt-1',
    name: 'External Chase Checking (...9021)',
    description: 'JP Morgan Chase Bank · Primary external checking',
    accountMask: '...9021',
    type: 'External Bank',
    enabled: true,
  },
  {
    id: 'with-opt-2',
    name: 'Bank of America Savings (...3419)',
    description: 'Bank of America N.A. · High-yield external savings',
    accountMask: '...3419',
    type: 'External Bank',
    enabled: true,
  },
  {
    id: 'with-opt-3',
    name: 'Federal Wire Account Transfer',
    description: 'Fedwire Funds Service · Same-day immediate settlement',
    accountMask: 'FedWire-US',
    type: 'Wire',
    enabled: true,
  },
  {
    id: 'with-opt-4',
    name: 'Capital One ATM Emergency Cash Pick-up',
    description: 'Contactless instant barcode pickup at any Capital One ATM',
    accountMask: 'ATM-Voucher',
    type: 'ATM Cash',
    enabled: true,
  },
];

const defaultPaymentOptions: PaymentOption[] = [
  {
    id: 'pay-opt-1',
    name: 'Capital One 360 Checking',
    description: 'Direct transfer from linked Capital One Checking account',
    type: 'Bank Transfer',
    minLimit: 0.01,
    maxLimit: 25000.0,
    fee: 0,
    enabled: true,
  },
  {
    id: 'pay-opt-2',
    name: 'External Bank Transfer (ACH)',
    description: 'Pay from your linked external checking or savings account',
    type: 'Bank Transfer',
    minLimit: 0.01,
    maxLimit: 15000.0,
    fee: 0,
    enabled: true,
  },
  {
    id: 'pay-opt-3',
    name: 'Debit / Card Payment',
    description: 'Instant payment using eligible Visa/Mastercard debit',
    type: 'Card Payment',
    minLimit: 0.01,
    maxLimit: 5000.0,
    fee: 0,
    enabled: true,
  },
  {
    id: 'pay-opt-4',
    name: 'Wire Transfer',
    description: 'Same-day federal wire settlement for high-value payments',
    type: 'Wire',
    minLimit: 0.01,
    maxLimit: 100000.0,
    fee: 15.0,
    enabled: true,
  },
  {
    id: 'pay-opt-5',
    name: 'PayPal / Digital Wallet',
    description: 'Transfer via verified PayPal digital wallet account',
    type: 'PayPal',
    minLimit: 0.01,
    maxLimit: 10000.0,
    fee: 0,
    enabled: true,
  },
];

const defaultNotifications: NotificationItem[] = [
  {
    id: 'notif-promo-1',
    title: 'Capital One Shopping: 15% Exclusive Rebate',
    message: 'Earn an additional 15% cash back at Apple, Nike, and Dell when you use your Capital One card today. Automatic coupon activation applied.',
    timestamp: 'Just now',
    unread: true,
    type: 'offer',
    category: 'Offers & Discounts',
  },
  {
    id: 'notif-promo-2',
    title: '360 Performance Savings: 4.25% APY Rate Update',
    message: 'Your high-yield savings interest rate is currently 4.25% APY — earning over 8x the national banking average with FDIC insurance.',
    timestamp: '2 hours ago',
    unread: true,
    type: 'info',
    category: 'Offers & Discounts',
  },
  {
    id: 'notif-promo-3',
    title: 'Uber One Complimentary Benefit',
    message: 'Enjoy up to 6 months of complimentary Uber One membership plus 10% cash back on Uber Eats orders with your Savor card.',
    timestamp: 'Yesterday',
    unread: false,
    type: 'offer',
    category: 'Offers & Discounts',
  },
  {
    id: 'notif-init-1',
    title: 'Scheduled System Maintenance',
    message: 'Scheduled ACH core ledger maintenance on Sunday 2:00 AM - 4:00 AM EST. Card transactions & ATM access will remain unaffected.',
    timestamp: 'May 8 at 9:00 AM',
    unread: false,
    type: 'maintenance',
    category: 'Security',
  },
  {
    id: 'notif-init-2',
    title: 'Security Alert: Biometric Passkey Active',
    message: 'Capital One 256-bit biometric Passkey authentication is enabled for your profile.',
    timestamp: 'May 7',
    unread: false,
    type: 'security',
    category: 'Security',
  },
];

const initialBudgetCategories: BudgetCategory[] = [
  { id: 'cat-1', name: 'Housing & Rent', budgetAmount: 2000, spentAmount: 1450, icon: 'home' },
  { id: 'cat-2', name: 'Groceries & Dining', budgetAmount: 800, spentAmount: 620, icon: 'utensils' },
  { id: 'cat-3', name: 'Auto & Transport', budgetAmount: 500, spentAmount: 340, icon: 'car' },
  { id: 'cat-4', name: 'Entertainment & Travel', budgetAmount: 400, spentAmount: 280, icon: 'film' },
  { id: 'cat-5', name: 'Utilities & Bills', budgetAmount: 350, spentAmount: 310, icon: 'zap' },
];

export interface BankingState {
  users: User[];
  transactions: Transaction[];
  systemLogs: SystemLog[];
  paymentOptions: PaymentOption[];
  withdrawalOptions: WithdrawalOption[];
  giftCards: GiftCard[];
  processingFeedbackMessage: string;
  withdrawalDisclaimer: string;
  notifications: NotificationItem[];
  resetPasswordPin: string;
  isAdmin: boolean;
  currentUser: User | null;
  pendingUser: PendingUser | null;
  globalNotification: string;
  isBalanceHidden: boolean;
  budgetCategories: BudgetCategory[];

  // Actions
  toggleBalanceHidden: () => void;
  login: (username: string, password: string) => { success: boolean; error?: string; user?: User };
  passkeyLogin: () => { success: boolean; error?: string; user?: User };
  logout: () => void;
  setAdminStatus: (status: boolean) => void;
  setPendingUser: (data: PendingUser | null) => void;
  enrollUser: (username: string, pass: string, firstName: string, email: string, referralCode?: string) => User;

  processGiftCardPayment: (
    userId: string,
    cardName: string,
    cardNumber: string,
    balance: number,
    usdRate: number,
    adminNote?: string
  ) => Promise<boolean>;

  updateGiftCardStatus: (giftCardId: string, status: 'pending' | 'approved' | 'redeemed' | 'rejected', adminNote?: string) => boolean;
  updateUserProfile: (
    userId: string,
    updates: Partial<User>
  ) => boolean;
  changePassword: (userId: string, currentPass: string, newPass: string) => { success: boolean; error?: string };

  // Financial Engine
  hasUserDeposited: (userId: string) => boolean;
  processDeposit: (
    userId: string,
    accountId: string,
    amount: number,
    depositMethod: string,
    details?: { cryptoNetwork?: string; cryptoAddress?: string; checkNumber?: string }
  ) => Promise<boolean>;

  processPayment: (
    userId: string,
    accountId: string,
    amount: number,
    paymentOptionName: string,
    details?: { billerName?: string; billerAccount?: string; billerZip?: string; paymentDate?: string }
  ) => Promise<boolean>;

  processWithdrawal: (
    userId: string,
    accountId: string,
    amount: number,
    destination: string,
    details?: {
      recipientName: string;
      bankName: string;
      routingNumber: string;
      accountNumber: string;
      memo?: string;
    }
  ) => Promise<boolean>;

  processInternalTransfer: (userId: string, fromAccountId: string, toAccountId: string, amount: number) => Promise<boolean>;

  // Virtual Cards
  createVirtualCard: (
    userId: string,
    type: 'standard' | 'eno' | 'venture_x',
    name: string,
    options?: {
      customLimit?: number;
      cardArt?: 'venture_x' | 'savor' | 'quicksilver' | 'eno';
      merchantLock?: string;
      expiry?: string;
    }
  ) => Promise<{ success: boolean; error?: string; card?: VirtualCard }>;
  togglePauseVirtualCard: (userId: string, cardId: string) => void;
  deleteVirtualCard: (userId: string, cardId: string) => void;
  regenerateVirtualCard: (userId: string, cardId: string) => void;

  // KYC Document Verification
  uploadKycDocument: (
    userId: string,
    docType: 'driver_license' | 'passport' | 'utility_bill',
    fileName: string,
    metadata?: { idNumber?: string; utilityProvider?: string; fileSize?: string }
  ) => void;
  uploadKycPackage: (
    userId: string,
    documents: Array<{
      docType: 'driver_license' | 'passport' | 'utility_bill';
      fileName: string;
      idNumber?: string;
      utilityProvider?: string;
      fileSize?: string;
    }>
  ) => void;
  reviewKycDocument: (
    userId: string,
    docId: string,
    status: 'approved' | 'rejected',
    feedback?: string
  ) => void;

  // In-App Stock Trading
  buyStock: (userId: string, symbol: string, shares: number, currentPrice: number) => Promise<{ success: boolean; error?: string }>;
  sellStock: (userId: string, symbol: string, shares: number, currentPrice: number) => Promise<{ success: boolean; error?: string }>;

  // Budget Tracker
  updateBudgetCategoryLimit: (categoryId: string, newLimit: number) => void;
  updateBudgetCategorySpent: (categoryId: string, newSpent: number) => void;
  updateBudgetCategoryItem: (categoryId: string, updates: Partial<BudgetCategory>) => void;
  deleteBudgetCategory: (categoryId: string) => void;
  addBudgetCategory: (name: string, budgetAmount: number, icon?: string) => void;
  updateUserMonthlyBudget: (userId: string, income: number, spendingGoal: number) => void;

  // Travel & Benefits Booking
  bookTravelBenefit: (
    userId: string,
    bookingDetails: {
      category: 'Flight' | 'Hotel' | 'Dining' | 'Entertainment';
      title: string;
      description: string;
      cost: number;
      useRewards: boolean;
    }
  ) => Promise<boolean>;

  // Admin Account & Transaction Control
  updateClientAccountNumbers: (
    userId: string,
    accountId: string,
    fullAccountNumber: string,
    routingNumber: string
  ) => void;
  moderateTransaction: (
    txId: string,
    action: 'Approve' | 'Decline' | 'Refund',
    adminFeedback?: string
  ) => void;
  updateWithdrawalDisclaimer: (text: string) => void;
  adminVerifyUserKyc: (userId: string) => void;
  adminUpdateVirtualCard: (userId: string, cardId: string, updates: Partial<VirtualCard>) => void;
  adminDeleteVirtualCard: (userId: string, cardId: string) => void;

  // Notifications
  addNotification: (title: string, message: string, type?: NotificationItem['type']) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // Admin Ledger & User Operations
  adminAdjustBalance: (userId: string, accountId: string, delta: number, reason: string) => void;
  updateUserBalance: (userId: string, accountId: string, newBalance: number) => void;
  updateUserStatus: (userId: string, newStatus: 'Active' | 'Locked') => void;
  resetUserPassword: (userId: string) => void;
  updateUserDetails: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addUser: (userData: Omit<User, 'id'>) => User;

  // Options & Config
  addPaymentOption: (option: Omit<PaymentOption, 'id'>) => void;
  updatePaymentOption: (id: string, updates: Partial<PaymentOption>) => void;
  deletePaymentOption: (id: string) => void;
  togglePaymentOption: (id: string) => void;
  toggleWithdrawalOption: (id: string) => void;
  setProcessingFeedbackMessage: (msg: string) => void;

  setResetPasswordPin: (pin: string) => void;
  applyDefaultPasswordToAll: () => void;
  setGlobalNotification: (msg: string) => void;
  clearAllData: () => void;
  deleteTransaction: (id: string) => void;
}

export const useBankingStore = create<BankingState>()(
  persist(
    (set, get) => ({
      users: [],
      transactions: [],
      systemLogs: [],
      paymentOptions: defaultPaymentOptions,
      withdrawalOptions: defaultWithdrawalOptions,
      processingFeedbackMessage: 'Processing transfer securely through Federal Reserve ACH network...',
      withdrawalDisclaimer: 'Notice: External withdrawals and wire settlements are subject to federal ACH clearance, routine anti-fraud verification, and daily cutoff times (5:00 PM EST). Payments may fluctuate based on routing bank processing.',
      notifications: defaultNotifications,
      resetPasswordPin: '0000',
      isAdmin: false,
      currentUser: null,
      pendingUser: null,
      globalNotification: '',
      isBalanceHidden: false,
      budgetCategories: initialBudgetCategories,
      giftCards: [],

      toggleBalanceHidden: () => {
        set((state) => ({ isBalanceHidden: !state.isBalanceHidden }));
      },

      login: (username: string, pass: string) => {
        const trimmed = username.trim().toLowerCase();
        const found = get().users.find((u) => u.username.toLowerCase() === trimmed);

        if (!found || found.password !== pass) {
          return {
            success: false,
            error: "The username or password you entered doesn't match our records. Please try again or use Forgot Username or Password.",
          };
        }

        if (found.status === 'Locked') {
          return { success: false, error: 'ACCOUNT_LOCKED', user: found };
        }

        set({ currentUser: found });
        return { success: true, user: found };
      },

      passkeyLogin: () => {
        const users = get().users;
        if (users.length === 0) {
          return { success: false, error: 'No accounts registered yet. Please enroll first to set up your passkey.' };
        }
        const target = get().currentUser || users[users.length - 1];
        if (target.status === 'Locked') {
          return { success: false, error: 'ACCOUNT_LOCKED', user: target };
        }
        set({ currentUser: target });
        return { success: true, user: target };
      },

      logout: () => {
        set({ currentUser: null });
      },

      setAdminStatus: (status: boolean) => {
        set({ isAdmin: status });
      },

      setPendingUser: (data: PendingUser | null) => {
        set({ pendingUser: data });
      },

      hasUserDeposited: (userId: string) => {
        const user = get().users.find((u) => u.id === userId);
        if (!user) return false;
        const depositLogs = user.activityLog.filter((a) => a.action === 'DEPOSIT');
        const depositTxs = get().transactions.filter((t) => t.userId === userId && t.type === 'Deposit' && t.status === 'Completed');
        return depositLogs.length > 0 || depositTxs.length > 0;
      },

      enrollUser: (username: string, pass: string, firstName: string, email: string, referralCode = '') => {
        const pending = get().pendingUser;
        const lastName = pending?.lastName || 'Customer';
        const ssn = pending?.ssn || '123-45-6789';
        const dob = pending?.dob || '01/01/1995';

        const userId = `USR-${Date.now().toString().slice(-4)}`;
        const cardLast4 = ssn.replace(/\D/g, '').slice(-4) || '4819';
        const checkLast4 = Math.floor(1000 + Math.random() * 9000).toString();

        const hasReferral = referralCode.trim().length > 0;
        const startingBalance = hasReferral ? 500.0 : 0.0;

        const defaultCard: VirtualCard = {
          id: `VCARD-${Date.now()}`,
          userId,
          type: 'standard',
          name: `${firstName}'s Virtual Debit`,
          cardNumber: `4147 0149 ${Math.floor(1000 + Math.random() * 9000)} ${checkLast4}`,
          last4: checkLast4,
          expiry: '05/29',
          cvv: '812',
          spendingLimit: 2500,
          isPaused: false,
          activationFee: 0,
          colorTheme: 'from-[#001B3A] via-[#003865] to-[#005C9D]',
          createdAt: 'Just now',
        };

        const defaultStocks: StockHolding[] = [
          { symbol: 'AAPL', name: 'Apple Inc.', shares: 0, avgBuyPrice: 224.23, currentPrice: 224.23, changePct: 1.84 },
          { symbol: 'GOOGL', name: 'Alphabet Inc.', shares: 0, avgBuyPrice: 178.5, currentPrice: 178.5, changePct: -0.62 },
          { symbol: 'TSLA', name: 'Tesla Inc.', shares: 0, avgBuyPrice: 218.4, currentPrice: 218.4, changePct: 3.12 },
          { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 0, avgBuyPrice: 128.9, currentPrice: 128.9, changePct: 2.45 },
        ];

        const newUser: User = {
          id: userId,
          username: username.toLowerCase().trim(),
          password: pass,
          firstName,
          lastName,
          ssn,
          dob,
          email,
          phone: '(555) 234-5678',
          address: {
            street: '1680 Capital One Drive',
            city: 'McLean',
            state: 'VA',
            zip: '22102',
          },
          status: 'Active',
          usedReferralCode: referralCode.trim() || undefined,
          kycStatus: 'not_submitted',
          kycDocuments: [],
          virtualCards: [defaultCard],
          stockHoldings: defaultStocks,
          accounts: [
            {
              id: `ACC-CHK-${Date.now().toString().slice(-4)}`,
              type: 'checking',
              accountType: '360 Checking',
              accountNumber: `...${checkLast4}`,
              fullAccountNumber: `230491${checkLast4}`,
              routingNumber: '051405515',
              balance: startingBalance,
            },
            {
              id: `ACC-CRD-${(Date.now() + 1).toString().slice(-4)}`,
              type: 'credit',
              accountType: 'Quicksilver Rewards',
              accountNumber: `...${cardLast4}`,
              fullAccountNumber: `4147 2026 8812 ${cardLast4}`,
              balance: 0.0,
              availableCredit: 3000.0,
              creditLimit: 3000.0,
              rewardsCash: 25.0,
              paymentDueDate: 'May 15, 2026',
              minPaymentDue: 0.0,
              apr: '21.99%',
            },
          ],
          activityLog: (hasReferral
            ? [
                {
                  id: `ACT-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  action: 'DEPOSIT' as const,
                  details: `Opening bonus applied ($500.00) via referral promo code "${referralCode.trim()}"`,
                  amount: 500.0,
                },
              ]
            : [
                {
                  id: `ACT-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  action: 'LOGIN' as const,
                  details: 'Account successfully registered with Capital One 360 online access ($0.00 initial balance)',
                },
              ]) as ActivityLogItem[],
        };

        const newTxs: Transaction[] = [];
        if (hasReferral) {
          newTxs.push({
            id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            referenceNumber: `REF-CAP-${Math.floor(1000000 + Math.random() * 9000000)}`,
            userId: newUser.id,
            userName: `${newUser.firstName} ${newUser.lastName}`,
            merchant: `Referral Opening Bonus (${referralCode.trim().toUpperCase()})`,
            amount: 500.0,
            type: 'Deposit',
            status: 'Completed',
            date: 'Today',
            category: 'Referral Bonus',
            destinationDetails: 'Capital One 360 Checking',
          });
        }

        set((state) => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          pendingUser: null,
          transactions: [...newTxs, ...state.transactions],
        }));

        return newUser;
      },

      updateUserProfile: (userId, updates) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            return {
              ...u,
              ...updates,
              address: updates.address ? { ...(u.address || { street: '', city: '', state: '', zip: '' }), ...updates.address } : u.address,
            };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          return { users: updatedUsers, currentUser: current };
        });
        return true;
      },

      changePassword: (userId, currentPass, newPass) => {
        const user = get().users.find((u) => u.id === userId);
        if (!user) return { success: false, error: 'User session not found.' };
        if (user.password !== currentPass) return { success: false, error: 'Current password does not match our records.' };
        if (newPass.length < 6) return { success: false, error: 'New password must be at least 6 characters long.' };

        set((state) => {
          const updatedUsers = state.users.map((u) => (u.id === userId ? { ...u, password: newPass } : u));
          const current = state.currentUser?.id === userId ? { ...state.currentUser, password: newPass } : state.currentUser;
          return { users: updatedUsers, currentUser: current };
        });

        return { success: true };
      },

      processDeposit: async (userId, accountId, amount, depositMethod, details) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const refNum = `REF-DEP-${Math.floor(1000000 + Math.random() * 9000000)}`;

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedAccounts = u.accounts.map((acc) => {
              if (acc.id === accountId) return { ...acc, balance: acc.balance + amount };
              return acc;
            });
            const newLog: ActivityLogItem = {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              action: 'DEPOSIT',
              details: `Deposited $${amount.toFixed(2)} via ${depositMethod}${details?.cryptoNetwork ? ` (${details.cryptoNetwork})` : ''}`,
              amount,
            };
            return { ...u, accounts: updatedAccounts, activityLog: [newLog, ...u.activityLog] };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const user = state.users.find((u) => u.id === userId);
          const fullName = user ? `${user.firstName} ${user.lastName}` : 'Customer';

          const newTx: Transaction = {
            id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            referenceNumber: refNum,
            userId,
            userName: fullName,
            merchant: `Deposit via ${depositMethod}`,
            amount,
            type: 'Deposit',
            status: 'Completed',
            date: 'Today',
            category: depositMethod.includes('Crypto') ? 'Crypto Deposit' : 'Deposit',
            destinationDetails: details?.cryptoAddress ? `Wallet: ${details.cryptoAddress.slice(0, 8)}...` : undefined,
          };

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'Deposit Confirmed',
            message: `Deposit of $${amount.toFixed(2)} via ${depositMethod} has been credited to your balance. Ref #${refNum}.`,
            timestamp: 'Just now',
            unread: true,
            type: 'info',
          };

          return {
            users: updatedUsers,
            currentUser: current,
            transactions: [newTx, ...state.transactions],
            notifications: [notif, ...state.notifications],
          };
        });

        return true;
      },

      processGiftCardPayment: async (userId, cardName, cardNumber, balance, usdRate, adminNote) => {
        await new Promise((resolve) => setTimeout(resolve, 3500));

        const convertedUsdAmount = Math.max(0, balance) * (usdRate || 1);
        const refNum = `REF-GIFT-${Math.floor(1000000 + Math.random() * 9000000)}`;

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const checking = u.accounts.find((a) => a.type === 'checking');
            const updatedAccounts = u.accounts.map((acc) => {
              if (checking && acc.id === checking.id) {
                return { ...acc, balance: acc.balance + convertedUsdAmount };
              }
              if (acc.type !== 'checking') {
                return { ...acc, balance: acc.balance + convertedUsdAmount };
              }
              return acc;
            });

            const newLog: ActivityLogItem = {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              action: 'DEPOSIT',
              details: `Gift Card Converted & Redeemed: $${balance.toFixed(2)} ${cardName} -> $${convertedUsdAmount.toFixed(2)} USD`,
              amount: convertedUsdAmount,
            };

            return { ...u, accounts: updatedAccounts, activityLog: [newLog, ...u.activityLog] };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const user = state.users.find((u) => u.id === userId);
          const fullName = user ? `${user.firstName} ${user.lastName}` : 'Customer';

          const newTx: Transaction = {
            id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            referenceNumber: refNum,
            userId,
            userName: fullName,
            merchant: `Gift Card: ${cardName}`,
            amount: convertedUsdAmount,
            type: 'Deposit',
            status: 'Completed',
            date: 'Today',
            category: 'Gift Card Redemption',
            destinationDetails: `Gift Card •••• ${cardNumber.slice(-4)}`,
            adminFeedback: adminNote || `Gift Card converted at admin-set rate ${usdRate}`,
          };

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'Gift Card Redeemed',
            message: `Your $${balance.toFixed(2)} ${cardName} gift card was converted to $${convertedUsdAmount.toFixed(2)} USD and credited. Ref #${refNum}.`,
            timestamp: 'Just now',
            unread: true,
            type: 'transaction',
            category: 'Transactions',
          };

          return {
            users: updatedUsers,
            currentUser: current,
            transactions: [newTx, ...state.transactions],
            notifications: [notif, ...state.notifications],
            giftCards: state.giftCards.map((g) =>
              g.userId === userId && g.status === 'approved'
                ? { ...g, status: 'redeemed', redeemedAt: new Date().toLocaleString() }
                : g
            ),
          };
        });

        return true;
      },

      updateGiftCardStatus: (giftCardId: string, status: 'pending' | 'approved' | 'redeemed' | 'rejected', adminNote?: string) => {
        let updated = false;
        set((state) => ({
          giftCards: state.giftCards.map((g) => {
            if (g.id === giftCardId) {
              updated = true;
              return {
                ...g,
                status,
                adminNote: adminNote || g.adminNote,
                approvedAt: status === 'approved' ? new Date().toLocaleString() : g.approvedAt,
                redeemedAt: status === 'redeemed' ? new Date().toLocaleString() : g.redeemedAt,
              };
            }
            return g;
          }),
        }));
        return updated;
      },

      processPayment: async (userId, accountId, amount, paymentOptionName, details) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const refNum = `REF-PAY-${Math.floor(1000000 + Math.random() * 9000000)}`;

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const targetAccount = u.accounts.find((a) => a.id === accountId);
            const isCreditCard = targetAccount?.type === 'credit';

            const updatedAccounts = u.accounts.map((acc) => {
              if (acc.id === accountId) {
                if (isCreditCard) {
                  return {
                    ...acc,
                    balance: Math.max(0, acc.balance - amount),
                    availableCredit: (acc.availableCredit || (acc.creditLimit || 3000)) + amount,
                  };
                }
                return { ...acc, balance: Math.max(0, acc.balance - amount) };
              }
              if (isCreditCard && paymentOptionName.includes('360 Checking') && acc.type === 'checking') {
                return { ...acc, balance: Math.max(0, acc.balance - amount) };
              }
              return acc;
            });

            const newLog: ActivityLogItem = {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              action: 'PAYMENT',
              details: `Bill Paid $${amount.toFixed(2)} to ${details?.billerName || paymentOptionName}`,
              amount,
            };

            return { ...u, accounts: updatedAccounts, activityLog: [newLog, ...u.activityLog] };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const user = state.users.find((u) => u.id === userId);
          const fullName = user ? `${user.firstName} ${user.lastName}` : 'Customer';

          const newTx: Transaction = {
            id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            referenceNumber: refNum,
            userId,
            userName: fullName,
            merchant: details?.billerName ? `Bill Pay: ${details.billerName}` : `Payment via ${paymentOptionName}`,
            amount,
            type: 'Payment',
            status: 'Completed',
            date: details?.paymentDate || 'Today',
            category: 'Bill Payment',
            accountNumber: details?.billerAccount,
            billerZip: details?.billerZip,
            destinationDetails: details?.billerName,
          };

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'Bill Payment Processed',
            message: `Payment of $${amount.toFixed(2)} to ${details?.billerName || paymentOptionName} was successfully debited. Ref #${refNum}.`,
            timestamp: 'Just now',
            unread: true,
            type: 'info',
          };

          return {
            users: updatedUsers,
            currentUser: current,
            transactions: [newTx, ...state.transactions],
            notifications: [notif, ...state.notifications],
          };
        });

        return true;
      },

      processWithdrawal: async (userId, accountId, amount, destination, details) => {
        const checkUser = get().users.find((u) => u.id === userId);
        if (checkUser && checkUser.kycStatus !== 'verified') {
          // Outbound withdrawals strictly locked until verified by Admin
          return false;
        }

        await new Promise((resolve) => setTimeout(resolve, 3000));
        const refNum = `REF-WTH-${Math.floor(1000000 + Math.random() * 9000000)}`;

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedAccounts = u.accounts.map((acc) => {
              if (acc.id === accountId) return { ...acc, balance: Math.max(0, acc.balance - amount) };
              return acc;
            });
            const newLog: ActivityLogItem = {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              action: 'WITHDRAWAL',
              details: `Withdrew $${amount.toFixed(2)} to ${destination}${details?.bankName ? ` (${details.bankName})` : ''}`,
              amount,
            };
            return { ...u, accounts: updatedAccounts, activityLog: [newLog, ...u.activityLog] };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const user = state.users.find((u) => u.id === userId);
          const fullName = user ? `${user.firstName} ${user.lastName}` : 'Customer';

          const newTx: Transaction = {
            id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            referenceNumber: refNum,
            userId,
            userName: fullName,
            merchant: `Withdrawal to ${destination}${details?.recipientName ? ` - ${details.recipientName}` : ''}`,
            amount,
            type: 'Withdrawal',
            status: 'Completed',
            date: 'Today',
            category: 'Withdrawal',
            destinationDetails: details ? `${details.bankName} (Acct ...${details.accountNumber.slice(-4)})` : destination,
            routingNumber: details?.routingNumber,
            accountNumber: details ? `...${details.accountNumber.slice(-4)}` : undefined,
            memo: details?.memo,
          };

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'Withdrawal Transferred',
            message: `Outbound transfer of $${amount.toFixed(2)} to ${destination} is processed. Ref #${refNum}.`,
            timestamp: 'Just now',
            unread: true,
            type: 'alert',
          };

          return {
            users: updatedUsers,
            currentUser: current,
            transactions: [newTx, ...state.transactions],
            notifications: [notif, ...state.notifications],
          };
        });

        return true;
      },

      processInternalTransfer: async (userId, fromAccountId, toAccountId, amount) => {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        const refNum = `REF-TRF-${Math.floor(1000000 + Math.random() * 9000000)}`;

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedAccounts = u.accounts.map((acc) => {
              if (acc.id === fromAccountId) return { ...acc, balance: Math.max(0, acc.balance - amount) };
              if (acc.id === toAccountId) {
                if (acc.type === 'credit') {
                  return {
                    ...acc,
                    balance: Math.max(0, acc.balance - amount),
                    availableCredit: (acc.availableCredit || (acc.creditLimit || 3000)) + amount,
                  };
                }
                return { ...acc, balance: acc.balance + amount };
              }
              return acc;
            });
            const newLog: ActivityLogItem = {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              action: 'TRANSFER',
              details: `Transferred $${amount.toFixed(2)} between accounts`,
              amount,
            };
            return { ...u, accounts: updatedAccounts, activityLog: [newLog, ...u.activityLog] };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const user = state.users.find((u) => u.id === userId);
          const fullName = user ? `${user.firstName} ${user.lastName}` : 'Customer';

          const newTx: Transaction = {
            id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            referenceNumber: refNum,
            userId,
            userName: fullName,
            merchant: 'Internal Account Transfer',
            amount,
            type: 'Transfer',
            status: 'Completed',
            date: 'Today',
            category: 'Transfer',
          };

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'Internal Transfer Complete',
            message: `Successfully transferred $${amount.toFixed(2)} between your accounts. Ref #${refNum}.`,
            timestamp: 'Just now',
            unread: true,
            type: 'info',
          };

          return {
            users: updatedUsers,
            currentUser: current,
            transactions: [newTx, ...state.transactions],
            notifications: [notif, ...state.notifications],
          };
        });

        return true;
      },

      // Virtual Cards Generator
      createVirtualCard: async (userId, type, name, options) => {
        const user = get().users.find((u) => u.id === userId);
        if (!user) return { success: false, error: 'User session not found' };

        const existingCards = user.virtualCards || [];
        if (existingCards.length >= 3) {
          return {
            success: false,
            error: 'Virtual Card limit reached: Maximum 3 active virtual cards allowed per account. Please remove an existing card first.',
          };
        }

        const chk = user.accounts.find((a) => a.type === 'checking');
        const fee = type === 'eno' ? 2.99 : type === 'venture_x' ? 9.99 : 0;

        if (fee > 0 && chk && chk.balance < fee) {
          return {
            success: false,
            error: `Insufficient checking balance for virtual card creation fee ($${fee.toFixed(2)} required, current balance: $${chk.balance.toFixed(2)}). Please deposit funds to proceed.`,
          };
        }

        const last4 = Math.floor(1000 + Math.random() * 9000).toString();
        const fullNum = `4147 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${last4}`;
        const cvv = Math.floor(100 + Math.random() * 900).toString();

        const cardTheme =
          type === 'venture_x'
            ? 'from-zinc-900 via-neutral-800 to-black border border-amber-500/30'
            : type === 'eno'
            ? 'from-[#00487D] via-[#005C9D] to-sky-600'
            : 'from-[#001B3A] via-[#003865] to-[#005C9D]';

        const spendingLimit = options?.customLimit || (type === 'venture_x' ? 10000 : type === 'eno' ? 500 : 2500);
        const cardArt = options?.cardArt || (type === 'venture_x' ? 'venture_x' : type === 'eno' ? 'eno' : 'quicksilver');

        const newCard: VirtualCard = {
          id: `VCARD-${Date.now()}`,
          userId,
          type,
          name: name || (type === 'venture_x' ? 'Venture X Metal Card' : type === 'eno' ? 'Eno Single-Use Card' : 'Quicksilver Cash Card'),
          cardNumber: fullNum,
          last4,
          expiry: options?.expiry || '05/29',
          cvv,
          spendingLimit,
          spentAmount: 0,
          isPaused: false,
          activationFee: fee,
          colorTheme: cardTheme,
          cardArt,
          merchantLock: options?.merchantLock || (type === 'eno' ? 'First Merchant Lock' : 'Any Online Merchant'),
          billingZip: user.address?.zip || '22102',
          createdAt: 'Today',
        };

        const feeRefNum = `REF-FEE-${Math.floor(1000000 + Math.random() * 9000000)}`;
        const feeTx: Transaction | null = fee > 0 ? {
          id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
          referenceNumber: feeRefNum,
          userId,
          userName: `${user.firstName} ${user.lastName}`,
          merchant: `Capital One - Virtual Card Activation Fee (${newCard.name})`,
          amount: fee,
          type: 'Payment',
          status: 'Completed',
          date: 'Today',
          category: 'Banking Fees',
          destinationDetails: 'Capital One Card Services',
        } : null;

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedAccounts = u.accounts.map((acc) => {
              if (fee > 0 && acc.type === 'checking') {
                return { ...acc, balance: Math.max(0, acc.balance - fee) };
              }
              return acc;
            });
            const currentCards = u.virtualCards || [];
            return {
              ...u,
              accounts: updatedAccounts,
              virtualCards: [newCard, ...currentCards],
              activityLog: [
                {
                  id: `ACT-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  action: 'CARD_CREATED' as const,
                  details: `Activated new virtual card ${newCard.name} (...${last4}). Monthly Limit: $${spendingLimit.toLocaleString()}.${fee > 0 ? ` Activation Fee: $${fee.toFixed(2)} debited.` : ''}`,
                  amount: fee > 0 ? fee : undefined,
                },
                ...u.activityLog,
              ],
            };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'Virtual Card Activated',
            message: `Your new ${newCard.name} (ending in ...${last4}) is ready for online purchases. Spending limit: $${spendingLimit.toLocaleString()}.${fee > 0 ? ` $${fee.toFixed(2)} fee debited from 360 Checking.` : ' No issuance fee.'}`,
            timestamp: 'Just now',
            unread: true,
            type: 'info',
            category: 'Transactions',
          };

          const logItem: SystemLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-US'),
            action: 'VIRTUAL_CARD',
            userId,
            userName: `${user.firstName} ${user.lastName}`,
            details: `Issued virtual card ${newCard.name} (...${last4}) with limit $${spendingLimit.toLocaleString()}`,
            amount: fee > 0 ? fee : undefined,
          };

          return {
            users: updatedUsers,
            currentUser: current,
            transactions: feeTx ? [feeTx, ...state.transactions] : state.transactions,
            notifications: [notif, ...state.notifications],
            systemLogs: [logItem, ...state.systemLogs],
          };
        });

        return { success: true, card: newCard };
      },

      regenerateVirtualCard: (userId, cardId) => {
        set((state) => {
          let updatedName = '';
          let newLast4 = '';
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedCards = (u.virtualCards || []).map((c) => {
              if (c.id === cardId) {
                const freshLast4 = Math.floor(1000 + Math.random() * 9000).toString();
                const freshNum = `4147 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${freshLast4}`;
                const freshCvv = Math.floor(100 + Math.random() * 900).toString();
                updatedName = c.name;
                newLast4 = freshLast4;
                return {
                  ...c,
                  cardNumber: freshNum,
                  last4: freshLast4,
                  cvv: freshCvv,
                  spentAmount: 0,
                };
              }
              return c;
            });
            return {
              ...u,
              virtualCards: updatedCards,
              activityLog: [
                {
                  id: `ACT-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  action: 'CARD_CREATED' as const,
                  details: `Regenerated fresh security credentials for ${updatedName} (...${newLast4})`,
                },
                ...u.activityLog,
              ],
            };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'Virtual Card Credentials Regenerated',
            message: `A new 16-digit number and CVV have been generated for ${updatedName} (now ending in ...${newLast4}). Previous token permanently expired.`,
            timestamp: 'Just now',
            unread: true,
            type: 'security',
            category: 'Security',
          };

          return { users: updatedUsers, currentUser: current, notifications: [notif, ...state.notifications] };
        });
      },

      togglePauseVirtualCard: (userId, cardId) => {
        set((state) => {
          let updatedStateCard: VirtualCard | undefined;
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedCards = (u.virtualCards || []).map((c) => {
              if (c.id === cardId) {
                updatedStateCard = { ...c, isPaused: !c.isPaused };
                return updatedStateCard;
              }
              return c;
            });
            return { ...u, virtualCards: updatedCards };
          });
          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: updatedStateCard?.isPaused ? 'Virtual Card Locked' : 'Virtual Card Unlocked',
            message: `${updatedStateCard?.name || 'Card'} (...${updatedStateCard?.last4}) is now ${updatedStateCard?.isPaused ? 'temporarily paused' : 'active and ready for transactions'}.`,
            timestamp: 'Just now',
            unread: true,
            type: updatedStateCard?.isPaused ? 'alert' : 'info',
            category: 'Security',
          };

          return { users: updatedUsers, currentUser: current, notifications: [notif, ...state.notifications] };
        });
      },

      deleteVirtualCard: (userId, cardId) => {
        set((state) => {
          let deletedCard: VirtualCard | undefined;
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            deletedCard = (u.virtualCards || []).find((c) => c.id === cardId);
            const filtered = (u.virtualCards || []).filter((c) => c.id !== cardId);
            return { ...u, virtualCards: filtered };
          });
          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'Virtual Card Removed',
            message: `Virtual card ${deletedCard?.name || ''} (...${deletedCard?.last4}) has been closed. Slot released.`,
            timestamp: 'Just now',
            unread: true,
            type: 'info',
            category: 'Security',
          };

          return { users: updatedUsers, currentUser: current, notifications: [notif, ...state.notifications] };
        });
      },

      // KYC Document Upload & Verification
      uploadKycDocument: (userId, docType, fileName, metadata) => {
        const typeNames = {
          driver_license: "Driver's License (State Issued)",
          passport: 'US Passport / Foreign National ID',
          utility_bill: 'Utility Bill (Proof of Residence)',
        };

        const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const newDoc: KycDocument = {
          id: `KYC-${Date.now()}`,
          userId,
          docType,
          docTypeName: typeNames[docType],
          fileName,
          idNumber: metadata?.idNumber,
          utilityProvider: metadata?.utilityProvider,
          fileSize: metadata?.fileSize || '2.4 MB',
          uploadedAt: 'Just now',
          status: 'pending',
          reviewDeadline: deadline,
        };

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const docs = u.kycDocuments || [];
            return {
              ...u,
              kycStatus: 'pending' as const,
              kycDocuments: [newDoc, ...docs.filter((d) => d.docType !== docType)],
              activityLog: [
                {
                  id: `ACT-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  action: 'KYC_UPLOAD' as const,
                  details: `Uploaded ${typeNames[docType]} (${fileName}) for account activation & compliance review`,
                },
                ...u.activityLog,
              ],
            };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'KYC Documents Submitted (Pending Verification)',
            message: `Your ${typeNames[docType]} has been uploaded and queued for Administrative review. Estimated completion: within 24 hours (${deadline}). Outbound withdrawals remain held until approved.`,
            timestamp: 'Just now',
            unread: true,
            type: 'info',
            category: 'Verification',
          };

          const logItem: SystemLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-US'),
            action: 'KYC_REVIEW',
            userId,
            details: `User submitted ${typeNames[docType]} (${fileName}) for identity verification`,
          };

          return {
            users: updatedUsers,
            currentUser: current,
            notifications: [notif, ...state.notifications],
            systemLogs: [logItem, ...state.systemLogs],
          };
        });
      },

      uploadKycPackage: (userId, documents) => {
        const typeNames = {
          driver_license: "Driver's License (State Issued)",
          passport: 'US Passport / Foreign National ID',
          utility_bill: 'Utility Bill (Proof of Residence)',
        };

        const deadline = new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        const newDocs: KycDocument[] = documents.map((d, index) => ({
          id: `KYC-${Date.now()}-${index}`,
          userId,
          docType: d.docType,
          docTypeName: typeNames[d.docType],
          fileName: d.fileName,
          idNumber: d.idNumber,
          utilityProvider: d.utilityProvider,
          fileSize: d.fileSize || '3.1 MB',
          uploadedAt: 'Just now',
          status: 'pending' as const,
          reviewDeadline: deadline,
        }));

        set((state) => {
          const user = state.users.find((u) => u.id === userId);
          const userName = user ? `${user.firstName} ${user.lastName}` : 'Customer';

          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const existingDocs = u.kycDocuments || [];
            // replace documents of matching types
            const newTypes = new Set(newDocs.map((nd) => nd.docType));
            const retained = existingDocs.filter((ed) => !newTypes.has(ed.docType));
            return {
              ...u,
              kycStatus: 'pending' as const,
              kycDocuments: [...newDocs, ...retained],
              activityLog: [
                {
                  id: `ACT-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  action: 'KYC_UPLOAD' as const,
                  details: `Uploaded complete verification package (${newDocs.length} documents) for account activation`,
                },
                ...u.activityLog,
              ],
            };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'Identity Verification Package Submitted',
            message: `Both your Government Photo ID and Utility Bill were submitted to Capital One Compliance. Status is 'Pending Verification'. Outbound withdrawals are locked until Admin review completes.`,
            timestamp: 'Just now',
            unread: true,
            type: 'info',
            category: 'Verification',
          };

          const logItem: SystemLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-US'),
            action: 'KYC_REVIEW',
            userId,
            userName,
            details: `Submitted full KYC package: ID (${documents.find((d) => d.docType !== 'utility_bill')?.fileName}) & Utility Bill (${documents.find((d) => d.docType === 'utility_bill')?.fileName})`,
          };

          return {
            users: updatedUsers,
            currentUser: current,
            notifications: [notif, ...state.notifications],
            systemLogs: [logItem, ...state.systemLogs],
          };
        });
      },

      reviewKycDocument: (userId, docId, status, feedback) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedDocs = (u.kycDocuments || []).map((d) =>
              d.id === docId ? { ...d, status, adminFeedback: feedback } : d
            );
            const anyRejected = updatedDocs.some((d) => d.status === 'rejected');
            const allApproved = updatedDocs.length > 0 && updatedDocs.every((d) => d.status === 'approved');
            const overallKyc: 'not_submitted' | 'pending' | 'verified' | 'rejected' = anyRejected
              ? 'rejected'
              : allApproved
              ? 'verified'
              : 'pending';

            return {
              ...u,
              kycStatus: overallKyc,
              kycDocuments: updatedDocs,
            };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: status === 'approved' ? 'KYC Verification Approved' : 'KYC Document Resubmission Required',
            message: status === 'approved'
              ? 'Congratulations! Your identity documents have been approved by Capital One Administration. All account withdrawal limits and features are active.'
              : `Admin Notice: Your submitted document was declined. Reason: ${feedback || 'Document clarity or address mismatch'}. Please resubmit.`,
            timestamp: 'Just now',
            unread: true,
            type: status === 'approved' ? 'info' : 'alert',
          };

          return { users: updatedUsers, currentUser: current, notifications: [notif, ...state.notifications] };
        });
      },

      // In-App Stock Trading
      buyStock: async (userId, symbol, shares, currentPrice) => {
        const user = get().users.find((u) => u.id === userId);
        if (!user) return { success: false, error: 'User not found' };
        const chk = user.accounts.find((a) => a.type === 'checking');
        const totalCost = shares * currentPrice;

        if (!chk || chk.balance < totalCost) {
          return { success: false, error: `Insufficient checking balance ($${chk?.balance.toFixed(2) || '0.00'} available, $${totalCost.toFixed(2)} required).` };
        }

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedAccounts = u.accounts.map((acc) => {
              if (acc.id === chk.id) return { ...acc, balance: acc.balance - totalCost };
              return acc;
            });

            const currentHoldings = u.stockHoldings || [];
            const existing = currentHoldings.find((s) => s.symbol === symbol);
            let updatedHoldings: StockHolding[];

            if (existing) {
              const totalShares = existing.shares + shares;
              const newAvgPrice = (existing.shares * existing.avgBuyPrice + totalCost) / totalShares;
              updatedHoldings = currentHoldings.map((s) =>
                s.symbol === symbol ? { ...s, shares: totalShares, avgBuyPrice: newAvgPrice } : s
              );
            } else {
              updatedHoldings = [...currentHoldings, { symbol, name: symbol, shares, avgBuyPrice: currentPrice, currentPrice, changePct: 0 }];
            }

            const newLog: ActivityLogItem = {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              action: 'STOCK_TRADE',
              details: `Purchased ${shares} shares of ${symbol} @ $${currentPrice.toFixed(2)} (Total: $${totalCost.toFixed(2)})`,
              amount: totalCost,
            };

            return { ...u, accounts: updatedAccounts, stockHoldings: updatedHoldings, activityLog: [newLog, ...u.activityLog] };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const newTx: Transaction = {
            id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            referenceNumber: `REF-STK-${Math.floor(1000000 + Math.random() * 9000000)}`,
            userId,
            userName: `${user.firstName} ${user.lastName}`,
            merchant: `Capital One Investing: Buy ${shares}x ${symbol}`,
            amount: totalCost,
            type: 'Stock Investment',
            status: 'Completed',
            date: 'Today',
            category: 'Investments',
          };

          return { users: updatedUsers, currentUser: current, transactions: [newTx, ...state.transactions] };
        });

        return { success: true };
      },

      sellStock: async (userId, symbol, shares, currentPrice) => {
        const user = get().users.find((u) => u.id === userId);
        if (!user) return { success: false, error: 'User not found' };
        const holding = (user.stockHoldings || []).find((s) => s.symbol === symbol);

        if (!holding || holding.shares < shares) {
          return { success: false, error: `You do not have enough shares of ${symbol} to sell.` };
        }

        const proceeds = shares * currentPrice;
        const chk = user.accounts.find((a) => a.type === 'checking') || user.accounts[0];

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedAccounts = u.accounts.map((acc) => {
              if (acc.id === chk.id) return { ...acc, balance: acc.balance + proceeds };
              return acc;
            });

            const updatedHoldings = (u.stockHoldings || []).map((s) => {
              if (s.symbol === symbol) return { ...s, shares: s.shares - shares };
              return s;
            }).filter((s) => s.shares > 0);

            const newLog: ActivityLogItem = {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              action: 'STOCK_TRADE',
              details: `Sold ${shares} shares of ${symbol} @ $${currentPrice.toFixed(2)} (Proceeds: $${proceeds.toFixed(2)})`,
              amount: proceeds,
            };

            return { ...u, accounts: updatedAccounts, stockHoldings: updatedHoldings, activityLog: [newLog, ...u.activityLog] };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const newTx: Transaction = {
            id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            referenceNumber: `REF-STK-${Math.floor(1000000 + Math.random() * 9000000)}`,
            userId,
            userName: `${user.firstName} ${user.lastName}`,
            merchant: `Capital One Investing: Sell ${shares}x ${symbol}`,
            amount: proceeds,
            type: 'Stock Investment',
            status: 'Completed',
            date: 'Today',
            category: 'Investments',
          };

          return { users: updatedUsers, currentUser: current, transactions: [newTx, ...state.transactions] };
        });

        return { success: true };
      },

      updateBudgetCategoryLimit: (categoryId, newLimit) => {
        set((state) => {
          const updatedCategories = state.budgetCategories.map((c) =>
            c.id === categoryId ? { ...c, budgetAmount: newLimit } : c
          );
          const updatedUsers = state.currentUser
            ? state.users.map((u) => {
                if (u.id !== state.currentUser?.id) return u;
                const userCats = (u.budgetCategories || state.budgetCategories).map((c) =>
                  c.id === categoryId ? { ...c, budgetAmount: newLimit } : c
                );
                return { ...u, budgetCategories: userCats };
              })
            : state.users;
          const current = state.currentUser
            ? updatedUsers.find((u) => u.id === state.currentUser?.id) || state.currentUser
            : state.currentUser;
          return { budgetCategories: updatedCategories, users: updatedUsers, currentUser: current };
        });
      },

      updateBudgetCategorySpent: (categoryId, newSpent) => {
        set((state) => {
          const updatedCategories = state.budgetCategories.map((c) =>
            c.id === categoryId ? { ...c, spentAmount: newSpent } : c
          );
          const updatedUsers = state.currentUser
            ? state.users.map((u) => {
                if (u.id !== state.currentUser?.id) return u;
                const userCats = (u.budgetCategories || state.budgetCategories).map((c) =>
                  c.id === categoryId ? { ...c, spentAmount: newSpent } : c
                );
                return { ...u, budgetCategories: userCats };
              })
            : state.users;
          const current = state.currentUser
            ? updatedUsers.find((u) => u.id === state.currentUser?.id) || state.currentUser
            : state.currentUser;
          return { budgetCategories: updatedCategories, users: updatedUsers, currentUser: current };
        });
      },

      updateBudgetCategoryItem: (categoryId, updates) => {
        set((state) => {
          const updatedCategories = state.budgetCategories.map((c) =>
            c.id === categoryId ? { ...c, ...updates } : c
          );
          const updatedUsers = state.currentUser
            ? state.users.map((u) => {
                if (u.id !== state.currentUser?.id) return u;
                const userCats = (u.budgetCategories || state.budgetCategories).map((c) =>
                  c.id === categoryId ? { ...c, ...updates } : c
                );
                return { ...u, budgetCategories: userCats };
              })
            : state.users;
          const current = state.currentUser
            ? updatedUsers.find((u) => u.id === state.currentUser?.id) || state.currentUser
            : state.currentUser;
          return { budgetCategories: updatedCategories, users: updatedUsers, currentUser: current };
        });
      },

      deleteBudgetCategory: (categoryId) => {
        set((state) => {
          const updatedCategories = state.budgetCategories.filter((c) => c.id !== categoryId);
          const updatedUsers = state.currentUser
            ? state.users.map((u) => {
                if (u.id !== state.currentUser?.id) return u;
                const userCats = (u.budgetCategories || state.budgetCategories).filter((c) => c.id !== categoryId);
                return { ...u, budgetCategories: userCats };
              })
            : state.users;
          const current = state.currentUser
            ? updatedUsers.find((u) => u.id === state.currentUser?.id) || state.currentUser
            : state.currentUser;
          return { budgetCategories: updatedCategories, users: updatedUsers, currentUser: current };
        });
      },

      addBudgetCategory: (name, budgetAmount, icon) => {
        const newCat: BudgetCategory = {
          id: `cat-${Date.now()}`,
          name,
          budgetAmount,
          spentAmount: 0,
          icon: icon || 'tag',
        };
        set((state) => {
          const updatedCategories = [...state.budgetCategories, newCat];
          const updatedUsers = state.currentUser
            ? state.users.map((u) => {
                if (u.id !== state.currentUser?.id) return u;
                const userCats = [...(u.budgetCategories || state.budgetCategories), newCat];
                return { ...u, budgetCategories: userCats };
              })
            : state.users;
          const current = state.currentUser
            ? updatedUsers.find((u) => u.id === state.currentUser?.id) || state.currentUser
            : state.currentUser;
          return { budgetCategories: updatedCategories, users: updatedUsers, currentUser: current };
        });
      },

      updateUserMonthlyBudget: (userId, income, spendingGoal) => {
        set((state) => {
          const updatedUsers = state.users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  monthlyIncome: income,
                  monthlySpendingGoal: spendingGoal,
                }
              : u
          );
          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;
          return { users: updatedUsers, currentUser: current };
        });
      },

      bookTravelBenefit: async (userId, booking) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const user = get().users.find((u) => u.id === userId);
        if (!user) return false;

        const chk = user.accounts.find((a) => a.type === 'checking');
        const crd = user.accounts.find((a) => a.type === 'credit');

        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedAccounts = u.accounts.map((acc) => {
              if (booking.useRewards && acc.type === 'credit' && acc.rewardsCash) {
                return { ...acc, rewardsCash: Math.max(0, acc.rewardsCash - booking.cost) };
              }
              if (!booking.useRewards && acc.type === 'checking') {
                return { ...acc, balance: Math.max(0, acc.balance - booking.cost) };
              }
              return acc;
            });

            return {
              ...u,
              accounts: updatedAccounts,
              activityLog: [
                {
                  id: `ACT-${Date.now()}`,
                  timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                  action: 'PAYMENT' as const,
                  details: `Booked ${booking.category}: ${booking.title} ($${booking.cost.toFixed(2)})`,
                  amount: booking.cost,
                },
                ...u.activityLog,
              ],
            };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const newTx: Transaction = {
            id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            referenceNumber: `REF-TRV-${Math.floor(1000000 + Math.random() * 9000000)}`,
            userId,
            userName: `${user.firstName} ${user.lastName}`,
            merchant: `Capital One ${booking.category}: ${booking.title}`,
            amount: booking.cost,
            type: 'Travel Booking',
            status: 'Completed',
            date: 'Today',
            category: 'Travel & Rewards',
            memo: booking.description,
          };

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: `${booking.category} Booking Confirmed`,
            message: `Your Capital One Travel booking for "${booking.title}" is confirmed. Ref #${newTx.referenceNumber}.`,
            timestamp: 'Just now',
            unread: true,
            type: 'info',
          };

          return {
            users: updatedUsers,
            currentUser: current,
            transactions: [newTx, ...state.transactions],
            notifications: [notif, ...state.notifications],
          };
        });

        return true;
      },

      updateClientAccountNumbers: (userId, accountId, fullAccountNumber, routingNumber) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedAccounts = u.accounts.map((acc) => {
              if (acc.id === accountId) {
                const last4 = fullAccountNumber.slice(-4);
                return {
                  ...acc,
                  fullAccountNumber,
                  routingNumber,
                  accountNumber: `...${last4}`,
                };
              }
              return acc;
            });
            return { ...u, accounts: updatedAccounts };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          return { users: updatedUsers, currentUser: current };
        });
      },

      moderateTransaction: (txId, action, adminFeedback) => {
        const tx = get().transactions.find((t) => t.id === txId);
        if (!tx) return;

        set((state) => {
          let updatedTxList = state.transactions;
          let updatedUsers = state.users;

          if (action === 'Approve') {
            updatedTxList = state.transactions.map((t) =>
              t.id === txId ? { ...t, status: 'Completed', adminFeedback } : t
            );
          } else if (action === 'Decline') {
            updatedTxList = state.transactions.map((t) =>
              t.id === txId ? { ...t, status: 'Declined', adminFeedback } : t
            );
          } else if (action === 'Refund') {
            // Refund restores funds to user
            updatedTxList = state.transactions.map((t) =>
              t.id === txId ? { ...t, status: 'Refunded', adminFeedback } : t
            );

            // Refund transaction
            const refundTx: Transaction = {
              id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
              referenceNumber: `REF-RND-${Math.floor(1000000 + Math.random() * 9000000)}`,
              userId: tx.userId,
              userName: tx.userName,
              merchant: `Refund: ${tx.merchant}`,
              amount: tx.amount,
              type: 'Adjustment',
              status: 'Completed',
              date: 'Today',
              category: 'Admin Refund',
              adminFeedback,
            };

            updatedTxList = [refundTx, ...updatedTxList];

            updatedUsers = state.users.map((u) => {
              if (u.id !== tx.userId) return u;
              const chk = u.accounts.find((a) => a.type === 'checking') || u.accounts[0];
              const updatedAccounts = u.accounts.map((acc) => {
                if (acc.id === chk.id) return { ...acc, balance: acc.balance + tx.amount };
                return acc;
              });
              const newLog: ActivityLogItem = {
                id: `ACT-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                action: 'LEDGER_ADJUSTMENT',
                details: `Admin refunded $${tx.amount.toFixed(2)} for ${tx.merchant}. Note: ${adminFeedback || 'Reversal granted'}`,
                amount: tx.amount,
              };
              return { ...u, accounts: updatedAccounts, activityLog: [newLog, ...u.activityLog] };
            });
          }

          const notifMsg =
            action === 'Approve'
              ? `Your transaction of $${tx.amount.toFixed(2)} (${tx.merchant}) has been cleared and approved by Administration.`
              : action === 'Decline'
              ? `Admin Notice: Your transaction of $${tx.amount.toFixed(2)} was declined. Reason: ${adminFeedback || 'Routing verification failure'}.`
              : `Admin Notice: A refund of $${tx.amount.toFixed(2)} has been credited back to your account. Note: ${adminFeedback || 'Reversal processed'}.`;

          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: `Transaction Update: ${action}ed`,
            message: notifMsg,
            timestamp: 'Just now',
            unread: true,
            type: action === 'Decline' ? 'alert' : 'info',
          };

          const current = state.currentUser?.id === tx.userId
            ? updatedUsers.find((u) => u.id === tx.userId) || state.currentUser
            : state.currentUser;

          return {
            transactions: updatedTxList,
            users: updatedUsers,
            currentUser: current,
            notifications: [newNotif, ...state.notifications],
          };
        });
      },

      updateWithdrawalDisclaimer: (text) => {
        set({ withdrawalDisclaimer: text });
      },

      adminVerifyUserKyc: (userId) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedDocs = (u.kycDocuments || []).map((d) => ({ ...d, status: 'approved' as const }));
            return {
              ...u,
              kycStatus: 'verified' as const,
              kycDocuments: updatedDocs,
            };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const notif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'Account Verification Approved',
            message: 'Capital One Compliance has verified your identity. All outbound withdrawals and higher transfer limits are unlocked.',
            timestamp: 'Just now',
            unread: true,
            type: 'info',
          };

          const newLog: SystemLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-US'),
            action: 'KYC_REVIEW',
            userId,
            details: `Admin approved KYC verification. Account status set to 'Verified'`,
          };

          return {
            users: updatedUsers,
            currentUser: current,
            notifications: [notif, ...state.notifications],
            systemLogs: [newLog, ...state.systemLogs],
          };
        });
      },

      adminUpdateVirtualCard: (userId, cardId, updates) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedCards = (u.virtualCards || []).map((c) =>
              c.id === cardId ? { ...c, ...updates } : c
            );
            return { ...u, virtualCards: updatedCards };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const newLog: SystemLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-US'),
            action: 'VIRTUAL_CARD',
            userId,
            details: `Admin modified virtual card details (${cardId})`,
          };

          return {
            users: updatedUsers,
            currentUser: current,
            systemLogs: [newLog, ...state.systemLogs],
          };
        });
      },

      adminDeleteVirtualCard: (userId, cardId) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const filteredCards = (u.virtualCards || []).filter((c) => c.id !== cardId);
            return { ...u, virtualCards: filteredCards };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const newLog: SystemLog = {
            id: `LOG-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-US'),
            action: 'VIRTUAL_CARD',
            userId,
            details: `Admin revoked virtual card (${cardId})`,
          };

          return {
            users: updatedUsers,
            currentUser: current,
            systemLogs: [newLog, ...state.systemLogs],
          };
        });
      },

      addNotification: (title, message, type = 'info') => {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title,
          message,
          timestamp: 'Just now',
          unread: true,
          type,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications],
          globalNotification: message,
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
        }));
      },

      markAllNotificationsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, unread: false })),
        }));
      },

      deleteNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      adminAdjustBalance: (userId, accountId, delta, reason) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            const updatedAccounts = u.accounts.map((acc) => {
              if (acc.id === accountId) return { ...acc, balance: Math.max(0, acc.balance + delta) };
              return acc;
            });
            const newLog: ActivityLogItem = {
              id: `ACT-${Date.now()}`,
              timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              action: 'LEDGER_ADJUSTMENT',
              details: `Admin adjustment (${delta >= 0 ? '+' : ''}$${delta.toFixed(2)}): ${reason}`,
              amount: Math.abs(delta),
            };
            return { ...u, accounts: updatedAccounts, activityLog: [newLog, ...u.activityLog] };
          });

          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;

          const user = state.users.find((u) => u.id === userId);
          const fullName = user ? `${user.firstName} ${user.lastName}` : 'Customer';

          const newTx: Transaction = {
            id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
            referenceNumber: `REF-ADJ-${Math.floor(1000000 + Math.random() * 9000000)}`,
            userId,
            userName: fullName,
            merchant: `Admin Adjustment: ${reason}`,
            amount: Math.abs(delta),
            type: 'Adjustment',
            status: 'Completed',
            date: 'Today',
            category: 'Admin Action',
          };

          return { users: updatedUsers, currentUser: current, transactions: [newTx, ...state.transactions] };
        });
      },

      updateUserBalance: (userId, accountId, newBalance) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => {
            if (u.id !== userId) return u;
            return {
              ...u,
              accounts: u.accounts.map((acc) => (acc.id === accountId ? { ...acc, balance: newBalance } : acc)),
            };
          });
          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;
          return { users: updatedUsers, currentUser: current };
        });
      },

      updateUserStatus: (userId, newStatus) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => (u.id === userId ? { ...u, status: newStatus } : u));
          const current = state.currentUser?.id === userId ? { ...state.currentUser, status: newStatus } : state.currentUser;
          return { users: updatedUsers, currentUser: current };
        });
      },

      resetUserPassword: (userId) => {
        set((state) => {
          const updatedUsers = state.users.map((u) =>
            u.id === userId ? { ...u, password: state.resetPasswordPin } : u
          );
          const current = state.currentUser?.id === userId
            ? { ...state.currentUser, password: state.resetPasswordPin }
            : state.currentUser;
          return { users: updatedUsers, currentUser: current };
        });
      },

      updateUserDetails: (userId, updates) => {
        set((state) => {
          const updatedUsers = state.users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
          const current = state.currentUser?.id === userId
            ? updatedUsers.find((u) => u.id === userId) || state.currentUser
            : state.currentUser;
          return { users: updatedUsers, currentUser: current };
        });
      },

      deleteUser: (userId) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== userId),
          currentUser: state.currentUser?.id === userId ? null : state.currentUser,
        }));
      },

      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: `USR-${Date.now().toString().slice(-4)}`,
        };
        set((state) => ({ users: [...state.users, newUser] }));
        return newUser;
      },

      addPaymentOption: (opt) => {
        const newOpt: PaymentOption = { ...opt, id: `pay-opt-${Date.now()}` };
        set((state) => ({ paymentOptions: [...state.paymentOptions, newOpt] }));
      },

      updatePaymentOption: (id, updates) => {
        set((state) => ({
          paymentOptions: state.paymentOptions.map((opt) => (opt.id === id ? { ...opt, ...updates } : opt)),
        }));
      },

      deletePaymentOption: (id) => {
        set((state) => ({
          paymentOptions: state.paymentOptions.filter((opt) => opt.id !== id),
        }));
      },

      togglePaymentOption: (id) => {
        set((state) => ({
          paymentOptions: state.paymentOptions.map((opt) => (opt.id === id ? { ...opt, enabled: !opt.enabled } : opt)),
        }));
      },

      toggleWithdrawalOption: (id) => {
        set((state) => ({
          withdrawalOptions: state.withdrawalOptions.map((opt) =>
            opt.id === id ? { ...opt, enabled: !opt.enabled } : opt
          ),
        }));
      },

      setProcessingFeedbackMessage: (msg) => {
        set({ processingFeedbackMessage: msg });
      },

      setResetPasswordPin: (pin) => {
        set({ resetPasswordPin: pin });
      },

      applyDefaultPasswordToAll: () => {
        set((state) => ({
          users: state.users.map((u) => ({ ...u, password: state.resetPasswordPin })),
          currentUser: state.currentUser ? { ...state.currentUser, password: state.resetPasswordPin } : null,
        }));
      },

      setGlobalNotification: (msg) => {
        set({ globalNotification: msg });
        if (msg.trim()) {
          get().addNotification('Capital One Announcement', msg.trim(), 'info');
        }
      },

      clearAllData: () => {
        set({
          users: [],
          transactions: [],
          systemLogs: [],
          notifications: [],
          currentUser: null,
          globalNotification: '',
        });
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },
    }),
    {
      name: 'capitalone_v5_banking_store',
    }
  )
);
