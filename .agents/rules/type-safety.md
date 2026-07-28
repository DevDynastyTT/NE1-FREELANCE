---

description: Strict TypeScript & Type-Safety Rules - Core guidelines for maintaining a zero-any, robustly typed codebase
globs:

- '\*_/_.ts'
- '\*_/_.tsx'
- 'shared/types/\*_/_.ts'
- 'lib/types/\*_/_.ts'
- 'app/api/lib/types/\*_/_.ts'
  alwaysApply: true

---

# Strict TypeScript & Type-Safety Rules

This document defines the strict type-safety standards for the Evolution One CMS project. These rules are non-negotiable and must be enforced during development and code reviews.

## 1. Zero-Any Policy

**RULE**: The usage of `any` is strictly prohibited.

- ❌ **NEVER** use `any` as a type for variables, parameters, or return types.
- ✅ **ALWAYS** define a concrete `type` or `interface`.
- ✅ **USE** `unknown` if the type truly cannot be determined at compile time (e.g., initial API parsing), but cast to a concrete type immediately after validation.

**Incorrect:**

```typescript
const handleData = (data: any) => {
  console.log(data.id);
};
```

**Correct:**

```typescript
import { CollectionData } from '@/shared/types';

const handleData = (data: CollectionData) => {
  console.log(data.id);
};
```

---

## 2. Type Location Hierarchy

To prevent circular dependencies and maintain a single source of truth, types MUST be stored in specific directories based on their scope:

| Scope           | Directory            | Use Case                                                        |
| :-------------- | :------------------- | :-------------------------------------------------------------- |
| **Shared**      | `shared/types/`      | Types used in BOTH Frontend and Backend (e.g., Models, DTOs).   |
| **Frontend**    | `lib/types/`         | Types used ONLY in components, hooks, or client utilities.      |
| **API/Backend** | `app/api/lib/types/` | Types used ONLY in API routes, helpers, or database operations. |
| **Global**      | `types/`             | Global definitions, environment variables, or polyfills.        |

---

## 3. Prefer `type` over `interface`

For consistency across the project, use the `type` keyword for defining data structures.

- ✅ **ALWAYS** use `type MyType = { ... }`.
- ❌ **AVOID** using `interface MyInterface { ... }` unless forced by library requirements or declaration merging.

---

## 4. Explicit Type Annotations

While TypeScript can infer many types, explicit annotations are required for complex logic to improve readability and prevent regressions.

- ✅ **ALWAYS** annotate function return types in helpers and API routes.
- ✅ **ALWAYS** annotate `useState` hooks if the initial value is `null`, `undefined`, or an empty array.
- ✅ **ALWAYS** use explicit Generic parameters for `Zustand` stores and `React.useRef`.

```typescript
const [items, setItems] = useState<Machine[]>([]);
const inputRef = useRef<HTMLInputElement>(null);

function calculateTotal(data: Metric[]): number {
  return data.reduce((acc, curr) => acc + curr.value, 0);
}
```

---

## 5. Mongoose & Database Type Safety

- **Model Imports**: Always import models from `app/api/lib/models/`.
- **ID Patterns**: Document IDs are strings. Ensure types reflect `_id: string`.
- **No `Record<string, unknown>` casts on query results**: Always type the result through the query generic instead.

### `.lean<T>()` — Required for all document queries

Every `findOne`, `find`, `findOneAndUpdate`, and similar queries MUST specify the return type via the lean generic. This gives you a plain JS object typed as your DTO — no Mongoose document overhead, no `Record` casting.

```typescript
// ❌ WRONG — untyped, forces Record<string, unknown> downstream
const machine = await Machine.findOne({ _id: id }).lean();

// ✅ CORRECT — typed at the query, no casting needed anywhere
const machine = await Machine.findOne({ _id: id }).lean<GamingMachine>();
if (!machine) return;
machine.collectionMeters; // typed as { metersIn: number; metersOut: number } | undefined
```

For `find`, lean returns `T[]`:

```typescript
const machines = await Machine.find({ gamingLocation: locationId }).lean<
  GamingMachine[]
>();
```

### `.cursor().toArray()` — For large result sets

When iterating large collections, prefer `.cursor()` over loading all documents into memory with `find()`. Always apply `.lean<T>()` before `.cursor()` so each document is typed:

