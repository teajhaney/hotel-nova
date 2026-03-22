import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as argon2 from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

// Mock argon2 so tests don't do real hashing (slow + unnecessary here)
jest.mock('argon2', () => ({
  hash: jest.fn().mockResolvedValue('hashed'),
  verify: jest.fn(),
}));

const mockUser = {
  id: 'user-1',
  email: 'yusuf@example.com',
  password: 'hashed',
  fullName: 'Yusuf Haney',
  phone: null,
  country: null,
  role: 'GUEST' as const,
  status: 'Active' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockRefreshToken = {
  id: 'token-1',
  tokenHash: 'hashed',
  userId: 'user-1',
  user: mockUser,
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  createdAt: new Date(),
};

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  refreshToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn().mockReturnValue('access-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  // ─── signup ────────────────────────────────────────────────────────────────

  describe('signup', () => {
    const dto: SignupDto = {
      email: 'yusuf@example.com',
      password: 'Password1',
      fullName: 'Yusuf Haney',
    };

    it('creates a user and returns tokens', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue(mockUser);
      mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

      const result = await service.signup(dto);

      expect(mockPrisma.user.create).toHaveBeenCalled();
      const [callArg] = mockPrisma.user.create.mock.calls[0] as [
        { data: { email: string } },
      ];
      expect(callArg.data.email).toBe(dto.email);
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('throws ConflictException if email is taken', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      await expect(service.signup(dto)).rejects.toThrow(ConflictException);
    });
  });

  // ─── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    const dto: LoginDto = {
      email: 'yusuf@example.com',
      password: 'Password1',
    };

    it('returns tokens on valid credentials', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

      const result = await service.login(dto);

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('throws UnauthorizedException for unknown email', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException for wrong password', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException if account is suspended', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        ...mockUser,
        status: 'Suspended',
      });
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      await expect(service.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  // ─── logout ────────────────────────────────────────────────────────────────

  describe('logout', () => {
    it('deletes the refresh token when valid', async () => {
      mockPrisma.refreshToken.findFirst.mockResolvedValue(mockRefreshToken);
      (argon2.verify as jest.Mock).mockResolvedValue(true);

      await service.logout('user-1', 'token-1.rawsecret');

      expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: 'token-1' },
      });
    });

    it('does nothing if token is not found', async () => {
      mockPrisma.refreshToken.findFirst.mockResolvedValue(null);

      await service.logout('user-1', 'token-1.rawsecret');

      expect(mockPrisma.refreshToken.delete).not.toHaveBeenCalled();
    });

    it('does nothing for a malformed token string', async () => {
      await service.logout('user-1', 'no-dot-here');

      expect(mockPrisma.refreshToken.findFirst).not.toHaveBeenCalled();
    });
  });

  // ─── refresh ───────────────────────────────────────────────────────────────

  describe('refresh', () => {
    it('issues new tokens and deletes the old one', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(mockRefreshToken);
      (argon2.verify as jest.Mock).mockResolvedValue(true);
      mockPrisma.refreshToken.delete.mockResolvedValue(mockRefreshToken);
      mockPrisma.refreshToken.create.mockResolvedValue(mockRefreshToken);

      const result = await service.refresh('token-1.rawsecret');

      expect(mockPrisma.refreshToken.delete).toHaveBeenCalledWith({
        where: { id: 'token-1' },
      });
      expect(result).toHaveProperty('accessToken');
    });

    it('throws if token is not found', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(null);

      await expect(service.refresh('token-1.rawsecret')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws if token is expired', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue({
        ...mockRefreshToken,
        expiresAt: new Date(Date.now() - 1000),
      });
      mockPrisma.refreshToken.delete.mockResolvedValue(mockRefreshToken);

      await expect(service.refresh('token-1.rawsecret')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('throws if the secret does not match the hash', async () => {
      mockPrisma.refreshToken.findUnique.mockResolvedValue(mockRefreshToken);
      (argon2.verify as jest.Mock).mockResolvedValue(false);

      await expect(service.refresh('token-1.rawsecret')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ─── getMe ─────────────────────────────────────────────────────────────────

  describe('getMe', () => {
    it('returns the user without the password', async () => {
      const safeUser = {
        id: mockUser.id,
        email: mockUser.email,
        fullName: mockUser.fullName,
        phone: null,
        country: null,
        role: mockUser.role,
        status: mockUser.status,
        createdAt: mockUser.createdAt,
      };
      mockPrisma.user.findUnique.mockResolvedValue(safeUser);

      const result = await service.getMe('user-1');

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(mockUser.email);
    });

    it('throws if user no longer exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.getMe('ghost-id')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
