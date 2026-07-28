---
name: s3-file-handling
description: Wasabi S3 uploads, pre-signed URLs, file upload patterns in API routes using formData().
---

# S3 File Handling (Wasabi)

## Upload Flow

```typescript
// In route handler
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get('thumbnail') as File | null;

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = Date.now() + '-' + file.name;
    await uploadToS3(buffer, fileName, file.type);
    // fileName is stored in MongoDB
  }
}
```

## Pre-Signed URLs

```typescript
import { getImageUrl } from '@/lib/s3';

// Returns a pre-signed URL (1 hour expiry)
const signedUrl = await getImageUrl(fileName);
```

## S3 Client Config

```typescript
// src/lib/s3.ts
const s3Client = new S3({
  region: "eu-west-1",
  endpoint: process.env.SECRET_ENDPOINT,
  credentials: {
    accessKeyId: process.env.WASABI_ACCESS_KEY_ID!,
    secretAccessKey: process.env.WASABI_SECRET_ACCESS_KEY_ID!,
  },
  forcePathStyle: true,
});
```

## File Upload Endpoints

| Route | Form Field | Purpose |
|-------|-----------|---------|
| `createJob` | `thumbnail` | Job thumbnail |
| `updateProfile` | `profile_picture` | Profile picture |
| `messages/send` | `file` | Chat attachment |
| `createService` | `thumbnail` | Service thumbnail |
| `updateServices` | `thumbnail` | Update service thumbnail |

## Checklist

- ✅ `request.formData()` (not multer)
- ✅ `Buffer.from(await file.arrayBuffer())` for file content
- ✅ Timestamped filenames: `Date.now() + '-' + file.name`
- ✅ Pre-signed URLs for reading: `getImageUrl(fileName)`
- ✅ File stored in MongoDB by filename only, not full URL
