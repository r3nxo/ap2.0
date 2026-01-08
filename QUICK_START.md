# 🚀 Quick Start & Reference Guide

## 📌 Project Overview

**LivePick PWA** - Football Scanner with Real-time Filters and Notifications

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Custom JWT + Session Cookies
- **Status:** ✅ Production Ready

---

## 🏃 Quick Start

### Installation
```bash
cd k:\livepick-pwa
npm install
```

### Development
```bash
npm run dev
# Opens on http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```

### Generate PWA Icons
```bash
npm run generate-icons
```

---

## 🔑 Environment Setup

Create `.env.local`:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xlrcyqzwnqxgiabgekwc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Football Data API
NEXT_PUBLIC_FOOTBALL_DATA_KEY=your-api-key

# Optional: Telegram
TELEGRAM_BOT_TOKEN=your-bot-token
```

---

## 📁 Key Files & Their Purpose

| File | Purpose |
|------|---------|
| `lib/supabase.ts` | Auth + Database helpers |
| `middleware.ts` | Route protection |
| `app/login/page.tsx` | Login page |
| `app/dashboard/` | Main app pages |
| `app/api/filters/import/route.ts` | Bulk import API |

---

## 🔐 Authentication Flow

```
1. User enters credentials on /login
2. authHelpers.login() validates against database
3. Session cookie set (rsq_session)
4. User object saved to localStorage
5. Redirect to /dashboard
6. Middleware verifies session on each route
```

### Login
```typescript
const { user, error } = await authHelpers.login(username, password);
if (user) {
  router.push('/dashboard');
} else {
  setError(error);
}
```

### Get Current User
```typescript
const user = authHelpers.getCurrentUser();
if (!user || !user.id) {
  router.push('/login');
}
```

### Logout
```typescript
authHelpers.logout();
router.push('/login');
```

---

## 📊 Filter System

### Create Filter
```typescript
const { data, error } = await dbHelpers.createFilter({
  user_id: user.id,
  name: 'Filter name',
  description: 'Description',
  conditions: { /* conditions */ },
  is_active: true,
});
```

### Get User Filters
```typescript
const filters = await dbHelpers.getUserFilters(userId);
```

### Update Filter
```typescript
const { data, error } = await dbHelpers.updateFilter(filterId, {
  name: 'New name',
  // ... other fields
});
```

### Delete Filter
```typescript
const { error } = await dbHelpers.deleteFilter(filterId);
```

---

## 🎯 Common Tasks

### Check if User is Admin
```typescript
const isAdmin = authHelpers.isAdmin();
if (!isAdmin) {
  router.push('/dashboard');
}
```

### Handle User Not Authenticated
```typescript
const user = authHelpers.getCurrentUser();
if (!user) {
  router.push('/login');
  return;
}

// Validate UUID (after fixes)
if (!user.id || user.id === 'anon' || typeof user.id !== 'string') {
  localStorage.removeItem('rsq_user');
  router.push('/login');
  return;
}
```

### Import Filters
```typescript
const response = await fetch('/api/filters/import', {
  method: 'POST',
  body: JSON.stringify({
    filters: [...],
    userId: currentUser.id,
  }),
});
const result = await response.json();
console.log(`Success: ${result.success}, Failed: ${result.failed}`);
```

---

## 🧪 Testing Checklist

### Before Pushing Code
```bash
✅ npm run dev works
✅ No TypeScript errors
✅ No ESLint warnings
✅ Login/logout works
✅ Can create filter
✅ Can import template
✅ No console errors
```

### Before Deploying
```bash
✅ npm run build succeeds
✅ npm run start works
✅ All .env vars set
✅ Database accessible
✅ API keys valid
✅ Tested in production mode
```

---

## 🐛 Debugging

### Enable Debug Logging
```bash
DEBUG=* npm run dev
```

### Check Browser Console
```javascript
// See if user is loaded
console.log(localStorage.getItem('rsq_user'));

// Check cookies
document.cookie // should show rsq_session
```

### Verify Supabase Connection
```javascript
// In browser console
fetch('https://xlrcyqzwnqxgiabgekwc.supabase.co/rest/v1/health')
  .then(r => r.json())
  .then(console.log);
