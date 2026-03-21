# HotelNova — Frontend

Next.js 16 (App Router) frontend for the HotelNova Property Management System.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Next.js 16 (App Router) | Framework, routing, server components |
| React 19 | UI library |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui | UI component library |
| TanStack Query v5 | Server state — data fetching and caching |
| Zustand v5 | Client state — auth, booking wizard |
| React Hook Form + Zod | Form handling and validation |
| Motion | Animations and transitions |
| Lucide React | Icons |
| Recharts | Analytics charts (admin dashboard) |

---

## Getting Started

### Prerequisites

- Node.js 20+
- Backend running on port 3001 (see [`hotel-nova-backend/README.md`](../hotel-nova-backend/README.md))

### Install and run

```bash
npm install
npm run dev
```

Runs on `http://localhost:3000`.

### Environment variables

Create `.env.local` in this directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Available scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## Route Structure

```
app/
├── (public)/                    # No auth required
│   ├── page.tsx                 # Home page
│   ├── rooms/page.tsx           # Browse rooms
│   ├── about/page.tsx           # About the hotel
│   ├── offers/page.tsx          # Promotions and deals
│   └── contact/page.tsx         # Contact page
│
├── (auth)/                      # Unauthenticated only
│   ├── login/page.tsx           # Guest login
│   ├── signup/page.tsx          # Guest signup
│   └── admin/
│       ├── login/page.tsx       # Admin login
│       └── signup/page.tsx      # Admin signup
│
├── dashboard/guest/             # Guest-only (middleware protected)
│   ├── page.tsx                 # Dashboard overview
│   ├── history/page.tsx         # Booking history
│   ├── profile/page.tsx         # Profile and settings
│   ├── reviews/page.tsx         # My reviews
│   └── notifications/page.tsx   # Notifications
│
├── admin/                       # Admin-only (middleware protected)
│   ├── overview/page.tsx        # Dashboard overview
│   ├── rooms/page.tsx           # Manage rooms
│   ├── bookings/page.tsx        # All bookings
│   ├── users/page.tsx           # User management
│   ├── promo-codes/page.tsx     # Promo codes
│   ├── reviews/page.tsx         # Moderate reviews
│   ├── analytics/page.tsx       # Analytics and charts
│   ├── notifications/page.tsx   # Admin notifications
│   └── settings/page.tsx        # Hotel settings
│
├── book/                        # Booking wizard
│   ├── rooms/page.tsx           # Step 1 — select room
│   ├── summary/page.tsx         # Step 2 — review booking
│   ├── payment/page.tsx         # Step 3 — Paystack payment
│   └── confirmation/page.tsx    # Step 4 — confirmation
│
└── api/                         # Next.js Route Handlers (proxy to NestJS)
    └── ...
```

---

## Component Structure

```
components/
├── home/        # Navbar, HeroSection, BookingBar, RoomCard, Footer, etc.
├── auth/        # AuthRightPanel, FormInput, PasswordInput, HotelNovaLogo
├── booking/     # DateRangePicker, AvailableRoomCard, PriceBreakdown, etc.
├── guest/       # GuestDashboardShell, GuestSidebar, GuestMobileNav, etc.
├── admin/       # AdminDashboardShell, AdminSidebar, all admin modals
├── about/       # AboutHero, OurStory, OurValues, TeamHighlight, etc.
├── rooms/       # RoomListingCard, RoomFilters, Pagination
└── offers/      # OfferCard, FeaturedOfferCard, LoyaltyBanner, etc.
```

---

## State Management

### TanStack Query — server state
All data fetched from the API goes through TanStack Query. No raw `fetch` calls inside client components.

```ts
// Example
const { data: rooms } = useQuery({
  queryKey: ['rooms'],
  queryFn: () => fetch('/api/rooms').then(r => r.json()),
});
```

### Zustand — client state

| Store | Contents |
|-------|----------|
| `stores/auth-store.ts` | Authenticated user, role |
| `stores/booking-store.ts` | Booking wizard state — dates, room, guest details, price calculation |

The booking store calculates pricing automatically:
- **Service charge:** 5% of subtotal
- **VAT:** 7.5% of subtotal
- **Total:** subtotal + service charge + VAT

Booking state is persisted to `sessionStorage` so it survives page refreshes within the wizard.

---

## Forms

Every form uses React Hook Form + Zod:

```ts
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({ resolver: zodResolver(schema) });
```

Use shadcn/ui `FormField`, `FormItem`, and `FormMessage` components for consistent error display.

---

## API Calls

Client components **never** call the NestJS backend directly. All API calls go through Next.js Route Handlers in `app/api/`:

```
Client Component → app/api/rooms/route.ts → NestJS :3001/rooms
```

This keeps the NestJS origin private and allows server-side cookie forwarding.

---

## Styling Conventions

- **Tailwind CSS v4** — utility-first styling
- **Pixel units** for spacing where precision matters
- **Reusable utilities** defined in `app/globals.css` under `@layer utilities` with `@apply` — never repeat the same multi-class combination across components
- **Font:** Plus Jakarta Sans (Google Fonts)
- **Icons:** Lucide React only — no custom SVGs unless no equivalent exists
- **Animations:** Motion library for modals, sidebars, and page transitions

---

## Key Conventions

- Server Components fetch data directly — no `useEffect`, no TanStack Query
- Client Components use TanStack Query for all data fetching
- `useEffect` is **never** used for data fetching
- JWT is stored in HttpOnly cookies — managed server-side, never in JS
- Route protection is enforced by `middleware.ts`
- All forms use React Hook Form — no uncontrolled inputs
- shadcn/ui components are used for all UI primitives
