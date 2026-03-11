# HotelNova Frontend (Next.js App Router)

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · TanStack Query · Zustand · React Hook Form · Zod

## Route Structure (App Router)

app/
(public)/ # No auth: homepage, rooms, about
(auth)/ # Login, signup pages
dashboard/ # Guest-only (protected via middleware)
admin/ # Admin-only (protected via middleware)
api/ # Next.js Route Handlers (server-side calls to NestJS)

## Commands

npm run dev # Start dev server (port 3000)
npm run build # Production build
npm run lint # ESLint

## Conventions

- Use shadcn/ui for all UI components — don't build primitives from scratch
- All screens must be responsive across all screen sizes (mobile-first)
- Add appropriate smooth animations and transitions with motion
- TanStack Query for ALL server state — no raw fetch in client components
- Zustand only for client state (auth user, booking wizard state)
- Booking wizard state lives in stores/booking-store.ts
- Socket.io client initialized in lib/socket.ts
- Next.js Route Handlers (`app/api/**`) proxy calls to NestJS backend
- React Hook Form + Zod for ALL forms — no uncontrolled inputs, no manual validation
- Use tailwindcss for styling and make use of reusable inline utilities and components and use px every unit.
- Always use reusable components where necessary.
- Have a seperate folder for reusable components.
- Have a seperate folder for contants, icons and strings etc.
- Use Lucide icons for all icons., you don't have to create any new icon or svg if there is equivalent lucide icon.
- Always use High quality images for the website.
- Use shadcn/ui components where itis neccesary, install and use it if needed.

## Styling Rules
- ALL reusable Tailwind class combinations must be defined in `app/globals.css` 
  inside `@layer utilities` using `@apply` — never repeat the same multi-class combination 
  inline across components. If you find yourself writing the same Tailwind classes in more 
  than one place, stop and create a named utility class instead.

## Forms

- Use `react-hook-form` with `useForm()` for every form
- Use `zod` for schema validation and `@hookform/resolvers/zod` for the resolver
- Pattern:
  ```ts
  const schema = z.object({ email: z.string().email(), ... })
  const form = useForm({ resolver: zodResolver(schema) })
  ```
- Display field errors via `form.formState.errors`
- Use shadcn/ui Form components (FormField, FormItem, FormMessage) built on top of react-hook-form

## Data Fetching

- Server Components fetch data directly (no useEffect, no TanStack Query)
- Client Components use TanStack Query (`useQuery`, `useMutation`)
- All API calls from Client Components go through Next.js Route Handlers — never directly to NestJS

## Auth Rules

- Auth state managed in stores/auth-store.ts (Zustand)
- Route protection via Next.js middleware (`middleware.ts`)
- Protected routes check role before rendering
- On 401 from API → clear store and redirect to /login
- JWT stored in HttpOnly cookies only — managed server-side

## Do Not

- Do NOT store JWT in localStorage or JS variables
- Do NOT call the NestJS backend directly from client components
- Do NOT use uncontrolled inputs or manual form state — always use React Hook Form
- Do NOT use `useEffect` for data fetching — use Server Components or TanStack Query
