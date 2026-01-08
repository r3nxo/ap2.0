# 🛠️ Admin Setup Guide

## Quick Setup

### Step 1: Apply RLS Policies
✅ Already done - Run `RLS_POLICIES_FIX.sql` in Supabase

### Step 2: Create Admin User

**Option A: Using the Script (Recommended)**
```bash
node scripts/setup-admin.js
```

This will prompt you for:
- Admin username (default: `admin`)
- Admin password
- Full name (default: `Administrator`)
- Email (default: `admin@example.com`)

**Option B: Manual Creation (Supabase Dashboard)**
1. Go to Supabase → Table Editor
2. Open `users` table
3. Click "Insert row"
4. Fill in:
   - username: `admin`
   - password_hash: Run this in SQL first:
     ```sql
     SELECT crypt('your_password', gen_salt('bf'));
     ```
   - full_name: `Administrator`
   - email: `admin@example.com`
   - is_admin: `true`
   - is_active: `true`

### Step 3: Verify Admin Access
1. Go to http://localhost:3002/login
2. Login with admin credentials
3. You should be redirected to dashboard
4. Click "Admin" in navigation (top right)
5. You should see user management page

---

## What's New

### ✅ Settings Page Created
- Path: `/dashboard/settings`
- Features:
  - Profile editing (name, email)
  - Password change form
  - Tab-based interface
  - Responsive design

### ✅ Admin Setup Script
- File: `scripts/setup-admin.js`
- Interactive prompts
- Creates admin user in Supabase
- Handles duplicate admin users

---

## Admin Permissions

Admin users can:
- ✅ View all users
- ✅ Create users
- ✅ Delete users
- ✅ Toggle user active status
- ✅ Access admin panel

---

## Troubleshooting

### Script says "Admin user already exists"
- The admin account is already created
- You can login with those credentials

### "Invalid credentials" on login
- Check RLS policies are applied
- Verify user exists in database
- Check `is_active` is `true`

### Settings page returns 404
- Check you're logged in
- Make sure you're in `/dashboard/settings`
- Clear browser cache and refresh

---

## Quick Test

```bash
# 1. Clear and rebuild (if needed)
npm run build

# 2. Start dev server
npm run dev

# 3. Create admin
node scripts/setup-admin.js

# 4. Test login
# Go to http://localhost:3002/login
# Enter admin credentials
```

---

## Files Created/Modified

✅ **Created:**
- `app/dashboard/settings/page.tsx` - Settings page
- `scripts/setup-admin.js` - Admin setup script

✅ **Already existed:**
- `app/dashboard/layout.tsx` - Has settings link
- `RLS_POLICIES_FIX.sql` - RLS policies

---

## Next Steps

1. Run RLS policies (if not already done)
2. Run admin setup script
3. Test login with admin account
4. Explore settings page
5. Visit admin panel to manage users

Good luck! 🚀
