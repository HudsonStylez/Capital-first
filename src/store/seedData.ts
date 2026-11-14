import type {
  User,
  Transaction,
  SystemLog,
  GiftCard,
  NotificationItem,
  VirtualCard,
  KycDocument,
  StockHolding,
  BudgetCategory,
  ActivityLogItem,
  UserAccount,
  SupportThread,
} from './useBankingStore';

// =============================================================================
// CAPITAL ONE — REALISTIC DEMO SEED DATA
// Populates the store on first load so every screen, admin view, and feature
// is data-packed and fully interactive. Admin can override any of this.
// =============================================================================

const iso = (daysAgo: number, hour = 12, min = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
};

const minsAgo = (minutes: number): string => new Date(Date.now() - minutes * 60000).toISOString();

// -----------------------------------------------------------------------------
// Shared budget categories
// -----------------------------------------------------------------------------
const demoBudgets: BudgetCategory[] = [
  { id: 'cat-1', name: 'Housing & Rent', budgetAmount: 2400, spentAmount: 2400, icon: 'home' },
  { id: 'cat-2', name: 'Groceries & Dining', budgetAmount: 850, spentAmount: 612.44, icon: 'utensils' },
  { id: 'cat-3', name: 'Auto & Transport', budgetAmount: 520, spentAmount: 318.2, icon: 'car' },
  { id: 'cat-4', name: 'Entertainment & Travel', budgetAmount: 450, spentAmount: 289.99, icon: 'film' },
  { id: 'cat-5', name: 'Utilities & Bills', budgetAmount: 380, spentAmount: 344.1, icon: 'zap' },
  { id: 'cat-6', name: 'Shopping', budgetAmount: 400, spentAmount: 187.5, icon: 'shopping-bag' },
];

const johnsmithBudgets: BudgetCategory[] = [
  { id: 'cat-1', name: 'Housing & Rent', budgetAmount: 1850, spentAmount: 1850, icon: 'home' },
  { id: 'cat-2', name: 'Groceries & Dining', budgetAmount: 600, spentAmount: 421.3, icon: 'utensils' },
  { id: 'cat-3', name: 'Auto & Transport', budgetAmount: 400, spentAmount: 265.0, icon: 'car' },
  { id: 'cat-4', name: 'Entertainment & Travel', budgetAmount: 300, spentAmount: 142.0, icon: 'film' },
];

// -----------------------------------------------------------------------------
// Accounts
// -----------------------------------------------------------------------------
const alexAccounts: UserAccount[] = [
  {
    id: 'acc-alex-checking',
    type: 'checking',
    accountType: '360 Checking',
    accountNumber: '485719023',
    fullAccountNumber: '000485719023',
    routingNumber: '051405515',
    balance: 18452.67,
  },
  {
    id: 'acc-alex-credit',
    type: 'credit',
    accountType: 'Quicksilver Rewards',
    accountNumber: '441298876',
    fullAccountNumber: '441298876001',
    routingNumber: '051405515',
    balance: -1245.3,
    availableCredit: 8754.7,
    creditLimit: 10000,
    rewardsCash: 642.18,
    paymentDueDate: iso(-12).slice(0, 10),
    minPaymentDue: 35,
    apr: '19.24% (Variable)',
  },
  {
    id: 'acc-alex-savings',
    type: 'savings',
    accountType: '360 Performance Savings',
    accountNumber: '772910344',
    fullAccountNumber: '000772910344',
    routingNumber: '051405515',
    balance: 42310.55,
  },
];

const johnAccounts: UserAccount[] = [
  {
    id: 'acc-john-checking',
    type: 'checking',
    accountType: '360 Checking',
    accountNumber: '330192847',
    fullAccountNumber: '000330192847',
    routingNumber: '051405515',
    balance: 6210.44,
  },
  {
    id: 'acc-john-credit',
    type: 'credit',
    accountType: 'Venture Rewards',
    accountNumber: '552019384',
    fullAccountNumber: '552019384002',
    routingNumber: '051405515',
    balance: -842.15,
    availableCredit: 14157.85,
    creditLimit: 15000,
    rewardsMiles: 48210,
    paymentDueDate: iso(-5).slice(0, 10),
    minPaymentDue: 25,
    apr: '21.49% (Variable)',
  },
];

