import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash, verify } from 'argon2';
import { randomBytes } from 'crypto';
import { REFRESH_TOKEN_EXPIRY_MS } from '../common/constants/auth.constants';
import { AUTH_MESSAGES } from '../common/constants/messages';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { AuthUser } from './interfaces/auth-user.interface';
import { JwtPayload } from './interfaces/jwt-payload.interface';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // SIGN UP
  async signup(dto: SignupDto): Promise<AuthTokens> {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) throw new ConflictException(AUTH_MESSAGES.EMAIL_IN_USE);

    const passwordHash = await hash(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: passwordHash,
        fullName: dto.fullName,
        phone: dto.phone,
        country: dto.country,
        role: dto.role ?? 'GUEST',
      },
    });

    return this.issueTokens(user);
  }

  // LOG IN
  async login(dto: LoginDto): Promise<AuthTokens> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    // same error for wrong email or wrong password — don't reveal which one
    if (!user)
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);

    const passwordValid = await verify(user.password, dto.password);
    if (!passwordValid)
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_CREDENTIALS);

    if (user.status !== 'Active') {
      throw new UnauthorizedException(AUTH_MESSAGES.ACCOUNT_SUSPENDED);
    }

    return this.issueTokens(user);
  }

  // LOG OUT
  async logout(userId: string, rawRefreshToken: string): Promise<void> {
    const [tokenId, rawSecret] = this.parseRefreshToken(rawRefreshToken);
    if (!tokenId || !rawSecret) return;

    const stored = await this.prisma.refreshToken.findFirst({
      where: { id: tokenId, userId },
    });
    if (!stored) return;

    const valid = await verify(stored.tokenHash, rawSecret);
    if (valid) {
      await this.prisma.refreshToken.delete({ where: { id: tokenId } });
    }
  }

  // REFRESH TOKEN
  async refresh(rawRefreshToken: string): Promise<AuthTokens> {
    const [tokenId, rawSecret] = this.parseRefreshToken(rawRefreshToken);
    if (!tokenId || !rawSecret) {
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    const stored = await this.prisma.refreshToken.findUnique({
      where: { id: tokenId },
      include: { user: true },
    });

    if (!stored)
      throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_TOKEN_NOT_FOUND);

    if (stored.expiresAt < new Date()) {
      // clean it up while we're here
      await this.prisma.refreshToken.delete({ where: { id: tokenId } });
      throw new UnauthorizedException(AUTH_MESSAGES.REFRESH_TOKEN_EXPIRED);
    }

    const valid = await verify(stored.tokenHash, rawSecret);
    if (!valid)
      throw new UnauthorizedException(AUTH_MESSAGES.INVALID_REFRESH_TOKEN);

    // delete the old one before issuing a new pair (rotation)
    await this.prisma.refreshToken.delete({ where: { id: tokenId } });

    return this.issueTokens(stored.user);
  }

  // GET CURRENT USER
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        country: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    if (!user) throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);
    return user;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  // ISSUE TOKENS
  private async issueTokens(user: User): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };

    const accessToken = this.jwt.sign(payload);

    // generate a random secret, store its hash, send "id.secret" to the client
    const rawSecret = randomBytes(40).toString('hex');
    const tokenHash = await hash(rawSecret);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRY_MS);

    const stored = await this.prisma.refreshToken.create({
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

  // PARSE REFRESH TOKEN
  private parseRefreshToken(token: string): [string, string] {
    const dot = token.indexOf('.');
    if (dot === -1) return ['', ''];
    return [token.slice(0, dot), token.slice(dot + 1)];
  }
}
