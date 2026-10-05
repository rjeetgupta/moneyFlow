import {
  accountRepository,
  AccountRepository,
} from "../repositories/account.repository";
import {
  AccountHoldingEntity,
  AccountType,
  HTTP_STATUS,
} from "../types/common.types";
import { ApiError } from "../utils/ApiError";

export class AccountService {
  constructor(private repo: AccountRepository = accountRepository) {}

  async getAllAccounts(): Promise<{
    accounts: AccountHoldingEntity[];
    summary: { totalLiquid: number; totalCredit: number; netWorth: number };
  }> {
    const accounts = await this.repo.findAll();

    const totalLiquid = accounts
      .filter((a) => a.type !== "Credit")
      .reduce((sum, a) => sum + a.balance, 0);

    const totalCredit = accounts
      .filter((a) => a.type === "Credit")
      .reduce((sum, a) => sum + a.balance, 0);

    return {
      accounts,
      summary: {
        totalLiquid,
        totalCredit,
        netWorth: totalLiquid + totalCredit,
      },
    };
  }

  async getAccountById(id: string): Promise<AccountHoldingEntity> {
    const account = await this.repo.findById(id);
    if (!account) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        `Account with ID '${id}' not found`,
      );
    }
    return account;
  }

  async createAccount(data: {
    name: string;
    type: AccountType;
    balance: number;
    accountNumberMask?: string;
    isPrimary?: boolean;
  }): Promise<AccountHoldingEntity> {
    const existing = await this.repo.findByName(data.name);
    if (existing) {
      throw new ApiError(
        HTTP_STATUS.CONFLICT,
        `An account with the name '${data.name}' already exists`,
      );
    }

    return await this.repo.create(data);
  }

  async updateAccount(
    id: string,
    data: Partial<Omit<AccountHoldingEntity, "id" | "createdAt">>,
  ): Promise<AccountHoldingEntity> {
    await this.getAccountById(id);

    if (data.name) {
      const existing = await this.repo.findByName(data.name);
      if (existing && existing.id !== id) {
        throw new ApiError(
          HTTP_STATUS.CONFLICT,
          `Another account already uses the name '${data.name}'`,
        );
      }
    }

    const updated = await this.repo.update(id, data);
    if (!updated) {
      throw new ApiError(
        HTTP_STATUS.NOT_FOUND,
        `Account with ID '${id}' could not be updated`,
      );
    }
    return updated;
  }

  async deleteAccount(
    id: string,
  ): Promise<{ deletedId: string; message: string }> {
    const account = await this.getAccountById(id);
    const success = await this.repo.delete(id);
    if (!success) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to delete account",
      );
    }
    return {
      deletedId: id,
      message: `Account '${account.name}' has been successfully removed`,
    };
  }
}

// Export singleton instance
export const accountService = new AccountService();
