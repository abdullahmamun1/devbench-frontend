# DevBench Frontend

Web app for DevBench, a developer assessment platform. Companies build coding, MCQ and written problems, invite candidates to timed assessments, and score the results. Candidates take exams in the browser. Admins oversee the whole platform.

| | |
|---|---|
| Live site | _add after deployment_ |
| Backend API | https://devbench-backend.vercel.app/ |
| Backend repo | https://github.com/abdullahmamun1/devbench-backend-api |

## Features

**Everyone**
- Marketing site: home, features, pricing with a credit calculator, about, FAQ and contact form
- Register with email OTP verification, login, Google Sign-In, forgot and reset password
- One-click demo login for every role
- Light and dark mode, responsive down to 375px, keyboard and screen reader friendly

**Company owner, assessment creator and evaluator**
- Dashboard with stats and recent activity
- Problem bank with a three step wizard (CODING with test cases, MCQ with options, WRITTEN). The create draft survives a page refresh
- Assessments: create, edit, publish, close, and attach many problems at once
- Invite candidates by email, resend or revoke invitations
- Team management with role invitations (owner)
- Billing: buy credits through Stripe Checkout, payment history, credit ledger
- Evaluation queue: review and score coding and written answers, with feedback

**Candidate**
- Dashboard with invitations, active attempts and results
- Accept an invitation by link, then take a timed exam with a code editor (Monaco), autosave and a countdown
- Results page with scores and evaluator feedback

**Admin**
- Platform stats and monthly trend charts
- Companies, candidates, payments and audit logs, with search, filters and pagination
- Suspend, reactivate or delete accounts, and adjust company credits with a reason

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19 with the React Compiler, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui on Base UI, next-themes |
| Server state | TanStack Query |
| Client state | Zustand (problem wizard and its persisted draft) |
| Forms | TanStack Form with Zod |
| HTTP | ofetch client with automatic refresh-token retry |
| Charts | Recharts (loaded on demand) |
| Editor | Monaco Editor (loaded on demand) |
| Notifications | Sonner |
| Tooling | Biome, Bun |

### How it is built

- **Server and client split:** pages, layouts and metadata are server components. Interactive parts are small client components.
- **Route guard:** `src/proxy.ts` redirects by role before a page renders, and `RoleGuard` backs it up on the client.
- **API proxy:** `/api/v1/*` is rewritten to the backend (`next.config.ts`), so the browser only talks to one origin and auth cookies stay first party.
- **URL state:** search, filters, tabs and pages live in the query string through `useUrlState`, so refresh, back and shared links all work.
- **Loading and errors:** each dashboard area has `loading.tsx` and `error.tsx`, plus custom `not-found` pages and a global error page.
- **SEO:** per page metadata, Open Graph image, `robots.txt` and `sitemap.xml`.

## Getting started

### Prerequisites

- [Bun](https://bun.sh) (or Node.js 20+ with npm)
- The [backend](https://github.com/abdullahmamun1/devbench-back) running locally or deployed

### Install and run

```bash
git clone https://github.com/abdullahmamun1/devbench-frontend.git
cd devbench-frontend
bun install
cp .env.example .env.local     # then fill in the values
bun dev                        # http://localhost:3000
```

```bash
bun run build     # production build
bun run start     # serve the build
bun run lint      # Biome check
bun run format
```

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | Path the browser calls. Keep it `/api/v1` |
| `BACKEND_URL` | Backend origin used by the rewrite, for example `http://localhost:5000` |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this site. Used for metadata, sitemap and Open Graph |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth client ID (same as the backend one) |
| `NEXT_PUBLIC_CREDIT_PRICE_CENTS` | Price of one credit in cents. Must equal the backend `CREDIT_PRICE_IN_CENTS` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Address shown on the contact page |

### Run the whole project locally

1. Start the backend (`npm run dev` in `devbench-back`) and, for payments, `stripe listen --forward-to localhost:5000/api/v1/payments/webhook`.
2. Load demo data with `npm run seed:demo` in the backend.
3. Start this app with `bun dev`.

## Demo accounts

The login page has one-click buttons for the first five. The rest are for testing specific cases.

| Role | Email | Password |
|---|---|---|
| Admin | admin@devbench.com | Admin@123 |
| Company owner | owner@acme.com | Owner@123 |
| Assessment creator | creator@acme.com | Creator@123 |
| Evaluator | evaluator@acme.com | Evaluator@123 |
| Candidate | candidate@test.com | Candidate@123 |
| Other company (data isolation) | owner@globex.example | Demo@1234 |
| Suspended company | owner@initech.example | Demo@1234 |
| Other demo candidates | `@demo.example` | Demo@1234 |

Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Project structure

```
src/
├── app/
│   ├── (public)/          marketing pages, authentication, invitation accept
│   ├── (dashboard)/       admin, company and candidate areas
│   ├── attempt/[id]/      full screen exam
│   └── layout, error, not-found, robots, sitemap, icons
├── api/                   one file per backend module
├── hooks/                 TanStack Query hooks, useUrlState, auth and role hooks
├── components/
│   ├── ui/                shadcn components
│   ├── shared/            DataTable, EmptyState, ErrorState, FilterTabs,
│   │                      SearchInput, StatusBadge, ConfirmDialog, ...
│   ├── layout/            headers, footers, dashboard shell, sidebar
│   └── modules/           feature components (admin, assessments, billing,
│                          candidate, evaluations, exam, invitations,
│                          marketing, problems, ...)
├── store/                 Zustand stores
├── validation/            Zod schemas
├── types/                 shared TypeScript types
├── constants/  routes/  utils/  lib/  providers/
└── proxy.ts               role based route guard
```

## Deployment

1. Import the repo into Vercel.
2. Add the environment variables above. `BACKEND_URL` is the deployed API origin and `NEXT_PUBLIC_SITE_URL` is this site's URL.
3. On the backend, set `APP_URL` to this site's URL and `NODE_ENV=production`.
4. Redeploy, then log in with a demo account and buy credits with the Stripe test card to confirm cookies, the proxy and the webhook all work.

## Known gaps

- There is no automated test suite. The app was checked with a written manual walkthrough covering every role.