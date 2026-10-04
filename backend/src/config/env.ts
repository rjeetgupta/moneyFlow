import "dotenv/config";

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  HOST: process.env.HOST || "0.0.0.0",
  NODE_ENV: process.env.NODE_ENV || "development",
  API_PREFIX: "/api/v1",
};
