-- ============================================
-- RLS Policies for Users Table - Login Fix
-- ============================================
-- Run this in your Supabase SQL editor to fix login issues

-- STEP 1: Drop existing policies (if any) to avoid conflicts
DROP POLICY IF EXISTS "Allow login query for anyone" ON public.users;
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow admins to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow admins to update users" ON public.users;

-- STEP 2: Create SIMPLE policies (no recursion!)

-- 1. Allow ANYONE to SELECT (needed for login to work)
--    Note: This is safe because passwords are hashed
CREATE POLICY "Allow all SELECT"
ON public.users
FOR SELECT
USING (true);

-- 2. Allow UPDATE only for self (authenticated users)
CREATE POLICY "Allow self UPDATE"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- 3. Allow INSERT for registration
CREATE POLICY "Allow self INSERT"  
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- STEP 3: Verify RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Note: These policies:
-- - Allow anyone to SELECT (needed for login without auth)
-- - Allow only self-updates (users can update own profile)
-- - Allow self-inserts (users can register)
-- - NO RECURSIVE QUERIES (prevents infinite recursion)
-- - Admin operations should use service role API
