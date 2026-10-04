export const createAccountSchema = {
  body: {
    type: 'object',
    required: ['name', 'type', 'balance'],
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 60 },
      type: { type: 'string', enum: ['Bank', 'Wallet', 'Cash', 'Credit'] },
      balance: { type: 'number' },
      accountNumberMask: { type: 'string', maxLength: 10 },
      isPrimary: { type: 'boolean' },
    },
  },
};

export const updateAccountSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2, maxLength: 60 },
      type: { type: 'string', enum: ['Bank', 'Wallet', 'Cash', 'Credit'] },
      balance: { type: 'number' },
      accountNumberMask: { type: 'string', maxLength: 10 },
      isPrimary: { type: 'boolean' },
    },
  },
};

export const accountParamsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
};
