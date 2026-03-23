import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

// Each function here is a composed decorator that you drop onto a controller method.
// Putting Swagger metadata here means the controller only handles routing — no noise.
// When you want to add @ApiBody() or @ApiResponse() docs later, you add them
// in this file without ever opening the controller.

export const ApiSignup = () =>
  applyDecorators(ApiOperation({ summary: 'Register a new user' }));

export const ApiLogin = () =>
  applyDecorators(ApiOperation({ summary: 'Log in with email and password' }));

export const ApiLogout = () =>
  applyDecorators(ApiOperation({ summary: 'Log out and clear auth cookies' }));

export const ApiRefreshToken = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get a new access token using the refresh cookie',
    }),
  );

export const ApiGetMe = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get the currently authenticated user' }),
  );
