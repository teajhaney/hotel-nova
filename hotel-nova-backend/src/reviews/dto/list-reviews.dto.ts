import { IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListReviewsDto {
  @IsOptional()
  @IsIn(['Pending', 'Approved', 'Hidden'])
  status?: 'Pending' | 'Approved' | 'Hidden';

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
