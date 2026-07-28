---
name: code-style-eslint
description: ESLint rules, TypeScript conventions, naming, error logging, no single-letter vars, type over interface.
---

# Code Style & ESLint

Use when **writing any code** in this project.

## TypeScript

- **`type` over `interface`** — always use `type` keyword
- **No `any`** — use `unknown` or specific types
- **No single-letter variables** — `index` not `i`, `item` not `c`, `sum` not `s`
- **No underscore-prefixed variables** — never use `_unusedVar`. If unused, REMOVE it entirely.
- **No unused variables** — remove them; don't prefix with `_`. Use `catch` without a variable if the error isn't referenced.
- **PascalCase** for types and components
- **camelCase** for variables, functions, and hooks

## ESLint

```bash
npm run lint          # ESLint check
npm run lint -- --fix # Auto-fix
npm run type-check    # tsc --noEmit
npm run check         # Both
```

- NEVER ignore ESLint violations
- Fix issues immediately, don't suppress with `// eslint-disable`

## React Imports

```tsx
// CORRECT — Direct imports only
import { useState, useEffect, FC } from 'react';

// WRONG — Never import React namespace
import React from 'react';
```

## Error Logging

```typescript
} catch (e) {
  console.error('[FunctionName] Error:', e instanceof Error ? e.message : 'Unknown error');
}
```

## Naming

```typescript
// ✅ camelCase variables
const userName = 'John';
const isActive = true;

// ✅ PascalCase types
export type JobType = { ... };

// ✅ UPPER_SNAKE_CASE constants
const MAX_PAGE_SIZE = 100;

// ❌ NEVER single-letter
items.map((item) => item.id);     // ✅
items.map((i) => i.id);           // ❌
```

## Checklist

- ✅ `type` not `interface`
- ✅ No single-letter variables
- ✅ No React namespace import
- ✅ Error messages prefixed with function name
- ✅ No `any` types
- ✅ `npm run check` passes
