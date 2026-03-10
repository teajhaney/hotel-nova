# HotelNova — Full-Stack Project Plan

> **Agent Instructions:** This file is the single source of truth for the HotelNova project.
> Read this file at the start of every session. Update task checkboxes (`[ ]` → `[x]`) as work is
> completed. If a decision changes (e.g. a library is swapped), update the relevant section and
> add a note under [Architecture Decisions Log](#architecture-decisions-log). Never delete
> completed sections — they serve as a progress record.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [User Roles & Auth Flow](#2-user-roles--auth-flow)
3. [Technology Stack](#3-technology-stack)
4. [Folder Structure](#4-folder-structure)
5. [Database Schema](#5-database-schema)
6. [Feature Specifications](#6-feature-specifications)
7. [API Endpoints Reference](#7-api-endpoints-reference)
8. [Development Roadmap](#8-development-roadmap)
9. [Environment Variables](#9-environment-variables)
10. [Architecture Decisions Log](#10-architecture-decisions-log)
11. [Known Issues & Blockers](#11-known-issues--blockers)

---

## 1. Project Overview

| Field | Detail |
|---|---|
| **Project Name** | HotelNova |
| **Type** | Single-Hotel Property Management System (PMS) |
| **Owner** | Yusuf Tunde |
| **Parent Company** | Terra Nova (under Terra Management) |
| **Version** | 1.0 |
| **Started** | March 2026 |
| **Goal** | Production-grade, portfolio-ready fullstack project to impress employers in 2026 |

### Vision

A beautiful public-facing hotel website where anyone can browse and book rooms online. Guests get their own personal dashboard to manage bookings. A protected admin dashboard gives hotel staff full control over rooms, bookings, payments, and analytics.

**This is a single-hotel system. There is no multi-tenancy. Do not design or suggest multi-tenant patterns.**

### Target Users

- **Public visitors** — Browse the hotel website and room listings (no login required)
- **Guests** — Register, book rooms, manage bookings, leave reviews
- **Admin / Staff** — Full hotel management via a protected dashboard

---

## 2. User Roles & Auth Flow

### Roles

| Role | Access Level | Post-Login Redirect |
|---|---|---|
| `GUEST` | Public site + `/dashboard` | `/dashboard` |
| `ADMIN` | Public site + `/admin` | `/admin` |

### Auth Rules

- Single unified Sign Up / Login page — same UI for all users
- Role is selected by the user **at registration**, not assigned later
- JWT tokens stored in **HttpOnly cookies only** — never in `localStorage` or JS memory
- Route guards on both frontend and backend enforce role-based access
- Unauthorized access to `/admin` by a Guest → redirect to `/dashboard`
- Unauthenticated access to any protected route → redirect to `/login`

---

## 3. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| **Frontend** | TanStack Start | SSR, file-based routing |
| **Frontend UI** | Tailwind CSS + shadcn/ui | Component library |
| **Frontend Server State** | TanStack Query | Wraps `createServerFn` calls for caching + loading states |
| **Frontend Client State** | Zustand | Auth user, booking wizard, UI-only state |
| **API Layer** | TanStack `createServerFn` + native `fetch` | Server functions call NestJS; no Axios on the client |
| **Backend** | NestJS + TypeScript | Modular architecture |
| **Auth** | JWT (HttpOnly cookies) + class-validator | Role-based guards |
| **Database** | Neon Postgres (serverless) | Cloud Postgres |
| **ORM** | Prisma (latest) | Type-safe queries + migrations |
| **Payments** | Paystack | Nigerian payment gateway |
| **Real-time** | Socket.io | WebSocket communication |
| **PDF** | react-pdf or pdf-lib | Booking confirmation PDFs |
| **Charts** | Recharts | Analytics dashboard |
| **API Docs** | Swagger (NestJS) | Auto-generated API docs |
| **Deployment — FE** | Vercel | Frontend hosting |
| **Deployment — BE** | Railway or Render | Backend hosting |
| **Deployment — DB** | Neon | Managed Postgres |

---

## 4. Folder Structure

### Monorepo Root

```
hotel-nova/
├── PLAN.md                      ← This file (agent reads + updates)
├── CLAUDE.md                    ← Ambient project context for agent
├── policy.md                    ← Security policies (read before every coding session)
├── API.md / AUTH.md / SECURITY.md / ACCESSIBILITY.md
├── hotel-nova-frontend/         ← TanStack Start project
├── hotel-nova-backend/          ← NestJS project
└── README.md                    ← Public-facing project documentation
```

### Backend (NestJS)

```
hotel-nova-backend/
└── src/
    ├── auth/                # JWT signup, login, guards, decorators
    ├── rooms/               # Room CRUD + photo management
    ├── bookings/            # Booking logic, availability, Paystack
    ├── reviews/             # Guest reviews & admin moderation
    ├── analytics/           # Dashboard metrics & reports
    ├── promo-codes/         # Discount code management
    ├── notifications/       # Socket.io real-time events
    ├── common/              # Shared guards, interceptors, decorators
    ├── websocket/           # Socket.io gateway
    ├── prisma/              # PrismaService singleton
    └── main.ts              # Application entry point
```

Each module must contain: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `*.dto.ts`

### Frontend (TanStack Start)

> **Routing conventions:**
> - Routes live in `src/routes/` — this is non-negotiable in TanStack Start
> - `__root.tsx` is the top-level layout (document shell: `<html>`, `<body>`, global providers)
> - `index.tsx` = the `/` index of its parent directory
> - `route.tsx` inside a directory = layout wrapper for all sibling routes in that directory
> - Pathless layout routes use `_name/` prefix — they wrap child routes with auth guards/layouts **without adding a URL segment**
> - Dynamic params use `$` prefix (e.g. `rooms/$roomId.tsx` → `/rooms/:roomId`)
> - `routeTree.gen.ts` is auto-generated — **never edit it manually**
>
> **Data fetching conventions:**
> - Use `createServerFn` for all calls to the NestJS backend — runs on the TanStack Start server, not the browser
> - Wrap `createServerFn` calls with TanStack Query (`useQuery`, `useMutation`) for caching, loading, and error states
> - Route loaders (`loader:`) use `createServerFn` directly for SSR data
> - Never call the NestJS API directly from client components (no client-side `fetch` to NestJS)

```
frontend/
└── src/
    ├── routes/
    │   ├── __root.tsx                        # Document shell, global providers
    │   ├── index.tsx                         # / Homepage
    │   │
    │   ├── about.tsx                         # /about
    │   │
    │   ├── rooms/
    │   │   ├── index.tsx                     # /rooms — Room listing page
    │   │   └── $roomId.tsx                   # /rooms/:roomId — Room detail page
    │   │
    │   ├── _auth/                            # Pathless layout: auth pages wrapper
    │   │   ├── route.tsx                     # Auth layout (redirect if already logged in)
    │   │   ├── login.tsx                     # /login
    │   │   └── signup.tsx                    # /signup
    │   │
    │   ├── _guest/                           # Pathless layout: Guest-only guard
    │   │   ├── route.tsx                     # Guard: redirect to /login if not GUEST
    │   │   └── dashboard/
    │   │       ├── route.tsx                 # /dashboard layout + sidebar
    │   │       ├── index.tsx                 # /dashboard (redirect to my-bookings)
    │   │       ├── my-bookings.tsx           # /dashboard/my-bookings
    │   │       └── profile.tsx               # /dashboard/profile
    │   │
    │   └── _admin/                           # Pathless layout: Admin-only guard
    │       ├── route.tsx                     # Guard: redirect to /login if not ADMIN
    │       └── admin/
    │           ├── route.tsx                 # /admin layout + sidebar
    │           ├── index.tsx                 # /admin (redirect to overview)
    │           ├── overview.tsx              # /admin/overview
    │           ├── rooms/
    │           │   ├── index.tsx             # /admin/rooms — room list + CRUD table
    │           │   └── $roomId.edit.tsx      # /admin/rooms/:roomId/edit
    │           ├── bookings/
    │           │   ├── index.tsx             # /admin/bookings — all bookings table
    │           │   └── $bookingId.tsx        # /admin/bookings/:bookingId — detail
    │           ├── analytics.tsx             # /admin/analytics
    │           ├── reviews.tsx               # /admin/reviews
    │           └── settings.tsx              # /admin/settings
    │
    ├── routeTree.gen.ts                      # Auto-generated — DO NOT EDIT
    ├── router.tsx                            # Router config (createRouter)
    │
    ├── components/
    │   ├── booking-wizard/                   # Multi-step booking flow
    │   ├── charts/                           # Recharts wrappers
    │   ├── notifications/                    # Bell icon + toast components
    │   └── ui/                               # shadcn/ui components
    │
    ├── lib/
    │   ├── server/                           # TanStack createServerFn definitions
    │   │   ├── auth.server.ts                #   Server fns: login, signup, me, logout
    │   │   ├── rooms.server.ts               #   Server fns: list, get, availability
    │   │   ├── bookings.server.ts            #   Server fns: create, get, cancel
    │   │   ├── reviews.server.ts             #   Server fns: submit, list
    │   │   └── admin.server.ts               #   Server fns: admin-only operations
    │   ├── query-client.ts                   # TanStack Query client config
    │   ├── socket.ts                         # Socket.io client singleton
    │   └── utils.ts                          # Shared helpers
    │
    └── stores/
        ├── auth-store.ts                     # Zustand: current user + auth state
        └── booking-store.ts                  # Zustand: booking wizard state
```

---

## 5. Database Schema

### Models Overview

| Model | Key Fields |
|---|---|
| `User` | id, name, email, password (hashed), role (GUEST/ADMIN), createdAt |
| `Room` | id, name, type, description, pricePerNight, capacity, status, photos[] |
| `Booking` | id, userId, roomId, checkIn, checkOut, guests, totalPrice, status, promoCodeId |
| `Payment` | id, bookingId, paystackRef, amount, status, paidAt |
| `Review` | id, userId, roomId, bookingId, rating (1-5), comment, status (PENDING/APPROVED/REJECTED) |
| `PromoCode` | id, code, discountType (PERCENT/FIXED), discountValue, validFrom, validTo, usageLimit, usedCount |
| `Notification` | id, userId, message, type, isRead, createdAt |

### Critical Constraints

- A booking's `checkIn` must always be before `checkOut`
- Room availability queries **must use Prisma transactions** to prevent race conditions and double bookings
- A guest can only submit one review per booking, and only after booking status is `CHECKED_OUT`
- Passwords must be hashed with bcrypt before storing — never store plaintext

---

## 6. Feature Specifications

### 6.1 Public Website (No Login Required)

- [ ] Homepage: hero section, image gallery, amenities showcase, about section
- [ ] Rooms listing page: grid layout of all available room types with photos and pricing
- [ ] Individual room detail page: photos carousel, amenities list, pricing, availability, "Book Now" CTA
- [ ] "Book Now" button on every room card — if not logged in, redirect to signup/login
- [ ] Fully responsive: mobile, tablet, desktop
- [ ] Average guest rating displayed on each room card and detail page

### 6.2 Authentication

- [ ] Single unified Sign Up / Login page with role selection (Guest or Admin)
- [ ] JWT issued on login, stored in HttpOnly cookie
- [ ] Refresh token strategy (optional but recommended)
- [ ] Logout clears cookie and Zustand auth store
- [ ] Frontend route guards redirect unauthenticated users to `/login`
- [ ] Backend guards reject requests without valid JWT

### 6.3 Booking Flow

- [ ] "Book Now" → redirect to login if unauthenticated
- [ ] Multi-step booking wizard:
  - Step 1: Select check-in / check-out dates (date picker, min 1 night)
  - Step 2: Specify number of guests
  - Step 3: System shows only available rooms for selected dates
  - Step 4: Guest selects a room
  - Step 5: Review booking summary with full price breakdown
  - Step 6: Optional promo code input with real-time validation
  - Step 7: Proceed to Paystack secure payment
- [ ] On successful Paystack payment → booking saved with status `CONFIRMED`
- [ ] Booking confirmation displayed to user after payment
- [ ] PDF confirmation auto-generated and available for download

### 6.4 Guest Dashboard (`/dashboard`)

- [ ] My Bookings: list of all bookings (past, current, upcoming) with status badges
- [ ] Booking status indicators: `Confirmed`, `Checked-In`, `Checked-Out`, `Cancelled`
- [ ] View full booking details
- [ ] Download booking confirmation PDF
- [ ] Cancel booking (only allowed if check-in is more than 24 hours away)
- [ ] Profile page: update name, email, password
- [ ] Submit review after booking status is `CHECKED_OUT` (one review per booking)
- [ ] Real-time status updates via Socket.io (e.g. when admin checks guest in)

### 6.5 Admin Dashboard (`/admin`)

- [ ] **Overview page** — real-time metrics:
  - Today's check-ins and check-outs count
  - Current occupancy rate (%)
  - Today's revenue and monthly revenue
  - Total bookings count
- [ ] **Manage Rooms:**
  - Full CRUD (create, edit, delete rooms)
  - Room status toggle: `Available` / `Occupied` / `Maintenance`
  - Upload and manage room photos
- [ ] **All Bookings table:**
  - Search by guest name, date, or status
  - Filter by booking status
  - Check-in action (changes status to `CHECKED_IN`)
  - Check-out action (changes status to `CHECKED_OUT`)
  - Cancel booking with reason
  - Add internal notes to any booking
- [ ] **Reviews moderation panel:**
  - View all pending reviews
  - Approve, reject, or hide reviews
- [ ] **Settings page:** update hotel name, contact details, policies
- [ ] Real-time new booking notifications via Socket.io (no page refresh needed)

### 6.6 Real-time Notifications (Socket.io)

- [ ] New booking → instant notification appears in admin dashboard
- [ ] Check-in / check-out action → live status update pushed to the relevant guest
- [ ] Toast notifications for important events (both admin and guest)
- [ ] Notification bell icon with unread count badge
- [ ] Notifications stored in DB and marked as read when viewed

### 6.7 Reviews & Ratings

- [ ] Guest can rate 1–5 stars and write a review after `CHECKED_OUT`
- [ ] One review per booking enforced at DB and API level
- [ ] Average rating calculated and displayed on public room pages
- [ ] Admin moderation panel: approve / reject / hide reviews
- [ ] Approved reviews show: guest first name, date, star rating, comment

### 6.8 Analytics Dashboard

- [ ] Occupancy rate trend — line or area chart (Recharts)
- [ ] Monthly revenue — bar chart
- [ ] Booking trends — line graph over time
- [ ] Room type popularity — pie chart
- [ ] Date range filter for custom period analysis
- [ ] Export charts as images

### 6.9 PDF Booking Confirmation

- [ ] Auto-generated after successful payment
- [ ] "Download PDF" button on booking details page
- [ ] PDF contents:
  - Hotel logo and branding
  - Guest name and booking reference number
  - QR code for easy check-in
  - Room details, check-in/check-out dates
  - Payment breakdown and receipt number
  - Hotel contact information and cancellation policy

### 6.10 Promo Codes & Discounts

- [ ] Admin creates promo codes with:
  - Code string (e.g. `ABUJA20`, `WEEKEND50`)
  - Discount type: `PERCENTAGE` or `FIXED_AMOUNT`
  - Discount value
  - Validity period (start and end dates)
  - Total usage limit + per-user usage limit
- [ ] Guest enters promo code at checkout step
- [ ] Real-time validation: show error if invalid/expired, show discount if valid
- [ ] Price automatically adjusts in booking summary
- [ ] Admin dashboard shows promo code usage statistics

---

## 7. API Endpoints Reference

> All protected routes require `Authorization` via HttpOnly cookie (JWT).
> All endpoints are documented in Swagger at `/api/docs`.

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | None | Register new user (Guest or Admin) |
| POST | `/auth/login` | None | Login, returns JWT in cookie |
| POST | `/auth/logout` | User | Clear JWT cookie |
| GET | `/auth/me` | User | Get current user profile |

### Rooms

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/rooms` | None | List all rooms |
| GET | `/rooms/:id` | None | Get single room details |
| GET | `/rooms/available` | None | List available rooms by date range |
| POST | `/rooms` | Admin | Create a new room |
| PATCH | `/rooms/:id` | Admin | Update room details |
| DELETE | `/rooms/:id` | Admin | Delete a room |
| PATCH | `/rooms/:id/status` | Admin | Change room status |

### Bookings

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/bookings` | Guest | Create a new booking |
| GET | `/bookings/my` | Guest | Get all bookings for logged-in guest |
| GET | `/bookings/:id` | User | Get booking details |
| POST | `/bookings/:id/cancel` | Guest | Cancel a booking |
| GET | `/bookings` | Admin | Get all bookings (with filters) |
| PATCH | `/bookings/:id/check-in` | Admin | Mark booking as checked in |
| PATCH | `/bookings/:id/check-out` | Admin | Mark booking as checked out |
| PATCH | `/bookings/:id/notes` | Admin | Add internal note to booking |

### Payments (Paystack)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/payments/initialize` | Guest | Initialize Paystack transaction |
| POST | `/payments/webhook` | None* | Paystack webhook (signature verified) |
| GET | `/payments/:bookingId` | User | Get payment details for a booking |

*Paystack webhook is public but must verify Paystack HMAC signature before processing.

### Reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/reviews` | Guest | Submit a review (post checkout only) |
| GET | `/reviews/room/:roomId` | None | Get approved reviews for a room |
| GET | `/reviews/pending` | Admin | Get all reviews pending moderation |
| PATCH | `/reviews/:id/moderate` | Admin | Approve, reject, or hide a review |

### Promo Codes

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/promo-codes` | Admin | Create a new promo code |
| GET | `/promo-codes` | Admin | List all promo codes with usage stats |
| POST | `/promo-codes/validate` | Guest | Validate a promo code |
| DELETE | `/promo-codes/:id` | Admin | Delete a promo code |

### Analytics

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/analytics/overview` | Admin | Today's metrics (check-ins, revenue, occupancy) |
| GET | `/analytics/revenue` | Admin | Revenue data by date range |
| GET | `/analytics/occupancy` | Admin | Occupancy rate over time |
| GET | `/analytics/bookings` | Admin | Booking trend data |
| GET | `/analytics/rooms` | Admin | Room popularity breakdown |

---

## 8. Development Roadmap

> **Instructions for agent:** Check off tasks as they are completed (`[ ]` → `[x]`).
> Do not skip tasks. If a task is blocked, note the reason in [Known Issues & Blockers](#11-known-issues--blockers).

---

### Week 1 — Setup & Backend Foundation

**Backend**
- [x] Initialise NestJS project with TypeScript
- [x] Set up ESLint + Prettier
- [x] Update backend port to `3001` (avoids conflict with frontend on `3000`)
- [ ] Create `hotel-nova-backend/.env` and `hotel-nova-backend/.env.example`
- [ ] Set up Neon Postgres database and retrieve connection string
- [ ] Connect Prisma to Neon, define initial schema (User, Room), run first migration
- [ ] Implement `Auth` module: signup, login, JWT with HttpOnly cookies, role selection
- [ ] Implement `Rooms` module: full CRUD endpoints
- [ ] Set up Swagger at `/api/docs`
- [ ] Test all Week 1 endpoints with Postman / Thunder Client

**Frontend**
- [x] Initialise TanStack Start project with TypeScript
- [x] Set up Tailwind CSS
- [ ] Install and configure shadcn/ui (`npx shadcn@latest init`)
- [ ] Create `hotel-nova-frontend/.env` and `hotel-nova-frontend/.env.example`
- [ ] Set up `lib/query-client.ts` (TanStack Query client)
- [ ] Set up `lib/server/` folder and first `createServerFn` (e.g. `auth.server.ts`)
- [ ] Set up Zustand `auth-store.ts`

---

### Week 2 — Booking Engine & Payment Integration

- [ ] Extend Prisma schema: Booking, Payment models — run migration
- [ ] Implement `Bookings` module in NestJS with CRUD
- [ ] Implement availability query using Prisma transactions (prevent double bookings)
- [ ] Set up Paystack account and store API keys in `.env`
- [ ] Implement Paystack payment initialization endpoint
- [ ] Implement Paystack webhook handler with signature verification
- [ ] Build basic public TanStack Start pages: Homepage, Rooms listing
- [ ] Test complete booking flow from API side

---

### Week 3 — Frontend Booking Flow & Guest Dashboard

- [ ] Build unified Sign Up / Login page with role selection
- [ ] Implement protected route middleware (redirect unauthenticated users)
- [ ] Build multi-step booking wizard component with date picker
- [ ] Implement room availability fetch based on selected dates
- [ ] Build booking summary and Paystack payment UI
- [ ] Build Guest Dashboard layout with sidebar navigation
- [ ] Build My Bookings page with status badges
- [ ] Add loading skeletons and error handling to all forms

---

### Week 4 — Admin Dashboard Core

- [ ] Build Admin layout with sidebar navigation
- [ ] Build Admin overview page with metric cards
- [ ] Build Manage Rooms page with data table
- [ ] Implement room CRUD in the UI (create, edit, delete)
- [ ] Add room status toggle (Available / Occupied / Maintenance)
- [ ] Build All Bookings table with search and filter
- [ ] Implement check-in, check-out, and cancel booking actions
- [ ] Add internal notes feature to bookings

---

### Week 5 — Senior Features Part 1 (Real-time + Reviews)

- [ ] Set up Socket.io on NestJS backend (WebSocket gateway)
- [ ] Implement real-time new booking notification → pushed to admin
- [ ] Implement real-time status update → pushed to relevant guest on check-in/out
- [ ] Build notification bell icon with unread count badge (frontend)
- [ ] Extend Prisma schema: Review model — run migration
- [ ] Implement `Reviews` module (backend API)
- [ ] Build review submission form on Guest Dashboard (post checkout only)
- [ ] Display average star rating on public room pages
- [ ] Build admin review moderation panel

---

### Week 6 — Senior Features Part 2 (Analytics + PDF + Promo Codes)

- [ ] Implement `Analytics` module in NestJS
- [ ] Build Analytics Dashboard page in admin with Recharts:
  - [ ] Occupancy rate chart (line/area)
  - [ ] Monthly revenue bar chart
  - [ ] Booking trends line graph
  - [ ] Room type popularity pie chart
- [ ] Add date range filter for analytics
- [ ] Set up PDF generation library (react-pdf or pdf-lib)
- [ ] Design and implement PDF template for booking confirmation
- [ ] Add QR code generation to PDF
- [ ] Implement "Download PDF" button on booking details
- [ ] Extend Prisma schema: PromoCode model — run migration
- [ ] Implement `Promo Codes` module (backend)
- [ ] Build promo code management UI in admin dashboard
- [ ] Add promo code input to checkout flow with real-time validation

---

### Week 7 — Polish & QA

- [ ] Make entire application fully responsive (mobile, tablet, desktop)
- [ ] Implement dark mode
- [ ] Add comprehensive error handling across all API calls
- [ ] Add loading skeletons for all data-fetching states
- [ ] Write database seed script with sample data (rooms, users, bookings)
- [ ] Set up room photo upload (Cloudinary or UploadThing) *(optional)*
- [ ] Add email confirmation after booking (Resend) *(optional)*
- [ ] Validate all forms (frontend + backend DTOs)
- [ ] Full end-to-end test: complete guest flow (browse → book → pay → dashboard)
- [ ] Full end-to-end test: complete admin flow (check-in → check-out → analytics)
- [ ] Fix all bugs discovered during testing

---

### Week 8 — Deployment & Portfolio

- [ ] Deploy backend to Railway or Render
- [ ] Deploy frontend to Vercel
- [ ] Connect Neon database to deployed backend
- [ ] Configure all environment variables on deployment platforms
- [ ] Set up custom domain *(optional)*
- [ ] Test deployed application thoroughly (all features)
- [ ] Record 2-minute Loom demo video
- [ ] Take high-quality screenshots of all major pages
- [ ] Write comprehensive `README.md` with setup instructions, screenshots, tech stack, features
- [ ] Create architecture diagram (Excalidraw or draw.io)
- [ ] Write "Challenges & Solutions" section in README
- [ ] Push clean final code to GitHub (tidy commit history)
- [ ] Add project to LinkedIn and portfolio website
- [ ] Update CV with project link and description

---

## 9. Environment Variables

> Never commit `.env` files to Git. Use `.env.example` as a template.

### Backend `.env`

```env
# Database
DATABASE_URL=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=7d

# Paystack
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=

# App
PORT=3001
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend `.env` (TanStack Start / Vite)

> Vite exposes env vars to the browser only if prefixed with `VITE_`. These are public-safe values only.

```env
VITE_API_URL=http://localhost:3001
VITE_PAYSTACK_PUBLIC_KEY=
```

---

## 10. Architecture Decisions Log

> **Instructions for agent:** When a significant technical decision is made (e.g. switching a
> library, changing a pattern, adding a new dependency), log it here with a date and reason.
> This helps maintain consistency across sessions.

| Date | Decision | Reason |
|---|---|---|
| March 2026 | Using TanStack Start for frontend | Owner's preference; modern SSR framework, aligns with TanStack ecosystem (TanStack Query already in stack) |
| March 2026 | JWT stored in HttpOnly cookies (not localStorage) | Prevents XSS attacks |
| March 2026 | Prisma transactions for availability checks | Prevents race conditions / double bookings |
| March 2026 | `createServerFn` + native `fetch` instead of Axios | Idiomatic TanStack Start pattern — API calls run on the server (no CORS issues, cookies forwarded automatically, no client-side API keys exposed). Learning goal: use the framework as intended. |
| March 2026 | TanStack Query wraps all `createServerFn` calls | Provides caching, background refetch, loading/error states — avoids manual state management for server data |
| March 2026 | Backend runs on port `3001`, frontend on `3000` | Prevents port conflict in local dev. Both were defaulting to `3000`. Documented in `main.ts` and `.env`. |

---

## 11. Known Issues & Blockers

> **Instructions for agent:** Log any bugs, blockers, or unresolved questions here.
> Remove items once resolved and note how they were fixed.

| Status | Issue | Notes |
|---|---|---|
| 🟡 Pending | No issues logged yet | — |
