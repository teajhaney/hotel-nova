import { Module } from '@nestjs/common';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

// BookingsModule only needs PrismaService to talk to the database.
// PrismaModule is global (exported from PrismaModule with isGlobal or re-exported),
// so we don't need to import it here — it's already available application-wide.
@Module({
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
