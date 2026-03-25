import { applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

type Decorator = MethodDecorator & ClassDecorator;

export const ApiGetOverviewStats = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Admin: get overview dashboard stats (occupancy, revenue, check-ins, trend data)' }),
  );

export const ApiGetAnalyticsSummary = (): Decorator =>
  applyDecorators(
    ApiOperation({ summary: 'Admin: get analytics page summary (stats, charts, high-value bookings)' }),
  );
