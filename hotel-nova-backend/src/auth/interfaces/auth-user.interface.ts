import { Role, UserStatus } from '@prisma/client';

// What lands on req.user after JwtStrategy validates the token
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

// Shape returned by admin user-management endpoints (no password field)
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  status: UserStatus;
  createdAt: Date;
}

export interface UsersPage {
  data: AdminUser[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
