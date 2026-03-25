export interface UpcomingCheckIn {
  bookingId: string;
  guestName: string;
  roomName: string;
  checkIn: Date;
  status: string;
}

export interface OccupancyPoint {
  day: string;
  value: number;
}

export interface RevenuePoint {
  month: string;
  value: number;
}

// Data for the admin Overview page
export interface OverviewStats {
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  dailyRevenue: number;
  occupancyTrend: OccupancyPoint[];
  monthlyRevenue: RevenuePoint[];
  upcomingCheckIns: UpcomingCheckIn[];
}

export interface WeeklyOccupancyPoint {
  label: string;
  value: number;
}

export interface MonthlyRevenuePoint {
  month: string;
  current: number;
}

export interface HighValueBooking {
  bookingId: string;
  guestName: string;
  roomName: string;
  checkIn: Date;
  checkOut: Date;
  totalAmount: number;
  status: string;
}

// Data for the admin Analytics page
export interface AnalyticsSummary {
  totalOccupancy: number;
  averageRevenue: number;
  activeBookings: number;
  guestSatisfaction: number;
  occupancyTrends: WeeklyOccupancyPoint[];
  monthlyRevenue: MonthlyRevenuePoint[];
  highValueBookings: HighValueBooking[];
}
