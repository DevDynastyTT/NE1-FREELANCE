---
name: api-route-structure
description: API route handler pattern with connectToDB, try/catch, validated inputs, proper status codes.
---

# API Route Structure

Use when **creating or modifying API routes** in `src/app/api/auth/`.

## Required Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { connectToDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    // 1. Connect to database — ALWAYS first
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
  } catch (e) {
    console.error('[RouteName] Error:', e instanceof Error ? e.message : 'Unknown error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
```

## Dynamic Routes

```typescript
// Params are Promises — MUST await
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
}
```

## File Uploads

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

## Checklist

- ✅ `connectToDB()` called at start
- ✅ try/catch with proper error logging
- ✅ Input validation before business logic
- ✅ Proper HTTP status codes (200, 201, 400, 404, 500)
- ✅ `console.error('[RouteName] Error:', ...)` in catch blocks
- ✅ Params awaited (Promise pattern)
