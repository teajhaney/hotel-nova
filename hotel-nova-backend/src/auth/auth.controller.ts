import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { COOKIES, TOKEN_TTL } from '../common/constants/auth.constants';
import { AUTH_MESSAGES } from '../common/constants/messages';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import type { AuthUser } from './interfaces/auth-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // SIGN UP
  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, ...tokens } = await this.authService.signup(dto);
    this.setCookies(res, tokens);
    return { message: AUTH_MESSAGES.SIGNUP_SUCCESS, user };
  }

  // LOG IN
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email and password' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, ...tokens } = await this.authService.login(dto);
    this.setCookies(res, tokens);
    return { message: AUTH_MESSAGES.LOGIN_SUCCESS, user };
  }

  // LOG OUT
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log out and invalidate refresh token' })
  async logout(
    @CurrentUser() user: AuthUser,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefreshToken = req.cookies[COOKIES.REFRESH_TOKEN] as
      | string
      | undefined;
    if (rawRefreshToken) {
      await this.authService.logout(user.id, rawRefreshToken);
    }
    this.clearCookies(res);
    return { message: AUTH_MESSAGES.LOGOUT_SUCCESS };
  }

  // REFRESH TOKEN
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a new access token using the refresh cookie' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefreshToken = req.cookies[COOKIES.REFRESH_TOKEN] as
      | string
      | undefined;
    if (!rawRefreshToken) {
      throw new UnauthorizedException(AUTH_MESSAGES.NO_REFRESH_TOKEN);
    }

    const tokens = await this.authService.refresh(rawRefreshToken);
    this.setCookies(res, tokens);
    return { message: AUTH_MESSAGES.TOKEN_REFRESHED };
  }

  // GET CURRENT USER
  @Get('me')
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  me(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  // ─── Cookie helpers ────────────────────────────────────────────────────────

  private setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const secure = process.env.NODE_ENV === 'production';

    res.cookie(COOKIES.ACCESS_TOKEN, tokens.accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      maxAge: TOKEN_TTL.ACCESS_MS,
    });

    res.cookie(COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'strict',
      maxAge: TOKEN_TTL.REFRESH_MS,
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie(COOKIES.ACCESS_TOKEN);
    res.clearCookie(COOKIES.REFRESH_TOKEN);
  }
}
