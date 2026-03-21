# HotelNova — Backend

NestJS REST API for the HotelNova Property Management System.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| NestJS 11 | Framework |
| TypeScript | Type safety |
| Prisma 7 | ORM and database client |
| Neon Postgres | Serverless database |
| Passport.js + JWT | Authentication |
| Argon2 | Password hashing |
| class-validator | DTO validation |
| Socket.io | Real-time notifications |
| @nestjs/schedule | Cron jobs (checkout reminders, review prompts) |
| @nestjs/swagger | API documentation |
| @nestjs/config | Environment variable management |
| @nestjs/throttler | Rate limiting |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database
- A [Paystack](https://paystack.com) account

### Install and run

```bash
npm install
npm run start:dev
```

Runs on `http://localhost:3001`.

### Environment variables

Create `.env` in this directory:

```env
DATABASE_URL=postgresql://...          # Neon connection string
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_WEBHOOK_SECRET=whsec_...
PORT=3001
```

### Available scripts

```bash
npm run start:dev       # Start with hot reload (development)
npm run start:prod      # Start production build
npm run build           # Compile TypeScript
npm run lint            # Run ESLint
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
npm run test:cov        # Run tests with coverage report
```

### Database commands

```bash
npx prisma migrate dev --name <migration-name>  # Create and apply a migration
npx prisma migrate deploy                        # Apply migrations in production
npx prisma db seed                               # Seed with test data
npx prisma studio                                # Open database browser UI
npx prisma generate                              # Regenerate Prisma client
```

---

## Module Structure

```
src/
├── main.ts                    # Bootstrap — cookie parser, CORS, global pipes/filters
├── app.module.ts              # Root module — throttler, global guards
│
├── auth/                      # Authentication
│   ├── auth.module.ts
│   ├── auth.controller.ts     # POST /auth/signup, /login, /logout, /refresh, GET /auth/me
│   ├── auth.service.ts        # Argon2 hashing, JWT issuance, cookie management
│   ├── strategies/
│   │   └── jwt.strategy.ts    # Reads JWT from HttpOnly cookie
│   ├── guards/
│   │   ├── jwt-auth.guard.ts  # Global — validates every request
│   │   └── roles.guard.ts     # Global — enforces @Roles() decorator
│   ├── decorators/
│   │   ├── public.decorator.ts       # @Public() — skip JWT guard
│   │   ├── roles.decorator.ts        # @Roles('ADMIN', 'GUEST')
│   │   ├── current-user.decorator.ts # @CurrentUser() — inject user from token
│   │   ├── admin.decorator.ts        # @Admin() shorthand
│   │   └── guest.decorator.ts        # @Guest() shorthand
│   └── interfaces/
│       └── jwt-payload.interface.ts
│
├── rooms/                     # Room management (Admin CRUD + public browse)
├── bookings/                  # Booking logic, availability, Paystack integration
├── reviews/                   # Guest reviews, admin moderation
├── promo-codes/               # Discount codes with usage limits
├── notifications/             # Stored notifications + Socket.io gateway
├── analytics/                 # Aggregation queries for admin dashboard
│
├── common/                    # Shared infrastructure
│   ├── exceptions/
│   │   ├── base.exception.ts         # BaseException extends HttpException
│   │   └── domain.exceptions.ts      # All domain-specific error classes
│   ├── filters/
│   │   └── http-exception.filter.ts  # Global — catches all errors, uniform response shape
│   └── interceptors/
│       └── logging.interceptor.ts    # Logs every request/response with timing
│
└── prisma/
    ├── prisma.module.ts       # Exports PrismaService globally
    └── prisma.service.ts      # Singleton PrismaClient
```

---

## API Overview

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/login` | Public | Login, sets HttpOnly cookies |
| POST | `/auth/logout` | Any | Clear auth cookies |
| POST | `/auth/refresh` | Public | Rotate refresh token |
| GET | `/auth/me` | Any | Get current user profile |

### Rooms

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/rooms` | Public | List rooms (filterable, paginated) |
| GET | `/rooms/:id` | Public | Get room details |
| POST | `/rooms` | Admin | Create a room |
| PATCH | `/rooms/:id` | Admin | Update room details |
| DELETE | `/rooms/:id` | Admin | Delete a room |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/bookings` | Guest | Create a booking |
| GET | `/bookings/my` | Guest | Get own bookings |
| GET | `/bookings/:id` | Guest/Admin | Get booking details |
| GET | `/bookings` | Admin | List all bookings |
| PATCH | `/bookings/:id/status` | Admin | Update booking status |
| DELETE | `/bookings/:id` | Admin | Cancel/delete a booking |
| POST | `/bookings/webhook` | Public | Paystack payment webhook |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/reviews` | Guest | Submit a review (post-checkout only) |
| GET | `/reviews` | Public | List approved reviews |
| PATCH | `/reviews/:id/moderate` | Admin | Approve or hide a review |
| DELETE | `/reviews/:id` | Admin | Delete a review |

### Promo Codes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/promo-codes` | Admin | Create a promo code |
| GET | `/promo-codes` | Admin | List all promo codes |
| PATCH | `/promo-codes/:id` | Admin | Update a promo code |
| DELETE | `/promo-codes/:id` | Admin | Delete a promo code |
| POST | `/promo-codes/validate` | Guest | Validate and apply a code |

### Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | Guest | Get own notifications |
| PATCH | `/notifications/:id/read` | Guest | Mark as read |
| PATCH | `/notifications/:id/archive` | Guest | Archive |
| PATCH | `/notifications/read-all` | Guest | Mark all as read |
| GET | `/notifications/admin` | Admin | Get admin notifications |
| PATCH | `/notifications/admin/:id/read` | Admin | Mark as read |
| PATCH | `/notifications/admin/read-all` | Admin | Mark all as read |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/analytics/overview` | Admin | Revenue, bookings, occupancy summary |
| GET | `/analytics/revenue` | Admin | Revenue over time (chart data) |
| GET | `/analytics/bookings` | Admin | Booking trends |

---

## Error Response Format

All errors follow a consistent shape:

```json
{
  "error": {
    "code": "ROOM_NOT_FOUND",
    "message": "Room not found."
  }
}
```

The `GlobalExceptionFilter` handles this for every endpoint automatically. Domain exception classes in `src/common/exceptions/domain.exceptions.ts` cover all known error scenarios.

---

## Authentication Flow

1. Guest POSTs credentials to `/auth/login`
2. Server verifies password with Argon2, issues JWT access token and refresh token
3. Both tokens are set as **HttpOnly cookies** — never exposed to JavaScript
4. Every subsequent request sends cookies automatically (browser handles this)
5. `JwtAuthGuard` reads the access token from the cookie on every request
6. When the access token expires, the frontend calls `/auth/refresh` using the refresh token cookie
7. The refresh token is rotated on every use

---

## Global Infrastructure

| Component | What it does |
|-----------|-------------|
| `JwtAuthGuard` | Applied globally — every endpoint requires auth unless decorated with `@Public()` |
| `RolesGuard` | Applied globally — checks `@Roles()` decorator and rejects wrong roles |
| `ThrottlerGuard` | Applied globally — 100 requests per 60 seconds per IP |
| `GlobalExceptionFilter` | Catches every error and returns a consistent `{ error: { code, message } }` shape |
| `LoggingInterceptor` | Logs every request (method, URL, IP) and response (status, duration) |
| `ValidationPipe` | Strips unknown fields (`whitelist`), rejects extra fields (`forbidNonWhitelisted`), auto-transforms types |

---

## Key Business Rules

- **No double bookings** — availability is checked inside a Prisma transaction to prevent race conditions
- **Prices in kobo** — all money values are integers (kobo = 1/100 naira); divide by 100 to display
- **Post-checkout reviews only** — the service checks `BookingStatus.CheckedOut` before allowing a review
- **One review per booking** — enforced by `@unique` on `Review.bookingId` at the database level
- **Paystack webhooks** — HMAC signature verified before any booking state is updated
- **Promo codes** — checked for validity period AND usage cap on every application
