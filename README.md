# Bookmark Manager

A real-time bookmark manager built with Next.js, Supabase, and Google OAuth.

## Live Demo
🔗 **[https://bookmark-manager-54lr.vercel.app](https://bookmark-manager-54lr.vercel.app)**

## Features
- ✅ Google OAuth authentication (no email/password)
- ✅ Add bookmarks (URL + Title)
- ✅ Private bookmarks (each user sees only their own)
- ✅ Real-time updates (changes appear instantly across tabs)
- ✅ Delete bookmarks
- ✅ Deployed on Vercel

## Tech Stack
- **Next.js 16** (App Router)
- **Supabase** (Authentication, Database, Realtime)
- **Tailwind CSS** (Styling)
- **TypeScript**

## Problems I Ran Into & How I Solved Them

### 1. **Missing `id` column in database**
**Problem:** Bookmarks were being saved but not displayed. Console showed `id` was undefined.

**Solution:** The `id` column with UUID type and primary key constraint was missing from the bookmarks table. Added it via Supabase Table Editor with `gen_random_uuid()` as default value.

### 2. **Missing `created_at` column**
**Problem:** Database query failed with error: "column bookmarks.created_at does not exist"

**Solution:** Added `created_at` column with type `timestamptz` and default value `now()` to automatically timestamp each bookmark.

### 3. **Google OAuth redirect_uri_mismatch error**
**Problem:** Google login failed with "Error 400: redirect_uri_mismatch"

**Solution:** Added the correct redirect URIs to Google Cloud Console OAuth credentials:
- `https://zajpivroysdtxcjtkper.supabase.co/auth/v1/callback`
- `http://localhost:3000/auth/callback`
- `https://bookmark-manager-54lr.vercel.app/auth/callback`

### 4. **TypeScript error during Vercel deployment**
**Problem:** Build failed with "Type 'string | undefined' is not assignable to parameter of type 'string'"

**Solution:** Added non-null assertion operators (`!`) to environment variables in `lib/supabase.ts`:
```typescript
process.env.NEXT_PUBLIC_SUPABASE_URL!
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
```

### 5. **App redirecting to localhost after Google login on production**
**Problem:** After deploying to Vercel, Google OAuth redirected to localhost instead of the live URL.

**Solution:** 
- Removed the `redirectTo: window.location.origin` option from `signInWithOAuth`
- Updated Supabase URL Configuration:
  - Set Site URL to: `https://bookmark-manager-54lr.vercel.app`
  - Added redirect URLs: `http://localhost:3000/**` and `https://bookmark-manager-54lr.vercel.app/**`

### 6. **Delete function not working**
**Problem:** Clicking delete showed "No ID provided for deletion" error.

**Solution:** The bookmarks weren't being fetched correctly. Updated `fetchBookmarks()` to filter by `user_id`:
```typescript
.eq('user_id', user.id)
```

## How to Run Locally

1. Clone the repository
```bash
git clone https://github.com/urstrulyshmoil/bookmark-manager.git
cd bookmark-manager
```

2. Install dependencies
```bash
npm install
```

3. Create `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Deployment
Deployed on Vercel with automatic deployments from the main branch.