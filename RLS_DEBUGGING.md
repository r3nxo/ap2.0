# 🔍 RLS 500 Error - Diagnostic Guide

## Error: `Failed to load resource: the server responded with a status of 500`

This means the SQL query failed on Supabase side.

---

## Common Causes & Solutions

### Cause 1: Policy Names Already Exist
**Symptom:** Error mentions "duplicate policy name"

**Solution:**
1. Go to Supabase → SQL Editor
2. Run this to check existing policies:
```sql
SELECT policyname FROM pg_policy WHERE relname = 'users';
```
3. If policies exist, manually delete them:
   - Supabase Dashboard → Authentication → Policies
   - Find each policy → Delete
4. Then run `RLS_POLICIES_FIX.sql` again

---

### Cause 2: UUID Type Mismatch
**Symptom:** Error about "operator does not exist"

**Solution:**
- Check what type your `id` column is:
```sql
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'id';
```

If it's **text** (not uuid):
- Use: `auth.uid() = id` (no casting)
- Replace in the policy script

If it's **uuid**:
- Use: `auth.uid() = id` (PostgreSQL handles this)

---

### Cause 3: Schema Name Wrong
**Symptom:** Error about "schema not found"

**Solution:**
- Verify your table is in `public` schema:
```sql
SELECT table_schema FROM information_schema.tables 
WHERE table_name = 'users';
```

If it's in different schema, replace `public.users` with `your_schema.users`

---

### Cause 4: RLS Already Enabled with Conflicting Policies
**Symptom:** 500 error, no clear message

**Solution:**
1. Disable RLS temporarily:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

2. Delete all policies:
```sql
DROP POLICY IF EXISTS "Allow login query for anyone" ON public.users;
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow admins to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow admins to update users" ON public.users;
```

3. Run the alternative script:
   - Use: `RLS_POLICIES_ALTERNATIVE.sql`

4. Re-enable RLS:
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

---

## Step-by-Step Debugging

### Step 1: Check Table Structure
```sql
-- See all columns and types
\d public.users
-- Or:
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'users';
```

### Step 2: Check Current Policies
```sql
-- See all policies on users table
SELECT policyname, cmd, permissive, qual 
FROM pg_policy 
WHERE relname = 'users';
```

### Step 3: Check RLS Status
```sql
-- Check if RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'users';
```

### Step 4: Manually Create Policy
If automated scripts fail, create one policy at a time:

```sql
-- First, clear everything
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "test_policy" ON public.users;

-- Then enable and create one policy
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "test_policy"
ON public.users
FOR SELECT
USING (true);
```

If this works, you know:
- RLS works
- Your table structure is fine
- The other policies might have issues

---

## Quick Test After Fixing

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Try login
4. Check for errors

You should see either:
- ✅ Successful login (no errors)
- ❌ Clear error message (not 500)

---

## Recommended Fix Order

### Option A: Use Alternative Script (Simpler)
1. Delete all existing policies manually (Supabase UI)
2. Run `RLS_POLICIES_ALTERNATIVE.sql`
3. Test login

### Option B: Full Reset
1. Disable RLS entirely:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

2. Delete all policies:
```sql
DROP POLICY IF EXISTS "Allow login query for anyone" ON public.users;
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow admins to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow admins to update users" ON public.users;
```

3. Re-enable RLS:
```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

4. Run `RLS_POLICIES_ALTERNATIVE.sql`

### Option C: Completely Disable RLS (Temporary)
For immediate access while debugging:
```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

This removes all RLS restrictions. **Remember to re-enable after!**

---

## Still Having Issues?

Check these one by one:

```sql
-- 1. Does users table exist?
SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users');

-- 2. Does it have an id column?
SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id');

-- 3. What type is the id column?
SELECT data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id';

-- 4. How many records in users?
SELECT COUNT(*) FROM public.users;

-- 5. Is auth working?
SELECT auth.uid();  -- Should return current user's UUID
```

---

## Next Steps

1. Try the alternative SQL script: `RLS_POLICIES_ALTERNATIVE.sql`
2. If that fails, check the debugging steps above
3. Copy the error message and share it for help

Good luck! 🚀
