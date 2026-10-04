export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type AccountType = "Bank" | "Wallet" | "Cash" | "Credit";

export type TransactionType = "Income" | "Expense" | "Transfer";

export interface TransactionEntity {
  id: string;
  payee: string;
  description?: string;
  category: string;
  type: TransactionType;
  amount: number;
  currency: string;
  account: string; // account ID
  targetAccount?: string; // target account ID for Transfer
  date: string; // ISO date or YYYY-MM-DD
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountHoldingEntity {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  accountNumberMask?: string;
  isPrimary?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LendStatus =
  "Active" | "Partially_Returned" | "Returned" | "Forgiven";

export interface RepaymentEntity {
  id: string;
  amount: number;
  date: string;
  destinationAccount?: string;
  note?: string;
  createdAt: string;
}

export interface LendRecordEntity {
  id: string;
  friendName: string;
  friendContact?: string;
  avatarUrl?: string;
  totalLentAmount: number;
  remainingAmount: number;
  sourceAccount: string;
  lendDate: string;
  dueDate?: string;
  notes?: string;
  status: LendStatus;
  repayments: RepaymentEntity[];
  createdAt: string;
  updatedAt: string;
}

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  occupation: string;
  phone?: string;
  kycVerified: boolean;
  googleId?: string;
  createdAt: string;
  updatedAt: string;
}
