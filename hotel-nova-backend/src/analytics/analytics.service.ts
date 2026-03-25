import { Injectable } from '@nestjs/common';
import { BookingStatus, PaymentStatus, ReviewStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type {
  AnalyticsSummary,
  HighValueBooking,
  MonthlyRevenuePoint,
  OverviewStats,
  RevenuePoint,
  UpcomingCheckIn,
  WeeklyOccupancyPoint,
} from './interfaces/analytics.interface';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // ─── Helper: today's date range ────────────────────────────────────────────
  private todayRange(): { start: Date; end: Date } {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    return { start, end };
  }

  // ─── Helper: occupancy count for a specific day ───────────────────────────
  // A booking is "active" on a day if checkIn <= day < checkOut
  private countOccupiedOnDay(day: Date): Promise<number> {
    const nextDay = new Date(day);
    nextDay.setDate(nextDay.getDate() + 1);
    return this.prisma.booking.count({
      where: {
        status: { in: [BookingStatus.Confirmed, BookingStatus.CheckedIn] },
        checkIn: { lt: nextDay },
        checkOut: { gt: day },
      },
    });
  }

  // ─── Helper: last-N-months revenue breakdown ──────────────────────────────
  private async monthlyRevenueForLastNMonths(
    n: number,
  ): Promise<RevenuePoint[]> {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - n);

    const bookings = await this.prisma.booking.findMany({
      where: {
        paymentStatus: PaymentStatus.Paid,
        createdAt: { gte: cutoff },
      },
      select: { totalAmount: true, createdAt: true },
    });

    // Group kobo amounts by abbreviated month name
    const map = new Map<string, number>();
    bookings.forEach((b) => {
      const key = MONTH_NAMES[b.createdAt.getMonth()];
      map.set(key, (map.get(key) ?? 0) + b.totalAmount);
    });

    // Build ordered array for the last N months
    const result: RevenuePoint[] = [];
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = MONTH_NAMES[d.getMonth()];
      result.push({ month: key, value: map.get(key) ?? 0 });
    }
    return result;
  }

  // ─── Admin: Overview Stats ─────────────────────────────────────────────────
  // Powers the admin Overview page. Returns occupancy, today's check-in/out
  // counts, daily revenue, a 7-day occupancy trend, monthly revenue chart
  // data, and the next 10 upcoming check-ins.
  async getOverviewStats(): Promise<OverviewStats> {
    const { start: today, end: tomorrow } = this.todayRange();

    // Build last-7-days date array (oldest first)
    const trendDays = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });

    const [
      totalRooms,
      occupiedRooms,
      todayCheckIns,
      todayCheckOuts,
      revenueAgg,
      upcomingRaw,
      trendCounts,
      monthlyRevenue,
    ] = await Promise.all([
      this.prisma.room.count(),
      this.prisma.room.count({ where: { status: 'Occupied' } }),
      this.prisma.booking.count({
        where: { checkIn: { gte: today, lt: tomorrow } },
      }),
      this.prisma.booking.count({
        where: { checkOut: { gte: today, lt: tomorrow } },
      }),
      this.prisma.booking.aggregate({
        where: { paymentStatus: PaymentStatus.Paid, createdAt: { gte: today } },
        _sum: { totalAmount: true },
      }),
      this.prisma.booking.findMany({
        where: {
          checkIn: { gte: today },
          status: { in: [BookingStatus.Pending, BookingStatus.Confirmed] },
        },
        orderBy: { checkIn: 'asc' },
        take: 10,
        include: { room: { select: { name: true } } },
      }),
      Promise.all(trendDays.map((d) => this.countOccupiedOnDay(d))),
      this.monthlyRevenueForLastNMonths(6),
    ]);

    const occupancyTrend = trendDays.map((day, i) => ({
      day: DAY_NAMES[day.getDay()],
      value:
        totalRooms > 0 ? Math.round((trendCounts[i] / totalRooms) * 100) : 0,
    }));

    const upcomingCheckIns: UpcomingCheckIn[] = upcomingRaw.map((b) => ({
      bookingId: b.id,
      guestName: b.guestName,
      roomName: b.room.name,
      checkIn: b.checkIn,
      status: b.status,
    }));

    return {
      occupancyRate:
        totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
      todayCheckIns,
      todayCheckOuts,
      dailyRevenue: revenueAgg._sum.totalAmount ?? 0,
      occupancyTrend,
      monthlyRevenue,
      upcomingCheckIns,
    };
  }

  // ─── Admin: Analytics Summary ──────────────────────────────────────────────
  // Powers the admin Analytics page. Returns summary stats, weekly occupancy
  // trend (last 4 weeks), monthly revenue (full year), and the top 5
  // highest-value bookings.
  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    // Build last-4-weeks array (each week starts on Monday)
    const weekStarts = Array.from({ length: 4 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (3 - i) * 7);
      // Snap to Monday of that week
      const dayOfWeek = d.getDay();
      const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      d.setDate(d.getDate() + daysToMonday);
      return d;
    });

    const [
      totalRooms,
      occupiedRooms,
      activeBookings,
      ratingAgg,
      weekOccupancies,
      monthlyRevData,
      highValueRaw,
    ] = await Promise.all([
      this.prisma.room.count(),
      this.prisma.room.count({ where: { status: 'Occupied' } }),
      this.prisma.booking.count({
        where: {
          status: { in: [BookingStatus.Confirmed, BookingStatus.CheckedIn] },
        },
      }),
      this.prisma.review.aggregate({
        where: { status: ReviewStatus.Approved },
        _avg: { rating: true },
      }),
      // For each of the 4 weeks, count how many rooms were occupied on the Monday
      Promise.all(weekStarts.map((d) => this.countOccupiedOnDay(d))),
      this.monthlyRevenueForLastNMonths(12),
      this.prisma.booking.findMany({
        where: { status: { notIn: [BookingStatus.Cancelled] } },
        orderBy: { totalAmount: 'desc' },
        take: 5,
        include: { room: { select: { name: true } } },
      }),
    ]);

    const occupancyTrends: WeeklyOccupancyPoint[] = weekStarts.map((_, i) => ({
      label: `Week ${i + 1}`,
      value:
        totalRooms > 0
          ? Math.round((weekOccupancies[i] / totalRooms) * 100)
          : 0,
    }));

    const monthlyRevenue: MonthlyRevenuePoint[] = monthlyRevData.map((r) => ({
      month: r.month,
      current: r.value,
    }));

    const highValueBookings: HighValueBooking[] = highValueRaw.map((b) => ({
      bookingId: b.id,
      guestName: b.guestName,
      roomName: b.room.name,
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      totalAmount: b.totalAmount,
      status: b.status,
    }));

    return {
      totalOccupancy:
        totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0,
      averageRevenue:
        monthlyRevData.length > 0
          ? Math.round(
              monthlyRevData.reduce((s, r) => s + r.value, 0) /
                monthlyRevData.length,
            )
          : 0,
      activeBookings,
      guestSatisfaction: Math.round((ratingAgg._avg.rating ?? 0) * 10) / 10,
      occupancyTrends,
      monthlyRevenue,
      highValueBookings,
    };
  }
}
