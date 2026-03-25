import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Admin } from '../auth/decorators/admin.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { UpdateReviewStatusDto } from './dto/update-review-status.dto';
import { ListReviewsDto } from './dto/list-reviews.dto';
import {
  ApiGetEligibleBookings,
  ApiListReviews,
  ApiSubmitReview,
  ApiUpdateReview,
  ApiUpdateReviewStatus,
} from './reviews.swagger';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  // GET /api/v1/reviews/eligible → NestJS GET /api/v1/reviews/eligible
  // Returns all CheckedOut bookings for the current guest with review status.
  @Get('eligible')
  @ApiGetEligibleBookings()
  getEligibleBookings(@CurrentUser('id') userId: string) {
    return this.reviewsService.getEligibleBookings(userId);
  }

  // POST /api/v1/reviews → NestJS POST /api/v1/reviews
  // Guest submits a new review. Booking must be CheckedOut.
  @Post()
  @ApiSubmitReview()
  submitReview(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.submitReview(userId, dto);
  }

  // PATCH /api/v1/reviews/:id → NestJS PATCH /api/v1/reviews/:id
  // Guest edits their own pending review.
  @Patch(':id')
  @ApiUpdateReview()
  updateReview(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateReviewDto,
  ) {
    return this.reviewsService.updateReview(id, userId, dto);
  }

  // GET /api/v1/reviews → NestJS GET /api/v1/reviews
  // Admin: paginated list of all reviews with optional status filter.
  @Admin()
  @Get()
  @ApiListReviews()
  listReviews(@Query() query: ListReviewsDto) {
    return this.reviewsService.listReviews(query);
  }

  // PATCH /api/v1/reviews/:id/status → NestJS PATCH /api/v1/reviews/:id/status
  // Admin: approve or hide a review.
  @Admin()
  @Patch(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiUpdateReviewStatus()
  updateReviewStatus(
    @Param('id') id: string,
    @Body() dto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateReviewStatus(id, dto);
  }
}
