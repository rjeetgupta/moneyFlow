export type TransactionType = "Income" | "Expense" | "Transfer";

export interface Transaction {
  id: string;
  date: string;
  timestamp: string;
  timeDisplay?: string;
  payee: string; // e.g. "TechCorp Monthly Salary"
  description: string; // e.g. "Direct Deposit • Ref #NEFT-88914"
  account: string; // e.g. "SBI" or "Paytm" or "Cash" or "HDFC"
  accountDisplay: string; // e.g. "SBI (•••• 4829)" or "SBI → Paytm"
  category: string; // e.g. "Salary & Perks", "Housing & Rent", "Food & Dining", etc.
  type: TransactionType;
  amount: number; // positive number
  referenceId?: string;
  memo?: string;
}

export interface AccountHolding {
  id: string;
  name: string;
  type: "Bank" | "Wallet" | "Cash" | "Credit";
  accountNumberMask: string; // e.g. "•••• 4892"
  ifsc?: string;
  balance: number;
  inflow: number;
  outflow: number;
  transfers: number;
  openingBalance: number;
  isPrimary?: boolean;
  status: "Active" | "Reconciled" | "Due" | "Self";
  colorTheme: "primary" | "secondary" | "tertiary" | "neutral";
  icon: string;
  metaInfo?: string;
  creditLimit?: number;
  dueDate?: string;
  utilizationPercent?: number;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  memberSince: string;
  tier: string;
  kycVerified: boolean;
  occupation?: string;
  bio?: string;
  taxIdMask?: string;
}

export interface SystemPreferences {
  baseCurrency: string;
  strictDoubleEntry: boolean;
  dateFormat: string;
  fiscalYear: string;
  overdraftWarnings: boolean;
  monthlyBudgetAlerts: boolean;
  biometricLock: boolean;
}

export type LendStatus = "Active" | "Partially Repaid" | "Settled" | "Overdue";

export interface LendRepayment {
  id: string;
  date: string; // e.g. "Sep 25, 2026"
  timestamp: string; // ISO
  amount: number;
  receivingAccountId: string;
  receivingAccountName: string;
  note?: string;
}

export interface LendRecord {
  id: string;
  borrowerName: string; // Friend's Name
  borrowerContact?: string;
  principalAmount: number;
  sourceAccountId: string;
  sourceAccountName: string;
  lentDate: string; // e.g. "Sep 15, 2026"
  dueDate?: string; // e.g. "Oct 15, 2026"
  status: LendStatus;
  repayments: LendRepayment[];
  totalRepaid: number;
  remainingAmount: number;
  notes?: string;
}
