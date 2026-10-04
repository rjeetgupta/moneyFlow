export const createLendSchema = {
  body: {
    type: "object",
    required: ["friendName", "amount", "sourceAccount"],
    properties: {
      friendName: { type: "string", minLength: 2, maxLength: 80 },
      friendContact: { type: "string", maxLength: 50 },
      avatarUrl: { type: "string" },
      amount: { type: "number", minimum: 1 },
      sourceAccount: { type: "string", minLength: 1 },
      lendDate: { type: "string" },
      dueDate: { type: "string" },
      notes: { type: "string", maxLength: 300 },
    },
  },
};

export const recordRepaymentSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
  body: {
    type: "object",
    required: ["amount"],
    properties: {
      amount: { type: "number", minimum: 1 },
      destinationAccount: { type: "string" },
      note: { type: "string", maxLength: 200 },
      date: { type: "string" },
    },
  },
};

export const markAsZeroSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
  body: {
    type: "object",
    properties: {
      destinationAccount: { type: "string" },
      reason: { type: "string", maxLength: 200 },
      recordAsRecovered: { type: "boolean", default: true },
    },
  },
};

export const updateRemainingAmountSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
  body: {
    type: "object",
    required: ["remainingAmount"],
    properties: {
      remainingAmount: { type: "number", minimum: 0 },
      note: { type: "string", maxLength: 200 },
    },
  },
};

export const lendParamsSchema = {
  params: {
    type: "object",
    required: ["id"],
    properties: {
      id: { type: "string" },
    },
  },
};
