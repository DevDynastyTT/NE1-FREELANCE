---
name: react-typescript-rules
description: React imports, TypeScript discipline, state management, component typing, 'use client' directive.
---

# React & TypeScript Rules

## React Imports

```tsx
// ✅ CORRECT
import { useState, useEffect, useCallback, FC } from 'react';

// ❌ WRONG
import React from 'react';
```

## TypeScript

- `type` over `interface` — always
- No `any` — use `unknown` or specific types
- PascalCase for types and components
- camelCase for variables/functions

## Client Components

```tsx
'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MyComponent() {
  const router = useRouter();
  const [data, setData] = useState<Item[]>([]);
  // ...
}
```

## State Patterns

```tsx
const [data, setData] = useState<JobType[]>([]);
const [loading, setLoading] = useState(false);

// Session from sessionStorage
const session = getUserSession();
```

## Component Typing

```tsx
import { FC } from 'react';

type MyProps = {
  title: string;
  onClose: () => void;
};

const MyComponent: FC<MyProps> = ({ title, onClose }) => { ... };
```

## Next.js Navigation

```tsx
// App Router — use next/navigation
import { useRouter, useParams, useSearchParams } from 'next/navigation';
// NOT next/router (Pages Router)
```

## No Single-Letter Variables

```tsx
// ✅ CORRECT
items.map((item) => <Row key={item.id} item={item} />);
const total = items.reduce((sum, item) => sum + item.price, 0);

// ❌ WRONG
items.map((i) => <Row key={i.id} item={i} />);
const total = items.reduce((s, c) => s + c.price, 0);
```
