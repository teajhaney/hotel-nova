# Security Policies — MUST READ

This project uses ShipSecure security policies. Before writing or modifying code, you MUST read and follow every policy file that exists in this repository.

## Policy Files

Read each of these files if they exist before making changes:

### Core
- SECURITY.md — Secrets management, attack surface, enforced architecture
- AUTH.md — Token handling, session rules, password policy, roles
- API.md — Input validation, rate limiting, error handling
- ACCESSIBILITY.md — WCAG compliance, semantic HTML, keyboard navigation, screen readers

### Extended
- DATABASE.md — Query safety, access control, migrations
- ENV_VARIABLES.md — Environment variable handling, secret rotation
- DEPLOYMENT.md — Deploy pipeline, environment isolation
- INCIDENT_RESPONSE.md — Breach response, escalation procedures
- ACCESS_CONTROL.md — Role-based access, permission boundaries
- DATA_PRIVACY.md — PII handling, data retention, GDPR compliance
- PAYMENTS.md — Payment processing, PCI compliance
- FILE_UPLOADS.md — Upload validation, storage security
- RATE_LIMITING.md — Throttling, abuse prevention
- THIRD_PARTY.md — Dependency security, vendor risk
- LOGGING_PII.md — Log sanitization, PII redaction
- TESTING.md — Security test requirements
- OBSERVABILITY.md — Monitoring, alerting, audit trails
- THREAT_MODEL.md — Known threats and mitigations
- PR_CHECKLIST.md — Pre-merge security checklist
- CONTRIBUTING_SECURITY.md — Security contribution guidelines
- VULNERABILITY_REPORTING.md — Responsible disclosure process
- POLICY_INDEX.md — Index of all policies
- FULL_AUDIT_CHECKLIST.md — 100+ point security audit checklist

### Stack Presets

## Rules

1. Always check policy files before writing code — if your task touches auth, APIs, database, payments, file uploads, or any area with a policy file, read that file first.
2. Never violate a policy — if a policy says "never do X", do not do X. Flag it if unsure.
3. Secrets are never hardcoded — no API keys, tokens, passwords, or credentials in source code.
4. Validate all input — every endpoint, every form, every external data source.
5. Follow the principle of least privilege — only request the permissions you need.


# HotelNova — Monorepo Root

## Project Summary
Single-hotel Property Management System (PMS) for Hotel Nova.
Goal: production-grade, portfolio-ready fullstack app to impress employers in 2026.

## Monorepo Structure
- /frontend — TanStack Start (SSR), TypeScript, Tailwind, shadcn/ui
- /backend  — NestJS, TypeScript, JWT Auth, Prisma ORM
- /shared   — (optional) shared types/constants

## Tech Stack
| Layer      | Tech                                      |
|------------|-------------------------------------------|
| Frontend   | TanStack Start, TanStack Query, Zustand   |
| Backend    | NestJS, JWT (HttpOnly cookies), Swagger   |
| Database   | Neon Postgres (serverless) + Prisma ORM   |
| Payments   | Paystack                                  |
| Real-time  | Socket.io                                 |
| PDF        | react-pdf or pdf-lib                      |
| Charts     | Recharts                                  |
| Deploy     | Vercel (FE), Railway/Render (BE), Neon    |

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
