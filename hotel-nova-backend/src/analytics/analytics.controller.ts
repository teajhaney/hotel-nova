import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Admin } from '../auth/decorators/admin.decorator';
import { AnalyticsService } from './analytics.service';
import {
  ApiGetAnalyticsSummary,
  ApiGetOverviewStats,
} from './analytics.swagger';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  // GET /api/v1/analytics/overview → NestJS GET /api/v1/analytics/overview
  // Powers the admin Overview page: occupancy, today's stats, trend charts.
  @Admin()
  @Get('overview')
  @ApiGetOverviewStats()
  getOverviewStats() {
    return this.analyticsService.getOverviewStats();
  }

  // GET /api/v1/analytics/summary → NestJS GET /api/v1/analytics/summary
  // Powers the admin Analytics page: summary stats, weekly trends, high-value bookings.
  @Admin()
  @Get('summary')
  @ApiGetAnalyticsSummary()
  getAnalyticsSummary() {
    return this.analyticsService.getAnalyticsSummary();
  }
}
