import { IsOptional, IsString, MinLength } from 'class-validator';

// What a guest can update about their own profile.
// Email changes are intentionally excluded — those require a
// separate email-verification flow which we don't have yet.
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
}
