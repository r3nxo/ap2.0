# 🔧 RLS Login Issue - Quick Fix

## Problem
After enabling RLS on Supabase `users` table:
- Login says "Invalid credentials"
- Error appears: `policy` or `PGRST100`

## Root Cause
RLS policies are blocking the login SELECT query before authentication

## Solution (3 Steps)

### Step 1: Copy SQL Fix
The file `RLS_POLICIES_FIX.sql` contains the required policies

### Step 2: Apply to Supabase
1. Go to: **Supabase Dashboard** → **SQL Editor**
2. Open the `RLS_POLICIES_FIX.sql` file from this project
3. Copy all the code
4. Paste into Supabase SQL Editor
5. Click **Run**

### Step 3: Verify & Test
1. Return to app (refresh if needed)
2. Try login again
3. Should work now ✅

---

## Understanding the Fix

The RLS policies created allow:

| Policy | Purpose |
|--------|---------|
| `Allow login query` | Unauthenticated users can read username/password for login |
| `Allow own profile` | Users can see/update their own data |
| `Allow admins` | Admins can see/update all users |

---

## If Still Having Issues

### Check 1: RLS Enabled?
```
Supabase → Authentication → Policies
→ Check "Enable RLS" is ON
```

### Check 2: User Exists?
```
Supabase → Table Editor → users
→ Verify user with that username exists
```

### Check 3: User Active?
```
Supabase → Table Editor → users
→ Check is_active column = true
```

### Check 4: Browser Console
- Open: DevTools (F12) → Console
- Look for error message
- Copy full error and share

---

## Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Invalid credentials` | User not found or RLS blocks query | Run RLS_POLICIES_FIX.sql |
| `policy` error | RLS policy violation | Check policies in Supabase |
| `PGRST100` | RLS error code | Run RLS_POLICIES_FIX.sql |
| `Database error` | Generic DB error | Check Supabase status |

---

## Manual RLS Policy Setup (Alternative)

If you prefer to set up policies manually:

1. Go to: **Supabase → Authentication → Policies**
2. Click **Create a new policy**
3. Name: `Allow login query`
4. Target roles: `Authenticated` + `Unauthenticated`
5. For: **SELECT**
6. Check: **Using (true)**
7. Save

This allows anyone to read user records (needed for login)

---

## Verify Login Works

1. Open browser DevTools (F12)
2. Go to Network tab
3. Try login
4. Look for successful response (200, not 4xx/5xx)
5. Browser should redirect to `/dashboard`

---

## Reset if Needed

If you need to disable RLS temporarily:

1. Go to: **Supabase → Authentication → Policies**
2. Find the `users` table
3. Click "Disable RLS"
4. This removes all restrictions (security risk!)
5. Re-enable after fixing

---

## Questions?

Check the console error details. RLS errors typically show:
- Error code: `PGRST100` = RLS policy violation
- Error code: `PGRST116` = No matching policy found

Paste the full error for debugging.