```

---

## 📊 Architecture Diagram

```
┌─────────────────────────────────────────┐
│          Browser (PWA)                   │
│  ┌─────────────────────────────────────┐ │
│  │  React Components                    │ │
│  │  (Login, Dashboard, Filters)         │ │
│  └──────────────┬──────────────────────┘ │
│                 │                         │
│  ┌──────────────▼──────────────────────┐ │
│  │  authHelpers, dbHelpers            │ │
│  │  (Client-side logic)               │ │
│  └──────────────┬──────────────────────┘ │
└─────────────────┼────────────────────────┘
                  │ HTTP
    ┌─────────────▼─────────────┐
    │   Next.js Server (3000)    │
    │  ┌──────────────────────┐  │
    │  │  middleware.ts       │  │
    │  │  (Route Protection)  │  │
    │  └──────────────────────┘  │
    │  ┌──────────────────────┐  │
    │  │  API Routes          │  │
    │  │  /api/filters/*      │  │
    │  │  /api/football-data/ │  │
    │  └────────────┬─────────┘  │
    │  ┌────────────▼─────────┐  │
    │  │  lib/supabase.ts     │  │
    │  │  (Validation)        │  │
    │  └────────────┬─────────┘  │
    └───────────────┼──────────────
                    │ HTTPS
         ┌──────────▼─────────────┐
         │  Supabase (PostgreSQL)  │
         │  - users table          │
         │  - filters table        │
         │  - UUID enforcement     │
         └─────────────────────────┘
```

---

## 🔒 Security Best Practices

### Do ✅
- Always validate user.id before database operations
- Check for session cookie before showing protected content
- Use server-side validation for all API requests
- Clear localStorage on logout
- Log errors for monitoring

### Don't ❌
- Never send 'anon' as user_id
- Never hardcode credentials
- Never trust client-side validation alone
- Never skip database type checking
- Never log sensitive data

---

## 🚨 Common Errors & Solutions

### Error: "Invalid user authentication"
```
Cause: user.id is invalid or missing
Fix: Clear localStorage and re-login
Solution: localStorage.removeItem('rsq_user')
```

### Error: "Filters must be an array"
```
Cause: Bulk import API sent wrong format
Fix: Ensure data is array of filter objects
Solution: Check JSON structure before sending
```

### Error: "userId required"
```
Cause: Import API called without userId
Fix: Include userId in request body
Solution: fetch('/api/filters/import', {
  body: JSON.stringify({ filters: [], userId: user.id })
})
```

### Error: "invalid input syntax for type uuid"
```
Cause: Non-UUID string sent to database (FIXED)
Status: ✅ Resolved - validation prevents this
Note: All code paths validated
```

---

## 📈 Performance Tips

### Optimize Bundle
```bash
npm run build
# Check .next size
du -sh .next/
```

### Cache Strategy
- Browser caching: 1 year for assets
- Database: `no-store` for live data
- API: `revalidate: 30` where applicable

### Code Splitting
- Automatic with Next.js App Router
- Components split at route level
- API routes are separate bundles

---

## 🎛️ Configuration

### TypeScript (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

### Tailwind (`tailwind.config.ts`)
- Custom colors for "Cyber Sports Minimal" theme
- Dark mode optimized
- Mobile-first responsive design

### Next.js (`next.config.js`)
- PWA enabled (production only)
- Image optimization
- Font optimization

---

## 📚 Documentation Files

| File | Content |
|------|---------|
| `FINAL_VERIFICATION_REPORT.md` | Complete system verification |
| `VERIFICATION_REPORT.md` | Detailed architecture & security |
| `DIAGNOSTIC_SUMMARY.md` | Quick status and metrics |
| `CHANGES_APPLIED.md` | Technical details of fixes |
| `README.md` | Project overview |

---

## 🎯 Deployment Checklist

```
Before Deploying:
  ☐ npm run build (success)
  ☐ All tests pass
  ☐ Environment variables configured
  ☐ Database migrations applied
  ☐ Backups created
  ☐ CDN configured (if needed)
  ☐ SSL certificate valid
  ☐ Monitoring set up
  ☐ Logging configured
  ☐ Team notified
```

---

## 📞 Quick Links

- **Supabase Dashboard:** https://app.supabase.com
- **API Football Docs:** https://www.api-football.com
- **Next.js Docs:** https://nextjs.org/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

---

## ✅ Status Summary

| Component | Status |
|-----------|--------|
| Build | ✅ Passing |
| Auth | ✅ Secure |
| Database | ✅ Connected |
| API | ✅ Responding |
| Tests | ✅ Ready |
| Docs | ✅ Complete |
| **Overall** | **✅ READY** |

---

**Last Updated:** January 8, 2026  
**Next Review:** February 8, 2026  
**Status:** Production Ready
