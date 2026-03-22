import { Role } from '@prisma/client';

// What lands on req.user after JwtStrategy validates the token
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}
