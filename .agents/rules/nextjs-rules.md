---
description: Senior Software Engineering Rules for Next.js Projects - Strict engineering guidelines for code quality, maintainability, and security
globs:
  - '**/*.ts'
  - '**/*.tsx'
  - '**/*.js'
  - '**/*.jsx'
  - '**/next.config.*'
  - '**/package.json'
alwaysApply: true
---

# Senior Software Engineering Rules for Next.js Projects

This document provides strict engineering guidelines to ensure code quality, maintainability, and security for Next.js projects.  
All contributors should adhere to the following rules, which are enforced throughout the codebase.

## Project Context: Evolution One CMS

**System Overview:**

- **Purpose**: Casino Management System for managing gaming operations, financial reporting, and player tracking
- **Technology Stack**: Next.js 15+, TypeScript, MongoDB with Mongoose, Tailwind CSS, Zustand, Bun runtime

**Architecture**: Service-oriented OOP — routes and hooks are thin; domain logic in `app/api/lib/services/` (backend) and `lib/services/` (frontend). See [`Documentation/architecture/OOP-ARCHITECTURE.md`](../../Documentation/architecture/OOP-ARCHITECTURE.md).
- **Key Features**: Real-time machine monitoring, financial analytics, collection management, multi-licencee support
- **Performance Targets**: 7d queries <10s, 30d queries <15s

**Critical Performance Requirements:**

- All `Meters.aggregate()` calls MUST use `.cursor({ batchSize: 1000 })` instead of `.exec()`
- Use `location` field directly from Meters collection instead of expensive `$lookup` operations
- Eliminate N+1 query patterns with batch queries
- Handle per-location gaming day offsets with global aggregation + in-memory filtering

**Key Database Models:**

- `Meters` - Financial metrics source (has `location` field for direct access)
- `Machines` - Primary UI data source
- `GamingLocations` - Location management with `gameDayOffset` field
- All dates stored in UTC, displayed in Trinidad time (UTC-4)

**See [`Documentation/PROJECT_GUIDE.md`](../../Documentation/PROJECT_GUIDE.md) for complete project documentation.**

---

## 2. React Imports & Hook Usage

**CRITICAL**: Never import the React namespace itself.

**Rules:**

- ❌ **NEVER** use `import React from 'react'` or `import * as React from 'react'`
- ❌ **NEVER** use `React.useState`, `React.useEffect`, `React.FC`, etc.
- ✅ **ALWAYS** import hooks and types directly: `import { useState, useEffect } from 'react'`
- ✅ **ALWAYS** import types directly: `import { FC, ChangeEvent, ReactNode } from 'react'`

**Correct patterns:**

```typescript
// ✅ CORRECT - Direct named imports
import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  FC,
  ChangeEvent,
  ReactNode,
  ElementRef,
  ComponentPropsWithoutRef,
} from 'react';

// ❌ INCORRECT - React namespace
import React from 'react';
import * as React from 'react';
const [state, setState] = React.useState(); // Never do this
```

**Common hooks to import directly:**

- Hooks: `useState`, `useEffect`, `useCallback`, `useMemo`, `useRef`, `useContext`, `useReducer`, `useLayoutEffect`, `useImperativeHandle`, `forwardRef`, `memo`, `Children`, `createContext`, `createElement`, `Fragment`
- Types: `FC`, `FunctionComponent`, `Dispatch`, `SetStateAction`, `ChangeEvent`, `MouseEvent`, `KeyboardEvent`, `FormEvent`, `FocusEvent`, `RefObject`, `MutableRefObject`, `ReactElement`, `ReactNode`, `PropsWithChildren`, `DetailedHTMLProps`, `HTMLAttributes`, `InputHTMLAttributes`, `ButtonHTMLAttributes`, `ElementRef`, `ComponentPropsWithoutRef`, `ComponentProps`, `CSSProperties`, `ErrorInfo`, `DragEvent`, `SyntheticEvent`, `JSX`

**Legacy cleanup scripts** (if needed):

- `scripts/fix-all-react-usage.ts` - Replaces all `React.` usages with direct imports
- `scripts/find-all-react-usage.ts` - Finds all remaining `React.` patterns
- `scripts/remove-all-unused-react.ts` - Removes unused `import * as React`

---

## 3. TypeScript Discipline & Types Organization

- **All type definitions must reside in the appropriate types directories:**
  - **Shared types** (used across frontend and backend) should be in [`shared/types/`](mdc:shared/types)
  - Application-wide types should be in [`types/`](mdc:types)
  - Component or library-specific types should be in [`lib/types/`](mdc:lib/types)
  - Do not define types or interfaces directly in component, helper, or utility files.
- **Prefer `type` over `interface`** for consistency across the codebase.
- **No `any` allowed** - Create appropriate type definitions for all variables and functions.
- **No underscore prefixes allowed** - Never prefix variables or functions with underscores (e.g., `_variable`, `_function`). If a parameter is unused, either use it or remove it entirely.
- **Always check dependencies before deleting types or functions** - Use `grep_search` to verify usage before removal.
- **Avoid type duplication** - Import and re-export from shared types instead of redefining. Any type used in both frontend and backend MUST be defined in [`shared/types/`](mdc:shared/types).
- **Type Explicitness**: Avoid vague types like `Record<string, any>` or `Record<string, number>` for core domain data. Use explicit types or arrays of objects (e.g., `Denomination[]` instead of `DenominationBreakdown`) to make the code easier to read for all developers.
- Always import types from their respective type files - avoid redefining types.
- Ensure type exports are properly named and documented.
- **Handle type conflicts properly** - When accessing properties that may not exist in a type, use proper fallback logic (e.g., `property || fallbackValue`).

