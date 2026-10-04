import { FastifyRequest, FastifyReply } from "fastify";
import { authService } from "../services/auth.services";
import { ApiError } from "../utils/ApiError";
import { HTTP_STATUS, UserEntity } from "../types/common.types";

// Extend FastifyRequest type to include authenticated user
declare module "fastify" {
  interface FastifyRequest {
    user?: UserEntity;
  }
}

export const authenticate = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Authorization header with Bearer token is required",
    );
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ApiError(
      HTTP_STATUS.UNAUTHORIZED,
      "Token missing in authorization header",
    );
  }

  const user = await authService.verifyToken(token);
  request.user = user;
};
