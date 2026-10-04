export const googleLoginSchema = {
  body: {
    type: "object",
    required: ["email", "name"],
    properties: {
      email: { type: "string", format: "email" },
      name: { type: "string", minLength: 1, maxLength: 80 },
      avatarUrl: { type: "string" },
      googleId: { type: "string" },
      idToken: { type: "string" },
    },
  },
};

export const updateProfileSchema = {
  body: {
    type: "object",
    properties: {
      name: { type: "string", minLength: 1, maxLength: 80 },
      occupation: { type: "string", maxLength: 80 },
      phone: { type: "string", maxLength: 30 },
      avatarUrl: { type: "string" },
    },
  },
};
