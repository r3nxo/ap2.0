# 🔴 CRITICAL BUG - "anon" UUID Still Appearing

**Reported:** January 8, 2026  
**Error:** `invalid input syntax for type uuid: "anon"`  
**Root Cause:** Under Investigation  
**Status:** 🔧 ACTIVELY DEBUGGING

---

## Error Log from Browser

```
POST https://xlrcyqzwnqxgiabgekwc.supabase.co/rest/v1/filters 400 (Bad Request)

Error details:
{
  "code": "22P02",
  "message": "invalid input syntax for type uuid: \"anon\""
}
```

---

## Investigation Findings

### Previous Fixes Applied (But Still Not Working)
1. ✅ Server-side validation added to `createFilter()`
2. ✅ Client-side validation added to filter creation component
3. ✅ Template import protection added
4. ✅ Bulk import API safety added

### Root Cause Analysis

**The validation checks are detecting "anon", but it's still reaching the database.**

This means one of two things:
1. The validation is being bypassed somehow
2. The user.id is being set to "anon" AFTER the validation passes
3. There's another code path that doesn't have validation

### New Instrumentation Added

Added aggressive logging to:
1. `lib/supabase.ts` - `saveUser()` function
   - Now validates before saving to localStorage
   - Logs errors if trying to save invalid user

2. `lib/supabase.ts` - `getCurrentUser()` function
   - Now validates when retrieving from localStorage
   - Clears corrupted data
   - Logs errors

3. `lib/supabase.ts` - `createFilter()` function
   - Logs received user_id
   - Logs validation result
   - Logs before/after database insert

4. `app/dashboard/filters/new/page.tsx`
   - Logs user from localStorage
   - Logs validation result
   - Logs before createFilter call

---

## Next Steps to Debug

### 1. Open Browser Console
- Go to http://localhost:3000
- Open DevTools (F12)
- Check Console tab for all logging output
- Look for messages starting with:
  - "📝" = Info logs
  - "✅" = Success logs
  - "❌" = Error logs
  - "🔍" = Debug logs

### 2. Try to Create Filter
- Fill in filter details
- Click "Create Filter"
- Watch the console for the log sequence
- This will show where "anon" is coming from

### 3. Check localStorage
```javascript
// In browser console:
localStorage.getItem('rsq_user')
```
This should show user object. If it has `"id":"anon"`, that's the problem.

### 4. Trace the Error Path
The logs should show:
```
1. "📝 Filter creation: User from localStorage:" {should show real user}
2. "📤 About to call createFilter with user_id:" {should show UUID, not 'anon'}
3. "🔍 createFilter: Received filter with user_id:" {should be UUID}
4. ❌ or ✅ result
```

If step 1 shows "anon", the problem is in localStorage.
If step 2 shows different than step 1, something is modifying it.

---

## Hypotheses

### Hypothesis 1: localStorage Corrupted
The `rsq_user` in localStorage contains `{"id":"anon",...}` instead of valid UUID.

**Test:** In browser console:
```javascript
const user = JSON.parse(localStorage.getItem('rsq_user'));
console.log(user.id); // Should show UUID, not 'anon'
```

**Fix if true:** Clear localStorage and re-login
```javascript
localStorage.clear();
location.reload();
```

### Hypothesis 2: Login Not Saving Real User
The login is succeeding but `authHelpers.saveUser()` is not being called with valid user data.

**Evidence:** Would show in "Saving user to localStorage" logs

**Test:** Check login component logs

### Hypothesis 3: Another Code Path
There's a different way filters are being created that bypasses validation.

**Example:** Maybe through bulk import or template import?

**Test:** Check which exact API endpoint is being called in Network tab

### Hypothesis 4: User Object Modified After Validation
Something is modifying `user.id` between validation and createFilter call.

**Test:** Check logs between step 2 and 3

---

## Commands to Debug

### Check Build Status
```bash
npm run build  # Should complete
```

### Clear Build Cache and Rebuild
```bash
rm -r .next
npm run build
npm run dev
```

### Check Environment Variables
```bash
env | grep NEXT_PUBLIC_SUPABASE
env | grep SUPABASE
```

### Verify Database Connection
```javascript
// In browser console:
fetch('https://xlrcyqzwnqxgiabgekwc.supabase.co/rest/v1/health')
  .then(r => r.json())
  .then(console.log)
```

---

## Expected Log Output (After Fix)

When creating a filter successfully:
```
📝 Filter creation: User from localStorage: {id: "550e8400-...", username: "testuser", ...}
✅ User validated, user_id: 550e8400-...
📤 About to call createFilter with user_id: 550e8400-...
🔍 createFilter: Received filter with user_id: 550e8400-...
✅ createFilter: user_id validated, inserting filter
✅ createFilter: success: <filter_id>
```

If you see ANY "anon" in this sequence, that's where the bug is.

---

## Code Changes Made (For Reference)

1. **lib/supabase.ts - saveUser()**
   - Now rejects invalid user objects
   - Logs before saving

2. **lib/supabase.ts - getCurrentUser()**
   - Now validates on retrieval
   - Clears corrupted data
   - Logs errors

3. **lib/supabase.ts - createFilter()**
   - Added console logging
   - Validates user_id with more detailed error

4. **app/dashboard/filters/new/page.tsx**
   - Added logging at multiple points
   - Logs user, validation, and API call

---

## Testing Protocol

### Test 1: Fresh Login
```
1. Clear localStorage: localStorage.clear()
2. Reload page
3. Login with valid credentials
4. Check console logs
5. Try to create filter
6. Check all logs
```

### Test 2: Check localStorage After Login
```
1. Login
2. In console: JSON.parse(localStorage.getItem('rsq_user'))
3. Verify id is UUID (not 'anon', not empty)
4. Try to create filter
```

### Test 3: Import Template
```
1. Login
2. Go to templates page
3. Try to import a template
4. Check console logs
5. Look for "anon" in logs
```

### Test 4: Check Network Tab
```
1. Open DevTools → Network tab
2. Create filter
3. Look for POST to /filters endpoint
4. Check request body - what user_id is being sent?
5. Check response - error message details
```

---

## Current Status

- ✅ Instrumentation code added
- ⏳ Build in progress
- ⏳ Testing in browser pending

**Next action:** Run dev server and check browser console logs to identify where "anon" is coming from.

