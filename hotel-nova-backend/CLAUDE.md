# HotelNova Backend (NestJS)

## Stack
NestJS · TypeScript · Prisma ORM · Neon Postgres · Socket.io · Paystack Webhooks

## Module Structure
src/
  auth/          # JWT signup/login, role guards
  rooms/         # Room CRUD + photo management
  bookings/      # Booking logic, availability, Paystack integration
  reviews/       # Ratings, moderation
  analytics/     # Dashboard metrics
  promo-codes/   # Discount codes
  notifications/ # Socket.io real-time gateway
  common/        # Guards, interceptors, decorators
  prisma/        # PrismaService (singleton)
  main.ts

## Commands
npm run start:dev       # Start dev server
npm run build           # Production build
npx prisma migrate dev  # Run migrations
npx prisma studio       # Open DB browser

## Conventions
- Every module must have: module, controller, service, dto files
- Use class-validator DTOs for all request validation
- All endpoints documented with Swagger @ApiTags / @ApiOperation
- Availability queries MUST use Prisma transactions
- Paystack webhook endpoint must verify signature before processing

## Database Rules
- Use Prisma migrations — never edit schema without migrating
- Seed file lives at prisma/seed.ts
