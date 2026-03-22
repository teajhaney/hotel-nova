import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import type { Request, Response } from 'express';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';

const mockTokens = {
  accessToken: 'access-token',
  refreshToken: 'token-id.raw-secret',
};

const mockAuthService = {
  signup: jest.fn(),
  login: jest.fn(),
  logout: jest.fn(),
  refresh: jest.fn(),
  getMe: jest.fn(),
};

// Minimal mock for the Response object — we only care about cookie calls
const mockRes = () => {
  const res = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };
  return res as unknown as Response;
};

const mockReq = (cookies: Record<string, string> = {}) =>
  ({ cookies }) as unknown as Request;

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  // ─── signup ────────────────────────────────────────────────────────────────

  describe('signup', () => {
    it('calls authService.signup and sets cookies', async () => {
      const dto: SignupDto = {
        email: 'yusuf@example.com',
        password: 'Password1',
        fullName: 'Yusuf Haney',
      };
      const res = mockRes();
      mockAuthService.signup.mockResolvedValue(mockTokens);

      const result = await controller.signup(dto, res);

      expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
      expect(res.cookie).toHaveBeenCalledWith(
        'accessToken',
        mockTokens.accessToken,
        expect.any(Object),
      );
      expect(res.cookie).toHaveBeenCalledWith(
        'refreshToken',
        mockTokens.refreshToken,
        expect.any(Object),
      );
      expect(result).toEqual({ message: 'Signup successful' });
    });
  });

  // ─── login ─────────────────────────────────────────────────────────────────

  describe('login', () => {
    it('calls authService.login and sets cookies', async () => {
      const dto: LoginDto = {
        email: 'yusuf@example.com',
        password: 'Password1',
      };
      const res = mockRes();
      mockAuthService.login.mockResolvedValue(mockTokens);

      const result = await controller.login(dto, res);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ message: 'Login successful' });
    });
  });

  // ─── logout ────────────────────────────────────────────────────────────────

  describe('logout', () => {
    const mockUser = { id: 'user-1', email: 'y@e.com', fullName: 'Y', role: 'GUEST' as const };

    it('calls authService.logout and clears cookies', async () => {
      const req = mockReq({ refreshToken: 'token-id.raw-secret' });
      const res = mockRes();

      await controller.logout(mockUser, req, res);

      expect(mockAuthService.logout).toHaveBeenCalledWith(
        'user-1',
        'token-id.raw-secret',
      );
      expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
    });

    it('clears cookies even if there is no refresh token cookie', async () => {
      const req = mockReq({});
      const res = mockRes();

      await controller.logout(mockUser, req, res);

      expect(mockAuthService.logout).not.toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalled();
    });
  });

  // ─── refresh ───────────────────────────────────────────────────────────────

  describe('refresh', () => {
    it('issues new tokens when a valid refresh cookie is present', async () => {
      const req = mockReq({ refreshToken: 'token-id.raw-secret' });
      const res = mockRes();
      mockAuthService.refresh.mockResolvedValue(mockTokens);

      const result = await controller.refresh(req, res);

      expect(mockAuthService.refresh).toHaveBeenCalledWith('token-id.raw-secret');
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ message: 'Token refreshed' });
    });

    it('throws UnauthorizedException if no refresh cookie', async () => {
      const req = mockReq({});
      const res = mockRes();

      await expect(controller.refresh(req, res)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  // ─── me ────────────────────────────────────────────────────────────────────

  describe('me', () => {
    it('delegates to authService.getMe with the user id', async () => {
      const safeUser = { id: 'user-1', email: 'y@e.com', fullName: 'Y' };
      mockAuthService.getMe.mockResolvedValue(safeUser);

      const result = await controller.me('user-1');

      expect(mockAuthService.getMe).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(safeUser);
    });
  });
});
