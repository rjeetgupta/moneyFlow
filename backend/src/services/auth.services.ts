import {
  userRepository,
  UserRepository,
} from "../repositories/user.repository";
import { UserEntity, HTTP_STATUS } from "../types/common.types";
import { ApiError } from "../utils/ApiError";

export interface GoogleLoginDTO {
  email: string;
  name: string;
  avatarUrl?: string;
  googleId?: string;
}

export class AuthService {
  constructor(private userRepo: UserRepository = userRepository) {}

  async loginWithGoogle(dto: GoogleLoginDTO): Promise<{
    user: UserEntity;
    token: string;
    isNewUser: boolean;
  }> {
    const existing = await this.userRepo.findByEmail(dto.email);
    let user: UserEntity;
    let isNewUser = false;

    if (!existing) {
      user = await this.userRepo.create({
        email: dto.email,
        name: dto.name,
        avatarUrl: dto.avatarUrl,
        googleId: dto.googleId,
      });
      isNewUser = true;
    } else {
      const updated = await this.userRepo.update(existing.id, {
        name: dto.name || existing.name,
        avatarUrl: dto.avatarUrl || existing.avatarUrl,
        googleId: dto.googleId || existing.googleId,
      });
      user = updated!;
    }

    // Lightweight deterministic session token (standard payload format)
    const tokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
    };

    const token = Buffer.from(JSON.stringify(tokenPayload)).toString("base64");

    return {
      user,
      token,
      isNewUser,
    };
  }

  async verifyToken(token: string): Promise<UserEntity> {
    try {
      const decoded = JSON.parse(
        Buffer.from(token, "base64").toString("utf-8"),
      );
      if (!decoded.sub || !decoded.email) {
        throw new Error("Invalid token structure");
      }

      const user = await this.userRepo.findById(decoded.sub);
      if (!user) {
        throw new ApiError(
          HTTP_STATUS.UNAUTHORIZED,
          "User associated with token no longer exists",
        );
      }

      return user;
    } catch {
      throw new ApiError(
        HTTP_STATUS.UNAUTHORIZED,
        "Invalid or expired authentication token",
      );
    }
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, "User profile not found");
    }
    return user;
  }

  async updateProfile(
    id: string,
    updates: Partial<Omit<UserEntity, "id" | "createdAt">>,
  ): Promise<UserEntity> {
    await this.getUserById(id);
    const updated = await this.userRepo.update(id, updates);
    if (!updated) {
      throw new ApiError(
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        "Failed to update profile",
      );
    }
    return updated;
  }
}

// Export singleton instance
export const authService = new AuthService();
