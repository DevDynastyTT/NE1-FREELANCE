---
name: file-organization
description: Project directory structure, where each type of file goes, import aliases.
---

# File Organization

```
├── app/                        # Next.js App Router pages
│   ├── api/auth/               # 42 API route handlers
│   ├── auth/                   # Auth pages (login, signup, profile, admin)
│   ├── jobs/                   # Job pages (list, create, [id], checkout)
│   ├── inbox/                  # Chat inbox
│   ├── about/                  # About page
│   ├── contact/                # Contact page
│   ├── admin/                  # Admin dashboard
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage
│   └── globals.css             # Global styles
├── components/                 # React components by feature
│   ├── GlobalNavbar.tsx
│   ├── GlobalFooter.tsx
│   ├── home/                   # Homepage components
│   ├── jobs/                   # Job components
│   ├── auth/                   # Auth components
│   ├── inbox/                  # Chat components
│   ├── aboutUs/                # About components
│   └── contact/                # Contact components
├── lib/                        # Backend infrastructure
│   ├── db.ts                   # MongoDB connection
│   ├── s3.ts                   # Wasabi S3 helpers
│   ├── email.ts                # Nodemailer helpers
│   ├── auth.ts                 # Session auth
│   └── invoiceTemplate.ts      # HTML invoice template
├── models/                     # Mongoose models (12)
├── types/                      # Shared TypeScript types
│   └── index.ts
├── utils/                      # Frontend utilities
│   ├── APIRoutes.ts            # API endpoint paths
│   ├── reuseableCode.ts        # getUserSession, fetchCategories
│   └── types.ts                # Legacy types
└── styles/                     # CSS/SCSS styles
    ├── footer.css
    ├── navbar.css
    ├── style.css
    └── ...

server.mjs                      # Custom server with Socket.IO
```

## Import Alias

`@/` maps to `./`

```typescript
import { connectToDB } from '@/lib/db';
import Users from '@/models/userModel';
import GlobalNavbar from '@/components/GlobalNavbar';
```

## Placement Rules

| Code Type | Location |
|-----------|----------|
| API routes | `app/api/auth/` |
| Page components | `app/` |
| React components | `components/` |
| Backend libs | `lib/` |
| Mongoose models | `models/` |
| Shared types | `types/` |
| Frontend utils | `utils/` |
| Styles | `styles/` |
| Static assets | `public/` |