**Shared Types Structure:**

- `shared/types/database.ts` - Database-related types
- `shared/types/entities.ts` - Core entity types
- `shared/types/api.ts` - API request/response types
- `shared/types/common.ts` - Common utility types
- `shared/types/auth.ts` - Authentication types
- `shared/types/analytics.ts` - Analytics and dashboard types
- `shared/types/index.ts` - Central export point for all shared types

**References:**

- `shared/types/` - Shared types across frontend and backend
- `types/` - Application-wide types
- `lib/types/` - Component or library-specific types

---

## 3. ESLint & Code Style

- **Never ignore ESLint rule violations.**
- Address all ESLint warnings and errors immediately.
- Run `bun lint` regularly to catch and fix style issues.
- Follow the established code style in the existing files for consistency.
- Use ESLint's auto-fix feature when possible: `bun lint --fix`.

**Reference:**

- `eslint.config.mjs` - ESLint configuration

---

## 4. File Organization & Separation of Concerns

- **Keep all `page.tsx` and component files lean.**
  - Offload complex logic into helper functions and utilities.
- **API-related logic should reside in [`lib/helpers/`](mdc:lib/helpers) or specific feature directories.**
- **Shared utilities should reside in [`lib/utils/`](mdc:lib/utils) or [`utils/`](mdc:utils).**
- **Context providers should be in [`lib/contexts/`](mdc:lib/contexts) or [`context/`](mdc:context).**
- **Feature-specific code should be organized within their related directories** in `lib/` (e.g., `lib/chat/`, `lib/profile/`).
- Do not mix API logic with UI or utility logic.
- **Create reusable UI components** in `components/ui/` for common patterns (e.g., `FinancialMetricsCards`). This folder is commonly for library components so only create components if the library doesn't have.

**Folder Structure Best Practices:**

- **Shared code** → `shared/` (types, utilities, constants)
- **Frontend-specific** → `lib/` (helpers, utils, contexts, types)
- **Backend-specific** → `app/api/` (routes, models, helpers)
- **Components** → `components/` (UI components, pages)
- **UI Components** → `components/ui/` (reusable UI components)
- **Feature modules** → `lib/[feature]/` (e.g., `lib/chat/`, `lib/auth/`)

**References:**

- `shared/` - Shared code (types, utilities, constants)
- `lib/helpers/` - API-related logic and helpers
- `lib/utils/` - Shared utilities
- `components/` - UI components and pages
- `components/ui/` - Reusable UI components
- `app/` - Next.js app directory structure

---

## 4.1. API Route Structure - CRITICAL REQUIREMENTS

**MANDATORY**: All API routes must follow this exact structure pattern.

### File Structure Template

```typescript
/**
 * [Route Name] API Route
 *
 * This route handles [brief description].
 * It supports:
 * - Feature 1
 * - Feature 2
 *
 * @module app/api/[path]/route
 */

// Imports organized by source
import { helper1, helper2 } from '@/app/api/lib/helpers/[feature]';
import { type Type1, type Type2 } from '@/app/api/lib/types';
import { NextRequest, NextResponse } from 'next/server';

/**
 * [Small utility function if route-specific]
 */
function createEmptyResponse(...) {
  // Small helper functions can stay in route file
}

/**
 * Main GET handler for [route name]
 *
 * Flow:
 * 1. Parse and validate request parameters
 * 2. Authenticate user and check permissions
 * 3. [Step 3 description]
 * 4. [Step 4 description]
 * ...
 */
export async function GET(req: NextRequest) {
  const startTime = Date.now(); // Performance tracking

  try {
    // ============================================================================
    // STEP 1: Parse and validate request parameters
    // ============================================================================
    const { searchParams } = new URL(req.url);
    const params = parseParams(searchParams);

    // ============================================================================
    // STEP 2: Connect to database and authenticate user
    // ============================================================================
    const db = await connectDB();
    const user = await getUserFromServer();

    // ============================================================================
    // STEP 3: [Next step description]
    // ============================================================================
    // Implementation

    // Continue with numbered steps...

    return NextResponse.json(response);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Server Error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
```

### Requirements

1. **File-Level JSDoc**: Must describe route purpose and features
2. **Step-by-Step Comments**: Use `// ============================================================================` separators
3. **Numbered Steps**: Each major operation must be a numbered step
4. **Flow Documentation**: Document the flow in function JSDoc before implementation
5. **Helper Extraction**: Extract complex logic to `app/api/lib/helpers/[feature].ts`
6. **Performance Tracking**: Track execution time for potentially slow operations
7. **Error Handling**: Proper try/catch with appropriate HTTP status codes

### Helper Function Extraction Rules

**Extract to `app/api/lib/helpers/` when:**

