# HotelNova -- Backend

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
| Cloudinary | Image uploads (room photos) |
| @nestjs/swagger | API documentation |
| @nestjs/config | Environment variable management |
| @nestjs/throttler | Rate limiting |

---

## Getting Started

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database
- A [Paystack](https://paystack.com) account
- A [Cloudinary](https://cloudinary.com) account

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
FRONTEND_URL=http://localhost:3000     # Production: comma-separated for CORS, e.g. https://hotel-nova.vercel.app,http://localhost:3000
PAYSTACK_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
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
npx prisma generate                              # Regenerate Prisma client
npx prisma studio                                # Open database browser UI
```

---

## Module Structure

```
src/
├── main.ts                    # Bootstrap -- cookie parser, CORS, global pipes/filters, rawBody: true
├── app.module.ts              # Root module -- throttler, global guards (JWT, Roles, Throttler)
├── app.controller.ts          # GET / health check (public)
├── app.service.ts             # Health check response
│
├── auth/                      # Authentication and user management
│   ├── auth.module.ts
│   ├── auth.controller.ts     # POST signup/login/logout/refresh, GET/PATCH/DELETE me, CRUD users
│   ├── auth.service.ts        # Argon2 hashing, JWT issuance, cookie management, user management
│   ├── auth.swagger.ts        # Swagger metadata for all auth endpoints
│   ├── strategies/
│   │   └── jwt.strategy.ts    # Reads JWT from HttpOnly cookie
│   ├── guards/
│   │   ├── jwt-auth.guard.ts  # Global -- validates every request
│   │   └── roles.guard.ts     # Global -- enforces @Roles() decorator
│   ├── decorators/
│   │   ├── public.decorator.ts       # @Public() -- skip JWT guard
│   │   ├── roles.decorator.ts        # @Roles('ADMIN', 'GUEST')
│   │   ├── current-user.decorator.ts # @CurrentUser() -- inject user from token
│   │   ├── admin.decorator.ts        # @Admin() -- shorthand for @Roles('ADMIN')
│   │   └── guest.decorator.ts        # @Guest() -- shorthand for @Roles('GUEST', 'ADMIN')
│   ├── helpers/
│   │   └── auth.helpers.ts    # issueTokens(), parseRefreshToken() -- pure functions
│   ├── interfaces/
│   │   ├── auth-user.interface.ts
│   │   └── jwt-payload.interface.ts
│   └── dto/
│       ├── signup.dto.ts
│       ├── login.dto.ts
│       ├── update-profile.dto.ts
│       ├── create-admin-user.dto.ts
│       ├── list-users.dto.ts
│       └── update-user.dto.ts
│
├── rooms/                     # Room management (Admin CRUD + public browse + photo upload)
│   ├── rooms.module.ts
│   ├── rooms.controller.ts
│   ├── rooms.service.ts
│   ├── rooms.swagger.ts
│   ├── helpers/
│   │   └── room.helpers.ts
│   └── dto/
│       ├── create-room.dto.ts
│       ├── update-room.dto.ts
│       └── room-filters.dto.ts
│
├── bookings/                  # Booking logic, availability, Paystack integration
│   ├── bookings.module.ts
│   ├── bookings.controller.ts
│   ├── bookings.service.ts
│   ├── bookings.swagger.ts
│   ├── helpers/
│   │   └── booking.helpers.ts # buildBookingRef(), calcAmounts(), calcNights(), initPaystackPayment()
│   ├── interface/
│   │   └── booking.interface.ts
│   └── dto/
│       ├── create-booking.dto.ts
│       ├── booking-filters.dto.ts
│       └── update-booking-status.dto.ts
│
├── reviews/                   # Guest reviews, admin moderation
│   ├── reviews.module.ts
│   ├── reviews.controller.ts
│   ├── reviews.service.ts
│   ├── reviews.swagger.ts
│   ├── interfaces/
│   │   └── review.interface.ts
│   └── dto/
│       ├── create-review.dto.ts
│       ├── update-review.dto.ts
│       ├── update-review-status.dto.ts
│       └── list-reviews.dto.ts
│
├── promo-codes/               # Discount codes with usage limits
│   ├── promo-codes.module.ts
│   ├── promo-codes.controller.ts
│   ├── promo-codes.service.ts
│   ├── promo-codes.swagger.ts
│   ├── interfaces/
│   │   └── promo-code.interface.ts
│   └── dto/
│       ├── create-promo-code.dto.ts
│       ├── update-promo-code.dto.ts
│       └── list-promo-codes.dto.ts
│
├── notifications/             # Stored notifications + Socket.io gateway
│   ├── notifications.module.ts
│   ├── notifications.controller.ts
│   ├── notifications.service.ts # REST CRUD + create() called by other services
│   ├── notifications.gateway.ts # Socket.io WebSocket gateway
│   ├── notifications.swagger.ts
│   ├── interfaces/
│   │   └── notification.interface.ts
│   └── dto/
│       └── notification-filters.dto.ts
│
├── analytics/                 # Aggregation queries for admin dashboard
│   ├── analytics.module.ts
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   ├── analytics.swagger.ts
│   └── interfaces/
│       └── analytics.interface.ts
│
├── cloudinary/                # Cloudinary integration for image uploads
│   ├── cloudinary.module.ts
│   ├── cloudinary.client.ts
│   └── cloudinary.service.ts  # uploadStream(), destroy()
│
├── helpers/                   # Shared utility functions
│   └── app.helpers.ts         # formatUptime()
│
├── common/                    # Shared infrastructure
│   ├── constants/
│   │   ├── auth.constants.ts         # Cookie names (accessToken, refreshToken, jwt), token TTLs
│   │   └── messages.ts               # Centralized message strings (auth, rooms, bookings, reviews, promo, notifications, uploads)
│   ├── exceptions/
│   │   ├── base.exception.ts         # BaseException extends HttpException
│   │   └── domain.exceptions.ts      # All domain-specific error classes (RoomNotFoundException, BookingConflictException, etc.)
│   ├── filters/
│   │   └── http-exception.filter.ts  # Global -- catches all errors, uniform response shape
│   └── interceptors/
│       └── logging.interceptor.ts    # Logs every request/response with timing
│
└── prisma/
    ├── prisma.module.ts       # Exports PrismaService globally
    └── prisma.service.ts      # Singleton PrismaClient
```

---

## API Overview

All endpoints are prefixed with `/api/v1`. For example, `GET /auth/me` is accessible at `GET /api/v1/auth/me`.

**Auth column legend:**
- **Public** -- no authentication required (`@Public()` decorator)
- **Any** -- any authenticated user, no role restriction (default `JwtAuthGuard` only)
- **Guest** -- authenticated user with GUEST or ADMIN role (`@Guest()` decorator)
- **Admin** -- authenticated user with ADMIN role only (`@Admin()` decorator)

### Health Check

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Public | Health check -- returns server status, version, uptime |

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | Public | Register new user (role selected at registration) |
| POST | `/auth/login` | Public | Login, sets HttpOnly cookies (access + refresh) |
| POST | `/auth/logout` | Any | Clear auth cookies, delete refresh token from DB |
| POST | `/auth/refresh` | Public | Rotate refresh token, issue new access + refresh cookies |
| GET | `/auth/me` | Any | Get current user profile |
| PATCH | `/auth/me` | Any | Update own profile (fullName, phone, country, password) |
| DELETE | `/auth/me` | Any | Delete own account (cascades all related data) |
| GET | `/auth/users` | Admin | List all users (paginated, filterable by role) |
| POST | `/auth/users` | Admin | Create a new admin user |
| PATCH | `/auth/users/:id` | Admin | Update a user's role or status |
| DELETE | `/auth/users/:id` | Admin | Delete a user (admin cannot delete self) |

### Rooms

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/rooms` | Public | List rooms (filterable, paginated) |
| GET | `/rooms/:id` | Public | Get room details |
| POST | `/rooms` | Admin | Create a room |
| PATCH | `/rooms/:id` | Admin | Update room details |
| DELETE | `/rooms/:id` | Admin | Delete a room |
| POST | `/rooms/:id/photos` | Admin | Upload a room photo (multipart, max 5 MB, JPEG/PNG/WebP) |

### Bookings

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/bookings` | Guest | Create a booking (returns Paystack payment URL) |
| GET | `/bookings/my` | Guest | Get own bookings (with room details) |
| GET | `/bookings` | Admin | List all bookings (filtered by status, paymentStatus, guestEmail, checkIn range; paginated) |
| GET | `/bookings/:id` | Guest | Get booking details (guests see own only, admins see any) |
| PATCH | `/bookings/:id/cancel` | Guest | Cancel own booking (Pending or Confirmed only) |
| PATCH | `/bookings/:id/status` | Admin | Update booking status (enforces allowed transitions) |
| POST | `/bookings/paystack/webhook` | Public | Paystack payment webhook (HMAC-SHA512 signature verified) |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/reviews/eligible` | Any | Get eligible bookings for review (CheckedOut, with review status) |
| POST | `/reviews` | Any | Submit a review (booking must be CheckedOut, one review per booking) |
| PATCH | `/reviews/:id` | Any | Edit own pending review (only while status is Pending) |
| GET | `/reviews` | Admin | List all reviews (paginated, filterable by status) |
| PATCH | `/reviews/:id/status` | Admin | Approve or hide a review |

### Promo Codes

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/promo-codes` | Admin | List all promo codes (paginated, filterable by status) |
| POST | `/promo-codes` | Admin | Create a promo code |
| PATCH | `/promo-codes/:id` | Admin | Update a promo code |
| DELETE | `/promo-codes/:id` | Admin | Delete a promo code |
| POST | `/promo-codes/validate` | Public | Validate a promo code (checks validity period and usage cap) |

### Notifications

All notification endpoints are available to any authenticated user (guest or admin). Each user manages their own notifications.

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/notifications` | Any | Get own notifications (paginated, filterable by type/read/archived) |
| GET | `/notifications/unread-count` | Any | Get unread notification count (for badge) |
| PATCH | `/notifications/:id/read` | Any | Mark one notification as read |
| PATCH | `/notifications/read-all` | Any | Mark all notifications as read |
| PATCH | `/notifications/:id/archive` | Any | Archive a notification (soft-delete) |

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

1. User POSTs credentials to `/auth/login` (or `/auth/signup`)
2. Server verifies password with Argon2, issues a JWT access token and a refresh token
3. Both tokens are set as **HttpOnly cookies** -- never exposed to JavaScript
4. Every subsequent request sends cookies automatically (browser handles this)
5. `JwtAuthGuard` reads the access token from the cookie on every request
6. When the access token expires (15 minutes), the frontend calls `/auth/refresh` using the refresh token cookie
7. The refresh token is rotated on every use -- the old token is deleted from the DB and a new one is issued
8. On logout, the refresh token is deleted from the DB and both cookies are cleared

**Refresh token format:** `{tokenId}.{randomSecret}` -- the secret is hashed with Argon2 before storage. On refresh, the server splits the token, looks up the row by ID, and verifies the secret against the stored hash.

---

## Socket.io Real-Time Notifications

The `NotificationsGateway` pushes live notifications to connected users over WebSocket.

**Connection details:**
- Namespace: `/notifications`
- CORS: same origin as REST API (`FRONTEND_URL` env var, supports comma-separated origins)
- Attaches to the same HTTP server as NestJS (no separate port)
- Authentication (two strategies, checked in order):
  1. **Token in handshake** (production) -- the frontend fetches the JWT from a same-origin Route Handler (`/api/auth/ws-token`) and passes it via `socket.auth.token`. This is required when the frontend and backend are on different domains (e.g. Vercel + Render), since cross-origin cookies are not sent with WebSocket handshakes.
  2. **Cookie fallback** (local dev) -- when both frontend and backend share `localhost`, the HttpOnly `accessToken` cookie is sent automatically with the handshake.
- Each authenticated user joins a private room named `user:<userId>`
- Unauthenticated connections are disconnected immediately

**Events emitted by the server:**
- `notification` -- a single `NotificationRecord` object pushed to a specific user's room

**Gateway methods:**
- `sendToUser(userId, notification)` -- emits to `user:<userId>` room
- `sendToAdmins(notification)` -- emits to `admins` room

### When Notifications Are Sent

Notifications are created in the database and pushed via Socket.io in real-time. All notification sends are fire-and-forget -- a failure never breaks the main business operation.

**From BookingsService:**

| Trigger | Type | Recipient | When |
|---------|------|-----------|------|
| New booking created | `new_booking` | All admins | After a guest creates a booking and Paystack payment URL is generated |
| Booking status changed | `booking_confirmed` | Guest (booking owner) | When an admin updates booking status (CheckedIn, CheckedOut, Cancelled, etc.) |
| Checkout completed | `review_prompt` | Guest (booking owner) | When admin changes status to CheckedOut (sent alongside the status change notification) |
| Paystack payment received | `payment_received` | Guest (booking owner) | When Paystack webhook confirms successful charge |
| Booking confirmed via payment | `booking_confirmed` | Guest (booking owner) | When Paystack webhook confirms successful charge (sent alongside payment_received) |

**From ReviewsService:**

| Trigger | Type | Recipient | When |
|---------|------|-----------|------|
| New review submitted | `new_review_submitted` | All admins | After a guest submits a new review |

---

## Prisma Schema

### Enums

| Enum | Values |
|------|--------|
| `Role` | GUEST, ADMIN |
| `UserStatus` | Active, Inactive, Suspended |
| `RoomType` | Standard, Deluxe, Executive, Suite |
| `RoomStatus` | Available, Occupied, Maintenance |
| `BookingStatus` | Pending, Confirmed, CheckedIn, CheckedOut, Cancelled |
| `PaymentStatus` | Pending, Paid, Failed, Refunded |
| `DiscountType` | percentage, fixed |
| `PromoStatus` | Active, Inactive, Scheduled |
| `ReviewStatus` | Pending, Approved, Hidden |
| `NotificationType` | booking_confirmed, checkout_reminder, payment_received, review_prompt, new_booking, new_user_registered, new_review_submitted, room_status_changed, security_alert, general |

### Models

| Model | Key Fields | Notes |
|-------|-----------|-------|
| `User` | id, email (unique), password, fullName, phone?, country?, role, status | Maps to `users` table |
| `RefreshToken` | id, tokenHash, userId, expiresAt | Maps to `refresh_tokens` table. Indexed on userId |
| `Room` | id, roomNumber, roomRef (unique), name, type, price, status, imageUrl?, imagePublicId?, beds?, maxGuests, sqm?, amenities[] | Maps to `rooms` table. Unique constraint on [roomNumber, type] |
| `Booking` | id, bookingRef (unique), guestId, roomId, checkIn, checkOut, nights, pricePerNight, subtotal, serviceCharge, vat, promoDiscount, totalAmount, status, paymentStatus, paymentReference? (unique) | Maps to `bookings` table. Indexed on guestId, roomId, [checkIn, checkOut], status |
| `Review` | id, guestId, roomId, bookingId (unique), rating, reviewText, status | Maps to `reviews` table. One review per booking enforced at DB level |
| `PromoCode` | id, code (unique), description, discountType, discountValue, usageLimit, used, validFrom, validTo, status | Maps to `promo_codes` table |
| `Notification` | id, userId, bookingId?, type, title, message, actionLabel?, actionHref?, read, archived | Maps to `notifications` table |

---

## Booking Status Transitions

The admin `PATCH /bookings/:id/status` endpoint enforces these transitions:

```
Pending    --> Confirmed, Cancelled
Confirmed  --> CheckedIn, Cancelled
CheckedIn  --> CheckedOut
```

Any transition not listed above is rejected with `INVALID_STATUS_TRANSITION`.

**Side effects on room status:**
- Transition to `CheckedIn` sets the room status to `Occupied`
- Transition to `CheckedOut` sets the room status back to `Available`
- Both updates (booking + room) run inside a Prisma `$transaction`

---

## Prisma Transaction Usage

Transactions are used in two places to prevent race conditions:

1. **Booking creation** (`BookingsService.createBooking`) -- the availability check and booking insert run inside `prisma.$transaction()`. This prevents two guests from booking the same room for overlapping dates. If a promo code is applied, its usage count is incremented inside the same transaction.

2. **Admin status update** (`BookingsService.adminUpdateStatus`) -- when a status change also requires a room status change (CheckedIn/CheckedOut), both the booking update and the room update run inside `prisma.$transaction()` so they succeed or fail together.

---

## Global Infrastructure

| Component | What it does |
|-----------|-------------|
| `JwtAuthGuard` | Applied globally -- every endpoint requires auth unless decorated with `@Public()` |
| `RolesGuard` | Applied globally -- checks `@Roles()` decorator and rejects wrong roles |
| `ThrottlerGuard` | Applied globally -- 100 requests per 60 seconds per IP |
| `GlobalExceptionFilter` | Catches every error and returns a consistent `{ error: { code, message } }` shape |
| `LoggingInterceptor` | Logs every request (method, URL, IP) and response (status, duration) |
| `ValidationPipe` | Strips unknown fields (`whitelist`), rejects extra fields (`forbidNonWhitelisted`), auto-transforms types |

---

## Key Business Rules

- **No double bookings** -- availability is checked inside a Prisma transaction to prevent race conditions
- **Prices in kobo** -- all money values are integers (kobo = 1/100 naira); divide by 100 to display
- **Post-checkout reviews only** -- the service checks `BookingStatus.CheckedOut` before allowing a review
- **One review per booking** -- enforced by `@unique` on `Review.bookingId` at the database level
- **Paystack webhooks** -- HMAC-SHA512 signature verified against `PAYSTACK_SECRET_KEY` before any booking state is updated
- **Promo codes** -- checked for validity period, active status, AND usage cap on every application
- **Refresh token rotation** -- every use of a refresh token deletes the old one and issues a new pair
- **Admin cannot delete self** -- the `DELETE /auth/users/:id` endpoint prevents an admin from deleting their own account
- **Room photos via Cloudinary** -- uploaded as streams (no disk writes), stored with `imageUrl` and `imagePublicId` on the Room model
