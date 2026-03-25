import { IsIn } from 'class-validator';

// Only an admin can change the status of a review.
export class UpdateReviewStatusDto {
  @IsIn(['Pending', 'Approved', 'Hidden'])
  status: 'Pending' | 'Approved' | 'Hidden';
}
