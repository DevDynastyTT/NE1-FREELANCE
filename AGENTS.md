# NE1-FREELANCE — Project Rules & Conventions

**Stack:** Next.js 16 (App Router), React 19, TypeScript 5, MongoDB/Mongoose, Socket.IO, Bootstrap 5

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

Key differences:
- Route handlers use `NextRequest` / `NextResponse` from `next/server`
- Dynamic params are Promises: `{ params }: Promise<{ id: string }>` and MUST be awaited
- File uploads use `request.formData()` (no multer needed)
- `experimental.appDir` is removed (App Router is default)
- next.config is `next.config.ts` with `NextConfig` type
- `type` keyword for all data structures (never `interface`)
<!-- END:nextjs-agent-rules -->

---

## 1. File Organization

```
src/
├── app/                        # Next.js App Router
│   ├── api/auth/               # 40+ API route handlers
│   │   ├── login/route.ts
│   │   ├── signup/route.ts
│   │   ├── jobs/               # Job endpoints
│   │   ├── messages/           # Chat endpoints
│   │   └── ...
│   ├── auth/                   # Auth pages (login, signup, profile, admin)
│   ├── jobs/                   # Job pages (list, create, [id], checkout)
│   ├── inbox/                  # Chat inbox
│   ├── about/                  # About page
│   ├── contact/                # Contact page
│   ├── admin/                  # Admin dashboard
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/                 # React components organized by feature
│   ├── GlobalNavbar.tsx
│   ├── GlobalFooter.tsx
│   ├── StarRating.tsx
│   ├── RatingsForm.tsx
│   ├── home/                   # Homepage components
│   ├── jobs/                   # Job components
│   ├── auth/                   # Auth components
│   ├── inbox/                  # Chat components
│   ├── aboutUs/                # About components
│   └── contact/                # Contact components
├── lib/                        # Backend infrastructure
│   ├── db.ts                   # MongoDB connection (cached singleton)
│   ├── s3.ts                   # Wasabi S3 helpers (upload, pre-signed URLs)
│   ├── email.ts                # Nodemailer email helpers
│   ├── auth.ts                 # Session auth helpers
│   ├── invoiceTemplate.ts      # HTML invoice template
│   └── commonPasswords.txt     # Weak password blacklist
├── models/                     # Mongoose models (12 models)
│   ├── userModel.ts
│   ├── userProfileModel.ts
│   ├── jobsModel.ts
│   ├── messagesModel.ts
│   ├── ratingsModel.ts
│   └── ...
├── types/                      # Shared TypeScript types
│   └── index.ts
├── utils/                      # Frontend utilities
│   ├── APIRoutes.ts            # All API endpoint paths
│   ├── reuseableCode.ts        # getUserSession, fetchCategories
│   ├── databaseConnection.ts   # Legacy DB connection (unused)
│   └── types.ts                # Legacy types (use src/types/ instead)
└── styles/                     # CSS/SCSS styles (flat .css files)
    ├── footer.css
    ├── navbar.css
    ├── style.css               # Homepage styles
    ├── inbox.css
    ├── jobDetails.css
    └── ...

server.mjs                      # Custom server with Socket.IO
```

**Import aliases:** `@/` maps to `./src/`

---

## 2. Code Style & ESLint

### TypeScript

- **`type` over `interface`** — always use `type` keyword for data structures
- **No `any`** — use `unknown` or specific types
- **No single-letter variables** — `index` not `i`, `item` not `c`, `sum` not `s`
- **PascalCase** for types and components, **camelCase** for variables/functions
- **No React namespace import** — always `import { useState } from 'react'`

### Running Checks

```bash
npm run lint          # ESLint
npm run build         # TypeScript + production build
```

### ESLint Rules

- NEVER ignore ESLint violations
- Fix issues immediately, don't suppress with `// eslint-disable`
- Run `npm run lint` before committing

---

## 3. React & TypeScript Rules

### React Imports — CRITICAL

```tsx
// CORRECT — Direct imports only
import { useState, useEffect, useCallback, FC } from 'react';

// WRONG — Never import React namespace
import React from 'react';
```

### Component Conventions

- All components using hooks/browser APIs MUST have `'use client'` directive
- Use `FC<Props>` for functional component typing
- Props types use `type` keyword with PascalCase
- Export default for page-level components

### State Patterns

