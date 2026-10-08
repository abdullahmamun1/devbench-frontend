# DevBench Frontend

Next.js frontend for DevBench, a developer assessment platform. Hiring teams build coding, multiple-choice and written assessments and invite candidates. Candidates take timed assessments in a focused exam screen. Admins oversee the platform.


## Live links

| | |
|---|---|
| Frontend | _added after deployment_ |
| Backend API | _added after deployment_ |
## Features

- **Three portals** with their own layout and navigation: company (owner, assessment creator, evaluator), candidate and admin.
- **One-click demo login** for every role on the login page.
- **Problem bank** with a three-step wizard for coding, multiple-choice and written problems.
- **Assessments** with problem attachment, publish and close, email invitations (resend, revoke) and a ranked results view.
- **Exam screen** with a server-synced countdown, Monaco code editor, autosave, question navigator and automatic submit at the deadline.
- **Evaluation queue** where evaluators score coding and written answers.
- **Billing** with Stripe Checkout in test mode, plus payment and credit history, and success and cancel pages.
- **Admin tools**: platform stats and trend charts, companies, candidates, suspend and reactivate, credit adjustments and a filterable audit log.
- **Team management** for owners: invite assessment creators and evaluators.
- **Public site**: home, features, pricing with a credit calculator, about, FAQ and contact.
- Dark mode, responsive layouts, skip link and keyboard-friendly forms.

## Tech stack

| Area | Choice |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, shadcn/ui on Base UI primitives |
| Server state | TanStack Query |
| Client state | Zustand (problem wizard) |
| Forms | TanStack Form with Zod |
| HTTP | ofetch with automatic token refresh |
| Editor | Monaco (`@monaco-editor/react`), loaded on demand |
| Charts | Recharts, loaded on demand |
| Auth | httpOnly cookies from the API, Google Sign-In |
| Tooling | Biome, Bun |

## Architecture

- **Rendering.** Public pages (home, pricing, FAQ and so on) are static and carry route metadata. Dashboards and the exam are client-rendered, behind `AuthGuard` and `RoleGuard`.
- **Route protection.** `src/proxy.ts` reads the access token cookie and redirects before a page loads: signed-out users go to `/login?redirect=...`, and users with the wrong role go to their own home. The client guards remain as a second layer.
- **API through the same origin.** `next.config.ts` rewrites `/api/v1/*` to the backend, so the browser talks to one domain and cookies are first party.
- **Server and client split.** Pages and layouts are server components. Client components hold hooks, forms and interactivity.
- **URL state.** Filters, search, tabs and pagination live in the query string through `useUrlState`, so views can be shared and survive reloads.
- **Errors and loading.** Every data route has a `loading.tsx` skeleton, and route groups have an `error.tsx`. Tables show a retry state when a request fails, instead of an empty list.

## Roles and routes

| Area | Path | Who |
|---|---|---|
| Public | `/`, `/features`, `/pricing`, `/about`, `/faq`, `/contact` | Everyone |
| Auth | `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password` | Signed-out users |
| Invitations | `/invitations/accept/[token]`, `/team/accept/[token]` | Invited people |
| Company | `/company`, `/company/problems`, `/company/assessments`, `/company/evaluations`, `/company/profile` | Owner, creator, evaluator |
| Company (owner only) | `/company/team`, `/company/billing` (with `/success` and `/cancel`) | Owner |
| Candidate | `/candidate`, `/candidate/invitations`, `/candidate/attempts`, `/candidate/profile` | Candidate |
| Exam | `/attempt/[id]` | Candidate |
| Admin | `/admin`, `/admin/companies`, `/admin/candidates`, `/admin/audit-logs` | Admin |

## Getting started

### Prerequisites

- [Bun](https://bun.sh) 1.x (npm or pnpm also work)
- The backend running locally. See its README.

### Install and run

```bash
bun install
cp .env.example .env.local
bun run dev
```

Open <http://localhost:3000>.

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | API base used by the browser. `/api/v1` uses the rewrite |
| `BACKEND_URL` | Backend origin the rewrite forwards to |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this site, for canonical links, sitemap and Open Graph |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google sign-in. Leave empty to hide the Google button |
| `NEXT_PUBLIC_CREDIT_PRICE_CENTS` | Credit price shown on the site. Must equal `CREDIT_PRICE_IN_CENTS` in the backend |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional address shown on the contact page |

### Scripts

| Command | Purpose |
|---|---|
| `bun run dev` | Development server |
| `bun run build` | Production build |
| `bun run start` | Serve the production build |
| `bun run lint` | Biome check |
| `bun run format` | Biome format |

## Demo accounts

Use the buttons on `/login`, or sign in manually:

| Role | Email | Password |
|---|---|---|
| Admin | admin@devbench.com | Admin@123 |
| Company owner | owner@acme.com | Owner@123 |
| Assessment creator | creator@acme.com | Creator@123 |
| Evaluator | evaluator@acme.com | Evaluator@123 |
| Candidate | candidate@test.com | Candidate@123 |

## Testing payments

Stripe runs in test mode. On the Stripe page use card `4242 4242 4242 4242`, any future expiry and any CVC. Credits arrive after Stripe's webhook reaches the backend, so run the webhook forwarder locally (see the backend README).

## Project structure

```
src/
  app/            routes: (public), (dashboard), attempt, sitemap, robots
  components/
    ui/           shadcn components
    shared/       DataTable, EmptyState, ErrorState, ConfirmDialog, ...
    modules/      feature components: admin, assessments, billing, candidate,
                  company, evaluations, exam, marketing, problems
    layout/       public header and footer
    dashboard/    shell, sidebar, user menu
    form/         auth and contact forms
  api/            typed API calls
  hooks/          TanStack Query hooks and small utilities
  types/          shared TypeScript types
  validation/     Zod schemas
  constants/      site, roles, marketing copy, demo accounts
  routes/         sidebar definitions per role
  store/          Zustand stores
  providers/      theme, query, tooltip, Google
  proxy.ts        route protection
```

## Deployment

Deploy on Vercel. Set the variables above, point `BACKEND_URL` at the deployed API, and set the backend's `APP_URL` to the deployed frontend URL.