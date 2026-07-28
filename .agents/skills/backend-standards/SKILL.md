---
name: backend-standards
description: Mongoose models, database operations, aggregation patterns, Wasabi S3, nodemailer, error handling.
---

# Backend Standards

Use for **all backend database operations** in `src/app/api/auth/` and `src/lib/`.

## Mongoose Models

```typescript
import Users from '@/models/userModel';
import Jobs from '@/models/jobsModel';

// Use .lean() for read-only queries
const user = await Users.findOne({ email }).lean();

// String IDs with findOne
const job = await Jobs.findOne({ _id: jobID });

// Aggregation pipeline
const results = await Jobs.aggregate([
  { $match: { category: 'development' } },
  { $lookup: { from: 'users', localField: 'freeLancerID', foreignField: '_id', as: 'user' } },
  { $unwind: '$user' },
]);
```

## Models (12 models)

| Model | Collection | Key Fields |
|-------|-----------|------------|
| Users | `users` | username, email, password, isStaff, isActive, dateJoined |
| userProfiles | `userProfiles` | userID, profilePicture, bio, creditCard |
| Jobs | `Jobs` | freeLancerID, title, description, thumbnail, price, category |
| JobCategories | `JobCategories` | name |
| Messages | `Messages` | chatID, sender, senderID, receiver, receiverID, content, file, sentAt |
| Ratings | `Ratings` | jobID, freeLancerID, userID, ratings, feedback, date |
| Invoice | `Invoice` | clientID, freeLancerID, transactionID, date, paymentDetails |
| CreditCard | `creditcard` | userID, cardNumber, expiryDate, securityCode, firstName, lastName |
| AboutUs | `AboutUs` | information, update |
| Contact | `Contact` | name, email, message |
| ReportJob | `ReportJob` | jobID, jobTitle, userID, freelancerID, reason, reportCategory |
| Services | `Services` | title, description, thumbnail |

## Wasabi S3 (`src/lib/s3.ts`)

```typescript
import { getImageUrl, uploadToS3 } from '@/lib/s3';

// Pre-signed URL (1 hour expiry)
const url = await getImageUrl(fileName);

// Upload file
const fileName = await uploadToS3(buffer, 'timestamp-filename.jpg', 'image/jpeg');
```

## Email (`src/lib/email.ts`)

```typescript
import { sendContactEmail, sendMessageNotification, sendInvoiceEmail } from '@/lib/email';
```

## Error Handling

```typescript
try {
  const data = await Model.findOne({ _id: id });
  if (!data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ data }, { status: 200 });
} catch (e) {
  console.error('[FunctionName] Error:', e instanceof Error ? e.message : 'Unknown error');
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}
```

## Checklist

- ✅ Mongoose models used (never raw `db.collection()`)
- ✅ `.lean()` for read-only queries
- ✅ `connectToDB()` at route start
- ✅ Error messages prefixed with function name
- ✅ Proper HTTP status codes
