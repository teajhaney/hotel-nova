import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { NotificationsModule } from '../notifications/notifications.module';

// BookingsModule imports NotificationsModule so that when a booking is
// created or its status changes, we can persist a notification and push
// it to the user in real-time via Socket.io.
@Module({
  imports: [NotificationsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
