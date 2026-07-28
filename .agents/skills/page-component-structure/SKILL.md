---
name: page-component-structure
description: page.tsx thin wrapper pattern, component section order, 'use client' directive, default exports.
---

# Page & Component Structure

## page.tsx — THIN WRAPPER

```tsx
import PageContent from '@/components/feature/PageContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title',
};

export default function PageName() {
  return <PageContent />;
}
```

## Component Section Order

```tsx
'use client'  // Required for hooks/browser APIs

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

## Rules

- `'use client'` at top for components using hooks, browser APIs, or event handlers
- Export default for page-level components
- `type` for props, `FC<Props>` for component typing
- Session from `getUserSession()` in `src/utils/reuseableCode.ts`
- Styles imported at top: `import '@/styles/page.css'`
