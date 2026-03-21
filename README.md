# HotelNova — Property Management System

A production-grade, full-stack Property Management System (PMS) for a single hotel. Built as a portfolio project to demonstrate real-world engineering across the entire stack — authentication, payments, real-time features, and role-based access control.

---

## Project Structure

```
hotel-nova/
├── hotel-nova-frontend/   # Next.js 16 (App Router) — port 3000
├── hotel-nova-backend/    # NestJS — port 3001
└── shared/                # Shared types/constants (optional)
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui |
| State | TanStack Query (server), Zustand (client) |
| Forms | React Hook Form + Zod |
| Animation | Motion |
| Backend | NestJS 11, TypeScript |
| Auth | JWT in HttpOnly cookies, Passport.js |
| Database | Neon Postgres (serverless) + Prisma ORM |
| Payments | Paystack |
| Real-time | Socket.io |
| Deployment | Vercel (frontend), Railway/Render (backend), Neon (database) |

---

## User Roles

| Role | Capabilities |
|------|-------------|
| **Guest** | Browse rooms, create bookings, manage own bookings, leave reviews, receive notifications |
| **Admin** | Full dashboard — manage rooms, users, bookings, promo codes, moderate reviews, view analytics |

---

## Key Features

- **Room Booking Wizard** — multi-step flow: date selection → room selection → guest details → Paystack payment → confirmation
- **Role-Based Access Control** — JWT guards on every endpoint, middleware-protected routes on the frontend
- **Real-Time Notifications** — Socket.io pushes notifications to guests and admins instantly
- **Promo Codes** — discount codes with usage limits and validity periods
- **Reviews** — guests can review only after checkout; admin can moderate
- **Analytics Dashboard** — booking metrics, revenue, occupancy for admins
- **No Double Bookings** — Prisma transactions enforce availability at the database level

---

## Authentication

- JWT stored in **HttpOnly cookies only** — never in localStorage
- Access tokens expire in ≤ 15 minutes; refresh tokens rotate on every use
- Single login/signup page; role is selected at registration
- Route protection enforced by Next.js middleware (frontend) and NestJS guards (backend)

---

## Local Development

### Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) Postgres database
- A [Paystack](https://paystack.com) account (for payment features)

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

**Backend** — create `hotel-nova-backend/.env`:

```env
DATABASE_URL=postgresql://...        # Neon connection string
JWT_SECRET=your-secret-here
JWT_REFRESH_SECRET=your-refresh-secret-here
FRONTEND_URL=http://localhost:3000
PAYSTACK_SECRET_KEY=sk_test_...
PORT=3001
```

**Frontend** — create `hotel-nova-frontend/.env.local`:

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
# Terminal 1 — Backend (port 3001)
cd hotel-nova-backend
npm run start:dev

# Terminal 2 — Frontend (port 3000)
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
| [`hotel-nova-backend/guide.md`](./hotel-nova-backend/guide.md) | Full implementation guide — schema decisions, module blueprints, architecture |
| [`API.md`](./API.md) | API standards, error format, rate limiting |
| [`AUTH.md`](./AUTH.md) | Token strategy, RBAC, password rules |
| [`SECURITY.md`](./SECURITY.md) | Security architecture and attack surface |
| [`ACCESSIBILITY.md`](./ACCESSIBILITY.md) | WCAG 2.1 AA compliance guidelines |

---

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Railway or Render |
| Database | Neon (serverless Postgres) |

---

## Business Rules

- No double bookings — availability is checked inside a Prisma transaction
- Guests can only submit a review after their booking status is `CheckedOut`
- Promo codes enforce both a validity period and a usage cap
- Paystack webhooks are verified by HMAC signature before any booking is confirmed
- Room prices are stored in **kobo** (smallest naira unit) — divide by 100 to display
