import { UserEntity } from "../types/common.types";

export class UserRepository {
  private users: UserEntity[] = [
    {
      id: "usr-ranjeet-1",
      email: "ranjeetkumargupta66@gmail.com",
      name: "Ranjeet Kumar Gupta",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
      occupation: "Staff Software Architect",
      phone: "+91 98765 43210",
      kycVerified: true,
      googleId: "google-sub-137128285453",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-09-30T12:00:00.000Z",
    },
  ];

  async findByEmail(email: string): Promise<UserEntity | null> {
    const normalized = email.toLowerCase().trim();
    const user = this.users.find(
      (u) => u.email.toLowerCase().trim() === normalized,
    );
    return user ? { ...user } : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = this.users.find((u) => u.id === id);
    return user ? { ...user } : null;
  }

  async create(data: {
    email: string;
    name: string;
    avatarUrl?: string;
    googleId?: string;
    occupation?: string;
    phone?: string;
  }): Promise<UserEntity> {
    const now = new Date().toISOString();
    const newUser: UserEntity = {
      id: `usr-${Date.now()}`,
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      avatarUrl:
        data.avatarUrl ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
      occupation: data.occupation || "Personal Account Holder",
      phone: data.phone,
      kycVerified: true,
      googleId: data.googleId,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);
    return { ...newUser };
  }

  async update(
    id: string,
    updates: Partial<Omit<UserEntity, "id" | "createdAt">>,
  ): Promise<UserEntity | null> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const updated: UserEntity = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.users[index] = updated;
    return { ...updated };
  }
}

// Export singleton instance
export const userRepository = new UserRepository();