- Function is longer than 20-30 lines
- Function contains complex business logic
- Function is reusable across multiple routes
- Function performs database operations
- Function contains data transformation logic

**Keep in route file when:**

- Function is route-specific and very small (< 10 lines)
- Function is a simple response builder
- Function is only used once in the route

### File Length Guidelines

- **Maximum route file length**: ~400-500 lines
- **If route exceeds limit**: Extract more helper functions
- **Helper files**: Can be longer but should be organized by functionality

**Reference Example:**

- `app/api/reports/meters/route.ts` - Exemplary API route structure

---

## 4.2. Page.tsx Structure - CRITICAL REQUIREMENTS

**MANDATORY**: All `page.tsx` files must be lean wrappers that delegate to components.

### File Structure Template

```typescript
/**
 * [Page Name] Page
 * [Brief description of the page]
 *
 * Features:
 * - Feature 1
 * - Feature 2
 */
export default function PageName() {
  return (
    <ProtectedRoute requiredPage="page-name">
      <PageErrorBoundary>
        <PageContent />
      </PageErrorBoundary>
    </ProtectedRoute>
  );
}

/**
 * [Page Name] Content Component
 * Handles all state management and data fetching for the page
 */
function PageContent() {
  // ============================================================================
  // Hooks & State
  // ============================================================================
  const [state, setState] = useState();

  // ============================================================================
  // Data Fetching
  // ============================================================================
  useEffect(() => {
    // Data fetching logic
  }, [dependencies]);

  // ============================================================================
  // Render
  // ============================================================================
  return (
    <PageLayout>
      {/* Page content */}
    </PageLayout>
  );
}
```

### Requirements

1. **File-Level JSDoc**: Must describe page purpose and features
2. **Thin Wrapper**: Page component should only handle routing/authentication
3. **Content Component**: Extract complex logic to separate component
4. **Helper Extraction**: Extract data fetching to `lib/helpers/`
5. **Custom Hooks**: Extract reusable stateful logic to custom hooks
6. **Section Comments**: Use section comments to organize code

### Logic Extraction Rules

**Extract to `lib/helpers/` when:**

- Data fetching logic (API calls)
- Complex state management
- Business logic calculations
- Data transformation
- Filter/search logic

**Extract to Custom Hooks when:**

- Reusable stateful logic
- Multiple related state variables
- Complex useEffect dependencies
- Data fetching with caching

**Extract to Components when:**

- Reusable UI patterns
- Complex rendering logic
- Form handling
- Table/list rendering

### File Length Guidelines

- **Maximum page.tsx length**: ~100-150 lines (wrapper only)
- **Maximum content component length**: ~300-400 lines
- **If component exceeds limit**: Extract sub-components or custom hooks

**Reference Examples:**

- `app/page.tsx` - Lean page wrapper
- `app/reports/page.tsx` - Simple page structure

---

## 4.3. Component Structure - CRITICAL REQUIREMENTS

**MANDATORY**: Components must be organized with clear sections and proper commenting.

### Component Structure Template

```typescript
/**
 * [Component Name] Component
 * [Brief description of component purpose]
 *
 * @param props - Component props with clear type definitions
 */
export default function ComponentName(props: ComponentProps) {
  // ============================================================================
  // Hooks & State
  // ============================================================================
  const [state, setState] = useState();
  const data = useCustomHook();

  // ============================================================================
  // Computed Values & Memoization
  // ============================================================================
  const computedValue = useMemo(() => {
    // Expensive computation
  }, [dependencies]);

  // ============================================================================
  // Event Handlers
  // ============================================================================
  const handleAction = useCallback(() => {
    // Handler logic
  }, [dependencies]);

  // ============================================================================
  // Effects
  // ============================================================================
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // ============================================================================
  // Render
  // ============================================================================
  return (
    // JSX
  );
}
```

### Requirements

1. **Component Documentation**: JSDoc comment describing purpose
2. **Section Organization**: Use section comments to organize code
3. **Logical Grouping**: Group related hooks, handlers, and effects
4. **Memoization**: Use `useMemo` and `useCallback` appropriately
5. **Extract When Needed**: Break into smaller components if too long

### File Length Guidelines

- **Maximum component length**: ~400-500 lines
- **If component exceeds limit**: Extract sub-components or custom hooks
- **Complex components**: Break into smaller, focused components

### Component Extraction Rules

**Extract sub-component when:**

- Component has multiple distinct sections
- Section is reusable elsewhere
- Section has its own state/logic
- Component is becoming hard to read

**Extract custom hook when:**

- Logic is reusable across components
- Multiple related state variables
- Complex data fetching logic
- Complex effect dependencies

**Reference Examples:**

- `components/reports/tabs/LocationsTab.tsx` - Well-organized component structure

---

## 4.4. Custom Hook Structure - CRITICAL REQUIREMENTS

**MANDATORY**: All custom hooks must follow a consistent organization pattern for maintainability.

### Hook Structure Template

