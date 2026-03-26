import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiCreateAdminUser,
  ApiDeleteOwnAccount,
  ApiDeleteUser,
  ApiGetMe,
  ApiListUsers,
  ApiLogin,
  ApiLogout,
  ApiRefreshToken,
  ApiSignup,
  ApiUpdateProfile,
  ApiUpdateUser,
} from './auth.swagger';
import type { Request, Response } from 'express';
import { COOKIES, TOKEN_TTL } from '../common/constants/auth.constants';
import { AUTH_MESSAGES } from '../common/constants/messages';
import { AuthService } from './auth.service';
import { Admin } from './decorators/admin.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import type { AuthUser } from './interfaces/auth-user.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // SIGN UP
  @Public()
  @Post('signup')
  @ApiSignup()
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
  @ApiLogin()
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
  @ApiLogout()
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
  @ApiRefreshToken()
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
  @ApiGetMe()
  me(@CurrentUser('id') userId: string) {
    return this.authService.getMe(userId);
  }

  // PATCH /api/v1/auth/me → NestJS PATCH /api/v1/auth/me
  // Any authenticated user can update their own name, phone, and country.
  @Patch('me')
  @ApiUpdateProfile()
  updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.authService.updateProfile(userId, dto);
  }

  // DELETE /api/v1/auth/me → NestJS DELETE /api/v1/auth/me
  // Permanently deletes the caller's own account and all related data.
  @Delete('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteOwnAccount()
  deleteOwnAccount(@CurrentUser('id') userId: string) {
    return this.authService.deleteOwnAccount(userId);
  }

  // ─── Admin: User Management ────────────────────────────────────────────────

  // GET /api/v1/auth/users → NestJS GET /api/v1/auth/users
  // Returns a paginated list of all users. Optionally filter by role.
  @Admin()
  @Get('users')
  @ApiListUsers()
  listUsers(@Query() query: ListUsersDto) {
    return this.authService.listUsers(query);
  }

  // POST /api/v1/auth/users → NestJS POST /api/v1/auth/users
  // Creates a new ADMIN account. Only admins can call this endpoint.
  @Admin()
  @Post('users')
  @ApiCreateAdminUser()
  createAdminUser(@Body() dto: CreateAdminUserDto) {
    return this.authService.createAdminUser(dto);
  }

  // PATCH /api/v1/auth/users/:id → NestJS PATCH /api/v1/auth/users/:id
  // Updates a user's role or status (e.g. suspend, promote to admin).
  @Admin()
  @Patch('users/:id')
  @ApiUpdateUser()
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.authService.updateUser(id, dto);
  }

  // DELETE /api/v1/auth/users/:id → NestJS DELETE /api/v1/auth/users/:id
  // Permanently removes a user and all their data from the database.
  // The currently logged-in admin cannot delete their own account.
  @Admin()
  @Delete('users/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDeleteUser()
  deleteUser(
    @Param('id') id: string,
    @CurrentUser('id') requestingAdminId: string,
  ) {
    return this.authService.deleteUser(id, requestingAdminId);
  }

  // ─── Cookie helpers ────────────────────────────────────────────────────────

  private setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    const isProduction = process.env.NODE_ENV === 'production';

    // In production the frontend (Vercel) and backend (Render) are on different
    // domains, so cookies need SameSite=None + Secure to be sent cross-origin.
    // In development both run on localhost so SameSite=Lax works fine.
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
    };

    res.cookie(COOKIES.ACCESS_TOKEN, tokens.accessToken, {
      ...cookieOptions,
      maxAge: TOKEN_TTL.ACCESS_MS,
    });

    res.cookie(COOKIES.REFRESH_TOKEN, tokens.refreshToken, {
      ...cookieOptions,
      maxAge: TOKEN_TTL.REFRESH_MS,
    });
  }

  private clearCookies(res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    const clearOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ('none' as const) : ('lax' as const),
    };

    res.clearCookie(COOKIES.ACCESS_TOKEN, clearOptions);
    res.clearCookie(COOKIES.REFRESH_TOKEN, clearOptions);
  }
}
