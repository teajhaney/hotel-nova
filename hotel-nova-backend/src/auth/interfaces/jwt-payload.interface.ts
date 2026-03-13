export interface JwtPayload {
  sub: string;
  email: string;
  role: 'GUEST' | 'ADMIN';
  fullName: string;
}