```typescript
/**
 * use[HookName] Hook
 *
 * [Brief description of hook purpose]
 *
 * [Additional context about what the hook manages]
 *
 * Architecture:
 * - [Architecture point 1]
 * - [Architecture point 2]
 * - [Architecture point 3]
 */

'use client';

// ============================================================================
// External Dependencies
// ============================================================================

import { dep1, dep2 } from '@/lib/helpers/[feature]';
import { useStore } from '@/lib/store/[store]';
import type { Type1, Type2 } from '@/lib/types/[types]';
import { utility1, utility2 } from '@/lib/utils/[utils]';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

// ============================================================================
// Type Definitions
// ============================================================================

type UseHookNameProps = {
  prop1: string;
  prop2?: number;
  onSuccess?: () => void;
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * [Description of what helper does]
 */
function helperFunction(params) {
  // Implementation
}

// ============================================================================
// Main Hook
// ============================================================================

export function useHookName({ prop1, prop2, onSuccess }: UseHookNameProps) {
  // ==========================================================================
  // Store State - [Brief description]
  // ==========================================================================
  const { storeValue, setStoreValue } = useStore();

  // ==========================================================================
  // Local State - [Grouped by concern]
  // ==========================================================================

  // [Concern 1: Brief description]
  const [state1, setState1] = useState<type1>();
  const [state2, setState2] = useState<type2>();

  // [Concern 2: Brief description]
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ==========================================================================
  // Form Data Bindings - [Brief description]
  // ==========================================================================

  const { field1, field2 } = formData;
  const setField1 = (val: type1) => setFormData({ field1: val });
  const setField2 = (val: type2) => setFormData({ field2: val });

  // ==========================================================================
  // Computed Values (useMemo)
  // ==========================================================================

  /**
   * [Brief description of computed value]
   */
  const computedValue = useMemo(() => {
    // Implementation
  }, [dependencies]);

  // ==========================================================================
  // Debounced Values
  // ==========================================================================

  const debouncedValue = useDebounce(value, 500);

  // ==========================================================================
  // Refs
  // ==========================================================================

  const callbackRef = useRef(onSuccess);
  const hasFetchedRef = useRef(false);

  // ==========================================================================
  // Effects
  // ==========================================================================

  /**
   * [Brief description of effect]
   */
  useEffect(() => {
    // Implementation
  }, [dependencies]);

  // ==========================================================================
  // Event Handlers - [Category 1]
  // ==========================================================================

  /**
   * [Brief description of handler]
   */
  const handleAction1 = useCallback(() => {
    // Implementation
  }, [dependencies]);

  /**
   * [Brief description of handler]
   */
  const handleAction2 = useCallback(() => {
    // Implementation
  }, [dependencies]);

  // ==========================================================================
  // Event Handlers - [Category 2]
  // ==========================================================================

  /**
   * [Brief description of handler]
   */
  const handleSubmit = useCallback(async () => {
    // Implementation
  }, [dependencies]);

  // ==========================================================================
  // Return
  // ==========================================================================

  return {
    // State
    state1,
    state2,
    isLoading,
    error,
    // Computed
    computedValue,
    // Handlers
    handleAction1,
    handleAction2,
    handleSubmit,
  };
}
```

### Requirements

1. **File-Level JSDoc**: Must describe hook purpose and architecture
2. **Section Organization**: Use section comments to organize code
3. **State Grouping**: Group related state by concern (e.g., "Selection State", "Processing State")
4. **Helper Functions**: Define small helpers before the main hook
5. **Event Handler Grouping**: Group handlers by category (e.g., "Location & Machine Selection", "Form Submission")
6. **Computed Values**: Use useMemo for expensive calculations
7. **Debounced Values**: Use for input fields to prevent excessive processing
8. **Refs**: Use for callback persistence and flags
9. **Effects**: Document each effect with a brief description

### Section Order (CRITICAL)

The sections MUST appear in this order:

1. External Dependencies
2. Type Definitions
3. Helper Functions
4. Main Hook Function
5. Store State
6. Local State (grouped by concern)
7. Form Data Bindings
8. Computed Values (useMemo)
9. Debounced Values
10. Refs
11. Effects
12. Event Handlers (grouped by category)
13. Return

### State Grouping Examples

**Good grouping by concern:**

```typescript
// Location & Machine Selection
const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
  null
);
const [selectedMachineId, setSelectedMachineId] = useState<
  string | undefined
>();

// Machine Data Entry
const [metersIn, setMetersIn] = useState('');
const [metersOut, setMetersOut] = useState('');
const [isFirstCollection, setIsFirstCollection] = useState(false);

// Processing State
const [isProcessing, setIsProcessing] = useState(false);
const [error, setError] = useState<string | null>(null);
```

**Bad grouping (no grouping):**

```typescript
const [selectedLocationId, setSelectedLocationId] = useState<string | null>(
  null
);
const [metersIn, setMetersIn] = useState('');
const [isProcessing, setIsProcessing] = useState(false);
const [selectedMachineId, setSelectedMachineId] = useState<
  string | undefined
>();
```

### Reference Examples

- `lib/hooks/collectionReport/useNewCollectionModal.ts` - Exemplary hook organization

---

## 4.5. JSX Commenting & Spacing (Frontend)

**CRITICAL**: JSX should be easy to navigate and understand. Use comments and spacing strategically (see [`Documentation/frontend/pages/frontend-standards.md`](../../Documentation/frontend/pages/frontend-standards.md) for full details).