const mariaAccounts: UserAccount[] = [
  {
    id: 'acc-maria-checking',
    type: 'checking',
    accountType: '360 Checking',
    accountNumber: '918273645',
    fullAccountNumber: '000918273645',
    routingNumber: '051405515',
    balance: 2380.9,
  },
];

const davidAccounts: UserAccount[] = [
  {
    id: 'acc-david-checking',
    type: 'checking',
    accountType: '360 Checking',
    accountNumber: '120394857',
    fullAccountNumber: '000120394857',
    routingNumber: '051405515',
    balance: 9930.12,
  },
  {
    id: 'acc-david-credit',
    type: 'credit',
    accountType: 'Savor Rewards',
    accountNumber: '660192837',
    fullAccountNumber: '660192837003',
    routingNumber: '051405515',
    balance: -312.6,
    availableCredit: 4687.4,
    creditLimit: 5000,
    rewardsCash: 128.4,
    paymentDueDate: iso(-20).slice(0, 10),
    minPaymentDue: 25,
    apr: '20.24% (Variable)',
  },
  {
    id: 'acc-david-savings',
    type: 'savings',
    accountType: '360 Performance Savings',
    accountNumber: '334019283',
    fullAccountNumber: '000334019283',
    routingNumber: '051405515',
    balance: 15870.0,
  },
];

// -----------------------------------------------------------------------------
// Virtual cards
// -----------------------------------------------------------------------------
const alexCards: VirtualCard[] = [
  {
    id: 'vcard-alex-1',
    userId: 'USR-ALEX',
    type: 'venture_x',
    name: "Alex's Venture X",
    cardNumber: '4147 0192 8837 4412',
    last4: '4412',
    expiry: '09/29',
    cvv: '314',
    spendingLimit: 10000,
    spentAmount: 1245.3,
    isPaused: false,
    activationFee: 0,
    colorTheme: 'black',
    cardArt: 'venture_x',
    billingZip: '20001',
    createdAt: iso(420),
  },
  {
    id: 'vcard-alex-2',
    userId: 'USR-ALEX',
    type: 'eno',
    name: 'Eno Shopping Card',
    cardNumber: '4147 0192 5521 9083',
    last4: '9083',
    expiry: '03/28',
    cvv: '882',
    spendingLimit: 500,
    spentAmount: 187.5,
    isPaused: false,
    activationFee: 2.99,
    colorTheme: 'violet',
    cardArt: 'eno',
    merchantLock: 'Amazon',
    billingZip: '20001',
    createdAt: iso(210),
  },
];

const johnCards: VirtualCard[] = [
  {
    id: 'vcard-john-1',
    userId: 'USR-JOHN',
    type: 'standard',
    name: "John's Virtual Debit",
    cardNumber: '4147 8820 1193 4471',
    last4: '4471',
    expiry: '11/28',
    cvv: '220',
    spendingLimit: 2000,
    spentAmount: 0,
    isPaused: false,
    activationFee: 0,
    colorTheme: 'blue',
    billingZip: '94105',
    createdAt: iso(150),
  },
];

// -----------------------------------------------------------------------------
// KYC documents
// -----------------------------------------------------------------------------
const alexKyc: KycDocument[] = [
  {
    id: 'kyc-alex-1',
    userId: 'USR-ALEX',
    docType: 'driver_license',
    docTypeName: "Driver's License",
    fileName: 'alex_morgan_license.jpg',
    fileSize: '1.8 MB',
    idNumber: 'D1234-5678-9012',
    uploadedAt: iso(400),
    status: 'approved',
    reviewDeadline: iso(-320),
  },
  {
    id: 'kyc-alex-2',
    userId: 'USR-ALEX',
    docType: 'utility_bill',
    docTypeName: 'Utility Bill',
    fileName: 'washington_dc_bill.pdf',
    fileSize: '640 KB',
    utilityProvider: 'Pepco',
    uploadedAt: iso(400),
    status: 'approved',
    reviewDeadline: iso(-320),
  },
];

