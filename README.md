# HotelNova -- Property Management System

A production-grade, full-stack Property Management System (PMS) for a single hotel. Built as a portfolio project to demonstrate real-world engineering across the entire stack -- authentication, payments, real-time features, role-based access control, and cross-tab synchronization.

---

## Project Structure

```
hotel-nova/
├── hotel-nova-frontend/   # Next.js 16 (App Router) -- port 3000
├── hotel-nova-backend/    # NestJS -- port 3001
├── API.md                 # API standards, error format, rate limiting
├── AUTH.md                # Token strategy, RBAC, password rules
├── SECURITY.md            # Security architecture and attack surface
├── ACCESSIBILITY.md       # WCAG 2.1 AA compliance guidelines
├── GUIDE.md               # Full implementation guide -- schema decisions, module blueprints
├── PLAN.md                # Project plan and milestones
└── POLICY.md              # Project policies and conventions
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| State | TanStack Query (server), Zustand (client) |
| Forms | React Hook Form + Zod + @hookform/resolvers |
| Animation | Motion (v12) |
| Icons | Lucide |
| Toasts | Sonner |
| Charts | Recharts |
| Backend | NestJS 11, TypeScript |
| Auth | JWT in HttpOnly cookies, Passport.js |
| Database | Neon Postgres (serverless) + Prisma ORM |
| Validation | class-validator + class-transformer (backend), Zod (frontend) |
| Image Upload | Cloudinary + Multer |
| Payments | Paystack |
| Real-time | Socket.io (WebSocket gateway) |
| Scheduling | @nestjs/schedule (cron jobs) |
| Rate Limiting | @nestjs/throttler |
| API Docs | Swagger (@nestjs/swagger) |
| Deployment | Vercel (frontend), Railway/Render (backend), Neon (database) |

---

## User Roles

| Role | Capabilities |
|------|-------------|
| **Guest** | Browse rooms, create bookings, manage own bookings, leave reviews after checkout, receive real-time notifications |
| **Admin** | Full dashboard -- manage rooms, users, bookings, promo codes, moderate reviews, view analytics, receive real-time notifications |

---

## Key Features

### Booking

- **Room Booking Wizard** -- multi-step flow: date selection, room selection, guest details, Paystack payment, confirmation
- **No Double Bookings** -- Prisma transactions enforce availability at the database level
- **Promo Codes** -- discount codes with usage limits and validity periods
- **Paystack Integration** -- webhook signature verification before any booking is confirmed

### Real-Time Notifications

- **Socket.io Gateway** -- the backend pushes notifications to connected guests and admins instantly via WebSocket
- **Global Toast Notifications** -- a single Socket.io listener mounted in the app Providers ensures toast notifications appear on every page, not just the notifications page
- **Dynamic Notification Badges** -- sidebar navigation displays live unread counts that update in real time as new notifications arrive
- **BroadcastChannel Cross-Tab Sync** -- when a guest submits a review or an admin moderates one, every other open tab of the same browser receives the update instantly via the BroadcastChannel API (with SSR guards for server-side safety)

### Reviews

- **Post-Checkout Reviews** -- guests can only submit a review after their booking status is CheckedOut
- **Admin Moderation** -- admins can approve or reject reviews before they become publicly visible
- **Cross-Tab + Cross-Device Updates** -- BroadcastChannel handles same-browser tabs instantly; polling handles cross-device sync

### Admin Dashboard

- **Analytics** -- booking metrics, revenue, and occupancy data powered by Recharts
- **Room Management** -- CRUD operations with Cloudinary image uploads
- **User Management** -- view and manage guest accounts
- **Booking Management** -- view, update status, and manage all bookings
- **Promo Code Management** -- create, edit, and track discount codes
- **Review Moderation** -- approve or reject guest reviews
- **Notification Center** -- view all system notifications

### Guest Dashboard

- **Booking History** -- view and manage personal bookings
- **Review Management** -- submit and edit reviews for checked-out bookings
- **Profile Management** -- update personal details
- **Notification Center** -- view personal notifications

### Other

- **Coming Soon Page** -- unbuilt routes redirect to a placeholder page rather than showing a 404
- **Money Convention (Kobo)** -- all prices are stored and computed in kobo (smallest naira unit) on the backend; the frontend divides by 100 for display using a shared `formatNgn()` utility
- **Responsive Design** -- mobile-first layouts across all pages
- **Smooth Animations** -- page transitions and UI interactions powered by Motion

---

## Authentication

- JWT stored in **HttpOnly cookies only** -- never in localStorage
- Access tokens expire in 15 minutes or less; refresh tokens rotate on every use
- Single login/signup page; role is selected at registration
- Route protection enforced by Next.js middleware (frontend) and NestJS guards (backend)
- Password hashing with Argon2

---

## Architecture

### Frontend

- **Next.js Route Handlers** (`app/api/`) proxy all calls to the NestJS backend -- client components never call the backend directly
- **TanStack Query** manages all server state with automatic caching, background refetch, and optimistic updates
- **Zustand** stores handle client-only state (auth user, booking wizard steps)
- **Socket.io client** (`lib/socket.ts`) connects once and is shared across the app

### Backend

- **Modular NestJS architecture** -- each domain (auth, rooms, bookings, reviews, notifications, promo-codes, analytics) is a self-contained module
- **Swagger documentation** -- metadata separated into `*.swagger.ts` files per module, never inline in controllers
- **Prisma ORM** -- type-safe database access with migrations and seed data
- **Socket.io Gateway** (`notifications.gateway.ts`) -- handles WebSocket connections and emits real-time events

---

## Local Development

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database
- A [Paystack](https://paystack.com) account (for payment features)
- A [Cloudinary](https://cloudinary.com) account (for image uploads)

### 1. Clone and install

```bash
git clone <repo-url>
cd hotel-nova