- **Use JSX comments to:**
  - Mark major UI sections (headers, filters, tables, forms, modals, pagination)
  - Explain complex conditional rendering and non-obvious UI behaviour
  - Indicate where data comes from and important responsive breakpoints
- **Recommended comment format for major sections:**

```tsx
{
  /* ============================================================================
   Header Section: Title, actions, and navigation
   ============================================================================ */
}
<div className="header-section">
  {/* Page Title */}
  <h1>Page Title</h1>

  {/* Action Buttons: Create, Edit, Delete */}
  <div className="actions">
    <Button>Create</Button>
  </div>
</div>;
```

- **Spacing guidelines:**
  - Separate major UI sections with blank lines
  - Group related elements together
  - Make nested structures readable
  - Avoid dense, unspaced JSX blocks that are hard to scan
- **Section comment examples:**

```tsx
{/* Modal Components: All modals used by this page */}
<EditModal />
<DeleteModal />
<CreateModal />

{/* Main Content: Page layout with data display */}
<PageLayout>
  {/* Page Header: Title and action buttons */}
  <div className="header">{/* ... */}</div>

  {/* Filters: Search, date range, and sorting */}
  <div className="filters">{/* ... */}</div>

  {/* Data Display: Table or cards */}
  <div className="data-display">
    {/* Loading State: Show skeleton while fetching */}
    {loading && <PageSkeleton />}

    {/* Error State: Show error message */}
    {error && <ErrorMessage />}

    {/* Success State: Show data */}
    {!loading && !error && <DataTable />}
  </div>
</PageLayout>
```

---

## 5. Comments & Documentation

- **Remove redundant comments** that simply restate the meaning of well-named code.
- In helper and utility files:
  - Every function should have a concise block comment describing:
    - Its purpose
    - Its parameters
    - Its return value
- Document complex business logic with clear explanations.
- Update comments when code changes.

### 5.1. File-Level Documentation

**Required for:**

- All API routes
- All page.tsx files
- Complex components (>200 lines)
- Helper files with multiple functions

**Format:**

```typescript
/**
 * [Name] [Type]
 *
 * [Brief description of purpose]
 *
 * Features/Supports:
 * - Feature 1
 * - Feature 2
 *
 * @module [path] (for routes/helpers)
 */
```

### 5.2. Step-by-Step Comments (API Routes)

**MANDATORY for all API route handlers:**

- Use visual separators: `// ============================================================================`
- Number each step: `// STEP 1:`, `// STEP 2:`, etc.
- Clear step descriptions for each major operation
- Document the flow in function JSDoc before implementation

**Example:**

```typescript
/**
 * Main GET handler for [route name]
 *
 * Flow:
 * 1. Parse and validate request parameters
 * 2. Authenticate user and check permissions
 * 3. Determine accessible locations
 * 4. Fetch data
 * 5. Transform and return results
 */
export async function GET(req: NextRequest) {
  try {
    // ============================================================================
    // STEP 1: Parse and validate request parameters
    // ============================================================================
    const params = parseParams(searchParams);

    // ============================================================================
    // STEP 2: Authenticate user and check permissions
    // ============================================================================
    const user = await getUserFromServer();
    // ... etc
  }
}
```

### 5.3. Section Comments (Components & Pages)

**Use for organizing code sections:**

```typescript
// ============================================================================
// Hooks & State
// ============================================================================

// ============================================================================
// Event Handlers
// ============================================================================

// ============================================================================
// Render Logic
// ============================================================================
```

---

## 6. Security & Authentication/Authorization

- **Implement secure authentication practices** using JWT tokens with `jose` library.
- **Follow OWASP standards** to safeguard code from vulnerabilities.
- Never expose sensitive information (API keys, tokens) in client-side code.
- Always validate and sanitize user input, especially in form submissions.
- Use middleware for route protection where necessary.
- Store JWT tokens in secure HTTP-only cookies with proper expiration.

**References:**

- `middleware.ts` - Next.js middleware for route protection
- `app/api/lib/helpers/auth.ts` - Authentication helpers

---

## 7. Component Structure & State Management

- Use appropriate state management solutions based on scope:
  - React's `useState` and `useReducer` for local component state
  - Context API for shared state across component tree
  - Zustand for application-wide state management
- Keep components focused on a single responsibility.
- Extract reusable UI elements into separate components.
- Implement proper error handling in components, especially for async operations.
- **Create reusable components** for common UI patterns (e.g., financial metrics cards, data tables).
- **Use proper prop types** with clear interfaces for component props.
- **Implement loading states** for async operations with skeleton loaders.
- **Handle data aggregation** in components when displaying totals from multiple data sources.

---

## 7.1. Loading States & Skeleton Loaders - CRITICAL REQUIREMENTS

- **MANDATORY: Every page and component with async data MUST use specific skeleton loaders**
- **NEVER use generic loading states** like "Loading...", "Loading Data", or generic spinners
- **EVERY skeleton loader MUST exactly match the layout and structure of the actual content**
- **Skeleton loaders MUST be page/component-specific** - no generic reusable skeletons for different content types

### **Skeleton Loader Requirements:**

#### **1. Content-Specific Skeletons:**