```tsx
// Local state
const [data, setData] = useState<JobType[]>([]);
const [loading, setLoading] = useState(false);

// Session from sessionStorage
const session = getUserSession();
```

---

## 4. API Route Structure

### Route Handler Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 1. Connect to database
    await connectToDB();

    // 2. Parse request
    const body = await request.json();

    // 3. Validate inputs
    if (!body.email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // 4. Business logic

    // 5. Return response
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('[RouteName] Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

### Dynamic Route Params (Next.js 16)

```typescript
// Params are Promises — MUST be awaited
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}
```

### File Uploads

```typescript
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('thumbnail') as File | null;

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = Date.now() + '-' + file.name;
    await uploadToS3(buffer, fileName, file.type);
  }
}
```

### Error Handling in Catch Blocks

```typescript
} catch (e) {
  console.error('[FunctionName] Error:', e instanceof Error ? e.message : 'Unknown error');
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
```

---

## 5. Backend Standards

### Database Operations

```typescript
// Use Mongoose models (never raw db.collection())
import Users from '@/models/userModel';

// Use .lean() for read-only queries
const user = await Users.findOne({ email }).lean();

// String IDs with findOne (consistent pattern)
const job = await Jobs.findOne({ _id: jobID });

// Aggregation pipeline pattern
const results = await Jobs.aggregate([
  { $match: { category: 'development' } },
  { $lookup: { from: 'users', localField: 'freeLancerID', foreignField: '_id', as: 'user' } },
  { $unwind: '$user' },
]);
```

### Always call `connectToDB()` at the start of every API route.

### Cookie/Session Security

- Use `cookies()` from `next/headers` for server-side cookie access
- Never hardcode `secure: true` — derive from environment

---

## 6. Page & Component Structure

### page.tsx — THIN WRAPPER

```tsx
import MainHomeComponent from '@/components/home/Main';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
};

export default function PageName() {
  return <PageContentComponent />;
}
```

### Component Section Order

```tsx
export default function ComponentName() {
  // ============================================================================
  // 1. Hooks & State
  // ============================================================================
  const [data, setData] = useState([]);

  // ============================================================================
  // 2. Data Fetching / Effects
  // ============================================================================
  useEffect(() => { /* fetch */ }, []);

  // ============================================================================
  // 3. Event Handlers
  // ============================================================================
  const handleSubmit = () => { };

  // ============================================================================
  // 4. Render
  // ============================================================================
  return (/* JSX */);
}
```

---

## 7. Socket.IO (Custom Server)

The project uses `server.mjs` to run Next.js with Socket.IO on the same port.

### Client Connection

```tsx
import io from 'socket.io-client';
const socket = io(); // Connects to current origin
```

### Events
- `online-users` — emit `{ userID }` on connect
- `send-message` — emit `{ message, sender, receiver, senderID, receiverID, file? }`
- `typing-alert` — emit `{ senderID, receiverID }`
- `receive-message` — listen for incoming messages
- `receive-typing-alert` — listen for typing indicators

---

## 8. Environment Variables

| Variable | Purpose |
|----------|---------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MONGODB_DBNAME` | Database name |
| `NE1FREELANCE_ORIGIN` | CORS origin for dev (http://localhost:3000) |
| `NODEMAILER_API_SERVER_EMAIL` | Email for nodemailer |
| `NODEMAILER_API_SERVER_EMAIL_PASSWORD` | Email password |
| `NODEMAILER_API_SERVICE_TYPE` | Email service (e.g. hotmail) |
| `WASABI_ACCESS_KEY_ID` | Wasabi S3 access key |
| `WASABI_SECRET_ACCESS_KEY_ID` | Wasabi S3 secret key |
| `SECRET_ENDPOINT` | Wasabi S3 endpoint URL |

---

## 9. Migration Notes

This project was migrated from a two-repo setup:
- `apiServer.ne1/` — Express.js backend (now fully integrated into `src/app/api/auth/`)
- `nextjs/` — Next.js 13 frontend (now Next.js 16 with React 19)

**Key changes:**
- All API endpoints moved from Express controllers to Next.js route handlers
- `multer` replaced by `request.formData()` Web API
- `express-session` replaced by cookie-based helpers
- Socket.IO integrated into custom `server.mjs` instead of separate server
- All packages updated to latest versions
- Single source of truth for types in `src/types/`
