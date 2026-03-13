import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          let token = null;

          // Extract from HttpOnly Cookies
          if (request && request.cookies) {
            token = request.cookies['accessToken'] || request.cookies['jwt'];
          }

          // Fallback to common Bearer token approach for easy testing/Postman
          if (!token && request.headers.authorization) {
            token = request.headers.authorization.replace('Bearer ', '');
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'super-secret-default-key-change-me',
    });
  }

  async validate(payload: JwtPayload) {
    // This payload is automatically validated by the super() call above.
    // If the token is invalid or expired, JwtStrategy throws a 401 automatically before this function runs.
    if (!payload || !payload.sub || !payload.email || !payload.role) {
      throw new UnauthorizedException(
        'Invalid token payload or missing claims.',
      );
    }

    // Attach user to request via req.user
    return {
      id: payload.sub,
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
    };
  }
}
