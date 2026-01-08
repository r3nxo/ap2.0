# ⚡ Quick Start - Admin & Settings

## ✅ What's Ready Now

```
✅ Admin user created
✅ Settings page created
✅ Dev server running
✅ Environment variables loaded
✅ Database configured with RLS
```

---

## 👤 Login Credentials

```
Username: rzv.st
Password: Erika7Raisa
```

---

## 🔗 Key Links to Test

| Feature | URL | What to Expect |
|---------|-----|----------------|
| Login | `http://localhost:3002/login` | Login form - enter admin credentials |
| Dashboard | `http://localhost:3002/dashboard` | Main dashboard after login |
| Settings | `http://localhost:3002/dashboard/settings` | Profile & password management |
| Admin | `http://localhost:3002/admin` | User management panel |

---

## 🔄 Testing Flow

### 1. Login
```
1. Go to http://localhost:3002/login
2. Enter:
   - Username: rzv.st
   - Password: Erika7Raisa
3. Click Login
4. Should redirect to /dashboard ✅
```

### 2. Access Settings
```
1. From dashboard, go to /dashboard/settings
2. You should see tabs: Profile | Password
3. Settings page loaded successfully ✅
```

### 3. Update Profile
```
1. Click on Profile tab
2. Edit your name or email
3. Click Save
4. Should see success message ✅
```

### 4. Change Password
```
1. Click on Password tab
2. Enter current password: Erika7Raisa
3. Enter new password (twice for confirmation)
4. Click Save
5. Should see success message ✅
```

---

## 🛠️ Admin Features

From `/admin` page you can:
- ✅ View all users in system
- ✅ Create new users
- ✅ Delete users
- ✅ Toggle user active/inactive status
- ✅ Manage user admin privileges

---

## 📝 Script Usage

If you need to create another admin user:

```bash
cd k:\livepick-pwa
node scripts/setup-admin.js
```

Follow the interactive prompts to create a new admin.

---

## 🔑 Environment Variables

Your `.env.local` contains:
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Admin API key
- ✅ Other API keys (Football Data, Telegram, etc.)

All loaded automatically by the setup script.

---

## 🚀 Dev Server

### Start Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm run start
```

### Clear Cache & Rebuild
```bash
Remove-Item -Path .next -Recurse -Force
npm run build
```

---

## ⚠️ If Something Goes Wrong

### Settings page not loading?
- Wait 20 seconds (Next.js compiling)
- Refresh with `Ctrl+Shift+R`
- Check dev server terminal for errors

### Can't login?
- Check username/password exactly
- Verify network connection
- Check `.env.local` credentials

### Admin user not created?
- Check for duplicate username
- Verify internet connection
- Check Supabase status

---

## 📞 Support Files

For more details, see:
- `ADMIN_SETUP_GUIDE.md` - Detailed setup guide
- `ADMIN_SETUP_COMPLETE.md` - What was accomplished
- `SETUP_COMPLETE.md` - Setup overview
- `.env.local` - Environment configuration

---

**Ready to use!** 🎉

Test the login and settings features now.
