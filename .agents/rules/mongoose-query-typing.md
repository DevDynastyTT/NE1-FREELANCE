---
description: Mongoose Query Typing Rules - Always specify generic types on lean(), cursor(), and aggregate() to eliminate Record casting
globs:
  - 'app/api/**/*.ts'
  - 'app/api/lib/helpers/**/*.ts'
  - 'app/api/lib/models/**/*.ts'
alwaysApply: true
---

# Mongoose Query Typing Rules

Every Mongoose query must specify its return type through the query's generic parameter. **Never** cast query results to `Record<string, unknown>` or `any` after the fact — type it at the source.

---

## Rule 1: Always use `.lean<T>()`, never bare `.lean()`

`.lean()` without a generic returns an untyped plain object. `.lean<T>()` returns `T | null` (or `T[]` for `find`), which propagates typed access to every field downstream with no casting.

```typescript
// ❌ NEVER — forces Record<string, unknown> casts everywhere below
const machine = await Machine.findOne({ _id: id }).lean();
const meters = (machine as Record<string, unknown>).collectionMeters as
  | { metersIn: number }
  | undefined;

// ✅ ALWAYS — typed at the query, zero casts needed
const machine = await Machine.findOne({ _id: id }).lean<GamingMachine>();
if (!machine) return;
const meters = machine.collectionMeters; // { metersIn: number; metersOut: number } | undefined
```

The same applies to `find`:

```typescript
const machines = await Machine.find({ gamingLocation: locationId }).lean<
  GamingMachine[]
>();
```

And to `findOneAndUpdate` when you need the returned document:

```typescript
const updated = await Machine.findOneAndUpdate(
  { _id: id },
  { $set: { collectionTime: new Date() } },
  { new: true }
).lean<GamingMachine>();
```

---

## Rule 2: Prefer `.lean<T>().cursor().toArray()` for large result sets

Loading large collections with `find().lean<T[]>()` pulls everything into memory at once. For large or unbounded sets, use `.cursor().toArray()` — Mongoose streams the documents then collects them, reducing peak memory:

```typescript
// ❌ AVOID for large sets — all documents held in memory simultaneously
const allMachines = await Machine.find({}).lean<GamingMachine[]>();

// ✅ PREFER for large sets — streamed, then collected
const allMachines = await Machine.find({})
  .lean<GamingMachine>()
  .cursor()
  .toArray();
```

`.lean<T>()` applied before `.cursor()` types each document as `T`, so `toArray()` resolves to `T[]`. No additional cast is needed.

**When to use each:**

- `.lean<T>()` — single documents, or small bounded result sets (a handful of records)
- `.lean<T>().cursor().toArray()` — large or unbounded result sets (hundreds of documents or more)

---

## Rule 3: Always type aggregation pipelines

`aggregate()` without a generic returns `any[]`. Pass the document shape as the generic so `.exec()` returns a typed array:

```typescript
// ❌ WRONG — result is any[]
const results = await Machine.aggregate([
  { $match: { gamingLocation: locationId } },
]).exec();

// ✅ CORRECT — result is GamingMachine[]
const results = await Machine.aggregate<GamingMachine>([
  { $match: { gamingLocation: locationId } },
]).exec();
```

---

## Rule 4: Type imports come from `shared/types/`

The generic you pass to `.lean<T>()` must be a proper shared type, not an inline object literal. Import from `shared/types/` or `app/api/lib/types/` as appropriate:

```typescript
import type { GamingMachine } from '@shared/types';
import type { CollectionReport } from '@shared/types';

const machine = await Machine.findOne({ _id: id }).lean<GamingMachine>();
const report = await CollectionReport.findOne({
  _id: reportId,
}).lean<CollectionReport>();
```

---

## Summary

| Pattern                         | Use when                                |
| :------------------------------ | :-------------------------------------- |
| `.lean<T>()`                    | Single document or small bounded query  |
| `.lean<T[]>()` on `find`        | Small bounded multi-document query      |
| `.lean<T>().cursor().toArray()` | Large or unbounded multi-document query |
| `.aggregate<T>([]).exec()`      | Any aggregation pipeline                |

These patterns eliminate all `Record<string, unknown>` and `as` casts on query results.
