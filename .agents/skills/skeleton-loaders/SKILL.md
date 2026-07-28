---
name: skeleton-loaders
description: Every async component MUST use a dedicated skeleton loader. Never use generic spinners or "Loading..." text.
---

# Skeleton Loaders

## Critical Rule

Every page with async data **MUST** show a loading state. Use Bootstrap spinners or skeleton placeholders. Never leave the user staring at a blank page.

## Current Approach

This project uses Bootstrap 5, not Shadcn. For loading states:

```tsx
// ✅ ACCEPTABLE — Bootstrap spinner with context
{loading && (
  <div className="d-flex justify-content-center my-4">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
)}

// ✅ BETTER — Content-specific skeleton (future improvement)
{loading && <JobsSkeleton />}
```

## Guidelines

1. Every async operation must show loading state
2. Never use plain "Loading..." text
3. Match skeleton layout to actual content
4. Handle all three states: loading → error → success