```typescript
// ❌ WRONG — loads everything into memory, untyped
const machines = await Machine.find({}).lean();

// ✅ CORRECT — streams documents, fully typed
const machines = await Machine.find({})
  .lean<GamingMachine>()
  .cursor()
  .toArray();
```

Use `cursor().toArray()` when the result set could be large (hundreds of documents or more). For small, bounded queries (single document, small known sets), `.lean<T>()` alone is sufficient.

### Aggregation pipelines

Use the `Aggregate<T[]>` generic on aggregation so `.exec()` returns a typed array instead of `any[]`:

```typescript
// ❌ WRONG
const results = await Machine.aggregate([...]).exec(); // any[]

// ✅ CORRECT
const results = await Machine.aggregate<GamingMachine>([...]).exec(); // GamingMachine[]
```

### Priority order for query patterns

1. `.lean<T>()` — single documents or small bounded sets
2. `.lean<T>().cursor().toArray()` — large or unbounded result sets
3. `.aggregate<T>([...]).exec()` — aggregation pipelines

---

## 6. No Comments in Type Files

Type files in `shared/types/`, `lib/types/`, and `app/api/lib/types/` must contain **zero comments** — no `//`, no `/* */`, no JSDoc `/** */`. Type names and field names must be self-documenting. If a type requires explanation, that explanation belongs in the CLAUDE.md or an `.instructions` rule file, not inline in the type file.

---

## 7. Type Refinement & Validation

- Use Type Guards (`isCollectionReport`) or assertion functions to narrow down `unknown` types.
- When dealing with user input or external APIs, use validation (like Zod if available, or manual checks) before casting.

---

## 8. No Implicit Conversions

- Avoid using the bang operator `!` unless absolutely certain of existence.
- Prefer optional chaining `?.` and nullish coalescing `??`.

---

## 9. Explicit Enumerations

- Prefer string literal unions or `const enum` over numeric enums for better readability and serializability.

```typescript
type ReportStatus = 'pending' | 'completed' | 'cancelled';
```

---

## 10. Function Parameter Guards

All exported and internal functions MUST validate required parameters at the start of the function body. Guards prevent unnecessary database queries or logic execution when critical parameters are missing.

### Rule

1. Check mandatory parameters immediately after function signature
2. Log errors with the function name as prefix: `[FunctionName] paramName is required`
3. Return early with a failure result or `undefined`
4. Do NOT use inline `if` checks scattered throughout the function body

### Required Guards

- **Mandatory IDs** (`_id`, `machineId`, `locationReportId`, etc.): Must exist and be non-empty strings
- **Mandatory numbers** (`metersIn`, `metersOut`, `amount`, etc.): Must be valid finite numbers (use `Number.isFinite()`)
- **Mandatory objects** (`body`, `payload`, `document`): Must be truthy and of correct type
- **Mandatory arrays** (`machines`, `items`): Must be arrays (use `Array.isArray()`)
- **Mandatory dates** (`timestamp`, `collectionTime`): Must be valid `Date` instances

### Optional Parameters

- Optional parameters (`?` or `| undefined`) should still be checked if used later in the function
- Log missing optional params at info level, not error

### Example

```typescript
// ❌ WRONG — scattered checks, no guards
async function updateMachine(
  machineId: string,
  data: UpdatePayload,
  optional?: string
) {
  const machine = await Machine.findOne({ _id: machineId });
  if (machineId) {
    // ... process
  }
}

// ✅ CORRECT — guards at top, clean body
async function updateMachine(
  machineId: string,
  data: UpdatePayload,
  optional?: string
): Promise<void> {
  if (!machineId) {
    console.error('[updateMachine] machineId is required');
    return;
  }

  if (!data || typeof data !== 'object') {
    console.error('[updateMachine] data is required');
    return;
  }

  if (optional) {
    console.log(`[updateMachine] Processing with optional: ${optional}`);
  }

  const machine = await Machine.findOne({ _id: machineId });
  // ... rest of logic
}
```

---

## 11. Creation Flow vs Edit Flow Distinction

**CRITICAL RULE**: Never confuse the creation flow with the edit flow. They have different purposes and update different data.

### Creation Flow — When Report is Created

