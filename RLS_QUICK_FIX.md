# ⚡ RLS Login Fix - Quick Start

## The Issue
✗ Login fails with "Invalid credentials" after enabling RLS  
✗ Console shows `policy` or `PGRST100` error  
✗ RLS policies block the SELECT query before authentication completes

## The Fix (2 Minutes)

### 1️⃣ Copy the SQL
File: `RLS_POLICIES_FIX.sql` (in project root)

### 2️⃣ Run in Supabase
1. Open: **Supabase Dashboard**
2. Go to: **SQL Editor**
3. Create new query
4. Paste content from `RLS_POLICIES_FIX.sql`
5. Click **Run**

### 3️⃣ Test Login
- Refresh your app
- Try login again
- ✅ Should work!

---

## What the Fix Does

Creates these RLS policies:
- ✅ `Allow login query` - Anyone can read for login
- ✅ `Allow users to read own profile` - Users see themselves
- ✅ `Allow users to update own profile` - Users update themselves
- ✅ `Allow admins to read all users` - Admins see everyone
- ✅ `Allow admins to update users` - Admins update anyone

---

## Error Handling Improved

The `lib/supabase.ts` login function now:
- ✅ Detects RLS policy errors
- ✅ Shows clearer error messages
- ✅ Logs detailed error info to console

---

## If It Still Doesn't Work

### Check 1: Is RLS enabled on users table?
```
Supabase → Authentication → Policies
→ Look for users table → Check RLS is enabled
```

### Check 2: Does user exist?
```
Supabase → Table Editor → users
→ Find the user you're trying to login with
→ Verify is_active = true
```

### Check 3: Check browser console
```
Press F12 → Console tab
→ Look for 🔴 error message
→ Copy it
```

---

## Files Provided

| File | Purpose |
|------|---------|
| `RLS_POLICIES_FIX.sql` | SQL to fix RLS policies |
| `RLS_LOGIN_FIX.md` | Detailed troubleshooting guide |
| `scripts/check-rls.js` | Diagnostic tool (run: `node scripts/check-rls.js`) |
| `lib/supabase.ts` | Updated login function with better error handling |

---

## Next Steps

1. ✅ Run `RLS_POLICIES_FIX.sql` in Supabase
2. ✅ Refresh your browser
3. ✅ Try login
4. ✅ You're done! 🎉

---

**Need help?** Check `RLS_LOGIN_FIX.md` for detailed troubleshooting.