- **Each page must have its own skeleton** that matches the exact layout of the real content
- **Each tab/section must have its own skeleton** that represents the specific content structure
- **Skeleton must include all visual elements**: headers, cards, tables, buttons, forms, charts, etc.
- **Skeleton must match responsive behavior**: desktop table view, mobile card view, etc.

#### **2. Visual Accuracy:**

- **Exact dimensions and spacing** as the real content
- **Proper visual hierarchy** with headers, descriptions, and content areas
- **All interactive elements** represented (buttons, inputs, dropdowns, etc.)
- **Status indicators** included where appropriate (online/offline dots, badges, etc.)
- **Pagination controls** represented in skeleton form

#### **3. Implementation Standards:**

- **Use Shadcn Skeleton component** for all skeleton elements
- **Create dedicated skeleton files** in `components/ui/skeletons/`
- **Name skeletons specifically**: `PageNameSkeleton`, `TabNameSkeleton`, `SectionNameSkeleton`
- **Import and use specific skeletons** in each component
- **NO generic `MainContentSkeleton` or similar** - each must be content-specific

#### **4. File Organization:**

- **Skeleton files**: `components/ui/skeletons/[PageName]Skeletons.tsx`
- **Export specific skeletons**: `export const PageNameSkeleton = () => (...)`
- **Import in components**: `import { PageNameSkeleton } from "@/components/ui/skeletons/[PageName]Skeletons"`
- **Use in loading states**: `{loading ? <PageNameSkeleton /> : <ActualContent />}`

#### **5. Examples of PROPER Implementation:**

```typescript
// ✅ CORRECT - Specific skeleton for Machines Overview tab
export const MachinesOverviewSkeleton = () => (
  <div className="space-y-6">
    {/* Machine Statistics Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="min-h-[120px]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    {/* Filters, Table, Pagination - all matching real content */}
  </div>
);

// ❌ WRONG - Generic skeleton
export const GenericSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);
```

#### **6. Enforcement Rules:**

- **Code reviews MUST verify** skeleton loaders match content layout
- **NO text-based loading states** allowed ("Loading...", "Loading Data", etc.)
- **NO generic spinners** for content areas
- **ALL async operations** must show appropriate skeleton
- **Skeleton must be visible** during data fetching, not hidden behind sidebars

#### **7. Common Violations to AVOID:**

- ❌ Using `MainContentSkeleton` for different content types
- ❌ Generic "Loading..." text instead of skeleton
- ❌ Spinner in content area instead of skeleton
- ❌ Skeleton that doesn't match actual content layout
- ❌ Skeleton hidden behind sidebar or other elements
- ❌ Same skeleton used for different pages/tabs

**References:**

- `components/ui/skeletons/` - All skeleton components
- `components/ui/skeletons/ReportsSkeletons.tsx` - Example of proper implementation

---

## 8. Performance Optimization

### 8.1. Database Query Optimization - CRITICAL RULES

#### Cursor Usage for Meters Aggregations

**MANDATORY**: All `Meters.aggregate()` calls MUST use `.cursor({ batchSize: 1000 })` instead of `.exec()`

```typescript
// ✅ CORRECT - Use cursor for Meters aggregations
const results: Array<Record<string, unknown>> = [];
const cursor = Meters.aggregate(pipeline, {
  allowDiskUse: true,
  maxTimeMS: 120000,
}).cursor({ batchSize: 1000 });

for await (const doc of cursor) {
  results.push(doc as Record<string, unknown>);
}

// ❌ INCORRECT - Don't use exec() for Meters
const results = await Meters.aggregate(pipeline).exec();
```

**Why:**

- Prevents loading large result sets into memory at once
- Significantly improves performance for 7d/30d periods (10-20x faster)
- Reduces memory usage and prevents timeouts

#### Location Field Direct Access

**MANDATORY**: When aggregating Meters by location, use the `location` field directly instead of `$lookup` operations

```typescript
// ✅ CORRECT - Use location field directly (uses index)
const pipeline: PipelineStage[] = [
  {
    $match: {
      location: { $in: allLocationIds }, // Direct field access (uses index)
      readAt: { $gte: globalStart, $lte: globalEnd },
    },
  },
  {
    $group: {
      _id: '$location', // Group by location field directly (no lookup needed!)
      totalDrop: { $sum: { $ifNull: ['$movement.drop', 0] } },
    },
  },
];

// ❌ INCORRECT - Expensive $lookup operation
const pipeline: PipelineStage[] = [
  { $match: { machine: { $in: allMachineIds } } },
  { $lookup: { from: 'machines', ... } }, // Expensive!
  { $unwind: '$machineDetails' },
  { $addFields: { locationId: { $toString: '$machineDetails.gamingLocation' } } },
  { $group: { _id: '$locationId' } }, // Much slower!
];
```

**Performance Impact:**

- Before: 31+ seconds with `$lookup` operations
- After: 5-10 seconds using direct location field
- Improvement: 10-20x faster for 7d/30d periods

#### N+1 Query Pattern Elimination

**MANDATORY**: Consolidate multiple sequential queries into single aggregations or batch queries

