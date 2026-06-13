# NE1 Freelance

![NE1 Freelance](public/images/landing.png)

A full-stack freelance marketplace connecting clients with local professionals. Built with Next.js 16, React 19, MongoDB, and Socket.IO.

---

## Features

- **Job listings** — browse, search, and filter by category with batch pagination
- **Job creation** — freelancers post jobs with image uploads to Wasabi S3
- **Real-time chat** — Socket.IO powered inbox with typing indicators and message history
- **Checkout** — fake payment flow with card validation
- **Ratings & reviews** — star rating system with per-freelancer averages and review cards
- **Report system** — modal-based job reporting with categorized reasons
- **User profiles** — editable profiles with avatar, bio, and skill tags
- **Admin dashboard** — staff-only panel with user/job management and platform stats
- **Authentication** — cookie-based sessions, password reset via email

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Database | MongoDB via Mongoose |
| Real-time | Socket.IO (custom `server.mjs`) |
| Storage | Wasabi S3 (AWS SDK v3) |
| Email | Nodemailer |
| Auth | Cookie sessions + bcrypt |
| Language | TypeScript 5 |

---

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- MongoDB Atlas cluster (or local MongoDB)
- Wasabi S3 bucket
- SMTP email account

### Install dependencies

```bash
bun install
# or
npm install
```

### Environment variables

Create a `.env.local` file at the project root:

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DBNAME=ne1-freelance

NODEMAILER_API_SERVER_EMAIL=your@email.com
NODEMAILER_API_SERVER_EMAIL_PASSWORD=your-password
NODEMAILER_API_SERVICE_TYPE=hotmail

WASABI_ACCESS_KEY_ID=...
WASABI_SECRET_ACCESS_KEY_ID=...
SECRET_ENDPOINT=https://s3.wasabisys.com

NE1FREELANCE_ORIGIN=http://localhost:3000
```

### Development

```bash
bun dev
# or
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

> The dev server uses a custom `server.mjs` that runs Next.js and Socket.IO on the same port.

### Quality checks

```bash
bun check          # type-check + lint + build
bun run type-check # TypeScript only
bun run lint       # ESLint only
bun run build      # Production build only
```

---

## Project Structure

```
src/
├── app/
│   ├── api/auth/          # 40+ API route handlers
│   ├── jobs/              # Job listing, detail, create, checkout pages
│   ├── inbox/             # Chat inbox and conversation pages
│   ├── auth/              # Login, signup, profile, admin pages
│   ├── about/
│   ├── contact/
│   └── admin/
├── components/
│   ├── jobs/              # Job cards, details, checkout, report form
│   ├── inbox/             # Chat box, message form, navigation
│   ├── auth/              # Login, signup, profile, admin components
│   ├── home/              # Header, services banner, reassurance
│   └── ui/                # shadcn/ui primitives + Pagination
├── lib/
│   ├── db.ts              # MongoDB singleton connection
│   ├── s3.ts              # Wasabi S3 upload + pre-signed URLs
│   ├── email.ts           # Nodemailer helpers
│   └── auth.ts            # Session cookie helpers
├── models/                # Mongoose models (12 models)
├── types/                 # Shared TypeScript types
└── utils/
    ├── APIRoutes.ts        # All API endpoint constants
    └── reuseableCode.ts   # getUserSession, fetchCategories
```

---

## Key Conventions

- **Route handlers** use `NextRequest` / `NextResponse` from `next/server`
- **Dynamic params** are Promises and must be awaited: `const { id } = await params`
- **File uploads** use `request.formData()` — no multer
- **`type` over `interface`** throughout — never use `interface`
- **No `any`** — use `unknown` or specific types
- **No single-letter variables**
- All client components declare `'use client'` at the top

---

## Scripts

| Command | Description |
|---|---|
| `bun dev` | Start dev server with Socket.IO |
| `bun run build` | Production build |
| `bun run start` | Start production server |
| `bun check` | Type-check + lint + build |
| `bun run lint` | ESLint |
| `bun run type-check` | TypeScript (`tsc --noEmit`) |
| `bun run seed` | Seed the database |
