import { FastifyRequest, FastifyReply } from "fastify";
import {
  transactionService,
  TransactionService,
  CreateTransactionDTO,
} from "../services/transaction.services";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { HTTP_STATUS, TransactionType } from "../types/common.types";

interface TransactionQueryParams {
  account?: string;
  type?: TransactionType;
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

interface TransactionParams {
  id: string;
}

export class TransactionController {
  constructor(private service: TransactionService = transactionService) {}

  getAll = asyncHandler(
    async (
      request: FastifyRequest<{ Querystring: TransactionQueryParams }>,
      reply: FastifyReply,
    ) => {
      const data = await this.service.getTransactions(request.query);
      return ApiResponse.send(
        reply,
        HTTP_STATUS.OK,
        data,
        "Transactions retrieved successfully",
      );
    },
  );

  getSummary = asyncHandler(
    async (
      request: FastifyRequest<{ Querystring: { account?: string } }>,
      reply: FastifyReply,
    ) => {
      const summary = await this.service.getSummary(request.query);
      return ApiResponse.send(
        reply,
        HTTP_STATUS.OK,
        summary,
        "Transaction analytics summary retrieved",
      );
    },
  );

  getById = asyncHandler(
    async (
      request: FastifyRequest<{ Params: TransactionParams }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const tx = await this.service.getTransactionById(id);
      return ApiResponse.send(
        reply,
        HTTP_STATUS.OK,
        tx,
        "Transaction details retrieved",
      );
    },
  );

  create = asyncHandler(
    async (
      request: FastifyRequest<{ Body: CreateTransactionDTO }>,
      reply: FastifyReply,
    ) => {
      const tx = await this.service.recordTransaction(request.body);
      return ApiResponse.send(
        reply,
        HTTP_STATUS.CREATED,
        tx,
        "Transaction recorded and account reconciled",
      );
    },
  );

  remove = asyncHandler(
    async (
      request: FastifyRequest<{ Params: TransactionParams }>,
      reply: FastifyReply,
    ) => {
      const { id } = request.params;
      const result = await this.service.deleteTransaction(id);
      return ApiResponse.send(reply, HTTP_STATUS.OK, result, result.message);
    },
  );
}

// Export singleton instance
export const transactionController = new TransactionController();
