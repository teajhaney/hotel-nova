import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { randomBytes } from 'crypto';
import { REFRESH_TOKEN_EXPIRY_MS } from '../../common/constants/auth.constants';
import { PrismaService } from '../../prisma/prisma.service';
import type { AuthTokens } from '../interfaces/auth-user.interface';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';

// Creates a JWT access token, stores a hashed refresh token in the DB,
// and returns both tokens together with the safe user object.
// Dependencies are passed as arguments rather than captured from `this`
// so this stays a pure, testable function.
export async function issueTokens(
  user: User,
  prisma: PrismaService,
  jwt: JwtService,
): Promise<AuthTokens> {
  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  };

  const accessToken = jwt.sign(payload);

  // generate a random secret, store its hash, send "id.secret" to the client
  const rawSecret = randomBytes(40).toString('hex');
  const tokenHash = await hash(rawSecret);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

  const stored = await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  return {
    accessToken,
    refreshToken: `${stored.id}.${rawSecret}`,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  };
}

// Splits the "id.secret" refresh token string into its two parts.
// Returns empty strings if the dot separator is missing (malformed token).
export function parseRefreshToken(token: string): [string, string] {
  const dot = token.indexOf('.');
  if (dot === -1) return ['', ''];
  return [token.slice(0, dot), token.slice(dot + 1)];
}