**When**: User clicks **"Create Report"** button
**Function**: `updateMachineCollectionData` in `collectionLifecycleOperations.ts` (via `CollectionLifecycleService`)
**What it does**:

- Updates machine's `collectionMeters` (current → becomes new current)
- Pushes entry to `collectionMetersHistory`
- Sets collection's `prevIn`/`prevOut`
- **Machine meter state moves FORWARD**

### Edit Flow — When Collection Entry is Edited

**When**: User edits a collection entry (e.g., corrects meter readings)
**Function**: `PATCH /api/collection-reports/collections/[id]/route.ts`
**What it does**:

- Updates collection document with edited values
- Recalculates movement/sasMeters
- Updates `collectionMetersHistory` entry
- **Does NOT update machine's `collectionMeters`**

### Why the Distinction Matters

| Flow         | Update Machine Meters? | Purpose                                  |
| ------------ | ---------------------- | ---------------------------------------- |
| **Creation** | ✅ Yes                 | Actual collection event, meters progress |
| **Edit**     | ❌ No                  | Fix typos/adjustments, meters stay same  |

**Incorrect:**

```typescript
// Editing collection should NOT progress machine meter state
await Machine.findOneAndUpdate(
  { _id: machineId },
  { $set: { collectionMeters: { metersIn: editedMetersIn } } }
);
```

**Correct:**

```typescript
// Only update collection document and history
await Collections.findOneAndUpdate(
  { _id: collectionId },
  { $set: { metersIn: editedMetersIn } }
);
```

---

## 12. JSDoc Type Documentation

All JSDoc `@param` and `@returns` annotations MUST include proper TypeScript type annotations in curly braces.

### Rule

1. Always use `{Type}` format for parameter types
2. Match types to actual function signatures (use imported types when available)
3. Use `[paramName]` syntax for optional parameters
4. Do NOT add types to inline comments or module-level JSDoc blocks

### Example

```typescript
// ❌ WRONG — missing type braces
/**
 * @param body - The payload
 * @returns { isValid: boolean }
 */

// ✅ CORRECT — proper type annotations
/**
 * @param {Partial<CreateCollectionReportPayload>} body - The payload
 * @returns {{ isValid: boolean; error?: string }}
 */
```

---

## 13. Avoid `Record` Type

Prefer specific types over generic `Record` types. `Record<string, unknown>` obscures type clarity and should be avoided.

### Rule

1. **Prefer** specific types that already exist in the codebase
2. **Use** `Pick<Type, Keys>` or type composition for partial types
3. **Prefer** defined types from `shared/types/`, `lib/types/`, or `app/api/lib/types/`
4. **Avoid** `Record<string, unknown>` as a lazy fallback
5. **Only use** `Record` when value is truly unknown (e.g., dynamic API response)

### Correct Pattern

```typescript
// ❌ WRONG — lazy Record type
const updateFields: Record<string, unknown> = {};

// ✅ CORRECT — specific type or Pick
type MachineUpdateFields = Partial<
  Pick<MachineDocument, 'serialNumber' | 'game' | 'assetStatus'>
> & {
  updatedAt: Date;
};
const updateFields: MachineUpdateFields = { updatedAt: new Date() };
```

---

## 14. Error Logging in Catch Blocks

Use `console.error` with clean, readable messages. Avoid complex if statements in catch blocks.

### Rule

1. Never type annotate catch parameter (no `catch (e: any)` or `catch (e: unknown)`)
2. Always use `console.error` for errors
3. Prefix with function name: `[FunctionName]`
4. Log the message only, not the entire error object

### Correct Pattern

```typescript
// ❌ WRONG — type annotation, logging entire error
} catch (e: unknown) {
  console.error(e);
}

// ❌ WRONG — no function name prefix
} catch (e) {
  console.error(e instanceof Error ? e.message : 'Unknown error');
}

// ✅ CORRECT — simple, clean, prefixed
} catch (e) {
  console.error('[FunctionName] Error:', e instanceof Error ? e.message : 'Unknown error');
}
```

### Backend (Node.js/Next.js API)

```typescript
} catch (e) {
  console.error('[createCollection] Error:', e instanceof Error ? e.message : 'Unknown error');
}
```

### Frontend (React)

```typescript
} catch (e) {
  console.error('[useCollection] Error:', e instanceof Error ? e.message : 'Unknown error');
}
```

