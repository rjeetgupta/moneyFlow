import { FastifyRequest, FastifyReply } from 'fastify';
import { accountService, AccountService } from '../services/account.services';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import { HTTP_STATUS, AccountType } from '../types/common.types';

interface CreateAccountBody {
  name: string;
  type: AccountType;
  balance: number;
  accountNumberMask?: string;
  isPrimary?: boolean;
}

interface UpdateAccountParams {
  id: string;
}

export class AccountController {
  constructor(private service: AccountService = accountService) {}

  getAll = asyncHandler(async (_request: FastifyRequest, reply: FastifyReply) => {
    const data = await this.service.getAllAccounts();
    return ApiResponse.send(reply, HTTP_STATUS.OK, data, 'Accounts retrieved successfully');
  });

  getById = asyncHandler(
    async (request: FastifyRequest<{ Params: UpdateAccountParams }>, reply: FastifyReply) => {
      const { id } = request.params;
      const account = await this.service.getAccountById(id);
      return ApiResponse.send(reply, HTTP_STATUS.OK, account, 'Account details retrieved');
    }
  );

  create = asyncHandler(
    async (request: FastifyRequest<{ Body: CreateAccountBody }>, reply: FastifyReply) => {
      const newAccount = await this.service.createAccount(request.body);
      return ApiResponse.send(
        reply,
        HTTP_STATUS.CREATED,
        newAccount,
        'Account created successfully'
      );
    }
  );

  update = asyncHandler(
    async (
      request: FastifyRequest<{ Params: UpdateAccountParams; Body: Partial<CreateAccountBody> }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const updated = await this.service.updateAccount(id, request.body);
      return ApiResponse.send(reply, HTTP_STATUS.OK, updated, 'Account updated successfully');
    }
  );

  remove = asyncHandler(
    async (request: FastifyRequest<{ Params: UpdateAccountParams }>, reply: FastifyReply) => {
      const { id } = request.params;
      const result = await this.service.deleteAccount(id);
      return ApiResponse.send(reply, HTTP_STATUS.OK, result, result.message);
    }
  );
}

// Export singleton instance
export const accountController = new AccountController();
