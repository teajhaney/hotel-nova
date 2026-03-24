import { IsEmail, IsString, MinLength } from 'class-validator';

// Used by the admin "Add Admin" form to create a new admin account.
// Role is always forced to ADMIN in the service — admins can't create guests this way.
export class CreateAdminUserDto {
  @IsString()
  @MinLength(2)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
