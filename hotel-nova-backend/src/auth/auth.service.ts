import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, verify } from 'argon2';
import { AUTH_MESSAGES } from '../common/constants/messages';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { issueTokens, parseRefreshToken } from './helpers/auth.helpers';
import type {
  AdminUser,
  AuthTokens,
  UsersPage,
} from './interfaces/auth-user.interface';

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

    return issueTokens(user, this.prisma, this.jwt);
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

    // Inactive users can still log in — only Suspended accounts are blocked.
    if (user.status === 'Suspended') {
      throw new UnauthorizedException(AUTH_MESSAGES.ACCOUNT_SUSPENDED);
    }

    return issueTokens(user, this.prisma, this.jwt);
  }

  // LOG OUT
  async logout(rawRefreshToken: string): Promise<void> {
    const [tokenId, rawSecret] = parseRefreshToken(rawRefreshToken);
    if (!tokenId || !rawSecret) return;

    const stored = await this.prisma.refreshToken.findUnique({
      where: { id: tokenId },
    });
    if (!stored) return;

    const valid = await verify(stored.tokenHash, rawSecret);
    if (valid) {
      await this.prisma.refreshToken.delete({ where: { id: tokenId } });
    }
  }

  // REFRESH TOKEN
  async refresh(rawRefreshToken: string): Promise<AuthTokens> {
    const [tokenId, rawSecret] = parseRefreshToken(rawRefreshToken);
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

    return issueTokens(stored.user, this.prisma, this.jwt);
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

  // ─── Guest: Update Own Profile ────────────────────────────────────────────
  // Lets the authenticated user update their name, phone, and country.
  // Optionally changes the password: if newPassword is supplied the caller
  // must also supply currentPassword, which we verify against the stored hash
  // before accepting the change. Email updates are excluded — those need a
  // separate verification flow.
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const wantsPasswordChange = !!dto.newPassword;
    let passwordHash: string | undefined;

    if (wantsPasswordChange) {
      // currentPassword is required to prove the caller knows the old one
      if (!dto.currentPassword) {
        throw new BadRequestException(
          AUTH_MESSAGES.PASSWORD_CHANGE_REQUIRES_CURRENT,
        );
      }

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { password: true },
      });

      if (!user) throw new UnauthorizedException(AUTH_MESSAGES.USER_NOT_FOUND);

      const valid = await verify(user.password, dto.currentPassword);
      if (!valid)
        throw new BadRequestException(AUTH_MESSAGES.INCORRECT_CURRENT_PASSWORD);

      passwordHash = await hash(dto.newPassword as string);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(dto.fullName !== undefined && { fullName: dto.fullName }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        ...(dto.country !== undefined && { country: dto.country }),
        ...(passwordHash !== undefined && { password: passwordHash }),
      },
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
  }

  // ─── Guest: Delete Own Account ─────────────────────────────────────────────
  // Permanently removes the caller's own account and all their data.
  // Because all relations have onDelete: Cascade, Postgres cleans up
  // bookings, reviews, notifications, and refresh tokens automatically.
  async deleteOwnAccount(userId: string): Promise<void> {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  // ─── Admin: List All Users ────────────────────────────────────────────────
  // Returns a paginated list of users. Optionally filter by role (ADMIN | GUEST).
  // We use `select` to keep the password hash out of the response.
  async listUsers(filters: ListUsersDto): Promise<UsersPage> {
    const page = filters.page ?? 1;
    const limit = Math.min(filters.limit ?? 20, 100);
    const skip = (page - 1) * limit;

    const where = filters.role ? { role: filters.role } : {};

    const [total, data] = await Promise.all([
      this.prisma.user.count({ where }),
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      data: data as AdminUser[],
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // ─── Admin: Create Admin User ─────────────────────────────────────────────
  // Creates a brand-new user with role=ADMIN. The admin provides name, email,
  // and password. We hash the password before storing — same flow as signup.
  async createAdminUser(dto: CreateAdminUserDto): Promise<AdminUser> {
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
        role: 'ADMIN',
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return user as AdminUser;
  }

  // ─── Admin: Update User Role / Status ─────────────────────────────────────
  // Lets an admin change a user's role or suspend/reactivate their account.
  // Only the fields included in the DTO are updated.
  async updateUser(id: string, dto: UpdateUserDto): Promise<AdminUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.role !== undefined && { role: dto.role }),
        ...(dto.status !== undefined && { status: dto.status }),
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return updated as AdminUser;
  }

  // ─── Admin: Delete User ───────────────────────────────────────────────────
  // Permanently removes the user and all their data from the database.
  // The Prisma schema has onDelete: Cascade on every relation (Booking,
  // Review, Notification, RefreshToken), so Postgres handles the cleanup
  // automatically — we don't need a manual transaction here.
  // One safety check: an admin cannot delete their own account, because that
  // would lock them out immediately with no way to recover.
  async deleteUser(id: string, requestingAdminId: string): Promise<void> {
    if (id === requestingAdminId) {
      throw new BadRequestException(AUTH_MESSAGES.CANNOT_DELETE_SELF);
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(AUTH_MESSAGES.USER_NOT_FOUND);

    await this.prisma.user.delete({ where: { id } });
  }
}