```typescript
// ❌ INCORRECT - N+1 query pattern
for (const location of locations) {
  const machines = await Machine.find({ gamingLocation: location._id });
  const metrics = await Meters.aggregate([...]);
}

// ✅ CORRECT - Batch queries
const allLocationIds = locations.map(loc => loc._id);
const allMachines = await Machine.find({ gamingLocation: { $in: allLocationIds } }).lean();
const allMachineIds = allMachines.map(m => m._id);
const allMetrics = await Meters.aggregate([...]).cursor({ batchSize: 1000 });
// Combine results in memory
```

#### Gaming Day Offset Handling

For per-location gaming day offsets:

1. Calculate global date range (earliest start, latest end)
2. Aggregate globally using wide date range
3. Filter in memory by location-specific gaming day ranges

```typescript
// Global aggregation
const globalStart = earliestGamingDayStart;
const globalEnd = latestGamingDayEnd;
const aggregation = await Meters.aggregate([
  {
    $match: {
      location: { $in: allLocationIds },
      readAt: { $gte: globalStart, $lte: globalEnd },
    },
  },
  {
    $group: {
      _id: '$location',
      totalDrop: { $sum: '$movement.drop' },
      minReadAt: { $min: '$readAt' },
      maxReadAt: { $max: '$readAt' },
    },
  },
]).cursor({ batchSize: 1000 });

// Filter by gaming day ranges in memory
for await (const agg of aggregation) {
  const gamingDayRange = gamingDayRanges.get(String(agg._id));
  const hasOverlap =
    agg.minReadAt <= gamingDayRange.rangeEnd &&
    agg.maxReadAt >= gamingDayRange.rangeStart;
  if (hasOverlap) {
    /* use result */
  }
}
```

### 8.2. Frontend Performance Optimization

- Implement proper code-splitting and lazy loading for pages and large components.
- Optimize images using Next.js Image component.
- Minimize unnecessary re-renders with memoization techniques.
- Use efficient data fetching patterns to prevent waterfalls.
- Implement proper caching strategies for API responses.
- **Use debouncing for search inputs** to prevent excessive API calls.
- **Implement proper cleanup** for event listeners, timeouts, and subscriptions.
- **Memoize expensive computations** and callback functions to prevent unnecessary re-renders.
- **Calculate derived data efficiently** - Use `useMemo` for expensive calculations like financial totals.
- **Optimize data aggregation** - Calculate totals once and reuse them across components.

### 8.3. Performance Targets

- **7d period**: <10 seconds (target: 5-10s)
- **30d period**: <15 seconds (target: 10-15s)
- **No timeouts**: All queries should complete within maxTimeMS limits
- **Memory efficiency**: Use cursors to prevent memory issues

**See [`Documentation/backend/api/calculation-engine.md`](../../Documentation/backend/api/calculation-engine.md) and the database query optimization skill for detailed optimization strategies.**

---

## 9. Testing Best Practices

- Focus on manual testing of critical user flows during development.
- Implement proper error handling and logging for debugging.
- Use TypeScript for compile-time error catching.
- Use the Go-based MongoDB query tool in `test/` directory for database validation and testing.

---

## 10. Accessibility & Internationalization

- Ensure all components are accessible with proper ARIA attributes.
- Use semantic HTML elements.
- Support keyboard navigation.
- Prepare for internationalization by avoiding hardcoded strings where possible.

---

## 11. Code Cleanup & Dependency Management

- **Always check dependencies before deleting code:**
  - Use `grep_search` to find all usages of a type, function, or variable
  - Check both import statements and direct usage
  - Verify no code depends on the item before removal
- **Handle type conflicts properly:**
  - When importing types from multiple sources, ensure no naming conflicts
  - Use explicit imports or aliases to resolve conflicts
  - Prefer shared types over local duplicates
- **Clean up unused imports and exports:**
  - Remove unused imports to reduce bundle size
  - Update index files when removing exports
  - Verify all imports are still valid after changes
- **Follow the dependency chain:**
  - When removing a type/function, check what imports it
  - Update or remove dependent code accordingly
  - Ensure the build still passes after cleanup

---

## 12. Frontend-Backend Type Consistency

- **Before creating or modifying types that represent backend data:**
  - **Trace the data flow** from API endpoint to frontend usage
  - **Check the original API source** in `app/api/` routes to understand the data structure
  - **Verify database schema** if the type represents database entities
  - **Ensure shared types match** the actual API response structure
- **Type synchronization workflow:**
  1. **Identify the API endpoint** that provides the data
  2. **Examine the response structure** in the route handler
  3. **Check database models** if applicable (MongoDB schemas, Prisma models)
  4. **Update shared types** to match the actual data structure
  5. **Verify frontend usage** aligns with the updated types
- **Common patterns to check:**
  - **API response transformations** (e.g., `_id` to `id`, date formatting)
  - **Optional vs required fields** based on API behavior
  - **Nested object structures** and their relationships
  - **Array types** and their element structures
  - **Calculated fields** that may not exist in the original data structure
- **Validation approach:**
  - **Use TypeScript strict mode** to catch type mismatches
  - **Test API endpoints** to verify response structure
  - **Check runtime data** in browser dev tools
  - **Validate against database schema** for entity types
  - **Handle missing properties gracefully** with fallback values and proper type guards

**References:**

- `app/api/` - API route handlers
- `shared/types/` - Shared type definitions
- `app/api/lib/models/` - Database models

---