const mariaKyc: KycDocument[] = [
  {
    id: 'kyc-maria-1',
    userId: 'USR-MARIA',
    docType: 'passport',
    docTypeName: 'Passport',
    fileName: 'maria_passport.jpg',
    fileSize: '2.1 MB',
    idNumber: 'P9988776655',
    uploadedAt: iso(2),
    status: 'pending',
    reviewDeadline: iso(-5),
  },
];

// -----------------------------------------------------------------------------
// Stock holdings
// -----------------------------------------------------------------------------
const alexStocks: StockHolding[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', shares: 25, avgBuyPrice: 178.4, currentPrice: 231.59, changePct: 1.24 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 12, avgBuyPrice: 402.1, currentPrice: 428.74, changePct: 0.68 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', shares: 18, avgBuyPrice: 118.2, currentPrice: 141.27, changePct: 3.42 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 15, avgBuyPrice: 172.5, currentPrice: 201.35, changePct: -0.31 },
];

// -----------------------------------------------------------------------------
// Activity logs
// -----------------------------------------------------------------------------
const alexActivity: ActivityLogItem[] = [
  { id: 'act-alex-1', timestamp: iso(0, 9, 15), action: 'DEPOSIT', details: 'Direct Deposit — Acme Corp Payroll', amount: 6240.0 },
  { id: 'act-alex-2', timestamp: iso(1, 14, 22), action: 'PAYMENT', details: 'Payment to Quicksilver Rewards', amount: 250.0 },
  { id: 'act-alex-3', timestamp: iso(2, 11, 5), action: 'TRANSFER', details: 'Transfer to 360 Performance Savings', amount: 1000.0 },
  { id: 'act-alex-4', timestamp: iso(3, 18, 40), action: 'LOGIN', details: 'Signed in via Face ID passkey' },
  { id: 'act-alex-5', timestamp: iso(5, 8, 12), action: 'STOCK_TRADE', details: 'Bought 5 shares of NVDA', amount: 706.35 },
  { id: 'act-alex-6', timestamp: iso(8, 20, 3), action: 'DEPOSIT', details: 'Mobile check deposit', amount: 850.0 },
];

const johnActivity: ActivityLogItem[] = [
  { id: 'act-john-1', timestamp: iso(1, 10, 0), action: 'DEPOSIT', details: 'Direct Deposit — Globex LLC Payroll', amount: 4120.0 },
  { id: 'act-john-2', timestamp: iso(4, 16, 30), action: 'PAYMENT', details: 'Payment to Venture Rewards', amount: 120.0 },
];

// -----------------------------------------------------------------------------
// Users
// -----------------------------------------------------------------------------
export const seedUsers: User[] = [
  {
    id: 'USR-ALEX',
    username: 'demo',
    password: 'demo1234',
    firstName: 'Alex',
    lastName: 'Morgan',
    ssn: '412-55-8890',
    dob: '1991-04-18',
    email: 'alex.morgan@example.com',
    phone: '(202) 555-0147',
    address: { street: '1420 Columbia Rd NW', city: 'Washington', state: 'DC', zip: '20009' },
    status: 'Active',
    occupation: 'Senior Product Designer',
    annualIncome: 124020,
    monthlyIncome: 10335,
    monthlySpendingGoal: 4500,
    budgetCategories: demoBudgets,
    swiftCode: 'HIBKUS44',
    routingNumber: '051405515',
    securityPin: '1984',
    accounts: alexAccounts,
    activityLog: alexActivity,
    virtualCards: alexCards,
    kycDocuments: alexKyc,
    kycStatus: 'verified',
    stockHoldings: alexStocks,
  },
  {
    id: 'USR-JOHN',
    username: 'johnsmith',
    password: 'Password1',
    firstName: 'John',
    lastName: 'Smith',
    ssn: '558-21-3344',
    dob: '1987-09-02',
    email: 'john.smith@example.com',
    phone: '(415) 555-0192',
    address: { street: '88 King St', city: 'San Francisco', state: 'CA', zip: '94105' },
    status: 'Active',
    occupation: 'Software Engineer',
    annualIncome: 148000,
    monthlyIncome: 12333,
    monthlySpendingGoal: 4000,
    budgetCategories: johnsmithBudgets,
    routingNumber: '051405515',
    securityPin: '2468',
    accounts: johnAccounts,
    activityLog: johnActivity,
    virtualCards: johnCards,
    kycStatus: 'verified',
  },
  {
    id: 'USR-MARIA',
    username: 'maria',
    password: 'Password1',
    firstName: 'Maria',
    lastName: 'Garcia',
    ssn: '667-90-1122',
    dob: '1995-12-11',
    email: 'maria.garcia@example.com',
    phone: '(305) 555-0173',
    address: { street: '77 Ocean Dr', city: 'Miami', state: 'FL', zip: '33139' },
    status: 'Active',
    occupation: 'Registered Nurse',
    annualIncome: 86000,
    monthlyIncome: 7166,
    monthlySpendingGoal: 3200,
    routingNumber: '051405515',
    securityPin: '1357',
    accounts: mariaAccounts,
    activityLog: [],
    kycDocuments: mariaKyc,
    kycStatus: 'pending',
  },
  {
    id: 'USR-DAVID',
    username: 'david',
    password: 'Password1',
    firstName: 'David',
    lastName: 'Chen',
    ssn: '702-33-8899',
    dob: '1989-06-25',
    email: 'david.chen@example.com',
    phone: '(646) 555-0110',
    address: { street: '300 Park Ave', city: 'New York', state: 'NY', zip: '10022' },
    status: 'Locked',
    occupation: 'Investment Analyst',
    annualIncome: 132000,
    monthlyIncome: 11000,
    monthlySpendingGoal: 5200,
    routingNumber: '051405515',
    securityPin: '9753',
    accounts: davidAccounts,
    activityLog: [],
    kycStatus: 'verified',
  },
];

