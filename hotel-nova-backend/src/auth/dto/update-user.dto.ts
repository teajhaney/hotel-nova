import { IsIn, IsOptional } from 'class-validator';

// Admin can change a user's role or account status.
// Both fields are optional — send only what you want to change.
export class UpdateUserDto {
  @IsOptional()
  @IsIn(['ADMIN', 'GUEST'])
  role?: 'ADMIN' | 'GUEST';

  @IsOptional()
  @IsIn(['Active', 'Inactive', 'Suspended'])
  status?: 'Active' | 'Inactive' | 'Suspended';
}
