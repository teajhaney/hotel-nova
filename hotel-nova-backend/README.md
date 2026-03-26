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
│   ├── auth.controller.ts     # POST signup/login/logout/refresh, GET/PATCH/DELETE me, CRUD users
│   ├── auth.service.ts        # Argon2 hashing, JWT issuance, cookie management, user management
│   ├── auth.swagger.ts        # Swagger metadata for all auth endpoints
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
├── rooms/                     # Room management (Admin CRUD + public browse + photo upload)
├── bookings/                  # Booking logic, availability, Paystack integration
├── reviews/                   # Guest reviews, admin moderation
├── promo-codes/               # Discount codes with usage limits
├── notifications/             # Stored notifications + Socket.io gateway
├── analytics/                 # Aggregation queries for admin dashboard
├── cloudinary/                # Cloudinary integration for image uploads
│
├── helpers/                   # Shared utility functions (app.helpers.ts)
│
├── common/                    # Shared infrastructure
│   ├── constants/
│   │   ├── auth.constants.ts         # Cookie names, token TTLs
│   │   └── messages.ts               # Centralized message strings
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
| PATCH | `/auth/me` | Any | Update own profile (name, phone, country) |
| DELETE | `/auth/me` | Any | Delete own account |
| GET | `/auth/users` | Admin | List all users (paginated, filterable by role) |
| POST | `/auth/users` | Admin | Create a new admin user |
| PATCH | `/auth/users/:id` | Admin | Update a user's role or status |
| DELETE | `/auth/users/:id` | Admin | Delete a user |

### Rooms

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/rooms` | Public | List rooms (filterable, paginated) |
| GET | `/rooms/:id` | Public | Get room details |
| POST | `/rooms` | Admin | Create a room |
| PATCH | `/rooms/:id` | Admin | Update room details |
| DELETE | `/rooms/:id` | Admin | Delete a room |
| POST | `/rooms/:id/photos` | Admin | Upload a room photo (multipart, max 5 MB) |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/bookings` | Guest | Create a booking (returns Paystack payment URL) |
| GET | `/bookings/my` | Guest | Get own bookings |
| GET | `/bookings/:id` | Guest/Admin | Get booking details |
| GET | `/bookings` | Admin | List all bookings (filtered, paginated) |
| PATCH | `/bookings/:id/cancel` | Guest | Cancel own booking |
| PATCH | `/bookings/:id/status` | Admin | Update booking status |
| POST | `/bookings/paystack/webhook` | Public | Paystack payment webhook |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/eligible` | Any | Get eligible bookings for review (checked-out, with review status) |
| POST | `/reviews` | Any | Submit a review (post-checkout only) |
| PATCH | `/reviews/:id` | Any | Edit own pending review |
| GET | `/reviews` | Admin | List all reviews (paginated, filterable by status) |
| PATCH | `/reviews/:id/status` | Admin | Approve or hide a review |

### Promo Codes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/promo-codes` | Admin | Create a promo code |
| GET | `/promo-codes` | Admin | List all promo codes |
| PATCH | `/promo-codes/:id` | Admin | Update a promo code |
| DELETE | `/promo-codes/:id` | Admin | Delete a promo code |
| POST | `/promo-codes/validate` | Guest | Validate and apply a code |

### Notifications

All notification endpoints are available to any authenticated user (guest or admin). Each user manages their own notifications.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | Any | Get own notifications (paginated, filterable) |
| GET | `/notifications/unread-count` | Any | Get unread notification count |
| PATCH | `/notifications/:id/read` | Any | Mark one notification as read |
| PATCH | `/notifications/read-all` | Any | Mark all notifications as read |
| PATCH | `/notifications/:id/archive` | Any | Archive a notification |

### Analytics

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/analytics/overview` | Admin | Occupancy, today's stats, trend charts (admin Overview page) |
| GET | `/analytics/summary` | Admin | Summary stats, weekly trends, high-value bookings (admin Analytics page) |

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