### MongoDB-Specific Queries (Mongoose)

```typescript
// For .catch() on promises
}).catch((e) => {
  console.error('[updateMachine] DB Error:', e instanceof Error ? e.message : 'Unknown error');
});
```

### Never Do This

```typescript
// ❌ Logging entire MongoDB error object (verbose, unreadable)
console.error(e);

// ❌ Complex type checking in catch
console.error(
  e instanceof Error && e.message
    ? e.message
    : typeof e === 'string'
      ? e
      : e?.errmsg
);
```

---

## 15. Critical Operation Result Checking (Within Try Blocks)

When performing critical database operations within `try` blocks, **always check the result** and return early on failure. This prevents cascading failures when a critical step fails.

### Rule

1. **Check results of `findOneAndDelete`, `findOneAndUpdate`, `deleteOne`, etc.**
2. **Log with function name prefix**: `[FunctionName] Failed to [operation] [resource] [id]`
3. **Return early with failure** if a critical operation fails
4. **Non-critical operations** (e.g., optional cleanup) can continue without returning

### Correct Pattern

```typescript
// ✅ CORRECT — check critical delete, return on failure
try {
  const result = await Meters.findOneAndDelete({ _id: meterId });
  if (!result) {
    console.error(`[deleteMeter] Failed to delete meter ${meterId}`);
    return { success: false };
  }

  // Continue only if critical operation succeeded
  await SomeOtherOperation();
} catch (e) {
  console.error(
    '[deleteMeter] Error:',
    e instanceof Error ? e.message : 'Unknown error'
  );
  return { success: false };
}
```

### When to Return vs Continue

| Operation                  | Critical? | Action on Failure     |
| -------------------------- | --------- | --------------------- |
| Delete meter for ram clear | ✅ Yes    | Return early          |
| Delete main meter          | ✅ Yes    | Return early          |
| Update optional field      | ❌ No     | Log warning, continue |
| Delete optional history    | ❌ No     | Log warning, continue |

### Never Do This

```typescript
// ❌ No result checking — function continues even if critical delete failed
try {
  await Meters.findOneAndDelete({ _id: meterId });
  await SomeOtherOperation(); // Runs even if delete failed
} catch (e) { ... }

// ❌ Silent failure — no logging
try {
  const result = await Meters.findOneAndDelete({ _id: meterId });
  if (!result) return; // No error logged
} catch (e) { ... }
```

---

## 16. Caller Responsibility for Error Handling

When calling functions that return `{ success: boolean; error?: string }` or similar result types, the **caller MUST check the result** and handle failures appropriately.

### Rule

1. **Always check the `success` property** (or equivalent) when calling functions that return result objects
2. **Return early with error** if `success === false` for critical operations
3. **Log the error** from the returned `error` property, not by catching thrown errors
4. **Non-critical operations** (e.g., optional logging) can continue without returning

### Correct Pattern (Caller Side)

```typescript
// ✅ CORRECT — check result of helper that returns { success, error? }
const result = await someHelperFunction(params);
if (!result.success) {
  return NextResponse.json(
    { message: result.error || 'Operation failed' },
    { status: 500 }
  );
}

// ✅ CORRECT — non-critical operation (optional logging)
const logResult = await logActivity(...);
if (!logResult.success) {
  console.warn('[Route] Failed to log activity:', logResult.error);
  // Continue — logging is non-critical
}
```

### When Function Throws vs Returns Error Object

| Pattern                            | When to Use                                           | Caller Action          |
| ---------------------------------- | ----------------------------------------------------- | ---------------------- |
| **Throws on failure**              | Critical operations that should stop execution        | `try/catch` block      |
| **Returns `{ success: boolean }`** | Operations where caller needs to decide how to handle | Check `result.success` |

### Critical vs Non-Critical Operations

| Operation                | Critical? | Caller Action on Failure |
| ------------------------ | --------- | ------------------------ |
| Delete meter             | ✅ Yes    | Return early with error  |
| Update collection report | ✅ Yes    | Return early with error  |
| Log activity             | ❌ No     | Log warning, continue    |
| Update optional field    | ❌ No     | Log warning, continue    |

---

**Summary:**
Type safety is the backbone of our reliability. Use `bun run check` frequently to catch violations before they reach the main branch.
