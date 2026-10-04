import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../utils/ApiError";
import { HTTP_STATUS } from "../types/common.types";

export const errorHandler = (
  error: FastifyError | ApiError | Error,
  _request: FastifyRequest,
  reply: FastifyReply,
) => {
  // If it's our custom ApiError
  if (error instanceof ApiError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  // If it's a Fastify Schema validation error (e.g. invalid JSON schema)
  if ("validation" in error && error.validation) {
    return reply.status(HTTP_STATUS.BAD_REQUEST).send({
      statusCode: HTTP_STATUS.BAD_REQUEST,
      success: false,
      message: error.message || "Validation failed on incoming request",
      errors: error.validation,
    });
  }

  // Any other unexpected system/database error
  const statusCode =
    (error as any).statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  return reply.status(statusCode).send({
    statusCode,
    success: false,
    message: error.message || "Internal Server Error",
    errors: [],
  });
};
