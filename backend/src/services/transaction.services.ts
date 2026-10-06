import {
  transactionRepository,
  TransactionRepository,
} from "../repositories/transaction.repository";
import {
  accountRepository,
  AccountRepository,
} from "../repositories/account.repository";
import {
  TransactionEntity,
  TransactionType,
  HTTP_STATUS,
} from "../types/common.types";
import { ApiError } from "../utils/ApiError";

export interface CreateTransactionDTO {
  payee: string;
  description?: string;
  category: string;
  type: TransactionType;
  amount: number;
  account: string;
  targetAccount?: string;
  date?: string;
  memo?: string;
}

export interface TransactionSummary {
  totalInflow: number;
  totalOutflow: number;
  netSavings: number;
  categoryBreakdown: Record<string, number>;
}

export class TransactionService {
  constructor(
    private txRepo: TransactionRepository = transactionRepository,
    private accRepo: AccountRepository = accountRepository,
  ) {}

  async getTransactions(filters?: {
    account?: string;
    type?: TransactionType;
    category?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ items: TransactionEntity[]; total: number }> {
    return await this.txRepo.findAll(filters);
  }

  async getTransactionById(id: string): Promise<TransactionEntity> {
    const tx = await this.txRepo.findById(id);
    if (!tx) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        `Transaction with ID '${id}' not found`,
      );
    }
    return tx;
  }

  async getSummary(filters?: {
    account?: string;
  }): Promise<TransactionSummary> {
    const { items: all } = await this.txRepo.findAll({
      account: filters?.account,
      limit: 1000,
    });

    let totalInflow = 0;
    let totalOutflow = 0;
    const categoryBreakdown: Record<string, number> = {};

    for (const tx of all) {
      if (tx.type === "Income") {
        totalInflow += tx.amount;
      } else if (tx.type === "Expense") {
        totalOutflow += tx.amount;
        categoryBreakdown[tx.category] =
          (categoryBreakdown[tx.category] || 0) + tx.amount;
      }
    }

    return {
      totalInflow,
      totalOutflow,
      netSavings: totalInflow - totalOutflow,
      categoryBreakdown,
    };
  }

  async recordTransaction(
    dto: CreateTransactionDTO,
  ): Promise<TransactionEntity> {
    // 1. Verify primary account exists
    const sourceAcc = await this.accRepo.findById(dto.account);
    if (!sourceAcc) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        `Source account with ID '${dto.account}' does not exist`,
      );
    }

    // 2. Validate transfer logic
    if (dto.type === "Transfer") {
      if (!dto.targetAccount) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Target account is required for Transfer transactions",
        );
      }
      if (dto.targetAccount === dto.account) {
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          "Source and target account cannot be the same account",
        );
      }
      const targetAcc = await this.accRepo.findById(dto.targetAccount);
      if (!targetAcc) {
        throw new ApiError(
          HTTP_STATUS.NOT_FOUND,
          `Target account with ID '${dto.targetAccount}' does not exist`,
        );
      }

      // Update both accounts
      await this.accRepo.update(sourceAcc.id, {
        balance: sourceAcc.balance - dto.amount,
      });
      await this.accRepo.update(targetAcc.id, {
        balance: targetAcc.balance + dto.amount,
      });
    } else if (dto.type === "Expense") {
      // Deduct from source account
      await this.accRepo.update(sourceAcc.id, {
        balance: sourceAcc.balance - dto.amount,
      });
    } else if (dto.type === "Income") {
      // Add to source account
      await this.accRepo.update(sourceAcc.id, {
        balance: sourceAcc.balance + dto.amount,
      });
    }

    // 3. Persist the transaction
    const date = dto.date || new Date().toISOString().split("T")[0];
    const created = await this.txRepo.create({
      payee: dto.payee.trim(),
      description: dto.description?.trim(),
      category: dto.category.trim(),
      type: dto.type,
      amount: dto.amount,
      currency: "INR",
      account: dto.account,
      targetAccount: dto.targetAccount,
      date,
      memo: dto.memo?.trim(),
    });

    return created;
  }

  async deleteTransaction(
    id: string,
  ): Promise<{ deletedId: string; message: string }> {
    const tx = await this.getTransactionById(id);

    // Revert account balances
    if (tx.type === "Expense") {
      const acc = await this.accRepo.findById(tx.account);
      if (acc) {
        await this.accRepo.update(acc.id, { balance: acc.balance + tx.amount });
      }
    } else if (tx.type === "Income") {
      const acc = await this.accRepo.findById(tx.account);
      if (acc) {
        await this.accRepo.update(acc.id, { balance: acc.balance - tx.amount });
      }
    } else if (tx.type === "Transfer" && tx.targetAccount) {
      const source = await this.accRepo.findById(tx.account);
      const target = await this.accRepo.findById(tx.targetAccount);
      if (source) {
        await this.accRepo.update(source.id, {
          balance: source.balance + tx.amount,
        });
      }
      if (target) {
        await this.accRepo.update(target.id, {
          balance: target.balance - tx.amount,
        });
      }
    }

    await this.txRepo.delete(id);

    return {
      deletedId: id,
      message: `Transaction of ₹${tx.amount.toLocaleString()} deleted and account balances reconciled.`,
    };
  }
}

// Export singleton instance
export const transactionService = new TransactionService();
