import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Custom decorator to extract the user object from the request.
 * The user object is attached to the request by the JwtStrategy after successful validation.
 * 
 * Usage:
 * @Get('profile')
 * getProfile(@CurrentUser() user: User) { ... }
 * 
 * Or to get a specific property:
 * getProfile(@CurrentUser('email') email: string) { ... }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
