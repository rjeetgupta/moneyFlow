import { TransactionEntity, TransactionType } from "../types/common.types";

export class TransactionRepository {
  private transactions: TransactionEntity[] = [
    {
      id: "tx-1",
      payee: "Google Workspace Cloud Tech",
      description: "Monthly Cloud Infrastructure & Workspace",
      category: "Cloud Services",
      type: "Expense",
      amount: 4250,
      currency: "INR",
      account: "sbi",
      date: "2026-09-28",
      memo: "Tax deductible business expense",
      createdAt: "2026-09-28T10:00:00.000Z",
      updatedAt: "2026-09-28T10:00:00.000Z",
    },
    {
      id: "tx-2",
      payee: "Direct Deposit Client Remittance",
      description: "Enterprise Architectural Retainer",
      category: "Salary",
      type: "Income",
      amount: 175000,
      currency: "INR",
      account: "sbi",
      date: "2026-09-25",
      memo: "Consulting retainership fee",
      createdAt: "2026-09-25T08:30:00.000Z",
      updatedAt: "2026-09-25T08:30:00.000Z",
    },
    {
      id: "tx-3",
      payee: "Blue Tokai Coffee Roasters",
      description: "Weekly team roast blend & brew pouch",
      category: "Food & Dining",
      type: "Expense",
      amount: 890,
      currency: "INR",
      account: "paytm",
      date: "2026-09-24",
      createdAt: "2026-09-24T14:15:00.000Z",
      updatedAt: "2026-09-24T14:15:00.000Z",
    },
    {
      id: "tx-4",
      payee: "Internal Wallet Refill",
      description: "Transfer from SBI Bank to Paytm Wallet",
      category: "Transfer",
      type: "Transfer",
      amount: 5000,
      currency: "INR",
      account: "sbi",
      targetAccount: "paytm",
      date: "2026-09-22",
      createdAt: "2026-09-22T09:00:00.000Z",
      updatedAt: "2026-09-22T09:00:00.000Z",
    },
    {
      id: "tx-5",
      payee: "Apple Store Regent Street",
      description: "Development Testing Peripheral USB-C",
      category: "Shopping",
      type: "Expense",
      amount: 2900,
      currency: "INR",
      account: "hdfc",
      date: "2026-09-20",
      createdAt: "2026-09-20T18:00:00.000Z",
      updatedAt: "2026-09-20T18:00:00.000Z",
    },
  ];

  async findAll(filters?: {
    account?: string;
    type?: TransactionType;
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: TransactionEntity[]; total: number }> {
    let result = [...this.transactions];

    if (filters?.account) {
      result = result.filter(
        (t) =>
          t.account === filters.account || t.targetAccount === filters.account,
      );
    }

    if (filters?.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters?.category) {
      const catLower = filters.category.toLowerCase().trim();
      result = result.filter(
        (t) => t.category.toLowerCase().trim() === catLower,
      );
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.payee.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q)) ||
          t.category.toLowerCase().includes(q),
      );
    }

    // Sort by date descending (newest first)
    result.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    const total = result.length;
    const offset = filters?.offset ?? 0;
    const limit = filters?.limit ?? 50;
    const paginated = result.slice(offset, offset + limit);

    return { items: paginated, total };
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    const tx = this.transactions.find((t) => t.id === id);
    return tx ? { ...tx } : null;
  }

  async create(
    data: Omit<TransactionEntity, "id" | "createdAt" | "updatedAt">,
  ): Promise<TransactionEntity> {
    const now = new Date().toISOString();
    const newTx: TransactionEntity = {
      ...data,
      id: `tx-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };

    this.transactions.unshift(newTx);
    return { ...newTx };
  }

  async delete(id: string): Promise<TransactionEntity | null> {
    const index = this.transactions.findIndex((t) => t.id === id);
    if (index === -1) return null;
    const deleted = this.transactions.splice(index, 1)[0];
    return deleted;
  }
}

// Export singleton instance
export const transactionRepository = new TransactionRepository();
