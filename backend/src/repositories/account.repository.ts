import { AccountHoldingEntity, AccountType } from "../types/common.types";

export class AccountRepository {
  private accounts: AccountHoldingEntity[] = [
    {
      id: "sbi",
      name: "State Bank of India",
      type: "Bank",
      balance: 142580,
      currency: "INR",
      accountNumberMask: "•••• 4921",
      isPrimary: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "hdfc",
      name: "HDFC Regalia Card",
      type: "Credit",
      balance: -18450,
      currency: "INR",
      accountNumberMask: "•••• 8820",
      isPrimary: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "paytm",
      name: "Paytm Wallet & UPI",
      type: "Wallet",
      balance: 8420,
      currency: "INR",
      accountNumberMask: "•••• 3192",
      isPrimary: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "cash",
      name: "Cash in Hand",
      type: "Cash",
      balance: 6500,
      currency: "INR",
      isPrimary: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  async findAll(): Promise<AccountHoldingEntity[]> {
    return [...this.accounts];
  }

  async findById(id: string): Promise<AccountHoldingEntity | null> {
    const acc = this.accounts.find((a) => a.id === id);
    return acc ? { ...acc } : null;
  }

  async findByName(name: string): Promise<AccountHoldingEntity | null> {
    const normalized = name.toLowerCase().trim();
    const acc = this.accounts.find(
      (a) => a.name.toLowerCase().trim() === normalized,
    );
    return acc ? { ...acc } : null;
  }

  async create(data: {
    name: string;
    type: AccountType;
    balance: number;
    accountNumberMask?: string;
    isPrimary?: boolean;
  }): Promise<AccountHoldingEntity> {
    const now = new Date().toISOString();
    const newAccount: AccountHoldingEntity = {
      id: `acc-${Date.now()}`,
      name: data.name.trim(),
      type: data.type,
      balance: data.balance,
      currency: "INR",
      accountNumberMask: data.accountNumberMask?.trim(),
      isPrimary: data.isPrimary ?? false,
      createdAt: now,
      updatedAt: now,
    };

    if (newAccount.isPrimary) {
      this.accounts = this.accounts.map((a) => ({ ...a, isPrimary: false }));
    }

    this.accounts.push(newAccount);
    return { ...newAccount };
  }

  async update(
    id: string,
    data: Partial<Omit<AccountHoldingEntity, "id" | "createdAt">>,
  ): Promise<AccountHoldingEntity | null> {
    const index = this.accounts.findIndex((a) => a.id === id);
    if (index === -1) return null;

    if (data.isPrimary) {
      this.accounts = this.accounts.map((a) => ({ ...a, isPrimary: false }));
    }

    const updated: AccountHoldingEntity = {
      ...this.accounts[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    this.accounts[index] = updated;
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    const prevLength = this.accounts.length;
    this.accounts = this.accounts.filter((a) => a.id !== id);
    return this.accounts.length < prevLength;
  }
}

// Export singleton instance
export const accountRepository = new AccountRepository();