## 13. Backend Database Query Standards & Licencee Filtering

These rules consolidate the backend guidelines in [`Documentation/backend/README.md`](../../Documentation/backend/README.md) and the licencee/location access rules.

### 13.1. Use Mongoose Models, Never Direct Collection Access

**CRITICAL**: Always use Mongoose models instead of direct `db.collection()` access:

- ✅ **Use Mongoose models** - Import from `@/app/api/lib/models/`
- ❌ **NEVER use `db.collection('name')`** - Bypasses type safety and indexes
- ✅ **Models provide**: Automatic indexing, type safety, validation, and optimization
- ❌ **Direct collection access**: No type safety, manual indexes required, error-prone

```typescript
// ✅ CORRECT - Use Mongoose model
import { Member } from '@/app/api/lib/models/members';
const members = await Member.find(query).lean();
const count = await Member.countDocuments(query);

// ❌ INCORRECT - Direct collection access
const members = await db.collection('members').find(query).toArray();
const count = await db.collection('members').countDocuments(query);
```

### 13.2. MongoDB Query Methods

- ✅ **Use `findOne({ _id: id })`** for finding by ID (string IDs, not `ObjectId`)
- ❌ **NEVER use `findById(id)`** (it expects `ObjectId`)
- ✅ **Use `findOneAndUpdate({ _id: id }, update, options)`** for updates
- ❌ **NEVER use `findByIdAndUpdate(id, ...)`**

```typescript
// ✅ CORRECT
const session = await MachineSession.findOne({ _id: sessionId });

// ❌ INCORRECT
const session = await MachineSession.findById(sessionId);
```

### 13.3. Licencee & Location Filtering

All API routes that return location- or machine-scoped data **must** respect the user’s accessible licencees and locations.

- **Always support both spellings** of the query parameter:

```typescript
const licencee = searchParams.get('licencee') || searchParams.get('licencee');
```

- **Always** use the shared helper to determine allowed locations and apply it to queries or aggregation `$match` stages.
- **Pattern for applying location filters:**

```typescript
const allowedLocationIds = await getUserLocationFilter(licencee || undefined);

if (allowedLocationIds !== 'all') {
  matchStage.gamingLocation = { $in: allowedLocationIds };
}
```

### 13.4. Aggregations with Licencee Filtering

When joining machines and locations in aggregations:

- Join machines by `_id`
- Join locations by `gamingLocation`
- Filter on `locationDetails.rel.licencee` using the resolved licencee

```typescript
const pipeline: PipelineStage[] = [
  { $match: baseMatch },
  {
    $lookup: {
      from: 'machines',
      localField: 'machine',
      foreignField: '_id',
      as: 'machineDetails',
    },
  },
  { $unwind: '$machineDetails' },
  {
    $lookup: {
      from: 'gaminglocations',
      localField: 'machineDetails.gamingLocation',
      foreignField: '_id',
      as: 'locationDetails',
    },
  },
  { $unwind: '$locationDetails' },
  {
    $match: {
      'locationDetails.rel.licencee': licenceeId,
    },
  },
];
```

### 13.5. Consistency & Safety

- Never bypass licencee/location checks in production APIs
- Prefer shared helpers (`licenceeFilter.ts`, `users.ts`) over duplicating logic
- Keep all database query logic type-safe – no `any` in query objects or results

---

## 14. Financial Data Presentation

**MANDATORY**: All components displaying financial numbers must follow consistent color-coding to indicate performance and direction of money flow.

- **Green** (`text-green-600` or similar): Represents positive values, income, profit, or "Money In" (e.g., Gross Profit, Total In, Positive Growth).
- **Red** (`text-red-600` or similar): Represents negative values, losses, expenses, or "Money Out" (e.g., Total Out, Discounts, Negative Growth).
- **Neutral (No color)**: Represents zero values or neutral metrics that don't imply "good" or "bad" performance.

### Implementation Helper

Use the `getFinancialColorClass` or `getGrossColorClass` utility whenever possible to ensure consistency:

```typescript
import { getFinancialColorClass } from '@/lib/utils/financial';

// JSX
<span className={getFinancialColorClass(value)}>
  {formatCurrency(value)}
</span>
```

### General Rules for Financial UI:

1. **Consistency**: Apply the same color logic across all tabs and reports (Overview, Monthly, Collection, etc.).
2. **Readability**: Ensure sufficient contrast when using colored text, especially on background colors.
3. **Alignment**: Financial numbers should generally be right-aligned in tables for easier comparison.

---

**Summary:**  
Persistence: Keep going until the job is completely solved before ending your turn.
Plan than reflect: Plan thoroughly before every tool call then reflect on the outcome after
This project enforces strict discipline in type safety, code style, modularity, security, and build integrity.  
Use your tools don't guess: If you're unsure about code or files, open them - do not hallucinate.
**Always check dependencies before deleting code** - Use grep_search to verify usage patterns.
**Prefer shared types over duplicates** - Maintain single source of truth for types.
**Trace API data flow** - Check original backend source before creating/modifying types.
**Handle type conflicts gracefully** - Use proper fallback logic for missing properties.
**Create reusable components** - Extract common UI patterns into reusable components.

All contributors must follow these rules to ensure a robust, maintainable, and secure codebase.
