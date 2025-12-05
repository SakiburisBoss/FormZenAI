# Next.js 16 Caching Strategy for Form-Zen-AI

## 🎯 Overview

This document outlines the comprehensive caching strategy for our form builder application using Next.js 16's `cacheComponents` feature with `use cache`, `cacheLife`, `cacheTag`, `updateTag`, and `revalidateTag`.

## 📋 Configuration

### next.config.ts
```typescript
const nextConfig: NextConfig = {
  cacheComponents: true, // ✅ Enabled
};
```

## 🔑 Key Concepts

### 1. **`use cache`** - Mark functions/components as cacheable
- Place at the top of async functions, components, or files
- Enables caching for that scope

### 2. **`cacheLife(profile)`** - Control cache duration
Available profiles:
- `"seconds"` - Very short cache (5 seconds stale, 10s revalidate)
- `"minutes"` - Short cache (5 min stale, 15 min revalidate) ⭐ **Default**
- `"hours"` - Medium cache (1 hour stale, 4 hours revalidate)
- `"days"` - Long cache (1 day stale, 7 days revalidate)
- `"weeks"` - Very long cache (7 days stale, 28 days revalidate)
- `"max"` - Maximum cache (never expires by time)

### 3. **`cacheTag(...tags)`** - Tag cached data for targeted invalidation
- Accepts multiple tags as arguments
- Used to group related cached data
- Example: `cacheTag("user-forms", userId)`

### 4. **`updateTag(tag)`** - Immediate cache invalidation
- ⚠️ **Only works in Server Actions**
- Expires cache immediately
- Next request waits for fresh data
- **Perfect for read-your-own-writes scenarios**
- Example: User creates a form → sees it immediately on dashboard

### 5. **`revalidateTag(tag, profile)`** - Background cache refresh
- Works in Server Actions AND Route Handlers
- **Second parameter is the revalidation profile** (e.g., `"max"`)
- `revalidateTag(tag, "max")` - Serve stale content while fetching fresh in background (stale-while-revalidate)
- `revalidateTag(tag, { expire: 0 })` - Immediate expiration (for webhooks)
- Use when you DON'T need immediate updates

## 🗺️ Caching Strategy by Page/Component

| Page/Component | Cache Life | Cache Tags | Invalidation Strategy | Reasoning |
|----------------|------------|------------|----------------------|-----------|
| `/forms` Dashboard | `"minutes"` | `"user-forms"`, `userId` | `updateTag()` on mutations | User needs near-real-time updates after creating/publishing forms |
| `/forms/[formId]` Public Form | `"max"` | `"published-form"`, `form-${formId}` | Rarely invalidated | Published forms are static content, rarely change |
| `/forms/[formId]/edit` Edit Page | `"seconds"` | `"draft-form"`, `form-${formId}` | `updateTag()` on publish | User actively editing, needs fresh data |
| `getForms()` Action | `"minutes"` | `"user-forms"`, `userId` | `updateTag()` on CRUD | Fetches user's forms list |

## 🔄 Cache Invalidation Patterns

### Pattern 1: Creating a New Form
```typescript
// actions/forms/generate-form.ts
export const generateForm = async () => {
  // ... create form logic
  
  // ✅ Immediate invalidation - user sees new form on dashboard
  updateTag("user-forms");
  updateTag(userId);
  revalidatePath("/forms");
  
  redirect(`/forms/${form.id}/edit`);
};
```

### Pattern 2: Publishing a Form (Draft → Published)
```typescript
// actions/forms/publish-form.ts
export const publishForm = async (formId: number) => {
  // ... publish form logic
  
  // ✅ Clear multiple caches since form state changed
  updateTag("user-forms");       // Dashboard
  updateTag(userId);              // User-specific
  updateTag("draft-form");        // Old draft cache
  updateTag(`form-${formId}`);    // Specific form
  
  revalidatePath("/forms");
  revalidatePath(`/forms/${formId}`);
  revalidatePath(`/forms/${formId}/edit`);
};
```

### Pattern 3: Submitting a Form
```typescript
// actions/forms/submit-form.ts
export const submitForm = async (formId: number) => {
  // ... submit logic
  
  // ✅ Only invalidate owner's dashboard (submission count changed)
  // DON'T invalidate the published form itself - it hasn't changed!
  updateTag("user-forms");
  updateTag(form.ownerId);
  revalidatePath("/forms");
  
  redirect("/forms");
};
```

## 📊 Performance Optimization Matrix

### When to use each strategy:

| Scenario | Use | Why |
|----------|-----|-----|
| User creates/edits their own data | `updateTag()` | Read-your-own-writes - user expects immediate update |
| Background data updates | `revalidateTag(tag, "max")` | Serve stale while fetching fresh - better UX |
| Public static content | `cacheLife("max")` | Minimize database queries, maximize performance |
| Active editing | `cacheLife("seconds")` | Always fresh, minimal cache |
| Dashboard/list views | `cacheLife("minutes")` | Balance freshness and performance |
| Webhook/external trigger | `revalidateTag(tag, { expire: 0 })` | Immediate expiration for external updates |

