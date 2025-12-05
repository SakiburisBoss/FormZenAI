# Next.js 16 Caching Quick Reference 🚀

## 🎯 The Two Golden Rules

1. **Server Actions** → Use `updateTag()` (immediate invalidation)
2. **Route Handlers** → Use `revalidateTag(tag, "max")` (stale-while-revalidate)

---

## 📦 Core APIs

### `"use cache"` - Enable Caching
```typescript
async function MyComponent() {
  "use cache";  // Place at top
  // ... fetch data
}
```

### `cacheLife(profile)` - Set Duration
```typescript
"use cache";
cacheLife("max");      // Never expire (static content)
cacheLife("hours");    // 1hr stale, 4hr revalidate
cacheLife("minutes");  // 5min stale, 15min revalidate (default)
cacheLife("seconds");  // 5s stale, 10s revalidate (for editing)
```

### `cacheTag(...tags)` - Tag for Invalidation
```typescript
"use cache";
cacheTag("posts", "user-123", `post-${id}`);
```

### `updateTag(tag)` - Immediate Invalidation ⚡
```typescript
"use server";
export async function createPost() {
  // ... create logic
  updateTag("posts");      // ✅ Expires immediately
  updateTag("user-123");   // ✅ Multiple calls for multiple tags
  revalidatePath("/posts");
}
```
**Use when:** User needs to see their changes RIGHT NOW

### `revalidateTag(tag, profile)` - Background Refresh 🔄
```typescript
export async function GET() {
  // ... logic
  revalidateTag("posts", "max");  // ✅ Serve stale, fetch fresh in background
  // OR
  revalidateTag("posts", { expire: 0 });  // ⚡ Immediate (webhooks only)
}
```
**Use when:** Stale content is acceptable while fetching fresh data

---

## 🎨 Common Patterns

### Pattern 1: Public Static Page (Max Cache)
```typescript
// app/blog/[slug]/page.tsx
import { cacheLife, cacheTag } from "next/cache";

export default async function BlogPost({ params }) {
  "use cache";
  cacheLife("max");  // Static content
  const slug = (await params).slug;
  cacheTag("blog-posts", `post-${slug}`);
  
  const post = await db.post.findUnique({ where: { slug } });
  return <Article post={post} />;
}
```

### Pattern 2: Dashboard (Balanced Cache)
```typescript
// app/dashboard/page.tsx
import { cacheLife, cacheTag } from "next/cache";

export default async function Dashboard({ userId }) {
  "use cache";
  cacheLife("minutes");  // Near real-time
  cacheTag("dashboard", userId);
  
  const data = await db.getDashboard(userId);
  return <DashboardUI data={data} />;
}
```

### Pattern 3: Edit Page (Minimal Cache)
```typescript
// app/posts/[id]/edit/page.tsx
import { cacheLife, cacheTag } from "next/cache";

export default async function EditPost({ params }) {
  "use cache";
  cacheLife("seconds");  // Always fresh
  const id = (await params).id;
  cacheTag("draft", `post-${id}`);
  
  const post = await db.post.findUnique({ where: { id } });
  return <Editor post={post} />;
}
```

### Pattern 4: Server Action with Invalidation
```typescript
// actions/create-post.ts
"use server";
import { updateTag, revalidatePath } from "next/cache";

export async function createPost(data: FormData) {
  const post = await db.post.create({ data });
  
  // ✅ Immediate invalidation (user sees their new post)
  updateTag("blog-posts");
  updateTag(`user-${post.authorId}`);
  revalidatePath("/blog");
  
  return { success: true };
}
```

### Pattern 5: Cached Server Function
```typescript
// actions/get-posts.ts
"use cache";
import { cacheLife, cacheTag } from "next/cache";

export async function getPosts(category: string) {
  cacheLife("hours");
  cacheTag("posts", `category-${category}`);
  
  return db.post.findMany({ where: { category } });
}
```

---

## 🔄 When to Invalidate What

