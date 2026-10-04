import { FastifyRequest, FastifyReply } from "fastify";
import {
  authService,
  AuthService,
  GoogleLoginDTO,
} from "../services/auth.services";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import { HTTP_STATUS } from "../types/common.types";
import { ApiError } from "../utils/ApiError";

interface UpdateProfileBody {
  name?: string;
  occupation?: string;
  phone?: string;
  avatarUrl?: string;
}

export class AuthController {
  constructor(private service: AuthService = authService) {}

  googleLogin = asyncHandler(
    async (
      request: FastifyRequest<{ Body: GoogleLoginDTO }>,
      reply: FastifyReply,
    ) => {
      const result = await this.service.loginWithGoogle(request.body);
      const message = result.isNewUser
        ? `Account registered and signed in via Google as ${result.user.email}`
        : `Signed in successfully via Google as ${result.user.email}`;

      return ApiResponse.send(reply, HTTP_STATUS.OK, result, message);
    },
  );

  getMe = asyncHandler(async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Not authenticated");
    }
    return ApiResponse.send(
      reply,
      HTTP_STATUS.OK,
      request.user,
      "User profile retrieved successfully",
    );
  });

  updateMe = asyncHandler(
    async (
      request: FastifyRequest<{ Body: UpdateProfileBody }>,
      reply: FastifyReply,
    ) => {
      if (!request.user) {
        throw new ApiError(HTTP_STATUS.UNAUTHORIZED, "Not authenticated");
      }
      const updated = await this.service.updateProfile(
        request.user.id,
        request.body,
      );
      return ApiResponse.send(
        reply,
        HTTP_STATUS.OK,
        updated,
        "Profile details updated",
      );
    },
  );

  logout = asyncHandler(
    async (_request: FastifyRequest, reply: FastifyReply) => {
      return ApiResponse.send(
        reply,
        HTTP_STATUS.OK,
        { loggedOut: true },
        "Logged out successfully. Token invalidated.",
      );
    },
  );
}

// Export singleton instance
export const authController = new AuthController();