## 🎨 Implementation Examples

### Example 1: Cached Page Component
```typescript
// app/forms/[formId]/page.tsx
import { cacheLife, cacheTag } from "next/cache";

const SubmitForm = async ({ params }) => {
  "use cache";
  cacheLife("max"); // Published forms never change
  const formId = (await params).formId;
  cacheTag("published-form", `form-${formId}`);
  
  const form = await prisma.form.findUnique({
    where: { id: Number(formId) },
  });
  
  return <FormDisplay form={form} />;
};
```

### Example 2: Cached Server Action
```typescript
// actions/forms/getForms.ts
"use cache";
import { cacheLife, cacheTag } from "next/cache";

export async function getForms(userId: string) {
  cacheLife("minutes");
  cacheTag("user-forms", userId);
  
  const forms = await prisma.form.findMany({
    where: { ownerId: userId },
  });
  
  return { forms };
}
```

### Example 3: Server Action with Invalidation
```typescript
// actions/forms/create-form.ts
"use server";
import { updateTag, revalidatePath } from "next/cache";

export async function createForm(data) {
  const form = await prisma.form.create({ data });
  
  // Immediate invalidation for read-your-own-writes
  updateTag("user-forms");
  updateTag(data.ownerId);
  revalidatePath("/forms");
  
  return form;
}
```

## ⚠️ Common Pitfalls to Avoid

### ❌ DON'T: Mix up revalidateTag parameters
```typescript
// WRONG - userId is not a profile
revalidateTag("user-forms", userId);

// CORRECT - second parameter is the revalidation profile
revalidateTag("user-forms", "max");
```

### ❌ DON'T: Use revalidateTag without second parameter
```typescript
// DEPRECATED - will be removed
revalidateTag("user-forms");

// CORRECT - use updateTag for immediate invalidation
updateTag("user-forms");

// OR use revalidateTag with profile
revalidateTag("user-forms", "max");
```

### ❌ DON'T: Use updateTag outside Server Actions
```typescript
// ERROR - updateTag only works in Server Actions
export async function GET() {
  updateTag("posts"); // ❌ This will throw an error
  
  // CORRECT - use revalidateTag in Route Handlers
  revalidateTag("posts", "max"); // ✅
}
```

### ❌ DON'T: Over-invalidate caches
```typescript
// BAD - invalidating form that didn't change
export const submitForm = async () => {
  await createSubmission();
  updateTag("published-form"); // ❌ Form didn't change!
  
  // GOOD - only invalidate dashboard (submission count changed)
  updateTag("user-forms"); // ✅
};
```

### ❌ DON'T: Access runtime data directly in cached scopes
```typescript
// ERROR - can't use cookies/headers directly
async function CachedPage() {
  "use cache";
  const cookieStore = cookies(); // ❌ Build will timeout
  
  // CORRECT - pass runtime data as arguments
  const session = await getSession(); // getSession reads cookies
  return <Page userId={session.userId} />; // ✅
}
```

## 🧪 Testing Cache Behavior

### Verify Cache is Working:
1. Check build output for "◐" symbol (partial prerendering)
2. Inspect Network tab - cached responses have `x-nextjs-cache: HIT`
3. Check response headers for `x-nextjs-stale-time`

### Debug Cache Issues:
```typescript
// Add logging in cached functions
export async function getData() {
  "use cache";
  console.log("Cache MISS - fetching fresh data", new Date());
  return data;
}
```

## 📚 Additional Resources

- [Next.js 16 cacheComponents docs](https://nextjs.org/docs/app/api-reference/next-config-js/cacheComponents)
- [use cache directive](https://nextjs.org/docs/app/api-reference/directives/use-cache)
- [cacheLife function](https://nextjs.org/docs/app/api-reference/functions/cacheLife)
- [cacheTag function](https://nextjs.org/docs/app/api-reference/functions/cacheTag)
- [updateTag function](https://nextjs.org/docs/app/api-reference/functions/updateTag)
- [revalidateTag function](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)

## 🎯 Best Practices Summary

1. ✅ Always use `"use cache"` + `cacheLife()` together
2. ✅ Use `cacheTag()` for targeted invalidation
3. ✅ Use `updateTag()` in Server Actions for read-your-own-writes
4. ✅ Use `revalidateTag(tag, "max")` for background updates
5. ✅ Cache public/static content with `cacheLife("max")`
6. ✅ Cache frequently changing data with `cacheLife("minutes")`
7. ✅ Only invalidate what actually changed
8. ✅ Pass runtime data (cookies, headers) as function arguments
9. ✅ Test cache behavior in production-like environments

---

**Last Updated:** January 2025  
**Next.js Version:** 16.0.6+  
**Status:** ✅ Production Ready