# Install frontend dependencies
cd hotel-nova-frontend && npm install

# Install backend dependencies
cd ../hotel-nova-backend && npm install
```

### 2. Configure environment variables

**Backend** -- create `hotel-nova-backend/.env`:

```env
DATABASE_URL=postgresql://...        # Neon connection string
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
FRONTEND_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
PORT=3001
```

**Frontend** -- create `hotel-nova-frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Set up the database

```bash
cd hotel-nova-backend
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. Start development servers

Open two terminals:

```bash
# Terminal 1 -- Backend (port 3001)
cd hotel-nova-backend
npm run start:dev

# Terminal 2 -- Frontend (port 3000)
cd hotel-nova-frontend
npm run dev
```

Visit `http://localhost:3000`.

---

## Documentation

| File | Contents |
|------|----------|
| [`hotel-nova-frontend/README.md`](./hotel-nova-frontend/README.md) | Frontend setup, routes, conventions |
| [`hotel-nova-backend/README.md`](./hotel-nova-backend/README.md) | Backend setup, modules, API overview |
| [`hotel-nova-backend/guide.md`](./hotel-nova-backend/guide.md) | Backend implementation guide |
| [`GUIDE.md`](./GUIDE.md) | Full implementation guide -- schema decisions, module blueprints, architecture |
| [`API.md`](./API.md) | API standards, error format, rate limiting |
| [`AUTH.md`](./AUTH.md) | Token strategy, RBAC, password rules |
| [`SECURITY.md`](./SECURITY.md) | Security architecture and attack surface |
| [`ACCESSIBILITY.md`](./ACCESSIBILITY.md) | WCAG 2.1 AA compliance guidelines |
| [`PLAN.md`](./PLAN.md) | Project plan and milestones |
| [`POLICY.md`](./POLICY.md) | Project policies and conventions |

---

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Railway or Render |
| Database | Neon (serverless Postgres) |

---

## Business Rules

- No double bookings -- room availability is checked inside a Prisma transaction before any booking is created
- Guests can only submit a review after their booking status is `CheckedOut`
- Promo codes enforce both a validity period and a usage cap
- Paystack webhooks are verified by HMAC signature before any booking is confirmed
- Room prices are stored in **kobo** (smallest naira unit) -- the backend never multiplies by 100 before sending to Paystack; the frontend always divides by 100 before display
- Reviews require admin moderation before becoming publicly visible
- Real-time notifications are delivered via Socket.io and persisted to the database
- BroadcastChannel keeps multiple browser tabs in sync without additional network requests
