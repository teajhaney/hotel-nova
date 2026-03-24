import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

// Each function here is a composed decorator that you drop onto a controller method.
// Putting Swagger metadata here means the controller only handles routing — no noise.
// When you want to add @ApiBody() or @ApiResponse() docs later, you add them
// in this file without ever opening the controller.
//
// Return type is annotated explicitly on all functions so that the TypeScript
// compiler (and ESLint's type-aware rules) can resolve the call signatures
// without falling back to `any`.

type Decorator = MethodDecorator & ClassDecorator;

export const ApiSignup = (): Decorator =>
  applyDecorators(ApiOperation({ summary: 'Register a new user' }));

export const ApiLogin = (): Decorator =>
  applyDecorators(ApiOperation({ summary: 'Log in with email and password' }));

export const ApiLogout = (): Decorator =>
  applyDecorators(ApiOperation({ summary: 'Log out and clear auth cookies' }));

export const ApiRefreshToken = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Get a new access token using the refresh cookie' }),
  );

export const ApiGetMe = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Get the currently authenticated user' }),
  );

export const ApiUpdateProfile = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: "Update the authenticated user's own profile" }),
  );

export const ApiDeleteOwnAccount = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: "Permanently delete the authenticated user's own account" }),
  );

export const ApiListUsers = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Admin: list all users with optional role filter' }),
  );

export const ApiCreateAdminUser = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Admin: create a new ADMIN account' }),
  );

export const ApiUpdateUser = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Admin: update a user role or status' }),
  );

export const ApiDeleteUser = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Admin: permanently delete a user and all their data' }),
  );
