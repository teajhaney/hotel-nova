# HotelNova — Monorepo Root

## Project Summary
Single-hotel Property Management System (PMS) for Hotel Nova
Goal: production-grade, portfolio-ready fullstack app to impress employers in 2026.

## Monorepo Structure
- /hotel-nova-frontend — Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- /hotel-nova-backend  — NestJS, TypeScript, JWT Auth, Prisma ORM
- /shared              — (optional) shared types/constants

## Tech Stack
| Layer      | Tech                                                        |
|------------|-------------------------------------------------------------|
| Frontend   | Next.js 16 (App Router), React 19, TanStack Query, Zustand |
| Forms      | React Hook Form + Zod + @hookform/resolvers                 |
| Backend    | NestJS, JWT (HttpOnly cookies), Swagger                     |
| Database   | Neon Postgres (serverless) + Prisma ORM                     |
| Payments   | Paystack                                                    |
| Real-time  | Socket.io                                                   |
| PDF        | react-pdf or pdf-lib                                        |
| Charts     | Recharts                                                    |
| Deploy     | Vercel (FE), Railway/Render (BE), Neon                      |

## User Roles
- Guest — can browse, book rooms, manage own bookings
- Admin — full management dashboard

## Auth Rules
- Single login/signup page, role selected at registration
- JWT stored in HttpOnly cookies (NEVER localStorage)
- Route guards enforce role-based access

## Key Business Rules
- No double bookings — use Prisma transactions for availability logic
- Guests can only review after check-out
- Promo codes have usage limits and validity periods

## Do Not
- Do NOT use localStorage for auth tokens
- Do NOT create multi-tenant logic — this is single-hotel only
- Do NOT mix frontend and backend code
