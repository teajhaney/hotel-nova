import { IsOptional, IsString, MinLength } from 'class-validator';

// What a guest can update about their own profile.
// Email changes are intentionally excluded — those require a
// separate email-verification flow which we don't have yet.
//
// Password change is optional: if currentPassword + newPassword are both
// present the service verifies the current one before hashing the new one.
// If neither is present the password is left untouched.
export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  currentPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  newPassword?: string;
}
