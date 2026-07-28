---
name: nextjs-16-conventions
description: Next.js 16 breaking changes: params as Promises, request.formData(), NextRequest, NextResponse, dynamic routes, file uploads.
---

# Next.js 16 Conventions

Use when **creating or modifying any API route or page** in this project.

## Route Handlers

```typescript
import { NextRequest, NextResponse } from 'next/server';

// Dynamic params are Promises — MUST be awaited
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // ...
}

// JSON body
export async function POST(request: NextRequest) {
  const body = await request.json();
}

// File upload (no multer needed)
export async function PUT(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('thumbnail') as File | null;
  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    // upload to S3
  }
}
```

## Key Breaking Changes from Next.js 13

- `experimental.appDir` removed — App Router is default
- Params are `Promise<{ id: string }>` — always `await`
- `next.config` is `next.config.ts` with `NextConfig` type
- `request.formData()` replaces multer
- `Response.json()` / `NextResponse.json()` for responses
- Import `NextRequest` from `next/server`, not `next/web`

## Custom Server

```js
// server.mjs — Node.js ES module, not compiled by Next.js
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";
```
