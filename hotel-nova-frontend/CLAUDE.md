# HotelNova Frontend (TanStack Start)

## Stack
TanStack Start · TypeScript · Tailwind CSS · shadcn/ui · TanStack Query · Zustand

## Route Structure
app/
  (public)/        # No auth: homepage, rooms, about
  (auth)/          # Login, signup
  dashboard/       # Guest-only (protected)
  admin/           # Admin-only (protected)

## Commands
npm run dev        # Start dev server
npm run build      # Production build
npm run typecheck  # Type check

## Conventions
- Use shadcn/ui for all UI components — don't build primitives from scratch
- TanStack Query for ALL server state — no raw fetch in components
- Zustand only for client state (auth user, booking wizard state)
- Booking wizard state lives in booking-store.ts
- Socket.io client initialized in lib/socket.ts

## Auth Rules
- Auth state managed in auth-store.ts (Zustand)
- Protected routes check role before rendering
- On 401 from API → clear store and redirect to /login

## Do Not
- Do NOT store JWT in localStorage or JS variables
- Do NOT call backend directly from components — use TanStack Query hooks
