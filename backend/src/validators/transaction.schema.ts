export const createTransactionSchema = {
  body: {
    type: "object",
    required: ["payee", "category", "type", "amount", "account"],
    properties: {
      payee: { type: "string", minLength: 2, maxLength: 100 },
      description: { type: "string", maxLength: 255 },
      category: { type: "string", minLength: 2, maxLength: 50 },
      type: { type: "string", enum: ["Income", "Expense", "Transfer"] },
      amount: { type: "number", minimum: 0.01 },
      account: { type: "string", minLength: 1 },
      targetAccount: { type: "string" },
      date: { type: "string" },
      memo: { type: "string", maxLength: 255 },
    },
  },
};

export const transactionQuerySchema = {
  querystring: {
    type: "object",
    properties: {
      account: { type: "string" },
      type: { type: "string", enum: ["Income", "Expense", "Transfer"] },
      category: { type: "string" },
      search: { type: "string" },
      limit: { type: "integer", minimum: 1, maximum: 200, default: 50 },
      offset: { type: "integer", minimum: 0, default: 0 },
    },
  },
};

export const transactionParamsSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
};