// -----------------------------------------------------------------------------
// Transactions
// -----------------------------------------------------------------------------
export const seedTransactions: Transaction[] = [
  // Alex Morgan
  { id: 'tx-alex-001', referenceNumber: 'REF-CAP-100241', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Acme Corp Payroll', amount: 6240.0, type: 'Deposit', status: 'Completed', date: iso(0, 9, 15), category: 'Income', destinationDetails: 'ACH Direct Deposit' },
  { id: 'tx-alex-016', referenceNumber: 'REF-CAP-100248', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Chipotle Mexican Grill', amount: -14.2, type: 'Credit Card', status: 'Completed', date: iso(0, 12, 34), category: 'Dining' },
  { id: 'tx-alex-017', referenceNumber: 'REF-CAP-100247', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Uber', amount: -18.75, type: 'Credit Card', status: 'Completed', date: iso(0, 21, 48), category: 'Auto & Transport' },
  { id: 'tx-alex-018', referenceNumber: 'REF-CAP-100245', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Apple iCloud+', amount: -2.99, type: 'Credit Card', status: 'Completed', date: iso(1, 3, 0), category: 'Subscriptions' },
  { id: 'tx-alex-019', referenceNumber: 'REF-CAP-100244', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Target', amount: -76.44, type: 'Credit Card', status: 'Completed', date: iso(1, 18, 12), category: 'Shopping' },
  { id: 'tx-alex-020', referenceNumber: 'REF-CAP-100243', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Zelle from Jordan R.', amount: 45.0, type: 'Deposit', status: 'Completed', date: iso(2, 19, 5), category: 'Income', destinationDetails: 'Peer transfer' },
  { id: 'tx-alex-021', referenceNumber: 'REF-CAP-100240', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: "Trader Joe's", amount: -58.13, type: 'Credit Card', status: 'Completed', date: iso(2, 17, 22), category: 'Groceries' },
  { id: 'tx-alex-022', referenceNumber: 'REF-CAP-100237', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Amazon Prime', amount: -14.99, type: 'Credit Card', status: 'Completed', date: iso(3, 6, 0), category: 'Subscriptions' },
  { id: 'tx-alex-023', referenceNumber: 'REF-CAP-100233', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Capital One ATM Withdrawal', amount: -100.0, type: 'Withdrawal', status: 'Completed', date: iso(4, 20, 15), category: 'Cash Withdrawal', destinationDetails: 'ATM C1-4471 · Washington, DC' },
  { id: 'tx-alex-024', referenceNumber: 'REF-CAP-100229', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Starbucks', amount: -5.45, type: 'Credit Card', status: 'Completed', date: iso(4, 7, 52), category: 'Dining' },
  { id: 'tx-alex-025', referenceNumber: 'REF-CAP-100226', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Verizon Wireless', amount: -85.0, type: 'Payment', status: 'Completed', date: iso(5, 10, 0), category: 'Utilities', destinationDetails: 'Biller: Verizon' },
  { id: 'tx-alex-002', referenceNumber: 'REF-CAP-100238', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Whole Foods Market', amount: -142.38, type: 'Credit Card', status: 'Completed', date: iso(0, 8, 12), category: 'Groceries' },
  { id: 'tx-alex-003', referenceNumber: 'REF-CAP-100235', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Starbucks Coffee', amount: -6.75, type: 'Credit Card', status: 'Completed', date: iso(0, 7, 45), category: 'Dining' },
  { id: 'tx-alex-004', referenceNumber: 'REF-CAP-100231', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Amazon.com', amount: -187.5, type: 'Credit Card', status: 'Completed', date: iso(1, 19, 22), category: 'Shopping' },
  { id: 'tx-alex-005', referenceNumber: 'REF-CAP-100228', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Quicksilver Rewards Payment', amount: 250.0, type: 'Payment', status: 'Completed', date: iso(1, 14, 22), category: 'Credit Card Payment' },
  { id: 'tx-alex-006', referenceNumber: 'REF-CAP-100224', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Shell Oil', amount: -58.4, type: 'Credit Card', status: 'Completed', date: iso(2, 17, 30), category: 'Auto & Transport' },
  { id: 'tx-alex-007', referenceNumber: 'REF-CAP-100219', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Transfer to Savings', amount: 1000.0, type: 'Transfer', status: 'Completed', date: iso(2, 11, 5), category: 'Internal Transfer' },
  { id: 'tx-alex-008', referenceNumber: 'REF-CAP-100214', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Netflix Subscription', amount: -22.99, type: 'Credit Card', status: 'Completed', date: iso(3, 6, 0), category: 'Entertainment' },
  { id: 'tx-alex-009', referenceNumber: 'REF-CAP-100209', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Delta Air Lines', amount: -486.2, type: 'Travel Booking', status: 'Completed', date: iso(4, 13, 45), category: 'Travel', destinationDetails: 'Confirmation DL9F3K2' },
  { id: 'tx-alex-010', referenceNumber: 'REF-CAP-100205', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'NVIDIA (NVDA) Purchase', amount: -706.35, type: 'Stock Investment', status: 'Completed', date: iso(5, 8, 12), category: 'Investments' },
  { id: 'tx-alex-011', referenceNumber: 'REF-CAP-100201', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Pepco Energy', amount: -94.1, type: 'Payment', status: 'Completed', date: iso(6, 10, 0), category: 'Utilities', destinationDetails: 'Biller: Pepco' },
  { id: 'tx-alex-012', referenceNumber: 'REF-CAP-100198', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Uber Eats', amount: -34.28, type: 'Credit Card', status: 'Completed', date: iso(7, 21, 10), category: 'Dining' },
  { id: 'tx-alex-013', referenceNumber: 'REF-CAP-100194', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Mobile Check Deposit', amount: 850.0, type: 'Deposit', status: 'Completed', date: iso(8, 20, 3), category: 'Income' },
  { id: 'tx-alex-014', referenceNumber: 'REF-CAP-100189', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'Apple Store', amount: -1299.0, type: 'Credit Card', status: 'Pending', date: iso(9, 15, 40), category: 'Shopping' },
  { id: 'tx-alex-015', referenceNumber: 'REF-CAP-100185', userId: 'USR-ALEX', userName: 'Alex Morgan', merchant: 'CVS Pharmacy', amount: -18.99, type: 'Credit Card', status: 'Completed', date: iso(10, 12, 20), category: 'Health' },

  // John Smith
  { id: 'tx-john-001', referenceNumber: 'REF-CAP-200141', userId: 'USR-JOHN', userName: 'John Smith', merchant: 'Globex LLC Payroll', amount: 4120.0, type: 'Deposit', status: 'Completed', date: iso(1, 10, 0), category: 'Income' },
  { id: 'tx-john-002', referenceNumber: 'REF-CAP-200138', userId: 'USR-JOHN', userName: 'John Smith', merchant: 'Venture Rewards Payment', amount: 120.0, type: 'Payment', status: 'Completed', date: iso(4, 16, 30), category: 'Credit Card Payment' },
  { id: 'tx-john-003', referenceNumber: 'REF-CAP-200135', userId: 'USR-JOHN', userName: 'John Smith', merchant: 'Safeway', amount: -88.42, type: 'Credit Card', status: 'Completed', date: iso(5, 18, 15), category: 'Groceries' },
  { id: 'tx-john-004', referenceNumber: 'REF-CAP-200131', userId: 'USR-JOHN', userName: 'John Smith', merchant: 'Uber', amount: -24.6, type: 'Credit Card', status: 'Completed', date: iso(6, 22, 50), category: 'Auto & Transport' },
  { id: 'tx-john-005', referenceNumber: 'REF-CAP-200128', userId: 'USR-JOHN', userName: 'John Smith', merchant: 'Spotify', amount: -10.99, type: 'Credit Card', status: 'Completed', date: iso(8, 6, 0), category: 'Entertainment' },

  // Maria Garcia
  { id: 'tx-maria-001', referenceNumber: 'REF-CAP-300041', userId: 'USR-MARIA', userName: 'Maria Garcia', merchant: 'Mercy Hospital Payroll', amount: 2380.0, type: 'Deposit', status: 'Completed', date: iso(3, 9, 0), category: 'Income' },
  { id: 'tx-maria-002', referenceNumber: 'REF-CAP-300038', userId: 'USR-MARIA', userName: 'Maria Garcia', merchant: 'Publix Super Market', amount: -64.2, type: 'Checking', status: 'Completed', date: iso(4, 17, 25), category: 'Groceries' },
  { id: 'tx-maria-003', referenceNumber: 'REF-CAP-300035', userId: 'USR-MARIA', userName: 'Maria Garcia', merchant: 'AT&T Wireless', amount: -85.0, type: 'Payment', status: 'Pending', date: iso(6, 11, 0), category: 'Utilities', destinationDetails: 'Biller: AT&T' },

  // David Chen
  { id: 'tx-david-001', referenceNumber: 'REF-CAP-400041', userId: 'USR-DAVID', userName: 'David Chen', merchant: 'Goldman Sachs Payroll', amount: 9250.0, type: 'Deposit', status: 'Completed', date: iso(2, 9, 0), category: 'Income' },
  { id: 'tx-david-002', referenceNumber: 'REF-CAP-400038', userId: 'USR-DAVID', userName: 'David Chen', merchant: 'Savor Rewards Payment', amount: 300.0, type: 'Payment', status: 'Declined', date: iso(5, 15, 0), category: 'Credit Card Payment' },
  { id: 'tx-david-003', referenceNumber: 'REF-CAP-400035', userId: 'USR-DAVID', userName: 'David Chen', merchant: 'The Ritz-Carlton', amount: -842.0, type: 'Travel Booking', status: 'Pending', date: iso(7, 14, 30), category: 'Travel' },
];

// -----------------------------------------------------------------------------
// System logs
// -----------------------------------------------------------------------------
export const seedSystemLogs: SystemLog[] = [
  { id: 'log-1', timestamp: iso(0, 9, 15), action: 'DEPOSIT', userId: 'USR-ALEX', userName: 'Alex Morgan', details: 'Direct deposit posted to 360 Checking', amount: 6240.0 },
  { id: 'log-2', timestamp: iso(0, 9, 14), action: 'LOGIN', userId: 'USR-ALEX', userName: 'Alex Morgan', details: 'Passkey sign-in · iPhone 15 Pro · Washington, DC · IP 73.12.44.9' },
  { id: 'log-3', timestamp: iso(0, 8, 12), action: 'PAYMENT', userId: 'USR-ALEX', userName: 'Alex Morgan', details: 'Card purchase authorized — Whole Foods Market', amount: -142.38 },
  { id: 'log-4', timestamp: iso(1, 10, 0), action: 'DEPOSIT', userId: 'USR-JOHN', userName: 'John Smith', details: 'Direct deposit posted to 360 Checking', amount: 4120.0 },
  { id: 'log-5', timestamp: iso(1, 9, 58), action: 'LOGIN', userId: 'USR-JOHN', userName: 'John Smith', details: 'Password sign-in · MacBook Pro · San Francisco, CA · IP 104.28.61.2' },
  { id: 'log-6', timestamp: iso(1, 14, 22), action: 'PAYMENT', userId: 'USR-ALEX', userName: 'Alex Morgan', details: 'Payment to Quicksilver Rewards', amount: 250.0 },
  { id: 'log-7', timestamp: iso(2, 22, 5), action: 'LOGIN', userId: 'USR-ALEX', userName: 'Alex Morgan', details: 'Sign-in · Safari · Washington, DC · IP 73.12.44.9' },
  { id: 'log-8', timestamp: iso(3, 9, 0), action: 'DEPOSIT', userId: 'USR-MARIA', userName: 'Maria Garcia', details: 'Direct deposit posted to 360 Checking', amount: 2380.0 },
  { id: 'log-9', timestamp: iso(4, 11, 0), action: 'SIGNUP', userId: 'USR-MARIA', userName: 'Maria Garcia', details: 'New enrollment created — KYC pending · iPhone 13 · Miami, FL' },
  { id: 'log-10', timestamp: iso(5, 16, 40), action: 'PROFILE_UPDATE', userId: 'USR-ALEX', userName: 'Alex Morgan', details: 'Mailing address & contact preferences updated' },
  { id: 'log-11', timestamp: iso(6, 15, 0), action: 'LOCK', userId: 'USR-DAVID', userName: 'David Chen', details: 'Account locked after 3 failed passkey attempts · New York, NY' },
  { id: 'log-12', timestamp: iso(7, 8, 30), action: 'LOGIN', userId: 'USR-ALEX', userName: 'Alex Morgan', details: 'Passkey sign-in · iPhone 15 Pro · Washington, DC' },
  { id: 'log-13', timestamp: iso(8, 12, 0), action: 'KYC_REVIEW', userId: 'USR-ALEX', userName: 'Alex Morgan', details: 'KYC documents approved by compliance' },
  { id: 'log-14', timestamp: iso(9, 19, 12), action: 'VIRTUAL_CARD', userId: 'USR-ALEX', userName: 'Alex Morgan', details: 'Eno virtual card created · limit $500 · merchant-locked to Amazon' },
  { id: 'log-15', timestamp: iso(10, 13, 45), action: 'PASSWORD_RESET', userId: 'USR-JOHN', userName: 'John Smith', details: 'Password reset completed via verified email' },
];

// -----------------------------------------------------------------------------
// Gift cards
// -----------------------------------------------------------------------------
export const seedGiftCards: GiftCard[] = [
  {
    id: 'gift-1',
    userId: 'USR-ALEX',
    cardName: 'Amazon Gift Card',
    cardNumber: '6006 4821 9930 1123',
    last4: '1123',
    originalBalance: 500,
    remainingBalance: 500,
    usdConversionRate: 0.85,
    convertedAmount: 425,
    status: 'pending',
    createdAt: iso(1, 12, 0),
  },
  {
    id: 'gift-2',
    userId: 'USR-ALEX',
    cardName: 'Apple Gift Card',
    cardNumber: '6006 7712 3345 8890',
    last4: '8890',
    originalBalance: 250,
    remainingBalance: 250,
    usdConversionRate: 0.9,
    convertedAmount: 225,
    status: 'approved',
    createdAt: iso(3, 12, 0),
    approvedAt: iso(2, 10, 0),
  },
  {
    id: 'gift-3',
    userId: 'USR-JOHN',
    cardName: 'Walmart Gift Card',
    cardNumber: '6006 1123 9987 2210',
    last4: '2210',
    originalBalance: 150,
    remainingBalance: 0,
    usdConversionRate: 0.8,
    convertedAmount: 120,
    status: 'redeemed',
    createdAt: iso(10, 12, 0),
    approvedAt: iso(9, 10, 0),
    redeemedAt: iso(8, 10, 0),
  },
];

// -----------------------------------------------------------------------------
// Notifications
// -----------------------------------------------------------------------------
export const seedNotifications: NotificationItem[] = [
  {
    id: 'notif-seed-1',
    title: 'Direct Deposit Posted',
    message: 'Your payroll deposit of $6,240.00 from Acme Corp has posted to your 360 Checking account.',
    timestamp: 'Just now',
    createdAt: minsAgo(1),
    unread: true,
    type: 'transaction',
    category: 'Transactions',
    actionUrl: '/dashboard',
  },
  {
    id: 'notif-seed-2',
    title: 'Capital One Shopping: 15% Rebate',
    message: 'Earn an additional 15% cash back at Apple, Nike, and Dell when you use your Capital One card today.',
    timestamp: '1 hour ago',
    createdAt: minsAgo(64),
    unread: true,
    type: 'offer',
    category: 'Offers & Discounts',
    actionUrl: '/',
  },
  {
    id: 'notif-seed-3',
    title: '360 Performance Savings: 4.25% APY',
    message: 'Your savings interest rate is 4.25% APY — over 8x the national average with FDIC insurance.',
    timestamp: '2 hours ago',
    createdAt: minsAgo(128),
    unread: true,
    type: 'info',
    category: 'Offers & Discounts',
    actionUrl: '/',
  },
  {
    id: 'notif-seed-4',
    title: 'Payment Due Reminder',
    message: 'Your Quicksilver Rewards minimum payment of $35.00 is due in 12 days.',
    timestamp: 'Yesterday',
    createdAt: minsAgo(60 * 22),
    unread: false,
    type: 'alert',
    category: 'Transactions',
    actionUrl: '/dashboard',
  },
  {
    id: 'notif-seed-5',
    title: 'Security Alert: New Device Sign-In',
    message: "A new sign-in to your account was detected from Washington, DC. If this wasn't you, secure your account.",
    timestamp: 'Yesterday',
    createdAt: minsAgo(60 * 31),
    unread: false,
    type: 'security',
    category: 'Security',
    actionUrl: '/profile',
  },
  {
    id: 'notif-seed-6',
    title: 'Scheduled Maintenance',
    message: 'ACH core ledger maintenance Sunday 2:00–4:00 AM EST. Cards and ATM access remain unaffected.',
    timestamp: 'May 8',
    createdAt: iso(180, 9, 0),
    unread: false,
    type: 'maintenance',
    category: 'Security',
    actionUrl: '/profile',
  },
];

export const DEMO_CREDENTIALS = {
  username: 'demo',
  password: 'demo1234',
  adminPasscode: '123456',
};

// -----------------------------------------------------------------------------
// Support threads (human support chat, not AI)
// -----------------------------------------------------------------------------
export const seedSupportThreads: SupportThread[] = [
  {
    id: 'thread-alex-1',
    userId: 'USR-ALEX',
    userName: 'Alex Morgan',
    userEmail: 'alex.morgan@example.com',
    subject: 'Travel booking confirmation',
    status: 'open',
    createdAt: iso(1, 14, 5),
    updatedAt: iso(1, 14, 12),
    messages: [
      {
        id: 'msg-alex-1',
        threadId: 'thread-alex-1',
        sender: 'user',
        senderName: 'Alex Morgan',
        text: 'Hi, I booked a Delta flight on my Venture X and wanted to confirm the purchase protection applies. Can you confirm?',
        timestamp: iso(1, 14, 5),
        read: true,
      },
      {
        id: 'msg-alex-2',
        threadId: 'thread-alex-1',
        sender: 'admin',
        senderName: 'Capital One Support',
        text: 'Hi Alex — yes, your Venture X purchase protection covers this travel booking. Your card is fully active. Anything else I can help with?',
        timestamp: iso(1, 14, 12),
        read: false,
      },
    ],
  },
  {
    id: 'thread-maria-1',
    userId: 'USR-MARIA',
    userName: 'Maria Garcia',
    userEmail: 'maria.garcia@example.com',
    subject: 'ID verification status',
    status: 'open',
    createdAt: iso(0, 9, 30),
    updatedAt: iso(0, 9, 30),
    messages: [
      {
        id: 'msg-maria-1',
        threadId: 'thread-maria-1',
        sender: 'user',
        senderName: 'Maria Garcia',
        text: 'Hello, I uploaded my passport for verification. How long does the review take before I can make withdrawals?',
        timestamp: iso(0, 9, 30),
        read: false,
      },
    ],
  },
];