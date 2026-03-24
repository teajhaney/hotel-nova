import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Query params for the admin "list all users" endpoint.
// Both `role` and pagination fields are optional — omitting role returns all users.
export class ListUsersDto {
  @IsOptional()
  @IsIn(['ADMIN', 'GUEST'])
  role?: 'ADMIN' | 'GUEST';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