| User Action | Invalidate | Don't Invalidate | Why |
|-------------|-----------|------------------|-----|
| Create Post | `updateTag("posts")`, `updateTag(userId)` | - | User needs to see their new post |
| Update Post | `updateTag("posts")`, `updateTag(post-${id})` | - | Content changed |
| Submit Form | `updateTag("user-forms")`, `updateTag(userId)` | `"published-form"` | Only submission count changed, not form itself |
| Publish Draft | `updateTag("drafts")`, `updateTag("published")` | - | State transition |
| Like/View Count | `revalidateTag("stats", "max")` | `"post-content"` | Background update, content unchanged |

---

## ⚠️ Common Mistakes

### ❌ Wrong: Missing Second Parameter
```typescript
revalidateTag("posts");  // ❌ DEPRECATED
```
### ✅ Right: Always Provide Profile
```typescript
updateTag("posts");                    // ✅ Server Actions
revalidateTag("posts", "max");         // ✅ Route Handlers
revalidateTag("posts", { expire: 0 }); // ✅ Webhooks
```

---

### ❌ Wrong: Using updateTag in Route Handlers
```typescript
export async function GET() {
  updateTag("posts");  // ❌ Error! Only works in Server Actions
}
```
### ✅ Right: Use revalidateTag
```typescript
export async function GET() {
  revalidateTag("posts", "max");  // ✅ Works in Route Handlers
}
```

---

### ❌ Wrong: Over-Invalidating
```typescript
export async function submitForm() {
  updateTag("forms");
  updateTag("users");
  updateTag("submissions");
  updateTag("analytics");  // ❌ Too much!
}
```
### ✅ Right: Only Invalidate What Changed
```typescript
export async function submitForm() {
  updateTag("user-forms");    // ✅ User's form list
  updateTag(userId);          // ✅ User-specific data
  // Form content didn't change, don't invalidate it!
}
```

---

### ❌ Wrong: Accessing Runtime Data in Cached Scope
```typescript
async function Page() {
  "use cache";
  const session = cookies().get("session");  // ❌ Build timeout!
}
```
### ✅ Right: Pass as Arguments
```typescript
async function Page() {
  const session = await getSession();  // Read cookies outside
  return <CachedContent userId={session.userId} />;  // ✅ Pass as prop
}

async function CachedContent({ userId }) {
  "use cache";
  cacheTag(userId);
  // ...
}
```

---

## 📊 Cache Duration Cheat Sheet

| Profile | Stale Time | Revalidate | Expires | Use Case |
|---------|-----------|------------|---------|----------|
| `"seconds"` | 5s | 10s | 1 min | Active editing |
| `"minutes"` | 5 min | 15 min | 1 hour | Dashboards |
| `"hours"` | 1 hour | 4 hours | 1 day | Semi-static |
| `"days"` | 1 day | 7 days | 30 days | Rarely changes |
| `"weeks"` | 7 days | 28 days | - | Very static |
| `"max"` | - | - | Never | Pure static |

---

## 🧪 Quick Test Commands

```bash
# Build to see cache behavior
npm run build

# Look for these symbols in output:
# ◐  = Partial Prerendering (good!)
# ○  = Static
# ƒ  = Dynamic

# Check response headers
curl -I https://yoursite.com/page
# Look for: x-nextjs-cache: HIT
#           x-nextjs-stale-time: ...
```

---

## 🎯 Decision Tree

```
Need to cache data?
├─ YES → Add "use cache"
│   ├─ How long?
│   │   ├─ Forever → cacheLife("max")
│   │   ├─ Hours → cacheLife("hours")
│   │   ├─ Minutes → cacheLife("minutes")
│   │   └─ Seconds → cacheLife("seconds")
│   └─ Need to invalidate?
│       └─ YES → Add cacheTag(...)
└─ NO → Don't use "use cache"

Need to invalidate?
├─ Server Action?
│   └─ YES → updateTag(tag)
└─ Route Handler?
    ├─ Background update → revalidateTag(tag, "max")
    └─ Immediate (webhook) → revalidateTag(tag, { expire: 0 })
```

---

## 🔗 Links

- [Full Strategy Doc](./CACHING_STRATEGY.md)
- [Next.js Docs](https://nextjs.org/docs/app/api-reference/next-config-js/cacheComponents)

---

**Remember:** Cache aggressively, invalidate precisely! 🎯