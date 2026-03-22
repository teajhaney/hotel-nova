import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { COOKIES } from '../../common/constants/auth.constants';
import { AUTH_MESSAGES } from '../../common/constants/messages';
import type { AuthUser } from '../interfaces/auth-user.interface';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request): string | null => {
          // prefer the httpOnly cookie, fall back to Bearer for Postman/testing
          const cookies = request.cookies as Record<string, string | undefined>;
          const fromCookie =
            cookies[COOKIES.ACCESS_TOKEN] ?? cookies[COOKIES.JWT_FALLBACK];
          if (fromCookie) return fromCookie;

          const authHeader = request.headers.authorization;
          if (authHeader) return authHeader.replace('Bearer ', '');

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'super-secret-default-key-change-me',
    });
  }

  // VALIDATE TOKEN PAYLOAD
  validate(payload: JwtPayload): AuthUser {
    if (!payload?.sub || !payload?.email || !payload?.role) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_TOKEN_PAYLOAD);
    }

    return {
      id: payload.sub,
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
    };
  }
}
