-- ============================================
-- ALTERNATIVE: Simpler RLS Policy Setup
-- ============================================
-- If the first script fails, try this simpler version

-- Step 1: Check current state
-- SELECT tableoid::regclass, policyname FROM pg_policy WHERE tablename = 'users';

-- Step 2: Drop all existing policies on users table
DROP POLICY IF EXISTS "Allow login query for anyone" ON public.users;
DROP POLICY IF EXISTS "Allow users to read own profile" ON public.users;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow admins to read all users" ON public.users;
DROP POLICY IF EXISTS "Allow admins to update users" ON public.users;

-- Step 3: Create SINGLE permissive policy for SELECT (for login)
-- This allows anyone to read user records (needed for login)
CREATE POLICY "Allow all SELECT"
ON public.users
FOR SELECT
USING (true);

-- Step 4: Create UPDATE policy for self-updates
CREATE POLICY "Allow self UPDATE"
ON public.users
FOR UPDATE
USING (auth.uid() = id);

-- Step 5: Create INSERT policy (for registration)
CREATE POLICY "Allow self INSERT"
ON public.users
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Step 6: Verify RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 7: Verify policies were created
SELECT policyname, cmd, permissive 
FROM pg_policy 
WHERE relname = 'users' 
ORDER BY policyname;
